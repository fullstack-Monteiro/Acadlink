from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        return obj.user == request.user


class IsAuthenticated(permissions.BasePermission):
    """
    Custom permission to check if user is authenticated.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class CanViewProfile(permissions.BasePermission):
    """
    Custom permission to view profiles.
    - Own profile: always allowed
    - Other profiles: allowed if not private or user is connected
    """
    def has_object_permission(self, request, view, obj):
        # Own profile
        if obj.user == request.user:
            return True
        
        # Public profile
        if not obj.is_private:
            return True
        
        # Private profile - check if connected
        from apps.connections.models import Connection
        return Connection.objects.filter(
            from_user=request.user,
            to_user=obj.user,
            status='accepted'
        ).exists()
