import google.generativeai as genai
import json
import re
from typing import Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class ConfidenceLevel(Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

@dataclass
class DocumentClassification:
    document_type: str
    confidence_level: ConfidenceLevel
    confidence_score: float  # 0-100
    reasoning: str
    key_indicators: list
    suggested_actions: list

class DocumentClassifierAgent:
    def __init__(self, api_key: str):
        """Initialize the Document Classifier Agent with Gemini API"""
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-pro')
        
        # Define document type patterns and keywords for pre-filtering
        self.document_patterns = {
            'forest_rights_certificate': [
                'forest rights', 'forest dwellers', 'scheduled', 'tribal', 'title', 'forest land',
                'annexure', 'occupation', 'heritable', 'transferable', 'himachal pradesh'
            ],
            'income_certificate': [
                'income certificate', 'annual income', 'revenue', 'salary', 'earnings'
            ],
            'caste_certificate': [
                'caste certificate', 'scheduled caste', 'scheduled tribe', 'obc', 'backward class'
            ],
            'domicile_certificate': [
                'domicile', 'residence', 'permanent resident', 'native'
            ],
            'birth_certificate': [
                'birth certificate', 'date of birth', 'born', 'birth registration'
            ],
            'death_certificate': [
                'death certificate', 'deceased', 'death registration', 'demise'
            ],
            'land_record': [
                'land record', 'khasra', 'khata', 'survey', 'plot', 'agricultural land'
            ],
            'ration_card': [
                'ration card', 'food security', 'bpl', 'apl', 'public distribution'
            ],
            'voter_id': [
                'voter', 'election', 'electoral', 'voting', 'constituency'
            ],
            'driving_license': [
                'driving license', 'motor vehicle', 'transport', 'license to drive'
            ]
        }
    
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

7. **DOCUMENT PURPOSE**: Briefly explain what this document is typically used for

Please respond in the following JSON format:
{{
    "document_type": "specific document type",
    "confidence_level": "HIGH/MEDIUM/LOW",
    "confidence_score": numerical_score,
    "key_indicators": ["indicator1", "indicator2", "indicator3"],
    "reasoning": "explanation of classification logic",
    "suggested_actions": ["action1", "action2", "action3"],
    "document_purpose": "what this document is used for",
    "language_detected": "primary language of document",
    "issuing_authority": "likely government department/authority",
    "document_validity": "assessment of document authenticity indicators"
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
            classification.language_detected = classification_data.get('language_detected', 'Not specified')
            classification.issuing_authority = classification_data.get('issuing_authority', 'Not specified')
            classification.document_validity = classification_data.get('document_validity', 'Not assessed')
            classification.document_purpose = classification_data.get('document_purpose', 'Not specified')
            
            return classification
            
        except Exception as e:
            # Fallback classification in case of API error
            return self._fallback_classification(headline_text, str(e))
    
    def _fallback_classification(self, headline_text: str, error_msg: str) -> DocumentClassification:
        """Fallback classification using local patterns if API fails"""
        text_lower = headline_text.lower()
        best_match = None
        best_score = 0
        
        for doc_type, keywords in self.document_patterns.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > best_score:
                best_score = score
                best_match = doc_type
        
        confidence_score = min((best_score / len(self.document_patterns.get(best_match, []))) * 100, 100) if best_match else 0
        
        if confidence_score >= 60:
            confidence_level = ConfidenceLevel.MEDIUM
        elif confidence_score >= 30:
            confidence_level = ConfidenceLevel.LOW
        else:
            confidence_level = ConfidenceLevel.LOW
            best_match = "Unknown Document"
        
        return DocumentClassification(
            document_type=best_match or "Unknown Document",
            confidence_level=confidence_level,
            confidence_score=confidence_score,
            reasoning=f"Fallback classification due to API error: {error_msg}",
            key_indicators=[kw for kw in self.document_patterns.get(best_match, []) if kw in text_lower],
            suggested_actions=["Retry with API", "Manual review recommended", "Verify document quality"]
        )
    
    def print_classification_report(self, classification: DocumentClassification, headline_text: str):
        """Print a formatted classification report"""
        print("=" * 70)
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
        
        if hasattr(classification, 'language_detected'):
            print(f"\n🌐 Language Detected: {classification.language_detected}")
        
        if hasattr(classification, 'document_validity'):
            print(f"✅ Validity Assessment: {classification.document_validity}")

def main():
    """Main function to demonstrate the classifier"""
    
    # You need to get your Gemini API key from: https://makersuite.google.com/app/apikey
    API_KEY = input("Enter your Gemini API Key: ").strip()
    
    if not API_KEY:
        print("❌ API Key is required. Get it from: https://makersuite.google.com/app/apikey")
        return
    
    # Initialize the classifier
    try:
        classifier = DocumentClassifierAgent(API_KEY)
        print("✅ Document Classifier Agent initialized successfully!")
    except Exception as e:
        print(f"❌ Failed to initialize classifier: {e}")
        return
    
    # Example headline (you can replace this with your OCR output)
    example_headline = """ANNEXURE-11 {See Rule 96] ofthe Scheduled ond Other Trina! Forest Dwellers of Forest Rights) Rules, 2008) TITLE FOR FOREST LAND UNDER OCCUPATION 1 Sh. Wek Ram Sh. Payare 2. $h. Ram of 3h, teak: Bam 'Sart. Kumari W/O Sh. Ram 'Sh. Ashok Kumar $/0 Sh. 'Se. Jang Devi W/O Sh. Ram, Description of boundaries by prominent landmarks including khasra/compartment Tis heritable, but oot allenable or transferable under Sub-section (4) of 'Section @ ofthe act, We, tne undersigned, hereby, for snd on behalf of the goverment of Himachal Pradesh affix our signatures to confiem the above forest right. Bu. Cos.ab"""
    
    # Get user input or use example
    use_example = input(f"\nUse example headline? (y/n): ").lower().strip()
    
    if use_example == 'y':
        headline_text = example_headline
    else:
        headline_text = input("Enter the document headline/text to classify: ").strip()
    
    if not headline_text:
        print("❌ No text provided for classification")
        return
    
    print("\n🔄 Classifying document...")
    
    # Classify the document
    classification = classifier.classify_document(headline_text)
    
    # Print detailed report
    classifier.print_classification_report(classification, headline_text)
    
    # Return classification for further use
    return classification

if __name__ == "__main__":
    result = main()