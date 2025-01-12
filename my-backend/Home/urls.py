# api/urls.py
from django.urls import path
from .views import hello_world
from .views import FileUploadView
from .views import register, login, logout

urlpatterns = [
    path('hello/', hello_world),  # 设置 hello 路由
    path("upload/", FileUploadView.as_view(), name="file-upload"),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
]
