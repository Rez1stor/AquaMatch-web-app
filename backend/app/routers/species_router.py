from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models, database

router = APIRouter(prefix="/species", tags=["species"])

@router.get("/", response_model=List[schemas.SpeciesResponse])
def get_species(skip: int = 0, limit: int = 100, water_type: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Species)
    if water_type:
        query = query.filter(models.Species.water_type == water_type)
    species = query.offset(skip).limit(limit).all()
    return species

@router.get("/{species_id}", response_model=schemas.SpeciesResponse)
def get_species_by_id(species_id: int, db: Session = Depends(database.get_db)):
    species = db.query(models.Species).filter(models.Species.id == species_id).first()
    return species
