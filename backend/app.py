"""
BanRakshak Backend API Server
FastAPI server for OCR-NER processing and asset mapping functionality
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import sys
import uuid
import shutil
from pathlib import Path
import asyncio
import json
from datetime import datetime

# Add OCR-NER to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'OCR-NER'))

# Import OCR-NER modules
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'OCR-NER'))

try:
    from structured_parser import StructuredDocumentParser
    from agent2 import DocumentClassifierAgent
    from utils import save_results_to_json, validate_image_path, create_output_directory
    ocr_modules_available = True
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("OCR-NER modules not available. Some functionality will be limited.")
    StructuredDocumentParser = None
    DocumentClassifierAgent = None
    ocr_modules_available = False

app = FastAPI(
    title="BanRakshak Backend API",
    description="Forest Rights Management Platform Backend",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ProcessingStatus(BaseModel):
    id: str
    filename: str
    status: str  # processing, completed, error
    progress: int
    created_at: datetime
    updated_at: datetime
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None

class OCRResult(BaseModel):
    id: str
    filename: str
    extracted_text: str
    entities: List[Dict[str, Any]]
    classification: Optional[Dict[str, Any]] = None
    confidence_scores: Dict[str, float]
    processing_method: str

# Global storage for processing tasks
processing_tasks: Dict[str, ProcessingStatus] = {}

# Create upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize OCR components
parser = None
classifier = None

if ocr_modules_available and StructuredDocumentParser and DocumentClassifierAgent:
    try:
        
        parser = StructuredDocumentParser()
        classifier = DocumentClassifierAgent()
        print("✅ OCR components initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize OCR components: {e}")
        parser = None
        classifier = None
else:
    print("❌ OCR modules not available - running in limited mode")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "BanRakshak Backend API is running",
        "version": "1.0.0",
        "status": "healthy",
        "ocr_available": parser is not None and classifier is not None,
        "modules_loaded": ocr_modules_available
    }

@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "ocr_parser": parser is not None,
            "document_classifier": classifier is not None,
            "upload_directory": UPLOAD_DIR.exists()
        }
    }

async def process_document_background(task_id: str, file_path: str, filename: str):
    """Background task for processing documents"""
    try:
        # Update status to processing
        processing_tasks[task_id].status = "processing"
        processing_tasks[task_id].progress = 10
        
        if not parser or not classifier:
            raise Exception("OCR components not available")
        
        # Step 1: Extract text and structure (30% progress)
        processing_tasks[task_id].progress = 30
        extraction_results = parser.parse_document_comprehensive(file_path, show_images=False)
        
        if extraction_results['processing_status'] != 'success':
            raise Exception(f"Text extraction failed: {extraction_results['processing_status']}")
        
        # Step 2: Classify document (60% progress)
        processing_tasks[task_id].progress = 60
        classification = None
        if extraction_results.get('full_text'):
            classification = classifier.classify(extraction_results['full_text'])
        
        # Step 3: Prepare final results (90% progress)
        processing_tasks[task_id].progress = 90
        
        # Create result object
        result = {
            "extraction": extraction_results,
            "classification": {
                "document_type": classification.document_type if classification else "Unknown",
                "confidence_level": classification.confidence_level.value if classification else "LOW",
                "confidence_score": classification.confidence_score if classification else 0,
                "reasoning": classification.reasoning if classification else "",
                "key_indicators": classification.key_indicators if classification else [],
                "suggested_actions": classification.suggested_actions if classification else [],
                "document_purpose": classification.document_purpose if classification else "",
                "issuing_authority": classification.issuing_authority if classification else ""
            } if classification else None,
            "processed_at": datetime.now().isoformat(),
            "filename": filename
        }
        
        # Complete processing
        processing_tasks[task_id].status = "completed"
        processing_tasks[task_id].progress = 100
        processing_tasks[task_id].result = result
        processing_tasks[task_id].updated_at = datetime.now()
        
    except Exception as e:
        processing_tasks[task_id].status = "error"
        processing_tasks[task_id].error_message = str(e)
        processing_tasks[task_id].updated_at = datetime.now()
        print(f"❌ Error processing document {task_id}: {e}")

@app.post("/api/ocr/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """Upload and start processing a document"""
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/bmp", "image/tiff", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Supported types: {allowed_types}"
        )
    
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    # Save uploaded file
    file_path = UPLOAD_DIR / f"{task_id}_{file.filename}"
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")
    
    # Create processing task
    processing_tasks[task_id] = ProcessingStatus(
        id=task_id,
        filename=file.filename,
        status="queued",
        progress=0,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    # Start background processing
    background_tasks.add_task(
        process_document_background,
        task_id,
        str(file_path),
        file.filename
    )
    
    return {
        "task_id": task_id,
        "filename": file.filename,
        "status": "queued",
        "message": "Document uploaded successfully. Processing started."
    }

@app.get("/api/ocr/status/{task_id}")
async def get_processing_status(task_id: str):
    """Get the processing status of a document"""
    
    if task_id not in processing_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = processing_tasks[task_id]
    
    return {
        "id": task.id,
        "filename": task.filename,
        "status": task.status,
        "progress": task.progress,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
        "error_message": task.error_message
    }

@app.get("/api/ocr/result/{task_id}")
async def get_processing_result(task_id: str):
    """Get the processing result of a completed document"""
    
    if task_id not in processing_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = processing_tasks[task_id]
    
    if task.status != "completed":
        raise HTTPException(
            status_code=400, 
            detail=f"Task is not completed. Current status: {task.status}"
        )
    
    return {
        "id": task.id,
        "filename": task.filename,
        "status": task.status,
        "result": task.result,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat()
    }

@app.get("/api/ocr/tasks")
async def list_all_tasks():
    """List all processing tasks"""
    
    tasks = []
    for task_id, task in processing_tasks.items():
        tasks.append({
            "id": task.id,
            "filename": task.filename,
            "status": task.status,
            "progress": task.progress,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat(),
            "has_result": task.result is not None
        })
    
    return {
        "tasks": sorted(tasks, key=lambda x: x["created_at"], reverse=True),
        "total": len(tasks)
    }

@app.delete("/api/ocr/task/{task_id}")
async def delete_task(task_id: str):
    """Delete a processing task and its associated files"""
    
    if task_id not in processing_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Remove file if it exists
    for file_path in UPLOAD_DIR.glob(f"{task_id}_*"):
        try:
            file_path.unlink()
        except Exception as e:
            print(f"Warning: Could not delete file {file_path}: {e}")
    
    # Remove from memory
    del processing_tasks[task_id]
    
    return {"message": "Task deleted successfully"}

# Asset mapping endpoints (for future implementation)
@app.get("/api/assets/health")
async def asset_mapping_health():
    """Asset mapping service health check"""
    return {
        "status": "available",
        "message": "Asset mapping functionality ready",
        "features": ["GIS processing", "Land boundary analysis", "Satellite imagery"]
    }

@app.post("/api/assets/analyze")
async def analyze_land_assets(data: Dict[str, Any]):
    """Analyze land assets and boundaries (placeholder)"""
    # This would integrate with the asset-map functionality
    return {
        "message": "Asset analysis functionality will be implemented here",
        "received_data": data
    }

# DSS (Decision Support System) endpoints
@app.get("/api/dss/health")
async def dss_health():
    """DSS service health check"""
    return {
        "status": "available",
        "message": "Decision Support System ready",
        "features": ["FRA analysis", "Land cover analysis", "Document processing"]
    }

@app.post("/api/dss/analyze")
async def dss_analyze(request_data: Dict[str, Any]):
    """
    DSS Analysis endpoint for land cover and FRA data processing
    """
    try:
        analysis_type = request_data.get("analysisType", "land_cover")
        
        if analysis_type == "land_cover":
            # Read the land cover data from the examples file
            land_cover_file = os.path.join(os.path.dirname(__file__), "DSS", "examples", "land_cover.txt")
            
            if os.path.exists(land_cover_file):
                land_cover_data = {}
                with open(land_cover_file, 'r') as f:
                    for line in f:
                        line = line.strip()
                        if ':' in line:
                            key, value = line.split(':', 1)
                            key = key.strip()
                            value = value.strip().rstrip('%')
                            try:
                                land_cover_data[key] = float(value)
                            except ValueError:
                                continue
                
                return {
                    "success": True,
                    "data": {
                        "landCoverAnalysis": land_cover_data,
                        "analysisType": "land_cover",
                        "timestamp": datetime.now().isoformat()
                    },
                    "message": "Land cover analysis completed successfully"
                }
            else:
                # Return mock data if file doesn't exist
                return {
                    "success": True,
                    "data": {
                        "landCoverAnalysis": {
                            "Background": 0.00,
                            "Bareland": 0.00,
                            "Rangeland": 14.79,
                            "Developed_Space": 5.74,
                            "Road": 0.00,
                            "Tree": 16.01,
                            "Water": 0.08,
                            "Agriculture land": 61.79,
                            "Building": 1.59
                        },
                        "analysisType": "land_cover",
                        "timestamp": datetime.now().isoformat()
                    },
                    "message": "Land cover analysis completed (using sample data)"
                }
        
        elif analysis_type == "scheme_recommendations":
            # Read the latest scheme analysis JSON from output directory
            output_dir = os.path.join(os.path.dirname(__file__), "DSS", "output")
            
            if os.path.exists(output_dir):
                # Find the latest scheme_analysis JSON file
                scheme_files = [f for f in os.listdir(output_dir) if f.startswith("scheme_analysis_") and f.endswith(".json")]
                
                if scheme_files:
                    # Sort by modification time to get the latest
                    latest_file = max(scheme_files, key=lambda f: os.path.getmtime(os.path.join(output_dir, f)))
                    scheme_file_path = os.path.join(output_dir, latest_file)
                    
                    with open(scheme_file_path, 'r', encoding='utf-8') as f:
                        scheme_data = json.load(f)
                    
                    return {
                        "success": True,
                        "data": {
                            "schemeAnalysis": scheme_data.get("developer_json", {}),
                            "claimantName": scheme_data.get("claimant_name", ""),
                            "processingTimestamp": scheme_data.get("processing_timestamp", ""),
                            "analysisMetadata": scheme_data.get("analysis_metadata", {}),
                            "analysisType": "scheme_recommendations",
                            "timestamp": datetime.now().isoformat()
                        },
                        "message": "Scheme recommendations retrieved successfully"
                    }
                else:
                    return {
                        "success": False,
                        "error": "No scheme analysis data found in output directory",
                        "message": "Please run the scheme analysis pipeline first"
                    }
            else:
                return {
                    "success": False,
                    "error": "Output directory not found",
                    "message": "Please create the output directory and run the analysis"
                }
        
        else:
            return {
                "success": False,
                "error": f"Unsupported analysis type: {analysis_type}",
                "supportedTypes": ["land_cover", "scheme_recommendations"]
            }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"DSS analysis failed: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
