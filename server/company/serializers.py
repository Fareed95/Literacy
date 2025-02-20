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

class CompanySerializer(serializers.ModelSerializer):
    internships = InternshipSerializer(many=True, read_only=True)
    class Meta:
        model = Company
        fields = [
            'user',
            'id',
            'name',
            'description',
            'logo',
            'website',
            'location',
            'industry',
            'founded_at',
            'contact_email',
            'contact_phone',  
            'internships',
        ]
