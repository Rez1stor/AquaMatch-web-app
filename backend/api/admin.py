from django.contrib import admin
from .models import Species, Aquarium

@admin.register(Species)
class SpeciesAdmin(admin.ModelAdmin):
    list_display = ('name', 'scientific_name', 'water_type', 'bioload')
    search_fields = ('name', 'scientific_name', 'tags')
    list_filter = ('water_type',)

@admin.register(Aquarium)
class AquariumAdmin(admin.ModelAdmin):
    list_display = ('name', 'water_type', 'volume', 'owner')
    search_fields = ('name', 'owner__username')
    list_filter = ('water_type',)
