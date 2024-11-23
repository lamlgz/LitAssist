from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from rest_framework.views import APIView
# from .models import PDFDocument
from .read_pdf import extract_text_from_pdf
from .zhipu_api import process_with_ai

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django Summary!"})


class ProcessPDFView(APIView):
    def post(self, request, *args, **kwargs):
        """处理上传的 PDF 文件"""
        try:
            # 从前端获取 PDF 文本内容
            file_path = "./media/uploaded_files/nihms-1581226.pdf"

            # 提取 PDF 内容
            pdf_text = extract_text_from_pdf(file_path)
            if not pdf_text:
                return JsonResponse({"status": "error", "message": "No PDF text provided"}, status=400)

            # 调用大模型 API
            ai_result = process_with_ai(pdf_text)

            return JsonResponse({"status": "success", "result": ai_result})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
