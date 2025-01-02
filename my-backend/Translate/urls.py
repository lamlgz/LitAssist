# api/urls.py
from django.urls import path
from .views import MakeTranslate, QueryTranslate

urlpatterns = [
    path('make_translate/', MakeTranslate.as_view(), name='make_translate'),
    path('query_translate/', QueryTranslate.as_view(), name='query_translate'),
]
