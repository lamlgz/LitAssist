# api/urls.py
from django.urls import path
from .views import ProcessPDFView

urlpatterns = [
    path('make_translate/', ProcessPDFView.as_view(), name='make_translate'),  # 设置 hello 路由
]
