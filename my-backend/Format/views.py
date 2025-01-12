# views.py
from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from gptpdf import parse_pdf
import os
# Create your views here.

from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "Hello from Django Format!"})
def upload_pdf(request):
    if request.method == 'POST' and request.FILES['pdf_file']:
        pdf_file = request.FILES['pdf_file']
        fs = FileSystemStorage()
        filename = fs.save(pdf_file.name, pdf_file)
        uploaded_file_url = fs.url(filename)  # 获取相对路径，如 '/media/file.pdf'
        pdf_path = os.path.join(fs.location, filename)
        output_dir = os.path.join(fs.location, 'output')
        
        try:
            content, image_paths = parse_pdf(pdf_path, output_dir=output_dir, model='gpt-4o', verbose=True)
            return JsonResponse({
                'content': content,
                'image_paths': image_paths,
                'output_dir': uploaded_file_url  # 返回相对路径
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return render(request, 'upload_pdf.html')
