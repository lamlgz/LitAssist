# api/urls.py
from django.urls import path
from .views import ProcessPDFChartView, PDFChartListView

urlpatterns = [
    path('make_chart/', ProcessPDFChartView.as_view(), name='chart and table display'),
    path('files/', PDFChartListView.as_view(), name='File list display')
]
