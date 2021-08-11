from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from django.contrib.auth.password_validation import validate_password

from imageBoard.models import User

class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    old_password = serializers.CharField(write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise ValidationError(["Old password is not correct"])
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance

    class Meta:
        model = User
        fields = ('password', 'old_password')
