"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Add this to handle media files during development
from django.conf import settings
from django.conf.urls.static import static


def home(request):
    return HttpResponse("Welcome to the Django homepage!")

urlpatterns = [
    path('', home),  # 设置根 URL 的默认视图
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # 将 api 应用的路由包含进来
    path('chart/', include('Chart.urls')),
    path('format/', include('Format.urls')),
    path('home/', include('Home.urls')),
    path('search/', include('Search.urls')),
    path('summary/', include('Summary.urls')),
    path('translate/', include('Translate.urls'))
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)