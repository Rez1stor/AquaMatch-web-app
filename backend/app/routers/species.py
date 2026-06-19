from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, models, database

router = APIRouter(
    prefix="/species",
    tags=["species"]
)

@router.get("/", response_model=List[schemas.SpeciesResponse])
def get_species(water_type: Optional[str] = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Species)
    if water_type:
        query = query.filter(models.Species.water_type == water_type)
    return query.all()

@router.post("/", response_model=schemas.SpeciesResponse, status_code=201)
def create_species(species: schemas.SpeciesBase, db: Session = Depends(database.get_db)):
    db_species = models.Species(**species.model_dump())
    db.add(db_species)
    db.commit()
    db.refresh(db_species)
    return db_species


@router.post("/recommend", response_model=List[schemas.RecommendationResponse])
def recommend_species(req: schemas.RecommendRequest, db: Session = Depends(database.get_db)):
    from ..engine import analyze_aquarium
    
    species_map = {item.species_id: item.quantity for item in req.current_species}
    current_species = db.query(models.Species).filter(models.Species.id.in_(species_map.keys())).all()
    current_species_with_qty = [(sp, species_map[sp.id]) for sp in current_species]
    
    candidates = db.query(models.Species).filter(
        models.Species.water_type == req.water_type,
        models.Species.id.not_in(species_map.keys()) if species_map else True
    ).all()
    
    recommended = []
    for candidate in candidates:
        # Check raw capacity first
        if candidate.bioload > req.volume:
            continue
            
        # Simulate adding 1 of this species to the current tank
        simulated_tank = current_species_with_qty + [(candidate, 1)]
        analysis = analyze_aquarium(req.water_type, req.volume, simulated_tank)
        
        # If adding this fish drops the score below 50, don't recommend it
        if analysis["compatibility_score"] < 50:
            continue
            
        # If it overloads the tank, skip
        if analysis["total_bioload"] > req.volume:
            continue
            
        # Convert SQLAlchemy object to dict to add extra fields
        candidate_dict = candidate.__dict__.copy()
        candidate_dict["compatibility_percentage"] = analysis["compatibility_score"]
        recommended.append(candidate_dict)
        
    # Sort by compatibility percentage descending, then by bioload ascending (prefer smaller fish)
    recommended.sort(key=lambda x: (-x["compatibility_percentage"], x["bioload"]))
    
    # Return Top 4
    return recommended[:4]
