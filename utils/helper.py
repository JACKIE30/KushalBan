"""
Helper functions for data processing
"""
import json
import re
from typing import Dict, Any, Optional
from models.schemas import FRAClaimantProfile

def clean_json_response(response: str) -> str:
    """
    Clean the Gemini response to extract only the JSON part
    """
    # Remove markdown code blocks
    response = re.sub(r'```json\s*', '', response)
    response = re.sub(r'```\s*$', '', response)
    
    # Find JSON object boundaries
    start_idx = response.find('{')
    if start_idx == -1:
        raise ValueError("No JSON object found in response")
    
    # Find the matching closing brace
    brace_count = 0
    end_idx = start_idx
    for i, char in enumerate(response[start_idx:], start_idx):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i + 1
                break
    
    json_str = response[start_idx:end_idx].strip()
    return json_str

def validate_and_parse_response(response: str) -> FRAClaimantProfile:
    """
    Parse and validate the JSON response from Gemini
    """
    try:
        # Clean the response
        clean_json = clean_json_response(response)
        
        # Parse JSON
        data = json.loads(clean_json)
        
        # Validate with Pydantic
        profile = FRAClaimantProfile(**data)
        return profile
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {e}")
    except Exception as e:
        raise ValueError(f"Error parsing response: {e}")

def load_sample_data(document_path: str = None, landcover_path: str = None) -> Dict[str, Any]:
    """
    Load sample data files for testing
    """
    sample_data = {}
    
    if document_path:
        try:
            with open(document_path, 'r', encoding='utf-8') as f:
                sample_data['document_analysis'] = json.load(f)
        except FileNotFoundError:
            print(f"Warning: Document file {document_path} not found")
    
    if landcover_path:
        try:
            with open(landcover_path, 'r', encoding='utf-8') as f:
                sample_data['land_cover_data'] = f.read()
        except FileNotFoundError:
            print(f"Warning: Land cover file {landcover_path} not found")
    
    return sample_data

def format_error_response(error: str) -> Dict[str, Any]:
    """
    Format error response
    """
    return {
        "success": False,
        "error": error,
        "data": None
    }

def format_success_response(profile: FRAClaimantProfile, raw_response: str = None) -> Dict[str, Any]:
    """
    Format success response
    """
    return {
        "success": True,
        "data": profile.dict(exclude_none=True),
        "error": None,
        "raw_response": raw_response
    }