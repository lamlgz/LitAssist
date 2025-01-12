# api/urls.py
from django.urls import path
from .views import hello_world
from .views import upload_pdf
urlpatterns = [
    path('hello/', hello_world),  # 设置 hello 路由
    path('pdf/', upload_pdf),  # 设置 hello 路由
]