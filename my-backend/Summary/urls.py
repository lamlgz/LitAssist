# api/urls.py
from django.urls import path
from .views import ProcessPDFView

urlpatterns = [
    path('make_summary/', ProcessPDFView.as_view(), name='make_summary'),
]
