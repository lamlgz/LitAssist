# api/urls.py
from django.urls import path
from .views import hello_world
from .views import ChartView, show_img

urlpatterns = [
    path('hello/', hello_world),  # 设置 hello 路由
    path('chart_imgs/', show_img(), name='img_in_file'),
    path('chart/', ChartView.as_view(), name='chart_display')
]
