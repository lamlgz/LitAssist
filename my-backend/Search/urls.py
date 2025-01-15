# api/urls.py
from django.urls import path
from .views import ProcessPDFView

urlpatterns = [
    path('make_search/', ProcessPDFView.as_view(), name='make_search'),
]
