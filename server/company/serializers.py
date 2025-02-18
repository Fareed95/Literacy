from rest_framework import serializers
from .models import Company, Internship

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
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
        ]


class InternshipSerializer(serializers.ModelSerializer):
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
        ]