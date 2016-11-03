from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        admin = request.user and request.user.is_staff
        # Instance must have an attribute named `owner`.
        return admin or obj.user == request.user

class IsAFriend(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        admin = request.user
        post = obj
        print post
        print admin
        # Instance must have an attribute named `owner`.
        return admin or obj.author.user == request.user
