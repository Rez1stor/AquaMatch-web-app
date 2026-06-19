from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, database, auth, engine

router = APIRouter(
    prefix="/aquariums",
    tags=["aquariums"]
)

@router.get("/", response_model=List[schemas.AquariumResponse])
def get_aquariums(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
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
    
    if aquarium.species:
        for item in aquarium.species:
            link = models.AquariumSpeciesLink(aquarium_id=db_aquarium.id, species_id=item.species_id, quantity=item.quantity)
            db.add(link)
        db.commit()
        db.refresh(db_aquarium)
        
    return db_aquarium

@router.get("/{aquarium_id}", response_model=schemas.AquariumResponse)
def get_aquarium(aquarium_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    aquarium = db.query(models.Aquarium).filter(models.Aquarium.id == aquarium_id, models.Aquarium.owner_id == current_user.id).first()
    if not aquarium:
        raise HTTPException(status_code=404, detail="Aquarium not found")
    return aquarium

@router.put("/{aquarium_id}", response_model=schemas.AquariumResponse)
def update_aquarium(aquarium_id: int, aquarium_data: schemas.AquariumCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_aquarium = db.query(models.Aquarium).filter(models.Aquarium.id == aquarium_id, models.Aquarium.owner_id == current_user.id).first()
    if not db_aquarium:
        raise HTTPException(status_code=404, detail="Aquarium not found")
    
    db_aquarium.name = aquarium_data.name
    db_aquarium.water_type = aquarium_data.water_type
    db_aquarium.volume = aquarium_data.volume
    
    db.query(models.AquariumSpeciesLink).filter(models.AquariumSpeciesLink.aquarium_id == aquarium_id).delete()
    
    if aquarium_data.species:
        for item in aquarium_data.species:
            link = models.AquariumSpeciesLink(aquarium_id=db_aquarium.id, species_id=item.species_id, quantity=item.quantity)
            db.add(link)
            
    db.commit()
    db.refresh(db_aquarium)
    return db_aquarium

@router.delete("/{aquarium_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_aquarium(aquarium_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_aquarium = db.query(models.Aquarium).filter(models.Aquarium.id == aquarium_id, models.Aquarium.owner_id == current_user.id).first()
    if not db_aquarium:
        raise HTTPException(status_code=404, detail="Aquarium not found")
        
    db.query(models.AquariumSpeciesLink).filter(models.AquariumSpeciesLink.aquarium_id == aquarium_id).delete()
    db.delete(db_aquarium)
    db.commit()
    return None

@router.post("/analyze")
def analyze_setup(req: schemas.AnalyzeRequest, db: Session = Depends(database.get_db)):
    species_map = {item.species_id: item.quantity for item in req.species}
    species_objs = db.query(models.Species).filter(models.Species.id.in_(species_map.keys())).all()
    selected_species_with_qty = [(sp, species_map[sp.id]) for sp in species_objs]
    
    result = engine.analyze_aquarium(req.water_type, req.volume, selected_species_with_qty)
    return result
