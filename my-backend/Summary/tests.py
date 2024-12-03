from django.test import TestCase

# Create your tests here.

from django.test import TestCase
from .read_pdf import extract_text_from_pdf
from .zhipu_api import process_with_ai

class PDFProcessingTests(TestCase):
    def test_pdf_extraction(self):
        text = extract_text_from_pdf("./media/uploaded_files/nihms-1581226.pdf")
        # print(f"PDF 提取文本: {text}")
        self.assertTrue(len(text) > 0)

    def test_ai_processing(self):
        result = process_with_ai("测试文本内容")
        print(f"AI 返回结果: {result}")  # 调试输出
