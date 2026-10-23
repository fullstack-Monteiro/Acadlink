from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UniversityViewSet, PortfolioViewSet

router = DefaultRouter()
router.register(r'universities', UniversityViewSet, basename='university')
router.register(r'', UserViewSet, basename='user')
router.register(r'portfolio', PortfolioViewSet, basename='portfolio')

urlpatterns = [
    path('', include(router.urls)),
]
