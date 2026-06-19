import os
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models import Species

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(Species).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    species_data = [
        # Freshwater
        {
            "name": "Neon Tetra",
            "scientific_name": "Paracheirodon innesi",
            "water_type": "freshwater",
            "bioload": 1.0,
            "tags": "peaceful, schooling",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Neon_tetra.jpg/800px-Neon_tetra.jpg",
            "ph_min": 6.0, "ph_max": 7.0, "temp_min": 21.0, "temp_max": 27.0
        },
        {
            "name": "Bojownik Wspaniały",
            "scientific_name": "Betta splendens",
            "water_type": "freshwater",
            "bioload": 5.0,
            "tags": "territorial, solitary",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Betta_splendens.jpg/800px-Betta_splendens.jpg",
            "ph_min": 6.5, "ph_max": 7.5, "temp_min": 24.0, "temp_max": 28.0
        },
        {
            "name": "Brzanka Sumatrzańska",
            "scientific_name": "Puntigrus tetrazona",
            "water_type": "freshwater",
            "bioload": 2.5,
            "tags": "semi-aggressive, fin-nipper",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Puntius_tetrazona_1.jpg/800px-Puntius_tetrazona_1.jpg",
            "ph_min": 6.0, "ph_max": 8.0, "temp_min": 20.0, "temp_max": 26.0
        },
        {
            "name": "Skalar",
            "scientific_name": "Pterophyllum scalare",
            "water_type": "freshwater",
            "bioload": 15.0,
            "tags": "semi-aggressive, cichlid",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Pterophyllum_scalare_1.jpg/800px-Pterophyllum_scalare_1.jpg",
            "ph_min": 6.0, "ph_max": 7.4, "temp_min": 24.0, "temp_max": 30.0
        },
        {
            "name": "Gupik Pawie Oczko",
            "scientific_name": "Poecilia reticulata",
            "water_type": "freshwater",
            "bioload": 1.5,
            "tags": "peaceful, livebearer",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Guppy_01.jpg/800px-Guppy_01.jpg",
            "ph_min": 7.0, "ph_max": 8.5, "temp_min": 22.0, "temp_max": 28.0
        },
        {
            "name": "Kirysek Spiżowy",
            "scientific_name": "Corydoras aeneus",
            "water_type": "freshwater",
            "bioload": 3.0,
            "tags": "peaceful, bottom-dweller, schooling",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Corydoras_aeneus.jpg/800px-Corydoras_aeneus.jpg",
            "ph_min": 6.0, "ph_max": 8.0, "temp_min": 21.0, "temp_max": 27.0
        },
        {
            "name": "Otosek",
            "scientific_name": "Otocinclus vittatus",
            "water_type": "freshwater",
            "bioload": 2.0,
            "tags": "peaceful, algae-eater",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Otocinclus_affinis.jpg/800px-Otocinclus_affinis.jpg",
            "ph_min": 6.0, "ph_max": 7.5, "temp_min": 21.0, "temp_max": 26.0
        },
        {
            "name": "Molinezja Ostrousta",
            "scientific_name": "Poecilia sphenops",
            "water_type": "freshwater",
            "bioload": 5.0,
            "tags": "peaceful, livebearer",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Black_Molly.jpg/800px-Black_Molly.jpg",
            "ph_min": 7.5, "ph_max": 8.5, "temp_min": 25.0, "temp_max": 28.0
        },
        {
            "name": "Zbrojnik Niebieski",
            "scientific_name": "Ancistrus dolichopterus",
            "water_type": "freshwater",
            "bioload": 10.0,
            "tags": "peaceful, bottom-dweller, territorial-bottom",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ancistrus_dolichopterus.jpg/800px-Ancistrus_dolichopterus.jpg",
            "ph_min": 6.5, "ph_max": 7.8, "temp_min": 23.0, "temp_max": 27.0
        },
        {
            "name": "Dyskowiec",
            "scientific_name": "Symphysodon discus",
            "water_type": "freshwater",
            "bioload": 20.0,
            "tags": "peaceful, cichlid",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Symphysodon_discus_1.jpg/800px-Symphysodon_discus_1.jpg",
            "ph_min": 5.0, "ph_max": 7.0, "temp_min": 28.0, "temp_max": 31.0
        },
        # Saltwater
        {
            "name": "Błazenek (Nemo)",
            "scientific_name": "Amphiprion ocellaris",
            "water_type": "saltwater",
            "bioload": 10.0,
            "tags": "peaceful, territorial",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Clown_fish_in_the_Andaman_Coral_Reef.jpg/800px-Clown_fish_in_the_Andaman_Coral_Reef.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 27.0
        },
        {
            "name": "Skrzydlica",
            "scientific_name": "Pterois volitans",
            "water_type": "saltwater",
            "bioload": 50.0,
            "tags": "predator, venomous",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Pterois_volitans_Manado-e.jpg/800px-Pterois_volitans_Manado-e.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 22.0, "temp_max": 26.0
        },
        {
            "name": "Pokolec Królewski (Dory)",
            "scientific_name": "Paracanthurus hepatus",
            "water_type": "saltwater",
            "bioload": 30.0,
            "tags": "peaceful, active",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Paracanthurus_hepatus_1.jpg/800px-Paracanthurus_hepatus_1.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 26.0
        },
        {
            "name": "Żółtek",
            "scientific_name": "Zebrasoma flavescens",
            "water_type": "saltwater",
            "bioload": 30.0,
            "tags": "semi-aggressive, algae-eater",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Yellow_tang.jpg/800px-Yellow_tang.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 28.0
        },
        {
            "name": "Mandarwspaniały",
            "scientific_name": "Synchiropus splendidus",
            "water_type": "saltwater",
            "bioload": 5.0,
            "tags": "peaceful, bottom-dweller, picky-eater",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Synchiropus_splendidus_2_Luc_Viatour.jpg/800px-Synchiropus_splendidus_2_Luc_Viatour.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 26.0
        },
        {
            "name": "Garbik Niebieski",
            "scientific_name": "Chrysiptera cyanea",
            "water_type": "saltwater",
            "bioload": 5.0,
            "tags": "aggressive, territorial",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Chrysiptera_cyanea_02.jpg/800px-Chrysiptera_cyanea_02.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 27.0
        },
        {
            "name": "Chetonik",
            "scientific_name": "Chelmon rostratus",
            "water_type": "saltwater",
            "bioload": 25.0,
            "tags": "peaceful, difficult",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Chelmon_rostratus_1.jpg/800px-Chelmon_rostratus_1.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 28.0
        },
        {
            "name": "Pikaso",
            "scientific_name": "Rhinecanthus aculeatus",
            "water_type": "saltwater",
            "bioload": 40.0,
            "tags": "aggressive, predator",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Picasso_triggerfish.jpg/800px-Picasso_triggerfish.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 26.0
        },
        {
            "name": "Idol Mauretański",
            "scientific_name": "Zanclus cornutus",
            "water_type": "saltwater",
            "bioload": 35.0,
            "tags": "peaceful, difficult",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Zanclus_cornutus.jpg/800px-Zanclus_cornutus.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 26.0
        },
        {
            "name": "Krewetka Czyszcząca",
            "scientific_name": "Lysmata amboinensis",
            "water_type": "saltwater",
            "bioload": 2.0,
            "tags": "peaceful, invertebrate, cleaner",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Lysmata_amboinensis_cleaner_shrimp.jpg/800px-Lysmata_amboinensis_cleaner_shrimp.jpg",
            "ph_min": 8.1, "ph_max": 8.4, "temp_min": 24.0, "temp_max": 27.0
        }
    ]

    for item in species_data:
        db.add(Species(**item))
    
    db.commit()
    db.close()
    print("Database seeded successfully with 20 species.")

if __name__ == "__main__":
    seed_db()
