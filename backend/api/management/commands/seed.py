from django.core.management.base import BaseCommand
from api.models import Species

class Command(BaseCommand):
    help = 'Seeds the database with initial species data'

    def handle(self, *args, **kwargs):
        if Species.objects.exists():
            self.stdout.write(self.style.SUCCESS('Database already seeded.'))
            return

        species_list = [
            {"name": "Błazenek plamisty", "scientific_name": "Amphiprion ocellaris", "water_type": "saltwater", "bioload": 30, "tags": "peaceful, reef-safe", "image_url": "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=300&q=80"},
            {"name": "Pokolec królewski", "scientific_name": "Paracanthurus hepatus", "water_type": "saltwater", "bioload": 200, "tags": "peaceful, reef-safe, schooling", "image_url": "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&w=300&q=80"},
            {"name": "Skrzydlica", "scientific_name": "Pterois volitans", "water_type": "saltwater", "bioload": 250, "tags": "predator, territorial", "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80"},
            {"name": "Bojownik", "scientific_name": "Betta splendens", "water_type": "freshwater", "bioload": 15, "tags": "territorial", "image_url": "https://images.unsplash.com/photo-1534608176106-b0523ec3d43b?auto=format&fit=crop&w=300&q=80"},
            {"name": "Gupik", "scientific_name": "Poecilia reticulata", "water_type": "freshwater", "bioload": 5, "tags": "peaceful, schooling", "image_url": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=300&q=80"},
            {"name": "Skalar", "scientific_name": "Pterophyllum scalare", "water_type": "freshwater", "bioload": 50, "tags": "territorial, peaceful", "image_url": "https://images.unsplash.com/photo-1517684988701-447a1ffb2f29?auto=format&fit=crop&w=300&q=80"},
            {"name": "Pirania Natterera", "scientific_name": "Pygocentrus nattereri", "water_type": "freshwater", "bioload": 150, "tags": "predator, schooling", "image_url": "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=300&q=80"},
        ]

        for sp in species_list:
            Species.objects.create(**sp)

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with species.'))
