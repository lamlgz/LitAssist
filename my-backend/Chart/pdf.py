import PyPDF2
import fitz
from django.core.files.base import ContentFile
from .models import ImageInfo
from Home.models import UploadedFile 

def extract_images_from_pdf(file_instance):
    """
    从Django模型实例的PDF文件中提取图片并保存到磁盘。
    
    :param file_instance: File模型的实例，包含PDF文件
    """
    # 确保file_instance有PDF文件
    pdf_path = file_instance.pdf_file.path

    # 打开PDF文件
    pdf_document = fitz.open(pdf_path)

    image_count = 0
    for page_number in range(len(pdf_document)):
        page = pdf_document[page_number]
        images = page.get_images(full=True)

        for img_index, img in enumerate(images):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_filename = f"page-{page_number + 1}_img-{img_index + 1}.{image_ext}"

            # 保存图片到数据库
            extracted_image = ImageInfo(
                file_id=file_instance.id,
                image_id=image_filename,
            )
            extracted_image.img.save(image_filename, ContentFile(image_bytes), save=True)
            extracted_image.save()
            
            image_count += 1

    pdf_document.close()
