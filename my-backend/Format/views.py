from django.http import JsonResponse
from rest_framework.views import APIView
from Home.models import UploadedFile
from .tests import upload_pdf
import json

class view_format(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # 检查是否有文件上传
            if 'pdf_file' not in request.FILES:
                return JsonResponse({"status": "error", "message": "未提供 PDF 文件"}, status=400)

            # 调用 upload_pdf 函数处理文件
            response = upload_pdf(request)

            # 如果 upload_pdf 返回的是 JsonResponse，直接返回
            if isinstance(response, JsonResponse):
                return response

            # 如果 upload_pdf 返回的是其他类型的数据，转换为 JSON 格式
            return JsonResponse({"status": "success", "data": response}, status=200)

        except Exception as e:
            # 捕获异常并返回错误信息
            return JsonResponse({"status": "error", "message": str(e)}, status=500)