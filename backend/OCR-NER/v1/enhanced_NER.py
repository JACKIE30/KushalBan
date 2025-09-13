import cv2
import numpy as np
import pytesseract
from typing import Dict, List, Tuple, Any
import re
import json
from dataclasses import dataclass
from PIL import Image
import pandas as pd
from collections import defaultdict
import os

# For table detection (install: pip install table-transformer or layoutparser)
try:
    import layoutparser as lp
    LAYOUT_AVAILABLE = True
except ImportError:
    LAYOUT_AVAILABLE = False
    print("LayoutParser not available. Install with: pip install layoutparser")

# For better OCR (install: pip install easyocr)
try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
    print("EasyOCR not available. Install with: pip install easyocr")

@dataclass
class TableCell:
    text: str
    bbox: Tuple[int, int, int, int]  # x1, y1, x2, y2
    confidence: float
    row_idx: int
    col_idx: int

@dataclass
class ExtractedData:
    document_title: str
    structured_fields: Dict[str, str]
    table_data: List[List[str]]
    confidence_scores: Dict[str, float]
    processing_method: str

class OfflineDocumentExtractor:
    def __init__(self, tesseract_path: str = None):
        """Initialize offline document extractor"""
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        
        # Initialize EasyOCR if available
        if EASYOCR_AVAILABLE:
            self.easyocr_reader = easyocr.Reader(['en', 'hi'])  # English and Hindi
        
        # Initialize layout parser if available
        if LAYOUT_AVAILABLE:
            try:
                # Download pre-trained model for table detection
                self.layout_model = lp.Detectron2LayoutModel(
                    'lp://PubLayNet/faster_rcnn_R_50_FPN_3x/config',
                    extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.8],
                    label_map={0: "Text", 1: "Title", 2: "List", 3: "Table", 4: "Figure"}
                )
            except:
                self.layout_model = None
                print("Could not load layout model")
        
        # Enhanced field patterns for Indian government forms
        self.field_mapping = {
            'holder_names': {
                'patterns': [
                    r'name\s*\(?s?\)?\s*of\s*holder\s*\(?s?\)?.*?:\s*(.+?)(?=\n.*:|$)',
                    r'holder.*?name.*?:\s*(.+?)(?=\n.*:|$)',
                    r'^\s*1\s+name.*?holder.*?\s+(.+?)(?=\n\s*2|$)'
                ],
                'table_indicators': ['name(s) of holder(s)', 'holder name', 'applicant name']
            },
            'father_mother_names': {
                'patterns': [
                    r'name\s*of\s*father/mother.*?:\s*(.+?)(?=\n.*:|$)',
                    r'father.*?name.*?:\s*(.+?)(?=\n.*:|$)',
                    r'^\s*2\s+name.*?father.*?\s+(.+?)(?=\n\s*3|$)'
                ],
                'table_indicators': ['name of father/mother', 'father name', 'mother name']
            },
            'dependents': {
                'patterns': [
                    r'name\s*of\s*dependents.*?:\s*(.+?)(?=\n.*:|address|$)',
                    r'dependents.*?:\s*(.+?)(?=\n.*:|address|$)',
                    r'^\s*3\s+name.*?dependents.*?\s+(.+?)(?=\n\s*4|address|$)'
                ],
                'table_indicators': ['name of dependents', 'dependents', 'family members']
            },
            'address': {
                'patterns': [
                    r'address.*?:\s*(.+?)(?=\n.*village|gram|$)',
                    r'^\s*4\s+address.*?\s+(.+?)(?=\n\s*5|village|$)'
                ],
                'table_indicators': ['address', 'residential address']
            },
            'village_gram_sabha': {
                'patterns': [
                    r'village/gram\s*sabha.*?:\s*(.+?)(?=\n.*:|$)',
                    r'^\s*5\s+village.*?\s+(.+?)(?=\n\s*6|$)'
                ],
                'table_indicators': ['village/gram sabha', 'village', 'gram sabha']
            },
            'tehsil_taluka': {
                'patterns': [
                    r'tehsil/taluka.*?:\s*(.+?)(?=\n.*:|$)',
                    r'^\s*7\s+tehsil.*?\s+(.+?)(?=\n\s*8|$)'
                ],
                'table_indicators': ['tehsil/taluka', 'tehsil', 'taluka']
            },
            'district': {
                'patterns': [
                    r'district.*?:\s*(.+?)(?=\n.*:|$)',
                    r'^\s*8\s+district.*?\s+(.+?)(?=\n\s*9|$)'
                ],
                'table_indicators': ['district']
            },
            'scheduled_tribe_status': {
                'patterns': [
                    r'whether\s*scheduled\s*tribe.*?:\s*(.+?)(?=\n.*:|$)',
                    r'^\s*9\s+whether.*?\s+(.+?)(?=\n\s*10|$)'
                ],
                'table_indicators': ['whether scheduled tribe', 'sc/st', 'tribe status']
            },
            'area': {
                'patterns': [
                    r'area.*?:\s*(.+?)(?=\n.*:|$)',
                    r'^\s*10\s+area.*?\s+(.+?)(?=\n\s*11|$)'
                ],
                'table_indicators': ['area', 'land area']
            },
            'boundary_description': {
                'patterns': [
                    r'description\s*of\s*boundaries.*?:\s*(.+?)(?=this\s*title|$)',
                    r'^\s*11\s+description.*?\s+(.+?)(?=this\s*title|$)'
                ],
                'table_indicators': ['description of boundaries', 'boundaries', 'khasra']
            }
        }
    
    def preprocess_image_for_tables(self, image_path: str) -> np.ndarray:
        """Preprocess image specifically for table extraction"""
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Enhance contrast for table lines
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(gray)
        
        # Apply threshold
        _, binary = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return binary
    
    def detect_table_structure(self, image: np.ndarray) -> List[TableCell]:
        """Detect table structure using computer vision"""
        # Find horizontal and vertical lines
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
        vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 40))
        
        horizontal_lines = cv2.morphologyEx(image, cv2.MORPH_OPEN, horizontal_kernel)
        vertical_lines = cv2.morphologyEx(image, cv2.MORPH_OPEN, vertical_kernel)
        
        # Combine to get table mask
        table_mask = cv2.addWeighted(horizontal_lines, 0.5, vertical_lines, 0.5, 0.0)
        
        # Find contours for table cells
        contours, _ = cv2.findContours(table_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Extract text from each potential cell
        cells = []
        for i, contour in enumerate(contours):
            x, y, w, h = cv2.boundingRect(contour)
            if w > 50 and h > 20:  # Filter small contours
                cell_img = image[y:y+h, x:x+w]
                
                # Extract text from cell
                if EASYOCR_AVAILABLE:
                    results = self.easyocr_reader.readtext(cell_img)
                    text = " ".join([result[1] for result in results if result[2] > 0.5])
                    avg_conf = np.mean([result[2] for result in results]) if results else 0
                else:
                    text = pytesseract.image_to_string(cell_img).strip()
                    avg_conf = 0.7  # Default confidence for pytesseract
                
                if text.strip():
                    cells.append(TableCell(
                        text=text.strip(),
                        bbox=(x, y, x+w, y+h),
                        confidence=avg_conf,
                        row_idx=int(y/30),  # Approximate row based on y position
                        col_idx=int(x/200)  # Approximate column based on x position
                    ))
        
        return cells
    
    def extract_with_enhanced_ocr(self, image_path: str) -> ExtractedData:
        """Enhanced extraction using better OCR and table detection"""
        
        # Preprocess image
        processed_img = self.preprocess_image_for_tables(image_path)
        
        # Method 1: EasyOCR if available (better for mixed language)
        full_text = ""
        if EASYOCR_AVAILABLE:
            results = self.easyocr_reader.readtext(image_path)
            full_text = " ".join([result[1] for result in results if result[2] > 0.3])
        else:
            # Fallback to Tesseract
            full_text = pytesseract.image_to_string(processed_img)
        
        # Extract document title
        title = self._extract_title_offline(full_text)
        
        # Method 2: Table structure detection
        table_cells = self.detect_table_structure(processed_img)
        table_data = self._organize_table_data(table_cells)
        
        # Method 3: Pattern-based extraction on full text
        pattern_fields = self._extract_fields_with_patterns(full_text)
        
        # Method 4: Table-aware field extraction
        table_fields = self._extract_from_table_structure(table_data)
        
        # Combine results
        final_fields = {**pattern_fields, **table_fields}
        
        return ExtractedData(
            document_title=title,
            structured_fields=final_fields,
            table_data=table_data,
            confidence_scores=self._calculate_confidence_scores(final_fields, full_text),
            processing_method="Offline Enhanced OCR + Table Detection"
        )
    
    def _extract_title_offline(self, text: str) -> str:
        """Extract document title using offline methods"""
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        title_patterns = [
            r'(annexure.*)',
            r'(title\s*for\s*forest\s*land.*)',
            r'(forest\s*rights.*)',
            r'([A-Z\s]{15,})',
            r'(certificate.*)',
            r'(form.*)',
        ]
        
        for pattern in title_patterns:
            for line in lines[:8]:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
        
        # Return first substantial line
        for line in lines:
            if len(line) > 15 and not line.isdigit():
                return line
        
        return "Document Title Not Found"
    
    def _organize_table_data(self, cells: List[TableCell]) -> List[List[str]]:
        """Organize detected cells into table structure"""
        if not cells:
            return []
        
        # Group by rows
        rows = defaultdict(list)
        for cell in cells:
            rows[cell.row_idx].append(cell)
        
        # Sort each row by column position
        table_data = []
        for row_idx in sorted(rows.keys()):
            row_cells = sorted(rows[row_idx], key=lambda c: c.col_idx)
            row_text = [cell.text for cell in row_cells]
            table_data.append(row_text)
        
        return table_data
    
    def _extract_fields_with_patterns(self, text: str) -> Dict[str, str]:
        """Extract fields using enhanced pattern matching"""
        extracted = {}
        text_lower = text.lower()
        
        for field_name, config in self.field_mapping.items():
            for pattern in config['patterns']:
                match = re.search(pattern, text_lower, re.IGNORECASE | re.MULTILINE | re.DOTALL)
                if match and match.group(1):
                    value = self._clean_field_value(match.group(1).strip())
                    if value:
                        extracted[field_name] = value
                        break
        
        return extracted
    
    def _extract_from_table_structure(self, table_data: List[List[str]]) -> Dict[str, str]:
        """Extract fields by analyzing table structure"""
        extracted = {}
        
        for row in table_data:
            if len(row) >= 2:
                label = row[0].lower().strip()
                value = " ".join(row[1:]).strip()
                
                # Map table labels to field names
                for field_name, config in self.field_mapping.items():
                    for indicator in config['table_indicators']:
                        if indicator.lower() in label:
                            cleaned_value = self._clean_field_value(value)
                            if cleaned_value:
                                extracted[field_name] = cleaned_value
                            break
        
        return extracted
    
    def _clean_field_value(self, value: str) -> str:
        """Clean and validate field values"""
        if not value:
            return ""
        
        # Remove common OCR artifacts and clean
        value = re.sub(r'[^\w\s\.,\-/():]', ' ', value)
        value = ' '.join(value.split())
        
        # Filter out very short or meaningless values
        if len(value) < 2 or value.lower() in ['not', 'found', 'nil', 'na', 'none']:
            return ""
        
        return value.strip()
    
    def _calculate_confidence_scores(self, fields: Dict[str, str], full_text: str) -> Dict[str, float]:
        """Calculate confidence scores for extracted fields"""
        scores = {}
        
        # Overall extraction confidence
        total_fields = len(self.field_mapping)
        extracted_fields = len([v for v in fields.values() if v])
        scores['overall'] = (extracted_fields / total_fields) * 100
        
        # Text quality confidence
        if len(full_text) > 100:
            scores['text_quality'] = min(100, len(full_text) / 10)
        else:
            scores['text_quality'] = 30
        
        # Field completeness
        critical_fields = ['holder_names', 'address', 'district']
        critical_found = sum(1 for field in critical_fields if fields.get(field))
        scores['critical_fields'] = (critical_found / len(critical_fields)) * 100
        
        return scores
    
    def extract_document(self, image_path: str) -> ExtractedData:
        """Main extraction method using offline techniques"""
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")
        
        print("Processing with offline methods...")
        
        # Use enhanced OCR extraction
        result = self.extract_with_enhanced_ocr(image_path)
        
        return result
    
    def print_results(self, result: ExtractedData):
        """Print formatted results"""
        print("=" * 80)
        print("OFFLINE DOCUMENT EXTRACTION RESULTS")
        print("=" * 80)
        
        print(f"\nDocument Title: {result.document_title}")
        print(f"Processing Method: {result.processing_method}")
        
        print(f"\nConfidence Scores:")
        for metric, score in result.confidence_scores.items():
            print(f"  {metric.replace('_', ' ').title()}: {score:.1f}%")
        
        print(f"\nExtracted Fields:")
        print("-" * 50)
        
        field_labels = {
            'holder_names': 'Name(s) of Holder(s)',
            'father_mother_names': 'Father/Mother Names',
            'dependents': 'Name of Dependents',
            'address': 'Address',
            'village_gram_sabha': 'Village/Gram Sabha',
            'tehsil_taluka': 'Tehsil/Taluka',
            'district': 'District',
            'scheduled_tribe_status': 'Scheduled Tribe Status',
            'area': 'Area',
            'boundary_description': 'Boundary Description'
        }
        
        for field_key, field_label in field_labels.items():
            value = result.structured_fields.get(field_key, "Not extracted")
            print(f"{field_label}: {value}")
        
        if result.table_data:
            print(f"\nDetected Table Structure:")
            print("-" * 50)
            for i, row in enumerate(result.table_data[:10]):  # Show first 10 rows
                print(f"Row {i+1}: {' | '.join(row)}")
    
    def save_results(self, result: ExtractedData, output_path: str):
        """Save results to JSON file"""
        output_data = {
            'document_title': result.document_title,
            'structured_fields': result.structured_fields,
            'table_data': result.table_data,
            'confidence_scores': result.confidence_scores,
            'processing_method': result.processing_method,
            'timestamp': __import__('datetime').datetime.now().isoformat()
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"Results saved to {output_path}")

# Advanced offline table extraction using computer vision
class AdvancedTableExtractor:
    def __init__(self):
        self.min_line_length = 50
        self.line_thickness_range = (1, 5)
    
    def extract_table_with_cv(self, image_path: str) -> Dict[str, Any]:
        """Extract table using pure computer vision methods"""
        img = cv2.imread(image_path)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Detect horizontal and vertical lines
        horizontal_lines = self._detect_horizontal_lines(gray)
        vertical_lines = self._detect_vertical_lines(gray)
        
        # Find table intersections
        intersections = self._find_intersections(horizontal_lines, vertical_lines)
        
        # Create grid structure
        grid = self._create_grid_from_lines(intersections, img.shape)
        
        # Extract text from each cell
        cell_contents = self._extract_cell_contents(gray, grid)
        
        # Map to field structure
        mapped_fields = self._map_cells_to_fields(cell_contents)
        
        return {
            'extracted_fields': mapped_fields,
            'grid_structure': grid,
            'cell_count': len(cell_contents),
            'method': 'Computer Vision Table Detection'
        }
    
    def _detect_horizontal_lines(self, gray: np.ndarray) -> np.ndarray:
        """Detect horizontal lines in the image"""
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 1))
        return cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)
    
    def _detect_vertical_lines(self, gray: np.ndarray) -> np.ndarray:
        """Detect vertical lines in the image"""
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 50))
        return cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)
    
    def _find_intersections(self, h_lines: np.ndarray, v_lines: np.ndarray) -> List[Tuple[int, int]]:
        """Find intersection points of horizontal and vertical lines"""
        # This is a simplified version - you might need more sophisticated logic
        intersections = []
        # Add your intersection detection logic here
        return intersections
    
    def _create_grid_from_lines(self, intersections: List[Tuple[int, int]], img_shape: Tuple) -> List[List[Tuple]]:
        """Create grid structure from detected lines"""
        # Placeholder - implement grid creation logic
        return []
    
    def _extract_cell_contents(self, gray: np.ndarray, grid: List) -> Dict[str, str]:
        """Extract text content from each grid cell"""
        # Placeholder - implement cell text extraction
        return {}
    
    def _map_cells_to_fields(self, cell_contents: Dict[str, str]) -> Dict[str, str]:
        """Map extracted cell contents to document fields"""
        # Placeholder - implement field mapping logic
        return {}

def main():
    """Main function for offline extraction"""
    extractor = OfflineDocumentExtractor(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
    
    image_path = input("Enter path to document image: ").strip()
    
    try:
        result = extractor.extract_document(image_path)
        extractor.print_results(result)
        
        # Save results
        save_choice = input("\nSave results? (y/n): ").strip().lower()
        if save_choice in ['y', 'yes']:
            output_file = input("Output filename (default: offline_extraction.json): ").strip()
            if not output_file:
                output_file = "offline_extraction.json"
            extractor.save_results(result, output_file)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()