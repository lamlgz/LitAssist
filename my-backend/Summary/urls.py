# api/urls.py
from django.urls import path
from .views import hello_world, ProcessPDFView

urlpatterns = [
    path('hello/', hello_world),  # 设置 hello 路由
    path('summary/', ProcessPDFView.as_view(), name='summary'),
]
