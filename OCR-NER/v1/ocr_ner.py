# Complete OCR + Document Classifier
# Single file solution - just run this one file!

import pytesseract
import cv2
import matplotlib.pyplot as plt
import re
import spacy
from typing import Dict, List, Optional, Tuple
import numpy as np
from PIL import Image, ImageEnhance
import os
import shutil
import google.generativeai as genai
import json
from dataclasses import dataclass
from enum import Enum

# Load spacy model for NER (install with: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Please install spacy English model: python -m spacy download en_core_web_sm")
    nlp = None

class ConfidenceLevel(Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

@dataclass
class DocumentClassification:
    document_type: str
    confidence_level: ConfidenceLevel
    confidence_score: float
    reasoning: str
    key_indicators: list
    suggested_actions: list

class DocumentParser:
    def __init__(self, tesseract_path: str = None):
        """Initialize the document parser with Tesseract path"""
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        else:
            # Try to find Tesseract automatically
            self._find_tesseract()
        
        # Define patterns for Indian document fields
        self.patterns = {
            'name': [
                r'name[:\s]*([a-zA-Z\s]+)',
                r'श्री[:\s]*([a-zA-Z\s]+)',
                r'नाम[:\s]*([a-zA-Z\s]+)',
                r'applicant[:\s]*([a-zA-Z\s]+)',
                r'candidate[:\s]*([a-zA-Z\s]+)'
            ],
            'father_name': [
                r'father[\'s\s]*name[:\s]*([a-zA-Z\s]+)',
                r'पिता का नाम[:\s]*([a-zA-Z\s]+)',
                r'father[:\s]*([a-zA-Z\s]+)',
                r's/o[:\s]*([a-zA-Z\s]+)',
                r'son of[:\s]*([a-zA-Z\s]+)'
            ],
            'mother_name': [
                r'mother[\'s\s]*name[:\s]*([a-zA-Z\s]+)',
                r'माता का नाम[:\s]*([a-zA-Z\s]+)',
                r'mother[:\s]*([a-zA-Z\s]+)',
                r'd/o[:\s]*([a-zA-Z\s]+)',
                r'daughter of[:\s]*([a-zA-Z\s]+)'
            ],
            'village': [
                r'village[:\s]*([a-zA-Z\s]+)',
                r'गांव[:\s]*([a-zA-Z\s]+)',
                r'gram[:\s]*([a-zA-Z\s]+)',
                r'vill[:\s]*([a-zA-Z\s]+)'
            ],
            'tehsil': [
                r'tehsil[:\s]*([a-zA-Z\s]+)',
                r'तहसील[:\s]*([a-zA-Z\s]+)',
                r'taluka[:\s]*([a-zA-Z\s]+)',
                r'block[:\s]*([a-zA-Z\s]+)'
            ],
            'district': [
                r'district[:\s]*([a-zA-Z\s]+)',
                r'जिला[:\s]*([a-zA-Z\s]+)',
                r'dist[:\s]*([a-zA-Z\s]+)'
            ],
            'area': [
                r'area[:\s]*([a-zA-Z\s]+)',
                r'locality[:\s]*([a-zA-Z\s]+)',
                r'ward[:\s]*([a-zA-Z\s\d]+)',
                r'zone[:\s]*([a-zA-Z\s\d]+)'
            ],
            'pincode': [
                r'pin[:\s]*(\d{6})',
                r'pincode[:\s]*(\d{6})',
                r'postal code[:\s]*(\d{6})'
            ],
            'address': [
                r'address[:\s]*([a-zA-Z0-9\s,.-]+)',
                r'पता[:\s]*([a-zA-Z0-9\s,.-]+)'
            ]
        }
    
    def _find_tesseract(self):
        """Automatically find Tesseract installation"""
        possible_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            r"C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe".format(os.getenv('USERNAME')),
        ]
        
        # Check if tesseract is in PATH
        if shutil.which("tesseract"):
            print("✅ Tesseract found in PATH")
            return
        
        # Check common installation paths
        for path in possible_paths:
            if os.path.exists(path):
                pytesseract.pytesseract.tesseract_cmd = path
                print(f"✅ Tesseract found at: {path}")
                return
        
        # If not found, raise error with instructions
        raise FileNotFoundError(
            "❌ Tesseract not found! Please:\n"
            "1. Download from: https://github.com/UB-Mannheim/tesseract/wiki\n"
            "2. Install to C:\\Program Files\\Tesseract-OCR\\\n"
            "3. Or add Tesseract to your PATH"
        )
    
    def preprocess_image(self, image_path: str) -> Tuple[np.ndarray, np.ndarray]:
        """Enhanced image preprocessing for better OCR accuracy"""
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image from path: {image_path}")
        
        original = img.copy()
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply different preprocessing techniques
        # 1. Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        
        # 2. Enhance contrast using CLAHE
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        enhanced = clahe.apply(blurred)
        
        # 3. Apply threshold
        _, thresh = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # 4. Morphological operations to clean up
        kernel = np.ones((1,1), np.uint8)
        processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        processed = cv2.morphologyEx(processed, cv2.MORPH_OPEN, kernel)
        
        return original, processed
    
    def extract_text_with_confidence(self, image: np.ndarray) -> Tuple[str, Dict]:
        """Extract text with confidence scores and bounding boxes"""
        # Get detailed OCR data
        data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        
        # Filter out low confidence text
        confidences = data['conf']
        texts = data['text']
        
        filtered_text = []
        high_conf_text = []
        
        for i, conf in enumerate(confidences):
            if conf > 30 and texts[i].strip():  # Filter low confidence
                filtered_text.append(texts[i])
                if conf > 60:
                    high_conf_text.append(texts[i])
        
        # Combine text
        full_text = ' '.join(filtered_text)
        high_conf_only = ' '.join(high_conf_text)
        
        return full_text, {
            'high_confidence_text': high_conf_only,
            'raw_data': data,
            'avg_confidence': np.mean([c for c in confidences if c > 0])
        }
    
    def extract_headline(self, text: str, ocr_data: Dict) -> str:
        """Extract the main headline/title of the document"""
        lines = text.split('\n')
        lines = [line.strip() for line in lines if line.strip()]
        
        if not lines:
            return "No headline found"
        
        # Strategy 1: Look for common document headers
        header_keywords = [
            'certificate', 'प्रमाण पत्र', 'notice', 'सूचना', 'application', 'आवेदन',
            'form', 'फॉर्म', 'card', 'कार्ड', 'license', 'लाइसेंस', 'permit', 'अनुमति',
            'registration', 'पंजीकरण', 'identity', 'पहचान', 'income', 'आय', 'caste', 'जाति'
        ]
        
        for line in lines[:5]:  # Check first 5 lines
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in header_keywords):
                if len(line) > 10:  # Reasonable headline length
                    return line
        
        # Strategy 2: Find the longest line in the first few lines (likely title)
        potential_headlines = []
        for line in lines[:3]:
            if len(line) > 15 and len(line) < 100:  # Reasonable headline length
                potential_headlines.append(line)
        
        if potential_headlines:
            # Return the longest one
            return max(potential_headlines, key=len)
        
        # Strategy 3: Return first substantial line
        for line in lines:
            if len(line) > 10:
                return line
        
        return lines[0] if lines else "No headline found"
    
    def extract_information_with_patterns(self, text: str) -> Dict[str, str]:
        """Extract information using regex patterns"""
        extracted_info = {}
        text_lower = text.lower()
        
        for field, patterns in self.patterns.items():
            for pattern in patterns:
                matches = re.finditer(pattern, text_lower, re.IGNORECASE)
                for match in matches:
                    if match.group(1):
                        value = match.group(1).strip()
                        if len(value) > 1:  # Avoid single character matches
                            extracted_info[field] = value.title()
                            break
            if field in extracted_info:
                continue  # Move to next field if found
        
        return extracted_info
    
    def extract_information_with_ner(self, text: str) -> Dict[str, List[str]]:
        """Extract information using Named Entity Recognition"""
        if nlp is None:
            return {}
        
        doc = nlp(text)
        entities = {
            'persons': [],
            'locations': [],
            'organizations': []
        }
        
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                entities['persons'].append(ent.text)
            elif ent.label_ in ["GPE", "LOC"]:  # Geopolitical entity or location
                entities['locations'].append(ent.text)
            elif ent.label_ == "ORG":
                entities['organizations'].append(ent.text)
        
        return entities
    
    def clean_and_validate_info(self, info: Dict[str, str]) -> Dict[str, str]:
        """Clean and validate extracted information"""
        cleaned_info = {}
        
        for key, value in info.items():
            if isinstance(value, str):
                # Remove extra whitespace and special characters
                cleaned_value = re.sub(r'[^\w\s]', ' ', value)
                cleaned_value = ' '.join(cleaned_value.split())
                
                # Validate based on field type
                if key == 'pincode':
                    if re.match(r'^\d{6}$', cleaned_value.replace(' ', '')):
                        cleaned_info[key] = cleaned_value.replace(' ', '')
                elif key in ['name', 'father_name', 'mother_name']:
                    if len(cleaned_value) > 2 and cleaned_value.replace(' ', '').isalpha():
                        cleaned_info[key] = cleaned_value
                elif key in ['village', 'tehsil', 'district', 'area']:
                    if len(cleaned_value) > 2:
                        cleaned_info[key] = cleaned_value
                else:
                    if len(cleaned_value) > 1:
                        cleaned_info[key] = cleaned_value
        
        return cleaned_info
    
    def parse_document(self, image_path: str, show_images: bool = True) -> Dict:
        """Main method to parse document and extract all information"""
        try:
            # Preprocess image
            original_img, processed_img = self.preprocess_image(image_path)
            
            if show_images:
                # Display images
                fig, axes = plt.subplots(1, 2, figsize=(15, 7))
                axes[0].imshow(cv2.cvtColor(original_img, cv2.COLOR_BGR2RGB))
                axes[0].set_title('Original Image')
                axes[0].axis('off')
                
                axes[1].imshow(processed_img, cmap='gray')
                axes[1].set_title('Processed Image')
                axes[1].axis('off')
                
                plt.tight_layout()
                plt.show()
            
            # Extract text
            text, ocr_info = self.extract_text_with_confidence(processed_img)
            
            # Extract headline
            headline = self.extract_headline(text, ocr_info)
            
            # Extract information using patterns
            pattern_info = self.extract_information_with_patterns(text)
            
            # Extract information using NER
            ner_info = self.extract_information_with_ner(text)
            
            # Clean and validate
            cleaned_info = self.clean_and_validate_info(pattern_info)
            
            # Compile results
            results = {
                'headline': headline,
                'extracted_text': text,
                'pattern_based_info': cleaned_info,
                'ner_info': ner_info,
                'ocr_confidence': ocr_info['avg_confidence'],
                'processing_status': 'success'
            }
            
            return results
            
        except Exception as e:
            return {
                'headline': 'Error processing document',
                'extracted_text': '',
                'pattern_based_info': {},
                'ner_info': {},
                'ocr_confidence': 0,
                'processing_status': f'error: {str(e)}'
            }

