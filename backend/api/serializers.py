from rest_framework import serializers
from .models import Species, Aquarium
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class SpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Species
        fields = '__all__'

class AquariumSerializer(serializers.ModelSerializer):
    species = SpeciesSerializer(many=True, read_only=True)
    species_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Aquarium
        fields = ('id', 'name', 'water_type', 'volume', 'owner', 'species', 'species_ids')
        read_only_fields = ('owner',)

    def create(self, validated_data):
        species_ids = validated_data.pop('species_ids', [])
        aquarium = Aquarium.objects.create(**validated_data)
        if species_ids:
            species_objs = Species.objects.filter(id__in=species_ids)
            aquarium.species.set(species_objs)
        return aquarium
