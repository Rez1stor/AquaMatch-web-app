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
@permission_classes([permissions.IsAuthenticated])
def analyze_setup(request):
    water_type = request.data.get('water_type')
    volume = request.data.get('volume')
    species_ids = request.data.get('species_ids', [])

    if not water_type or not volume:
        return Response({"detail": "water_type and volume required"}, status=status.HTTP_400_BAD_REQUEST)

    selected_species = Species.objects.filter(id__in=species_ids)
    result = analyze_aquarium(water_type, float(volume), selected_species)
    return Response(result)
