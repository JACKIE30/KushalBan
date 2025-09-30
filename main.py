"""
FRA Claimant Data Processing Agent using Gemini 2.5 - FIXED VERSION
"""
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Dict, Any, Optional
from models.schemas import FRAClaimantProfile, ProcessingRequest, ProcessingResponse
from utils.helper import validate_and_parse_response, format_error_response, format_success_response
from prompt import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE

# Load environment variables
load_dotenv()

class FRADataProcessor:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the FRA Data Processor with Gemini API
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Initialize the model
        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-exp",  # Fixed model name
            system_instruction=SYSTEM_PROMPT
        )
        
        # Generation config for consistent JSON output
        self.generation_config = genai.types.GenerationConfig(
            candidate_count=1,
            temperature=0.1,  # Low temperature for consistent output
            max_output_tokens=2048,
        )
    
    def process_data(self, document_analysis: Dict[str, Any], land_cover_data: str) -> ProcessingResponse:
        """
        Process FRA claimant data and return structured profile
        
        Args:
            document_analysis: Dictionary containing document analysis results
            land_cover_data: String containing land cover data
        
        Returns:
            ProcessingResponse object with success status and data/error
        """
        try:
            # Validate input
            request = ProcessingRequest(
                document_analysis=document_analysis,
                land_cover_data=land_cover_data
            )
            
            # Create the user prompt
            user_prompt = USER_PROMPT_TEMPLATE.format(
                document_analysis=json.dumps(request.document_analysis, indent=2),
                land_cover_data=request.land_cover_data
            )
            
            # Generate response
            response = self.model.generate_content(
                user_prompt,
                generation_config=self.generation_config
            )
            
            if not response.text:
                return ProcessingResponse(
                    success=False,
                    error="No response generated from Gemini"
                )
            
            # Parse and validate the response
            profile = validate_and_parse_response(response.text)
            
            return ProcessingResponse(
                success=True,
                data=profile,
                raw_response=response.text
            )
            
        except Exception as e:
            return ProcessingResponse(
                success=False,
                error=f"Error processing data: {str(e)}"
            )
    
    def process_from_files(self, document_file: str, landcover_file: str) -> ProcessingResponse:
        """
        Process data from files
        
        Args:
            document_file: Path to JSON file containing document analysis
            landcover_file: Path to text file containing land cover data
        
        Returns:
            ProcessingResponse object
        """
        try:
            # Check if files exist
            if not os.path.exists(document_file):
                return ProcessingResponse(
                    success=False,
                    error=f"Document file not found: {document_file}"
                )
            
            if not os.path.exists(landcover_file):
                return ProcessingResponse(
                    success=False,
                    error=f"Land cover file not found: {landcover_file}"
                )
            
            # Read document analysis
            with open(document_file, 'r', encoding='utf-8') as f:
                document_analysis = json.load(f)
            
            # Read land cover data
            with open(landcover_file, 'r', encoding='utf-8') as f:
                land_cover_data = f.read()
            
            return self.process_data(document_analysis, land_cover_data)
            
        except FileNotFoundError as e:
            return ProcessingResponse(
                success=False,
                error=f"File not found: {str(e)}"
            )
        except json.JSONDecodeError as e:
            return ProcessingResponse(
                success=False,
                error=f"Invalid JSON in document file: {str(e)}"
            )
        except Exception as e:
            return ProcessingResponse(
                success=False,
                error=f"Error reading files: {str(e)}"
            )


def main():
    """
    Example usage of the FRA Data Processor
    """
    # Initialize processor
    try:
        processor = FRADataProcessor()
        print("✅ FRA Data Processor initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing processor: {e}")
        return
    
    print("\n" + "="*50)
    print("PROCESSING DATA FROM FILES")
    print("="*50)
    
    # Print current working directory for debugging
    print(f"Current working directory: {os.getcwd()}")
    
    # Try different path combinations
    possible_paths = [
        # Option 1: Relative to current directory
        ("examples/sample_doc.json", "examples/land_cover.txt"),
        # Option 2: DSS subdirectory  
        ("DSS/examples/sample_doc.json", "DSS/examples/land_cover.txt"),
        # Option 3: Current directory files
        ("sample_doc.json", "land_cover.txt"),
        # Option 4: Full relative path
        ("./examples/sample_doc.json", "./examples/land_cover.txt")
    ]
    
    found_files = False
    for doc_path, land_path in possible_paths:
        if os.path.exists(doc_path) and os.path.exists(land_path):
            print(f"✅ Found files at: {doc_path}, {land_path}")
            document_file = doc_path
            landcover_file = land_path
            found_files = True
            break
    
    if not found_files:
        print("❌ Could not find input files. Please check:")
        print("1. File paths are correct")
        print("2. Files exist in the expected location")
        print("3. Current working directory contains the files")
        print("\nSearched for files at:")
        for doc_path, land_path in possible_paths:
            print(f"  - {doc_path}")
            print(f"  - {land_path}")
        return

    # Process directly from files
    result = processor.process_from_files(document_file, landcover_file)
    
    if result.success:
        print("✅ Processing successful!")
        print("\nExtracted Profile:")
        # Convert Pydantic model to dictionary for JSON serialization
        profile_dict = result.data.model_dump(exclude_none=True) if result.data else {}
        print(json.dumps(profile_dict, indent=2, ensure_ascii=False))
        # Save to JSON file
        with open(r"F:\ML + Projects\SIH\DSS\fra_profile_output.json", "w", encoding="utf-8") as f:
            json.dump(profile_dict, f, indent=2, ensure_ascii=False)
        print("💾 Profile saved to: fra_profile_output.json")
    else:
        print(f"❌ Processing failed: {result.error}")
    
    print("\n" + "="*50)
    print("USAGE INSTRUCTIONS")
    print("="*50)
    print(f"""
Files successfully processed from:
- Document: {document_file if found_files else 'NOT FOUND'}
- Land Cover: {landcover_file if found_files else 'NOT FOUND'}
""")

if __name__ == "__main__":
    main()