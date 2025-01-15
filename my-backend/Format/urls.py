# api/urls.py
from django.urls import path
from .views import view_format

urlpatterns = [
    path('make_format/', view_format.as_view(), name = 'make_format'), 
]
