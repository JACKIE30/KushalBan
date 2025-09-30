"""
Pydantic models for data validation
"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any, Optional, Literal
import json

class Location(BaseModel):
    village: Optional[str] = None
    tehsil: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

class LandUseDistribution(BaseModel):
    Agriculture: Optional[str] = None
    Forest: Optional[str] = None
    Water: Optional[str] = None
    Settlement: Optional[str] = None
    Other: Optional[str] = None
    
    class Config:
        extra = "allow"  # Allow additional land use categories

class FRAClaimantProfile(BaseModel):
    holder_name: Optional[str] = None
    dependents: List[str] = Field(default_factory=list)
    social_category: Optional[Literal["Scheduled Tribe", "Other Traditional Forest Dweller"]] = None
    fra_right_type: Optional[str] = None
    land_use_primary: Optional[str] = None
    land_use_distribution: Optional[LandUseDistribution] = None
    water_access: Optional[str] = None
    location: Optional[Location] = None
    
    @field_validator('dependents', mode='before')
    def validate_dependents(cls, v):
        if isinstance(v, str):
            return [v] if v.strip() else []
        return v or []
    
    def to_json(self, indent: int = 2) -> str:
        """Convert to formatted JSON string"""
        return json.dumps(self.model_dump(exclude_none=True), indent=indent, ensure_ascii=False)

class ProcessingRequest(BaseModel):
    document_analysis: Dict[str, Any]
    land_cover_data: str
    
    @field_validator('document_analysis', mode='before')
    def validate_document_analysis(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON in document_analysis")
        return v

class ProcessingResponse(BaseModel):
    success: bool
    data: Optional[FRAClaimantProfile] = None
    error: Optional[str] = None
    raw_response: Optional[str] = None
