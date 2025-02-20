from rest_framework import serializers
from .models import Company, Internship,StudentsRegistered


class StudentsRegisteredSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentsRegistered
        fields = [
            'id',
            'user',
            'internship',
            'registered_at',
            'is_selected',
        ]


class InternshipSerializer(serializers.ModelSerializer):
    students_registered = StudentsRegisteredSerializer(many=True, read_only=True)

    class Meta:
        model = Internship
        fields = [
            'id',
            'company',
            'title',
            'description',
            'stipend',
            'duration',
            'location',
            'skills_required',
            'openings',
            'application_deadline',
            'posted_at',
            'students_registered',
        ]

class CompanyProfileSerializer(serializers.ModelSerializer):
    internships = InternshipSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(source='user', read_only=True)
    class Meta:
        model = Company
        fields = [
            'user_email',
            'user_id',
            'id',
            'name',
            'description',
            'logo',
            'website',
            'location',
            'industry',
            'founded_at',
            'contact_phone',  
            'internships',
        ]
