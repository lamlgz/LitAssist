from django.http import JsonResponse
from rest_framework.views import APIView
from Home.models import UploadedFile
from .read_pdf import extract_text_from_pdf
from .zhipu_api import process_with_ai
import json

class ProcessPDFView(APIView):
    def post(self, request, *args, **kwargs):
        """根据文件 ID 处理 PDF 文件并提取详细信息"""
        try:
            # 从请求中获取 file_id
            file_id = request.data.get("file_id")
            if not file_id:
                return JsonResponse({"status": "error", "message": "file_id is required"}, status=400)

            # 从数据库中获取文件记录
            try:
                uploaded_file = UploadedFile.objects.get(id=file_id)
            except UploadedFile.DoesNotExist:
                return JsonResponse({"status": "error", "message": "File not found"}, status=404)

            # 获取文件路径
            file_path = uploaded_file.file.path

            # 提取 PDF 内容
            pdf_text = extract_text_from_pdf(file_path)
            if not pdf_text.strip():
                return JsonResponse({"status": "error", "message": "No content extracted from the PDF"}, status=400)

            # 调用大模型 API 提取结构化信息
            ai_result = process_with_ai(pdf_text)
            # ai_result = json.dumps(pdf_text)

            # 返回生成的详细信息和文件 ID
            return JsonResponse({
                "status": "success",
                "file_id": uploaded_file.id,  # 返回文件 ID
                "data": ai_result  # 详细的文献信息
            })
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
