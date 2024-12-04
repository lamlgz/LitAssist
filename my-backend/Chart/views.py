from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django Chart!"})

class ChartView(APIView):
    def post(self, request, *args, **kwargs):
        return