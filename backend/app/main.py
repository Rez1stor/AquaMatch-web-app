from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import database, models
from app.routers import auth_router, species_router, aquariums_router

# Create tables if they don't exist (in a real scenario, Alembic should be used)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AquaMatch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(species_router.router)
app.include_router(aquariums_router.router)

@app.get("/")
def root():
    return {"message": "Welcome to AquaMatch API"}
