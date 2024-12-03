import fitz  # PyMuPDF

def extract_text_from_pdf(file_path):
    """提取 PDF 文件中的文本内容"""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text