"""
Restaurant Views - Placeholder
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_list(request):
    """Get list of restaurants"""
    # Placeholder - will return mock data for now
    return Response({
        'success': True,
        'restaurants': []
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_detail(request, restaurant_id):
    """Get restaurant details"""
    return Response({
        'success': True,
        'restaurant': {}
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def restaurant_menu(request, restaurant_id):
    """Get restaurant menu"""
    return Response({
        'success': True,
        'menu': []
    }, status=status.HTTP_200_OK)