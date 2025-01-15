from django.http import JsonResponse
from rest_framework.views import APIView
from Home.models import UploadedFile
import os
from .pdf import extract_tables_from_pdf, extract_images_from_pdf
from .llm import Zhipu_LLM_chart
import json

class ProcessPDFChartView(APIView):
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

            pdf_tables = extract_tables_from_pdf(file_path)
            if not pdf_tables.strip():
                return JsonResponse({"status": "error", "message": "No Tables extracted from the PDF"}, status=400)
            
            print("Processing PDF File...")
            
            pdf_imgs = extract_images_from_pdf()
            ai_result = []

            for img in pdf_imgs:
                result = {img: img}
                description = Zhipu_LLM_chart(img)
                print(description)
                result['description'] = description
                ai_result.append(result)
            
            # 返回生成的详细信息和文件 ID
            return JsonResponse({
                "status": "success",
                "file_id": uploaded_file.id,  # 返回文件 ID
                "table_data": pdf_tables,#返回表格的列表
                "img_data": ai_result  # 返回图片及描述的列表
            })
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
        
class PDFChartListView(APIView):
    def get(self, request, *args, **kwargs):
        files = UploadedFile.objects.all()

        # 获取文件夹中的所有文件
        file_data = []
        for file in files:
            file_info = {
                'id':file.id,
                'name': file.original_name,
            }
            file_data.append(file_info)

        # 返回文件列表
        return JsonResponse({'status': "success",
                             "files": file_data})