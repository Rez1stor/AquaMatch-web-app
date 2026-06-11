from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models, database, auth, engine

router = APIRouter(prefix="/aquariums", tags=["aquariums"])

@router.get("/", response_model=List[schemas.AquariumResponse])
def get_user_aquariums(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Aquarium).filter(models.Aquarium.owner_id == current_user.id).all()

@router.post("/", response_model=schemas.AquariumResponse)
def create_aquarium(aquarium: schemas.AquariumCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_aquarium = models.Aquarium(
        name=aquarium.name,
        water_type=aquarium.water_type,
        volume=aquarium.volume,
        owner_id=current_user.id
    )
    db.add(db_aquarium)
    db.commit()
    db.refresh(db_aquarium)

    for sp_id in aquarium.species_ids:
        sp = db.query(models.Species).filter(models.Species.id == sp_id).first()
        if sp:
            db_aquarium.species.append(sp)
    
    db.commit()
    db.refresh(db_aquarium)
    return db_aquarium

@router.get("/{aquarium_id}", response_model=schemas.AquariumResponse)
def get_aquarium(aquarium_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_aquarium = db.query(models.Aquarium).filter(models.Aquarium.id == aquarium_id, models.Aquarium.owner_id == current_user.id).first()
    if not db_aquarium:
        raise HTTPException(status_code=404, detail="Aquarium not found")
    return db_aquarium

@router.post("/analyze", response_model=schemas.AnalyzeResponse)
def analyze_setup(request: schemas.AnalyzeRequest, db: Session = Depends(database.get_db)):
    selected_species = []
    for sp_id in request.species_ids:
        sp = db.query(models.Species).filter(models.Species.id == sp_id).first()
        if sp:
            selected_species.append(sp)
    
    result = engine.analyze_aquarium(request.water_type, request.volume, selected_species)
    return result
