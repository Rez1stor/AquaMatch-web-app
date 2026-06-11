from django.db import models
from django.contrib.auth.models import User

class Species(models.Model):
    name = models.CharField(max_length=100, unique=True)
    scientific_name = models.CharField(max_length=100)
    water_type = models.CharField(max_length=20) # "freshwater" or "saltwater"
    bioload = models.FloatField()
    tags = models.CharField(max_length=255)
    image_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.name

class Aquarium(models.Model):
    name = models.CharField(max_length=100)
    water_type = models.CharField(max_length=20)
    volume = models.FloatField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="aquariums")
    species = models.ManyToManyField(Species, related_name="aquariums")

    def __str__(self):
        return self.name
