from django.shortcuts import render
from django.http import JsonResponse
import base64

# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from Home.models import UploadedFile
from .models import ImageInfo
from .llm import Zhipu_LLM_chart
from .pdf import extract_images_from_pdf

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django Chart!"})

def show_img(request):
    f_id = request.data.get("file_id")
    if not f_id:
        return JsonResponse({"status": "error", "message": "file_id is required"}, status=400)
    try:
        uploaded_file = UploadedFile.objects.get(id=f_id)
    except UploadedFile.DoesNotExist:
        return JsonResponse({"status": "error", "message": "File not found"}, status=404)
    
    extract_images_from_pdf(uploaded_file)
    
    img = ImageInfo.objects.filter(file_id = f_id)
    data = list(img.values('image_id', 'img'))

    return JsonResponse(data, safe=False)

class ChartView(APIView):
    def post(self, request, *args, **kwargs):
        """根据文件 ID 处理 PDF 文件并提取详细信息"""
        try:
            # 从请求中获取 file_id
            Img_id = request.data.get("image_id")
            if not Img_id:
                return JsonResponse({"status": "error", "message": "image_id is required"}, status=400)

            # 从数据库中获取文件记录
            try:
                chosen_img = ImageInfo.objects.get(image_id=Img_id)
            except ImageInfo.DoesNotExist:
                return JsonResponse({"status": "error", "message": "Image not found"}, status=404)

            # 获取文件路径
            Image = chosen_img.img

            img_url = base64.encodebytes(Image)

            info = Zhipu_LLM_chart(img_url)

            return JsonResponse({
                "status": "success",
                "file_id": chosen_img.id,  # 返回文件 ID
                "data": info  # 详细的文献信息
            })
            
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)