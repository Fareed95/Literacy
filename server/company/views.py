from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Company, Internship, StudentsRegistered
from .serializers import CompanyProfileSerializer, InternshipSerializer, StudentsRegisteredSerializer


# 🚀 Company Views
class CompanyView(APIView):

    # GET: List all companies or retrieve a single company by ID
    def get(self, request, company_id=None):
        if company_id:
            company = get_object_or_404(Company, id=company_id)
            serializer = CompanyProfileSerializer(company)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        companies = Company.objects.all()
        serializer = CompanyProfileSerializer(companies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: Create a new company
    def post(self, request):
        serializer = CompanyProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH: Update an existing company by ID
    def patch(self, request, company_id=None):
        company = get_object_or_404(Company, id=company_id)
        serializer = CompanyProfileSerializer(company, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Remove a company by ID
    def delete(self, request, company_id=None):
        company = get_object_or_404(Company, id=company_id)
        company.delete()
        return Response({"message": "Company deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# 🚀 Internship Views
class InternshipView(APIView):

    # GET: List all internships or retrieve a single internship by ID
    def get(self, request, internship_id=None):
        if internship_id:
            internship = get_object_or_404(Internship, id=internship_id)
            serializer = InternshipSerializer(internship)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        internships = Internship.objects.all()
        serializer = InternshipSerializer(internships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: Create a new internship
    def post(self, request):
        serializer = InternshipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH: Update an existing internship by ID
    def patch(self, request, internship_id=None):
        internship = get_object_or_404(Internship, id=internship_id)
        serializer = InternshipSerializer(internship, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Remove an internship by ID
    def delete(self, request, internship_id=None):
        internship = get_object_or_404(Internship, id=internship_id)
        internship.delete()
        return Response({"message": "Internship deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from api.models import User
from .models import Internship, StudentsRegistered
from .serializers import StudentsRegisteredSerializer

class ApplyForInternshipView(APIView):
    """
    This endpoint registers a student for all internships with the given title.
    """

    def post(self, request):
        email = request.data.get('email')
        internship_title = request.data.get('internship_title')

        if not email or not internship_title:
            return Response({"error": "Email and internship title are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the user object
        user = get_object_or_404(User, email=email)

        # Get all internships with the given title
        internships = Internship.objects.filter(title__iexact=internship_title)

        if not internships.exists():
            return Response({"message": f"No internships found with the title '{internship_title}'."}, status=status.HTTP_404_NOT_FOUND)

        registered_internships = []
        already_registered = []

        # Iterate through all internships with the matching title
        for internship in internships:
            # Check if the user is already registered for the internship
            if StudentsRegistered.objects.filter(user=user, internship=internship).exists():
                already_registered.append(internship.title)
                continue
            
            # Register the user for the internship
            registration = StudentsRegistered.objects.create(user=user, internship=internship)
            registered_internships.append(registration)

        # Prepare the response
        serializer = StudentsRegisteredSerializer(registered_internships, many=True)
        response_data = {
            "registered": serializer.data,
            "already_registered": already_registered
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
