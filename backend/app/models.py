from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class AquariumSpeciesLink(Base):
    __tablename__ = 'aquarium_species'
    
    aquarium_id = Column(Integer, ForeignKey('aquariums.id'), primary_key=True)
    species_id = Column(Integer, ForeignKey('species.id'), primary_key=True)
    quantity = Column(Integer, default=1)
    
    species = relationship("Species")
    aquarium = relationship("Aquarium", back_populates="species_links")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    aquariums = relationship("Aquarium", back_populates="owner")

class Species(Base):
    __tablename__ = "species"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    scientific_name = Column(String)
    water_type = Column(String)
    bioload = Column(Float)
    tags = Column(String)
    image_url = Column(String, nullable=True)
    ph_min = Column(Float, default=7.0)
    ph_max = Column(Float, default=7.0)
    temp_min = Column(Float, default=25.0)
    temp_max = Column(Float, default=25.0)

class Aquarium(Base):
    __tablename__ = "aquariums"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    water_type = Column(String)
    volume = Column(Float)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="aquariums")
    species_links = relationship("AquariumSpeciesLink", back_populates="aquarium", cascade="all, delete-orphan")
