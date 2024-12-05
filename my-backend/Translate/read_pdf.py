import fitz  # PyMuPDF
import re


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    doc.authenticate('Unicom75f')
    paragraphs = ""
    # debug = ""

    for page in doc:
        paragraphs += page.get_text()
        # blocks = page.get_text("blocks")
        # # debug += page.get_text()
        # # print(blocks)
        # blocks.sort(key=lambda b: (b[1], b[0]))  # 根据垂直和水平位置对文本块排序
        # for block in blocks:
        #     if block[6] == 0:
        #         text = block[4].strip()  # 提取文本并去除首尾空白
        #         if text:
        #             text = text.replace('\r\n', '')  # 去除换行符，合并为连续文本
        #             if text.startswith('(P:') or bool(re.match(r'^– \d+ –$', text)):  # 去掉页脚和页码信息
        #                 continue
        #             paragraphs += text + '\r\n'
    doc.close()
    # print(debug)
    return paragraphs

