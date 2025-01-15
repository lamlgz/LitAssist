# api/urls.py
from django.urls import path
from .views import ProcessPDFChartView

urlpatterns = [
    path('chart/', ProcessPDFChartView.as_view(), name='chart and table display')
]
