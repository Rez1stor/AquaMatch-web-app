from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class DeleteAccountRequest(BaseModel):
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SpeciesBase(BaseModel):
    name: str
    scientific_name: str
    water_type: str
    bioload: float
    tags: str
    image_url: Optional[str] = None
    ph_min: float = 7.0
    ph_max: float = 7.0
    temp_min: float = 25.0
    temp_max: float = 25.0

class SpeciesResponse(SpeciesBase):
    id: int

    class Config:
        from_attributes = True

class AquariumSpeciesResponse(BaseModel):
    species: SpeciesResponse
    quantity: int

    class Config:
        from_attributes = True

class AquariumBase(BaseModel):
    name: str
    water_type: str
    volume: float

class SpeciesQuantityItem(BaseModel):
    species_id: int
    quantity: int

class AquariumCreate(AquariumBase):
    species: List[SpeciesQuantityItem] = []

class AquariumResponse(AquariumBase):
    id: int
    owner_id: int
    species_links: List[AquariumSpeciesResponse] = []

    class Config:
        from_attributes = True

class AnalyzeRequest(BaseModel):
    water_type: str
    volume: float
    species: List[SpeciesQuantityItem]

class RecommendRequest(BaseModel):
    water_type: str
    volume: float
    current_species: List[SpeciesQuantityItem]

class RecommendationResponse(SpeciesResponse):
    compatibility_percentage: int