class DocumentClassifierAgent:
    def __init__(self, api_key: str):
        """Initialize the Document Classifier Agent with Gemini API"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def create_classification_prompt(self, headline_text: str) -> str:
        """Create a structured prompt for document classification"""
        prompt = f"""
You are an expert document classifier specializing in Indian government documents and certificates. 

Analyze the following extracted headline/text from a document:

DOCUMENT TEXT: "{headline_text}"

Please provide a comprehensive classification with the following format:

1. **DOCUMENT TYPE**: Identify the specific type of document (e.g., Forest Rights Certificate, Income Certificate, Caste Certificate, etc.)

2. **CONFIDENCE LEVEL**: Assign one of the following:
   - HIGH: Very clear indicators, confident identification (80-100%)
   - MEDIUM: Some indicators present, reasonably confident (50-79%)
   - LOW: Limited/unclear indicators, uncertain identification (0-49%)

3. **CONFIDENCE SCORE**: Provide a numerical score from 0-100

4. **KEY INDICATORS**: List the specific words, phrases, or patterns that led to this classification

5. **REASONING**: Explain your classification logic in 2-3 sentences

6. **SUGGESTED ACTIONS**: Provide 2-3 actionable recommendations for processing this document

Please respond in the following JSON format:
{{
    "document_type": "specific document type",
    "confidence_level": "HIGH/MEDIUM/LOW",
    "confidence_score": numerical_score,
    "key_indicators": ["indicator1", "indicator2", "indicator3"],
    "reasoning": "explanation of classification logic",
    "suggested_actions": ["action1", "action2", "action3"],
    "document_purpose": "what this document is used for",
    "issuing_authority": "likely government department/authority"
}}

