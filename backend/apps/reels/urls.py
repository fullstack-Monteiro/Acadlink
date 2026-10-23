from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReelViewSet, ReelCategoryViewSet

router = DefaultRouter()
router.register(r'categories', ReelCategoryViewSet, basename='category')
router.register(r'', ReelViewSet, basename='reel')

urlpatterns = [
    path('', include(router.urls)),
]
