from rest_framework import serializers
from Auth.models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'full_name', 'phone_number', 'email', 'password']
        extra_kwargs = {
            'password' : {'write_only' : True}
        }
    def validate(self, data):
            # Validating username existence 
            if CustomUser.objects.filter(username = data['username']).exists():
                raise serializers.ValidationError('Username is already taken')
            # Validating email existence
            if CustomUser.objects.filter(email = data['email']).exists():
                raise serializers.ValidationError('Email is already taken')
            # Validating Phone number
            if len(data['phone_number'])!=10 or not data['phone_number'].isdigit():
                raise serializers.ValidationError("Invalid Phone number")
            return data
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user
    # Above is equivalent to:-
    # def create(self, validated_data):
    #     user = CustomUser.objects.create_user(
    #     username=validated_data['username'],
    #     email=validated_data['email'],
    #     full_name=validated_data['full_name'],
    #     phone_number=validated_data['phone_number'],
    #     roll_num=validated_data['roll_num'],
    #     password=validated_data['password']
    #     )
    #     return user
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    # Above is equivalent to:-
    # def update(self, instance, validated_data):
    #     instance.username = validated_data.get('username', instance.username)
    #     instance.full_name = validated_data.get('full_name', instance.full_name)
    #     instance.email = validated_data.get('email', instance.email)
    #     instance.phone_number = validated_data.get('phone_number', instance.phone_number)
    #     instance.roll_num = validated_data.get('roll_num', instance.roll_num)
    #     instance.is_active = validated_data.get('is_active', instance.is_active)
    #     instance.is_staff = validated_data.get('is_staff', instance.is_staff)
    
    #     password = validated_data.get('password', None)
    #     if password:
    #         instance.set_password(password)  # Ensures the password is hashed before saving
    #     instance.save()
    #     return instance
