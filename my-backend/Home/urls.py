# api/urls.py
from django.urls import path
from .views import hello_world
from .views import FileUploadView

urlpatterns = [
    path('hello/', hello_world),  # 设置 hello 路由
    path("upload/", FileUploadView.as_view(), name="file-upload"),
]
