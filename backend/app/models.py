from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Table
from sqlalchemy.orm import relationship
from app.database import Base

aquarium_species_table = Table(
    "aquarium_species",
    Base.metadata,
    Column("aquarium_id", Integer, ForeignKey("aquariums.id", ondelete="CASCADE"), primary_key=True),
    Column("species_id", Integer, ForeignKey("species.id", ondelete="CASCADE"), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    aquariums = relationship("Aquarium", back_populates="owner", cascade="all, delete-orphan")

class Aquarium(Base):
    __tablename__ = "aquariums"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    water_type = Column(String) # "freshwater" or "saltwater"
    volume = Column(Float) # in liters
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    owner = relationship("User", back_populates="aquariums")
    species = relationship("Species", secondary=aquarium_species_table)

class Species(Base):
    __tablename__ = "species"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    scientific_name = Column(String)
    water_type = Column(String) # "freshwater" or "saltwater"
    bioload = Column(Float) # Required volume per fish in liters
    tags = Column(String) # Comma-separated tags e.g. "predator, territorial, schooling, peaceful"
    image_url = Column(String, nullable=True)
