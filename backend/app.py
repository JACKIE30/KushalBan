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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
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
        # Note: You may need to adjust the tesseract path for your system
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
