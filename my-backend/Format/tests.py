from django.shortcuts import render
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from gptpdf import parse_pdf
import os

# Create your tests here.
api_key = 'sk-27076d786a65457c8c05a4448e644f3f'
base_url= 'https://dashscope.aliyuncs.com/compatible-mode/v1'
print(content)

def upload_pdf(request):
    if request.method == 'POST' and request.FILES['pdf_file']:
        # 获取上传的 PDF 文件
        pdf_file = request.FILES['pdf_file']
        
        # 保存文件
        fs = FileSystemStorage()
        filename = fs.save(pdf_file.name, pdf_file)
        uploaded_file_url = fs.url(filename)
        
        # 获取 PDF 文件的路径
        pdf_path = os.path.join(fs.location, filename)
        
        # 设置输出目录（可以根据需要自定义）
        output_dir = os.path.join(fs.location, 'output')
        
        # 调用 parse_pdf 函数处理文件
        try:
            content, image_paths = parse_pdf(pdf_path, output_dir=output_dir,api_key=api_key, base_url=base_url, model='qwen-vl-plus-latest', verbose=True)
            # 返回处理结果给前端
            return JsonResponse({
                'content': content,
                'image_paths': image_paths,
                'output_dir': uploaded_file_url
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return render(request, 'upload_pdf.html')
if __name__ == '__main__':
    # test_use_api_key()
    upload_pdf()
    # test_azure()
    # test_qwen_vl_max()