from django.urls import path
from .views import (
    UserDetailsByEmailAPIView, ToolnameAPIView, ToolsAPIView,
    ToolComponentsAPIView, EducationAPIView,
    ProjectAPIView, LinkAPIView, ResumeAPIView
)

urlpatterns = [
    # UserDetails via Email
    path('userdetails/<str:email>/', UserDetailsByEmailAPIView.as_view(), name='userdetails-by-email'),
    path('userdetails/', UserDetailsByEmailAPIView.as_view(), name='userdetails'),

    # Tool-related APIs
    path('toolnames/', ToolnameAPIView.as_view(), name='toolnames'),
    path('tools/', ToolsAPIView.as_view(), name='tools'),
    path('toolcomponents/', ToolComponentsAPIView.as_view(), name='toolcomponents'),

    # Education, Certificates, Projects, and Links
    path('education/', EducationAPIView.as_view(), name='education'),
    path('projects/', ProjectAPIView.as_view(), name='projects'),
    path('links/', LinkAPIView.as_view(), name='links'),
    path('resume/<str:email>/', ResumeAPIView.as_view(), name='resume'),
]
