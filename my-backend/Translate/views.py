from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
from rest_framework.views import APIView
from .read_pdf import extract_text_from_pdf
from Home.models import UploadedFile
from .baidu_trans_doc import do_translate
from .api import *


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
            # print(file_path)
            origin_text = extract_text_from_pdf(file_path)
            status, msg = do_translate('auto', target_lang, 'pdf', file_id, file_path)
            if not status == 0:
                return JsonResponse({"status": "error", "message": msg}, status=400)

            # 提取 PDF 内容
            translate_text = extract_text_from_pdf(msg)

            if not translate_text.strip():
                return JsonResponse({"status": "error", "message": "No content extracted from the PDF"}, status=400)

            # 返回翻译和文件 ID
            return JsonResponse({
                "status": "success",
                "file_id": uploaded_file.id,  # 返回文件 ID
                "data": {
                    "origin": origin_text,
                    "translate": translate_text
                }
            })
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
