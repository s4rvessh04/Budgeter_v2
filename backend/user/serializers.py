from django.contrib.auth.models import User

from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "full_name"]

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, read_only=True)
    username = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    password = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "password"]

    def update(self, instance, validated_data):
        if "username" in validated_data and validated_data["username"] != "":
            if User.objects.filter(username=validated_data["username"]).exists():
                raise serializers.ValidationError(
                    {"username": "This username is already taken."}
                )
            instance.username = validated_data["username"]
        if "email" in validated_data and validated_data["email"] != "":
            if User.objects.filter(email=validated_data["email"]).exists():
                raise serializers.ValidationError(
                    {"email": "This email is already taken."}
                )
            instance.email = validated_data["email"]
        if "first_name" in validated_data and validated_data["first_name"] != "":
            instance.first_name = validated_data["first_name"]
        if "last_name" in validated_data and validated_data["last_name"] != "":
            instance.last_name = validated_data["last_name"]
        if "password" in validated_data and validated_data["password"] != "":
            instance.set_password(validated_data["password"])

        instance.save()

        return instance


class UserCheckPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ["password"]
