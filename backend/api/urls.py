from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import SpeciesViewSet, AquariumViewSet, RegisterView, analyze_setup

router = DefaultRouter()
router.register(r'species', SpeciesViewSet, basename='species')
router.register(r'aquariums', AquariumViewSet, basename='aquariums')

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', TokenObtainPairView.as_view(), name='login'), # Matches FASTAPI /auth/login with 'username' and 'password'
    path('aquariums/analyze', analyze_setup, name='analyze'),
    path('', include(router.urls)),
]
