import pytesseract
import cv2
import re
import spacy
import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict
from typing import Dict, List, Any
import json
import os

# Load spacy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Please install spacy English model: python -m spacy download en_core_web_sm")
    nlp = None


class StructuredDocumentParser:
    def __init__(self, tesseract_path: str = None):
        """Initialize the structured document parser with Tesseract path"""
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        else:
            self._find_tesseract()
        
        # Enhanced patterns for Indian government documents
        self.field_patterns = {
            'holder_name': [
                r'name\s*\(s\)\s*of\s*holder\s*\(s\).*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'holder.*?name.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'श्री\s*([A-Za-z\s\.]+?)(?:\n|$)',
                r'name.*?([A-Za-z\s\.]+?)s/o'
            ],
            'father_mother_name': [
                r'name\s*of\s*father/mother.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'father.*?name.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'mother.*?name.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r's/o\s*([A-Za-z\s\.]+?)(?:\n|$)',
                r'w/o\s*([A-Za-z\s\.]+?)(?:\n|$)',
                r'd/o\s*([A-Za-z\s\.]+?)(?:\n|$)'
            ],
            'dependents': [
                r'name\s*of\s*dependents.*?([A-Za-z\s\.,\n]+?)(?=address|village|$)',
                r'dependents.*?([A-Za-z\s\.,\n]+?)(?=address|village|$)'
            ],
            'address': [
                r'address.*?([A-Za-z0-9\s\.,\-\n]+?)(?=village|gram|tehsil|district|$)',
                r'पता.*?([A-Za-z0-9\s\.,\-\n]+?)(?=village|gram|tehsil|district|$)'
            ],
            'village_gram': [
                r'village/gram\s*sabha.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'village.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'gram.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'गांव.*?([A-Za-z\s\.]+?)(?:\n|$)'
            ],
            'gram_panchayat': [
                r'gram\s*panchayat.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'panchayat.*?([A-Za-z\s\.]+?)(?:\n|$)'
            ],
            'tehsil': [
                r'tehsil/taluka.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'tehsil.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'taluka.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'block.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'तहसील.*?([A-Za-z\s\.]+?)(?:\n|$)'
            ],
            'district': [
                r'district.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'जिला.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'dist.*?([A-Za-z\s\.]+?)(?:\n|$)'
            ],
            'caste_category': [
                r'whether\s*scheduled\s*tribe.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'sc/st.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'caste.*?([A-Za-z\s\.]+?)(?:\n|$)',
                r'category.*?([A-Za-z\s\.]+?)(?:\n|$)'
            ],
            'area': [
                r'area.*?([0-9\-\.\s]+?)(?:bighas|acres|hectares|\n|$)',
                r'क्षेत्रफल.*?([0-9\-\.\s]+?)(?:bighas|acres|hectares|\n|$)'
            ],
            'boundaries': [
                r'description\s*of\s*boundaries.*?([A-Za-z0-9\s\.,\-\n/]+?)(?=this\s*title|$)',
                r'boundaries.*?([A-Za-z0-9\s\.,\-\n/]+?)(?=this\s*title|$)'
            ],
            'khasra_number': [
                r'khasra\s*no.*?([0-9/\-\s\.]+?)(?:\n|$)',
                r'survey\s*no.*?([0-9/\-\s\.]+?)(?:\n|$)'
            ]
        }
        
        # Patterns for document headers/titles
        self.title_patterns = [
            r'(title\s*for\s*forest\s*land.*)',
            r'(annexure.*)',
            r'(certificate.*)',
            r'(प्रमाण\s*पत्र.*)',
            r'(forest\s*rights.*)',
            r'(occupation.*right.*)',
            r'([A-Z\s]{10,}(?:CERTIFICATE|TITLE|FORM|APPLICATION).*)'
        ]

    def _find_tesseract(self):
        """Try to find Tesseract installation automatically"""
        possible_paths = [
            r"C:\Program Files\Tesseract-OCR\tesseract.exe",
            r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
            "/usr/bin/tesseract",
            "/usr/local/bin/tesseract"
        ]
        
        for path in possible_paths:
            try:
                if os.path.exists(path):
                    pytesseract.pytesseract.tesseract_cmd = path
                    return
            except:
                continue
    
    def preprocess_image_advanced(self, image_path: str) -> List[np.ndarray]:
        """Advanced image preprocessing with multiple variants for better OCR"""
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image from path: {image_path}")
        
        # Original
        original = img.copy()
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Multiple preprocessing variants
        variants = []
        
        # Variant 1: Standard preprocessing
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        enhanced = clahe.apply(blurred)
        _, thresh1 = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        variants.append(thresh1)
        
        # Variant 2: Adaptive threshold
        adaptive_thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        variants.append(adaptive_thresh)
        
        # Variant 3: Morphological operations
        kernel = np.ones((2,2), np.uint8)
        morph = cv2.morphologyEx(thresh1, cv2.MORPH_CLOSE, kernel)
        morph = cv2.morphologyEx(morph, cv2.MORPH_OPEN, kernel)
        variants.append(morph)
        
        # Variant 4: Denoising
        denoised = cv2.fastNlMeansDenoising(gray)
        _, thresh_denoised = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        variants.append(thresh_denoised)
        
        return [original] + variants
    
    def extract_text_with_layout(self, image: np.ndarray) -> Dict[str, Any]:
        """Extract text with detailed layout information"""
        # Get bounding box data
        data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        
        # Filter high confidence text
        words_info = []
        for i in range(len(data['text'])):
            if int(data['conf'][i]) > 30 and data['text'][i].strip():
                words_info.append({
                    'text': data['text'][i],
                    'confidence': int(data['conf'][i]),
                    'left': int(data['left'][i]),
                    'top': int(data['top'][i]),
                    'width': int(data['width'][i]),
                    'height': int(data['height'][i]),
                    'line_num': int(data['line_num'][i]),
                    'word_num': int(data['word_num'][i])
                })
        
        # Group words by lines
        lines = defaultdict(list)
        for word_info in words_info:
            lines[word_info['line_num']].append(word_info)
        
        # Sort words in each line by horizontal position
        for line_num in lines:
            lines[line_num].sort(key=lambda x: x['left'])
        
        # Reconstruct text maintaining layout
        full_text = ""
        line_texts = []
        
        for line_num in sorted(lines.keys()):
            line_text = " ".join([word['text'] for word in lines[line_num]])
            line_texts.append(line_text)
            full_text += line_text + "\n"
        
        return {
            'full_text': full_text,
            'line_texts': line_texts,
            'words_info': words_info,
            'raw_data': data,
            'avg_confidence': np.mean([w['confidence'] for w in words_info]) if words_info else 0
        }
    
    def extract_document_title(self, text: str) -> str:
        """Extract document title/heading with better accuracy"""
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        if not lines:
            return "No title found"
        
        # Look for title patterns
        for pattern in self.title_patterns:
            for line in lines[:10]:  # Check first 10 lines
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        
        # Look for lines with specific keywords and formatting
        title_keywords = [
            'title', 'certificate', 'form', 'application', 'annexure',
            'प्रमाण', 'पत्र', 'फॉर्म', 'आवेदन', 'forest', 'land', 'occupation'
        ]
        
        potential_titles = []
        for i, line in enumerate(lines[:8]):  # First 8 lines
            line_lower = line.lower()
            keyword_count = sum(1 for keyword in title_keywords if keyword in line_lower)
            
            if keyword_count > 0 and len(line) > 10:
                score = keyword_count + (1 if line.isupper() else 0) + (1 if i < 3 else 0)
                potential_titles.append((line, score))
        
        if potential_titles:
            # Return the highest scoring title
            return max(potential_titles, key=lambda x: x[1])[0]
        
        # Fallback: return first substantial line
        for line in lines:
            if len(line) > 15 and not line.isdigit():
                return line
        
        return lines[0] if lines else "No title found"
    
    def extract_structured_fields(self, text: str) -> Dict[str, str]:
        """Extract structured fields using enhanced pattern matching"""
        extracted_fields = {}
        text_lower = text.lower()
        
        for field_name, patterns in self.field_patterns.items():
            for pattern in patterns:
                try:
                    matches = re.finditer(pattern, text_lower, re.IGNORECASE | re.MULTILINE | re.DOTALL)
                    for match in matches:
                        if match.group(1):
                            value = match.group(1).strip()
                            # Clean the extracted value
                            value = self._clean_extracted_value(value, field_name)
                            if value and len(value) > 1:
                                extracted_fields[field_name] = value
                                break
                except re.error:
                    continue
                
                if field_name in extracted_fields:
                    break
        
        return extracted_fields
    
    def _clean_extracted_value(self, value: str, field_type: str) -> str:
        """Clean extracted values based on field type"""
        if not value:
            return ""
        
        # Remove common OCR artifacts
        value = re.sub(r'[^\w\s\.,\-/]', ' ', value)
        value = ' '.join(value.split())
        
        # Field-specific cleaning
        if field_type in ['holder_name', 'father_mother_name']:
            # Keep only alphabetic characters and spaces for names
            value = re.sub(r'[^a-zA-Z\s\.]', ' ', value)
            value = ' '.join(word.title() for word in value.split() if len(word) > 1)
            
        elif field_type == 'area':
            # Keep numbers, decimals, and common area units
            value = re.sub(r'[^0-9\.\-\s]', ' ', value)
            value = ' '.join(value.split())
            
        elif field_type == 'khasra_number':
            # Keep numbers, slashes, and hyphens
            value = re.sub(r'[^0-9/\-\s]', ' ', value)
            value = ' '.join(value.split())
            
        elif field_type in ['village_gram', 'tehsil', 'district']:
            # Clean location names
            value = re.sub(r'[^a-zA-Z\s\.]', ' ', value)
            value = ' '.join(word.title() for word in value.split() if len(word) > 1)
        
        return value.strip()
    
    def extract_table_structure(self, words_info: List[Dict]) -> Dict[str, str]:
        """Extract information assuming table structure"""
        # Group words by approximate rows (using y-coordinate clustering)
        if not words_info:
            return {}
        
        # Sort by vertical position
        words_info.sort(key=lambda x: x['top'])
        
        # Group into rows
        rows = []
        current_row = []
        last_top = -1
        row_threshold = 20  # pixels
        
        for word in words_info:
            if last_top == -1 or abs(word['top'] - last_top) < row_threshold:
                current_row.append(word)
            else:
                if current_row:
                    rows.append(current_row)
                current_row = [word]
            last_top = word['top']
        
        if current_row:
            rows.append(current_row)
        
        # Extract key-value pairs from rows
        extracted_data = {}
        
        for row in rows:
            if len(row) < 2:
                continue
            
            # Sort words in row by horizontal position
            row.sort(key=lambda x: x['left'])
            
            # Join all text in the row
            row_text = " ".join([word['text'] for word in row])
            
            # Try to identify if this row contains a field we're interested in
            row_lower = row_text.lower()
            
            for field_name, patterns in self.field_patterns.items():
                if field_name not in extracted_data:
                    for pattern in patterns:
                        match = re.search(pattern, row_lower, re.IGNORECASE)
                        if match and match.group(1):
                            value = self._clean_extracted_value(match.group(1), field_name)
                            if value:
                                extracted_data[field_name] = value
                                break
        
        return extracted_data
    
    def parse_document_comprehensive(self, image_path: str, show_images: bool = True) -> Dict[str, Any]:
        """Comprehensive document parsing with multiple extraction strategies"""
        try:
            # Preprocess with multiple variants
            image_variants = self.preprocess_image_advanced(image_path)
            
            if show_images:
                # Display first few variants
                fig, axes = plt.subplots(2, 3, figsize=(18, 12))
                axes = axes.flatten()
                
                for i, img in enumerate(image_variants[:6]):
                    if i == 0:
                        axes[i].imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
                        axes[i].set_title('Original Image')
                    else:
                        axes[i].imshow(img, cmap='gray')
                        axes[i].set_title(f'Processed Variant {i}')
                    axes[i].axis('off')
                
                plt.tight_layout()
                plt.show()
            
            # Extract text from all variants and choose the best
            best_result = None
            best_confidence = 0
            
            all_extractions = []
            
            for i, variant in enumerate(image_variants[1:], 1):  # Skip original
                try:
                    ocr_result = self.extract_text_with_layout(variant)
                    ocr_result['variant_id'] = i
                    all_extractions.append(ocr_result)
                    
                    if ocr_result['avg_confidence'] > best_confidence:
                        best_confidence = ocr_result['avg_confidence']
                        best_result = ocr_result
                except:
                    continue
            
            if not best_result:
                raise Exception("Failed to extract text from any variant")
            
            # Extract title
            title = self.extract_document_title(best_result['full_text'])
            
            # Extract fields using pattern matching
            pattern_fields = self.extract_structured_fields(best_result['full_text'])
            
            # Extract fields using table structure
            table_fields = self.extract_table_structure(best_result['words_info'])
            
            # Merge results (pattern matching takes precedence)
            final_fields = {**table_fields, **pattern_fields}
            
            # Extract using NER if available
            ner_info = {}
            if nlp:
                try:
                    doc = nlp(best_result['full_text'])
                    ner_info = {
                        'persons': [ent.text for ent in doc.ents if ent.label_ == "PERSON"],
                        'locations': [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]],
                        'organizations': [ent.text for ent in doc.ents if ent.label_ == "ORG"]
                    }
                except:
                    pass
            
            # Compile comprehensive results
            results = {
                'document_title': title,
                'extracted_fields': final_fields,
                'ner_info': ner_info,
                'full_text': best_result['full_text'],
                'ocr_confidence': best_result['avg_confidence'],
                'extraction_variants': len(all_extractions),
                'processing_status': 'success'
            }
            
            return results
            
        except Exception as e:
            return {
                'document_title': 'Error processing document',
                'extracted_fields': {},
                'ner_info': {},
                'full_text': '',
                'ocr_confidence': 0,
                'extraction_variants': 0,
                'processing_status': f'error: {str(e)}'
            }
    
    def print_comprehensive_results(self, results: Dict[str, Any]):
        """Print comprehensive formatted results"""
        print("=" * 80)
        print("🏛️  STRUCTURED DOCUMENT ANALYSIS RESULTS")
        print("=" * 80)
        
        print(f"\n📋 DOCUMENT TITLE:")
        print(f"    {results['document_title']}")
        
        print(f"\n📊 PROCESSING INFO:")
        print(f"    OCR Confidence: {results['ocr_confidence']:.1f}%")
        print(f"    Variants Processed: {results['extraction_variants']}")
        print(f"    Status: {results['processing_status']}")
        
        print(f"\n🎯 EXTRACTED FIELDS:")
        print("=" * 50)
        
        # Define field display order and labels
        field_labels = {
            'holder_name': '👤 Name(s) of Holder(s)',
            'father_mother_name': '👥 Father/Mother Name',
            'dependents': '👨‍👩‍👧‍👦 Name of Dependents',
            'address': '🏠 Address',
            'village_gram': '🏘️ Village/Gram Sabha',
            'gram_panchayat': '🏛️ Gram Panchayat',
            'tehsil': '📍 Tehsil/Taluka',
            'district': '🗺️ District',
            'caste_category': '📋 Caste Category (SC/ST)',
            'area': '📐 Area',
            'khasra_number': '📄 Khasra Number',
            'boundaries': '🔲 Description of Boundaries'
        }
        
        extracted_fields = results['extracted_fields']
        
        for field_key, field_label in field_labels.items():
            if field_key in extracted_fields and extracted_fields[field_key]:
                print(f"{field_label}:")
                print(f"    {extracted_fields[field_key]}")
            else:
                print(f"{field_label}:")
                print(f"    ❌ Not found or unclear")
            print()
        
        # Show NER results if available
        if results.get('ner_info') and any(results['ner_info'].values()):
            print("🤖 NAMED ENTITY RECOGNITION:")
            print("=" * 50)
            for entity_type, entities in results['ner_info'].items():
                if entities:
                    print(f"{entity_type.title()}: {', '.join(set(entities))}")
            print()
        
        # Show full text summary
        print("📄 FULL TEXT PREVIEW:")
        print("=" * 50)
        text_preview = results['full_text'][:800] + "..." if len(results['full_text']) > 800 else results['full_text']
        print(text_preview)
        
        print("\n" + "=" * 80)
    
    def save_results_to_json(self, results: Dict[str, Any], output_path: str = "document_analysis_results.json"):
        """Save results to JSON file"""
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"✅ Results saved to {output_path}")
        except Exception as e:
            print(f"❌ Error saving results: {str(e)}")