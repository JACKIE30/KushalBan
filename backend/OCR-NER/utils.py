import json
import os
from typing import Dict, Any
from datetime import datetime

def save_results_to_json(results: Dict[str, Any], output_path: str = "document_analysis_results.json"):
    """Save results to JSON file with timestamp and formatting"""
    try:
        # Add timestamp to results
        results_with_metadata = {
            **results,
            "processing_timestamp": datetime.now().isoformat(),
            "version": "1.0"
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results_with_metadata, f, indent=2, ensure_ascii=False)
        print(f"✅ Results saved to {output_path}")
    except Exception as e:
        print(f"❌ Error saving results: {str(e)}")

def load_results_from_json(file_path: str) -> Dict[str, Any]:
    """Load results from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading results: {str(e)}")
        return {}

def validate_image_path(image_path: str) -> bool:
    """Validate if image path exists and has valid extension"""
    if not os.path.exists(image_path):
        return False
    
    valid_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif']
    return any(image_path.lower().endswith(ext) for ext in valid_extensions)

def create_output_directory(base_name: str = "document_analysis") -> str:
    """Create output directory with timestamp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    dir_name = f"{base_name}_{timestamp}"
    
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
    
    return dir_name