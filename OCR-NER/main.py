import os
import sys
from pathlib import Path

try:
    from structured_parser import StructuredDocumentParser
    from agent2 import DocumentClassifierAgent
    from utils import save_results_to_json, validate_image_path, create_output_directory
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print("Make sure all required modules (structured_parser, agent2.py, utils.py) are in the same directory")
    sys.exit(1)

def print_classification_results(classification):
    """Print classification results in a formatted way"""
    print("\n" + "=" * 80)
    print("🏷️  DOCUMENT CLASSIFICATION RESULTS")
    print("=" * 80)
    
    print(f"\n📄 Document Type: {classification.document_type}")
    print(f"🎯 Confidence: {classification.confidence_level.value} ({classification.confidence_score}%)")
    print(f"🏛️ Issuing Authority: {classification.issuing_authority}")
    print(f"📋 Purpose: {classification.document_purpose}")
    
    print(f"\n🔍 Key Indicators:")
    for indicator in classification.key_indicators:
        print(f"    • {indicator}")
    
    print(f"\n💭 AI Reasoning:")
    print(f"    {classification.reasoning}")
    
    print(f"\n💡 Suggested Actions:")
    for action in classification.suggested_actions:
        print(f"    • {action}")
    
    print("\n" + "=" * 80)

def main():
    """Main function orchestrating document processing and classification"""
    print("🚀 Document Analysis Pipeline Starting...")
    
    # Initialize components
    try:
        parser = StructuredDocumentParser(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
        classifier = DocumentClassifierAgent()
        print("✅ All components initialized successfully")
    except Exception as e:
        print(f"❌ Initialization Error: {e}")
        return None
    
    # Get and validate image path
    while True:
        image_path = input("\n📁 Enter the path to the document image: ").strip()
        
        if not image_path:
            print("❌ Please provide a valid image path")
            continue
            
        if not validate_image_path(image_path):
            print(f"❌ Invalid image path or unsupported format: {image_path}")
            print("Supported formats: .jpg, .jpeg, .png, .bmp, .tiff, .tif")
            continue
        
        break
    
    # Create output directory
    output_dir = create_output_directory("document_analysis")
    print(f"📁 Output directory created: {output_dir}")
    
    try:
        # Step 1: Extract text and structure
        print("\n🔄 Step 1: Extracting text and analyzing structure...")
        extraction_results = parser.parse_document_comprehensive(image_path, show_images=True)
        
        if extraction_results['processing_status'] != 'success':
            print(f"❌ Extraction failed: {extraction_results['processing_status']}")
            return None
            
        parser.print_comprehensive_results(extraction_results)
        
        # Save extraction results
        extraction_file = os.path.join(output_dir, "extraction_results.json")
        save_results_to_json(extraction_results, extraction_file)
        
        # Step 2: Classify document with AI
        print("\n🔄 Step 2: Classifying document with AI...")
        
        if not extraction_results.get('full_text'):
            print("❌ No text extracted for classification")
            return extraction_results, None
            
        classification = classifier.classify(extraction_results['full_text'])
        print_classification_results(classification)
        
        # Save classification results
        classification_data = {
            'document_type': classification.document_type,
            'confidence_level': classification.confidence_level.value,
            'confidence_score': classification.confidence_score,
            'reasoning': classification.reasoning,
            'key_indicators': classification.key_indicators,
            'suggested_actions': classification.suggested_actions,
            'document_purpose': classification.document_purpose,
            'issuing_authority': classification.issuing_authority
        }
        
        classification_file = os.path.join(output_dir, "classification_results.json")
        save_results_to_json(classification_data, classification_file)
        
        # Create combined results
        combined_results = {
            'extraction': extraction_results,
            'classification': classification_data,
            'image_path': image_path,
            'output_directory': output_dir
        }
        
        combined_file = os.path.join(output_dir, "combined_results.json")
        save_results_to_json(combined_results, combined_file)
        
        print(f"\n✅ Processing completed successfully!")
        print(f"📁 All results saved in: {output_dir}")
        
        return extraction_results, classification
        
    except Exception as e:
        print(f"❌ Processing Error: {str(e)}")
        return None, None

def batch_process():
    """Process multiple documents in a directory"""
    print("📚 Batch Processing Mode")
    
    input_dir = input("Enter directory path containing images: ").strip()
    if not os.path.exists(input_dir):
        print(f"❌ Directory not found: {input_dir}")
        return
    
    # Get all image files
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif']
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(Path(input_dir).glob(f"*{ext}"))
        image_files.extend(Path(input_dir).glob(f"*{ext.upper()}"))
    
    if not image_files:
        print("❌ No image files found in directory")
        return
    
    print(f"📋 Found {len(image_files)} image files")
    
    # Process each file
    parser = StructuredDocumentParser(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
    classifier = DocumentClassifierAgent()
    
    batch_results = []
    
    for i, image_file in enumerate(image_files, 1):
        print(f"\n🔄 Processing {i}/{len(image_files)}: {image_file.name}")
        
        try:
            # Extract
            extraction = parser.parse_document_comprehensive(str(image_file), show_images=False)
            
            # Classify
            classification = None
            if extraction.get('full_text'):
                classification = classifier.classify(extraction['full_text'])
            
            batch_results.append({
                'file': str(image_file),
                'extraction': extraction,
                'classification': classification.__dict__ if classification else None
            })
            
            print(f"✅ Completed: {image_file.name}")
            
        except Exception as e:
            print(f"❌ Error processing {image_file.name}: {e}")
            batch_results.append({
                'file': str(image_file),
                'error': str(e)
            })
    
    # Save batch results
    output_dir = create_output_directory("batch_analysis")
    batch_file = os.path.join(output_dir, "batch_results.json")
    save_results_to_json({'results': batch_results}, batch_file)
    
    print(f"\n✅ Batch processing completed!")
    print(f"📁 Results saved in: {output_dir}")

if __name__ == "__main__":
    print("📄 Document Analysis Pipeline")
    print("=" * 50)
    
    mode = input("Choose mode:\n1. Single document\n2. Batch processing\nEnter choice (1/2): ").strip()
    
    if mode == "2":
        batch_process()
    else:
        results = main()
        
        if results[0] and results[1]:
            print("\n🎉 Analysis completed successfully!")
        else:
            print("\n❌ Analysis failed. Check error messages above.")