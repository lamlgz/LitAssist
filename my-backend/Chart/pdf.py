import fitz  # PyMuPDF
import io
import base64
from PIL import Image
import pdfplumber
import pandas as pd

def extract_tables_from_pdf(pdf_path):
    # 打开PDF文件
    with pdfplumber.open(pdf_path) as pdf:
        all_tables = []
        
        # 遍历所有页面
        for page_num, page in enumerate(pdf.pages):
            print(f"正在处理第{page_num + 1}页...")
            # 提取页面中的所有表格
            tables = page.extract_tables(table_settings={"vertical_strategy": "lines_strict", "horizontal_strategy": "lines"})
            for table in tables:
                all_tables.append(table)
    return all_tables

def extract_images_from_pdf(pdf_path):
    # 打开PDF文件
    doc = fitz.open(pdf_path)
    
    image_count = 0
    img_list = []
    
    # 遍历每一页
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        
        # 获取页面上的所有图像
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]  # 图片的xref
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            img_list.append(image_base64)
            
    print(f"共提取了 {image_count} 张图片.")
    return img_list
