from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from .read_pdf import extract_text_from_pdf
from Home.models import UploadedFile
from .baidu_trans_doc import make_translate, query_translate
from .api import *


class MakeTranslate(APIView):
    def get(self, request, *args, **kwargs):
        file_id = request.GET.get("file_id")
        to_lang = request.GET.get("lang")
        uploaded_file = UploadedFile.objects.get(id=file_id)
        file_path = uploaded_file.file.path
        status, msg = make_translate('auto', to_lang, 'pdf', file_id, file_path)
        if status == 0:
            response = HttpResponse(open(file_path, 'rb'), content_type='application/pdf')
            return response
        else:
            return JsonResponse({"status": "error", "message": msg}, status=500)


class QueryTranslate(APIView):
    def get(self, request, *args, **kwargs):
        file_id = request.GET.get("file_id", target_lang)
        to_lang = request.GET.get("lang")
        status, msg = query_translate(file_id, to_lang)
        download_path = msg
        if status == 0:
            response = HttpResponse(open(download_path, 'rb'), content_type='application/pdf')
            return response
        else:
            return JsonResponse({"status": "error", "message": msg}, status=500)
