from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import UserDetails, Toolname, Tools, ToolComponents, Education,  Project, Link
from .serializers import (
    UserDetailsSerializer, ToolnameSerializer, ToolsSerializer, 
    ToolComponentsSerializer, EducationSerializer, 
    ProjectSerializer, LinkSerializer
)
from django.template.loader import render_to_string
from weasyprint import HTML
from django.http import HttpResponse

# UserDetails by Email
class UserDetailsByEmailAPIView(APIView):
    def get(self, request, email):
        user = get_object_or_404(UserDetails, email=email)
        serializer = UserDetailsSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, email):
        user = get_object_or_404(UserDetails, email=email)
        serializer = UserDetailsSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, email):
        user = get_object_or_404(UserDetails, email=email)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# Toolname API
class ToolnameAPIView(APIView):
    def get(self, request):
        toolnames = Toolname.objects.all()
        serializer = ToolnameSerializer(toolnames, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ToolnameSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Tools API
class ToolsAPIView(APIView):
    def get(self, request):
        tools = Tools.objects.all()
        serializer = ToolsSerializer(tools, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ToolsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ToolComponents API
class ToolComponentsAPIView(APIView):
    def get(self, request):
        components = ToolComponents.objects.all()
        serializer = ToolComponentsSerializer(components, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ToolComponentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Education API
class EducationAPIView(APIView):
    def get(self, request):
        education = Education.objects.all()
        serializer = EducationSerializer(education, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = EducationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Project API
class ProjectAPIView(APIView):
    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Link API
class LinkAPIView(APIView):
    def get(self, request):
        links = Link.objects.all()
        serializer = LinkSerializer(links, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResumeAPIView(APIView):
    def get(self, request, email):
        user = get_object_or_404(UserDetails, email=email)
        serializer = UserDetailsSerializer(user)
        # print(serializer.data)
        context = {
            'user': serializer.data,
            'name': serializer.data['name'],
            'email': serializer.data['email'],
            'phone': serializer.data['phone_number'],
            'education': Education.objects.filter(user=user),
            'projects': Project.objects.filter(user=user),
            # 'links': Link.objects.filter(user=user),
        }
        print(serializer.data['certificate'])
        print(Education.objects.filter(user=user))
        html_content = render_to_string('resume.html', context)
        resume_name =f"{serializer.data['name']}_resume.pdf"

    # Generate the PDF and return it
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename={resume_name}'
        HTML(string=html_content).write_pdf(response)

        return response

    

        # return response
        return Response(serializer.data, status=status.HTTP_200_OK)