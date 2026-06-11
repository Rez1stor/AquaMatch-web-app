from pydantic import BaseModel, EmailStr
from typing import List, Optional

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Species Schemas ---
class SpeciesBase(BaseModel):
    name: str
    scientific_name: str
    water_type: str
    bioload: float
    tags: str
    image_url: Optional[str] = None

class SpeciesResponse(SpeciesBase):
    id: int

    class Config:
        from_attributes = True

# --- Aquarium Schemas ---
class AquariumBase(BaseModel):
    name: str
    water_type: str
    volume: float

class AquariumCreate(AquariumBase):
    species_ids: List[int] = []

class AquariumResponse(AquariumBase):
    id: int
    owner_id: int
    species: List[SpeciesResponse] = []

    class Config:
        from_attributes = True

# --- Engine Schemas ---
class AnalyzeRequest(BaseModel):
    water_type: str
    volume: float
    species_ids: List[int]

class WarningMessage(BaseModel):
    type: str # "error" or "warning"
    message: str

class AnalyzeResponse(BaseModel):
    compatibility_score: int
    total_bioload: float
    capacity: float
    warnings: List[WarningMessage]
