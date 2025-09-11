import google.generativeai as genai
import json
import re
from dataclasses import dataclass
from enum import Enum
from typing import List
from dotenv import load_dotenv
import os

# REMOVED: from structured_parser import StructuredDocumentParser
load_dotenv()  # auto-load .env

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
    key_indicators: List[str]
    suggested_actions: List[str]
    document_purpose: str = "Not specified"
    issuing_authority: str = "Not specified"

class DocumentClassifierAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("❌ Missing GEMINI_API_KEY in .env file")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def classify(self, text: str) -> DocumentClassification:
        prompt = f"""
        You are an expert document classification agent. You specialise in Indian Government document analysis. Analyze the following text and classify the document type, confidence level (HIGH, MEDIUM, LOW), confidence score (0-100), key indicators, reasoning, suggested actions, document purpose, and issuing authority.:

        TEXT: "{text}"

        Respond in JSON:
        {{
            "document_type": "...",
            "confidence_level": "HIGH/MEDIUM/LOW",
            "confidence_score": 85,
            "key_indicators": ["word1", "word2"],
            "reasoning": "Explanation...",
            "suggested_actions": ["action1", "action2"],
            "document_purpose": "purpose here",
            "issuing_authority": "authority here"
        }}
        """
        response = self.model.generate_content(prompt).text
        match = re.search(r"\{.*\}", response, re.DOTALL)
        if not match:
            raise ValueError("No JSON found in response")
        data = json.loads(match.group())
        
        # Validate response before creating object
        if not self._validate_response(data):
            raise ValueError("Invalid response structure from AI model")
            
        return DocumentClassification(
            document_type=data.get("document_type", "Unknown"),
            confidence_level=ConfidenceLevel(data.get("confidence_level", "LOW")),
            confidence_score=float(data.get("confidence_score", 0)),
            reasoning=data.get("reasoning", ""),
            key_indicators=data.get("key_indicators", []),
            suggested_actions=data.get("suggested_actions", []),
            document_purpose=data.get("document_purpose", "Not specified"),
            issuing_authority=data.get("issuing_authority", "Not specified"),
        )
    
    def _validate_response(self, data: dict) -> bool:
        """Validate AI response has required fields"""
        required_fields = ["document_type", "confidence_level", "confidence_score"]
        return all(field in data for field in required_fields)

# Optional: Keep a simple test function if needed for standalone testing
def test_classifier():
    """Test function for standalone testing of the classifier"""
    sample_text = "This is a sample document for testing classification."
    classifier = DocumentClassifierAgent()
    result = classifier.classify(sample_text)
    print(result)

if __name__ == "__main__":
    # Only run test when this file is executed directly
    test_classifier()