Focus on Indian government documents, certificates, and official papers. Be precise and thorough in your analysis.
"""
        return prompt
    
    def classify_document(self, headline_text: str) -> DocumentClassification:
        """Main method to classify document using Gemini"""
        try:
            # Create and send prompt to Gemini
            prompt = self.create_classification_prompt(headline_text)
            response = self.model.generate_content(prompt)
            
            # Parse JSON response
            response_text = response.text
            
            # Extract JSON from response (handle cases where model adds extra text)
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                classification_data = json.loads(json_str)
            else:
                raise ValueError("No valid JSON found in response")
            
            # Create classification object
            classification = DocumentClassification(
                document_type=classification_data.get('document_type', 'Unknown'),
                confidence_level=ConfidenceLevel(classification_data.get('confidence_level', 'LOW')),
                confidence_score=float(classification_data.get('confidence_score', 0)),
                reasoning=classification_data.get('reasoning', 'No reasoning provided'),
                key_indicators=classification_data.get('key_indicators', []),
                suggested_actions=classification_data.get('suggested_actions', [])
            )
            
            # Add additional metadata
            classification.document_purpose = classification_data.get('document_purpose', 'Not specified')
            classification.issuing_authority = classification_data.get('issuing_authority', 'Not specified')
            
            return classification
            
        except Exception as e:
            # Fallback classification
            return DocumentClassification(
                document_type="Classification Failed",
                confidence_level=ConfidenceLevel.LOW,
                confidence_score=0,
                reasoning=f"API Error: {str(e)}",
                key_indicators=[],
                suggested_actions=["Retry classification", "Manual review required"]
            )
    
    def print_classification_report(self, classification: DocumentClassification, headline_text: str):
        """Print a formatted classification report"""
        print("\n" + "=" * 70)
        print("🤖 DOCUMENT CLASSIFICATION REPORT")
        print("=" * 70)
        
        print(f"\n📄 Original Headline:")
        print(f"   {headline_text[:100]}{'...' if len(headline_text) > 100 else ''}")
        
        print(f"\n🏷️  Document Type: {classification.document_type}")
        
        # Color coding for confidence levels
        confidence_emoji = {
            ConfidenceLevel.HIGH: "🟢",
            ConfidenceLevel.MEDIUM: "🟡", 
            ConfidenceLevel.LOW: "🔴"
        }
        
        print(f"📊 Confidence: {confidence_emoji[classification.confidence_level]} {classification.confidence_level.value}")
        print(f"📈 Score: {classification.confidence_score:.1f}/100")
        
        print(f"\n🧠 Reasoning:")
        print(f"   {classification.reasoning}")
        
        if hasattr(classification, 'document_purpose'):
            print(f"\n🎯 Document Purpose:")
            print(f"   {classification.document_purpose}")
        
        if hasattr(classification, 'issuing_authority'):
            print(f"\n🏛️  Likely Issuing Authority:")
            print(f"   {classification.issuing_authority}")
        
        print(f"\n🔍 Key Indicators Found:")
        for indicator in classification.key_indicators:
            print(f"   • {indicator}")
        
        print(f"\n💡 Suggested Actions:")
        for action in classification.suggested_actions:
            print(f"   • {action}")

def print_ocr_results(results: Dict):
    """Print formatted OCR results"""
    print("="*60)
    print("📋 DOCUMENT ANALYSIS RESULTS")
    print("="*60)
    
    print(f"\n📋 HEADLINE: {results['headline']}")
    print(f"\n📊 OCR Confidence: {results['ocr_confidence']:.1f}%")
    print(f"🔄 Status: {results['processing_status']}")
    
    print("\n" + "="*40)
    print("📝 EXTRACTED INFORMATION")
    print("="*40)
    
    info = results['pattern_based_info']
    fields_to_show = ['name', 'father_name', 'mother_name', 'village', 'tehsil', 'district', 'area', 'pincode', 'address']
    
    for field in fields_to_show:
        if field in info:
            print(f"{field.replace('_', ' ').title()}: {info[field]}")
        else:
            print(f"{field.replace('_', ' ').title()}: Not found")
    
    if results['ner_info']:
        print("\n" + "="*40)
        print("🤖 NER ANALYSIS")
        print("="*40)
        for entity_type, entities in results['ner_info'].items():
            if entities:
                print(f"{entity_type.title()}: {', '.join(entities)}")

def main():
    """Main function - just run this!"""
    print("🚀 OCR + Document Classifier Started!")
    
    # Initialize OCR parser
    try:
        parser = DocumentParser()
    except FileNotFoundError as e:
        print(e)
        return None
    
    # Get document image path
    image_path = input("\nEnter the path to the document image: ").strip()
    
    # Parse the document
    print("\n🔄 Processing document...")
    results = parser.parse_document(image_path, show_images=True)
    
    # Print OCR results
    print_ocr_results(results)
    
    # Ask if user wants AI classification
    if results['processing_status'] == 'success' and results['headline'] != 'No headline found':
        classify_doc = input("\n🤖 Do you want to classify this document with AI? (y/n): ").lower().strip()
        
        if classify_doc == 'y':
            api_key = input("Enter your Gemini API Key: ").strip()
            
            if api_key:
                try:
                    print("\n🔄 Initializing AI classifier...")
                    classifier = DocumentClassifierAgent(api_key)
                    
                    print("🔄 Analyzing document with AI...")
                    classification = classifier.classify_document(results['headline'])
                    
                    # Print classification report
                    classifier.print_classification_report(classification, results['headline'])
                    
                    # Add classification to results
                    results['classification'] = {
                        'document_type': classification.document_type,
                        'confidence_level': classification.confidence_level.value,
                        'confidence_score': classification.confidence_score,
                        'reasoning': classification.reasoning
                    }
                    
                except Exception as e:
                    print(f"❌ Classification failed: {e}")
            else:
                print("⚠️  No API key provided. Skipping classification.")
    else:
        print("⚠️  Document processing failed or no headline found. Skipping classification.")
    
    return results

if __name__ == "__main__":
    result = main()
    if result:
        print("\n✅ Processing completed!")