from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UploadedFile

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django Home!"})


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file provided"}, status=400)

        # 提取文件信息
        original_name = file.name
        size = file.size

        # 保存到数据库
        uploaded_file = UploadedFile.objects.create(
            file=file,
            original_name=original_name,
            size=size
        )

        return Response({
            "message": "File uploaded successfully",
            "file_id": uploaded_file.id,
            "file_path": uploaded_file.file.url,
            "original_name": uploaded_file.original_name,
            "size": uploaded_file.size
        }, status=201)
