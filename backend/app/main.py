from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, species, aquariums

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AquaMatch API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(species.router)
app.include_router(aquariums.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AquaMatch API"}
