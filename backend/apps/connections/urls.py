from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConnectionViewSet

router = DefaultRouter()
router.register(r'', ConnectionViewSet, basename='connection')

urlpatterns = [
    path('', include(router.urls)),
]
