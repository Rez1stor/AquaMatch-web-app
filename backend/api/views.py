from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Species, Aquarium
from .serializers import SpeciesSerializer, AquariumSerializer, UserSerializer
from .engine import analyze_aquarium

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=email).exists():
            return Response({"detail": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=email, email=email, password=password)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class SpeciesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Species.objects.all()
    serializer_class = SpeciesSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        water_type = self.request.query_params.get('water_type')
        if water_type:
            queryset = queryset.filter(water_type=water_type)
        return queryset

class AquariumViewSet(viewsets.ModelViewSet):
    serializer_class = AquariumSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Aquarium.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def analyze_setup(request):
    water_type = request.data.get('water_type')
    volume = request.data.get('volume')
    species_ids = request.data.get('species_ids', [])

    if not water_type or not volume:
        return Response({"detail": "water_type and volume required"}, status=status.HTTP_400_BAD_REQUEST)

    selected_species = Species.objects.filter(id__in=species_ids)
    result = analyze_aquarium(water_type, float(volume), selected_species)
    return Response(result)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def recommend_species(request):
    water_type = request.data.get('water_type')
    volume = request.data.get('volume')
    current_species_ids = request.data.get('current_species_ids', [])

    if not water_type or not volume:
        return Response({"detail": "water_type and volume required"}, status=status.HTTP_400_BAD_REQUEST)

    volume = float(volume)
    current_species = Species.objects.filter(id__in=current_species_ids)
    
    # Calculate current bioload and remaining capacity
    current_bioload = sum(sp.bioload for sp in current_species)
    remaining_capacity = volume - current_bioload

    # Get behavior context of the tank
    tags_in_tank = set()
    for sp in current_species:
        for tag in sp.tags.split(","):
            tags_in_tank.add(tag.strip().lower())
            
    has_peaceful = "peaceful" in tags_in_tank
    has_territorial = "territorial" in tags_in_tank
    
    # Base filter for candidates: same water type, fits in bioload
    candidates = Species.objects.filter(water_type=water_type).exclude(id__in=current_species_ids)
    
    recommended = []
    for candidate in candidates:
        if candidate.bioload > remaining_capacity:
            continue
            
        candidate_tags = [t.strip().lower() for t in candidate.tags.split(",") if t.strip()]
        
        # Rule out predators if there are peaceful fish
        if "predator" in candidate_tags and has_peaceful:
            continue
            
        # Rule out solitary/territorial if the tank is small and already has territorial
        if "territorial" in candidate_tags and has_territorial and volume < 200:
            continue
            
        # Good match
        recommended.append(candidate)
        
    serializer = SpeciesSerializer(recommended, many=True)
    return Response(serializer.data)
