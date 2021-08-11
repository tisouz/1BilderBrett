from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import IsAuthenticated

from imageBoard.models import User
from .serializers import ChangePasswordSerializer

class ChangePassword(UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer
