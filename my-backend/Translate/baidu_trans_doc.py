import base64
import hashlib
import hmac
import json
import time
import requests
import urllib
import os
from .api import *

class Translate:
    def __init__(self):
        self.appid = appid
        self.seckey = seckey

    def create_quote_job(self, from_lang, to_lang, extend, file_name, file_path):
        url = quote_url
        with open(file_path, 'rb') as f:
            content = base64.b64encode(f.read()).decode('utf-8')
        input_data = {
            'from': from_lang,
            'to': to_lang,
            'input': {
                'content': content,
                'format': extend,
                'filename': file_name
            }
        }
        timestamp = int(time.time())
        sign = self.create_sign(timestamp, input_data)
        headers = self.create_headers(timestamp, sign)
        response = requests.post(url, headers=headers, json=input_data)
        return response.text

    def query_quote(self, file_id):
        url = query_quote_url
        input_data = {'fileId': file_id}
        timestamp = int(time.time())
        sign = self.create_sign(timestamp, input_data)
        headers = self.create_headers(timestamp, sign)
        response = requests.post(url, headers=headers, json=input_data)
        return response.text

    def create_trans_job(self, from_lang, to_lang, extend, file_name, file_path, output=''):
        url = trans_url
        with open(file_path, 'rb') as f:
            content = base64.b64encode(f.read()).decode('utf-8')
        input_data = {
            'from': from_lang,
            'to': to_lang,
            'input': {
                'content': content,
                'format': extend,
                'filename': file_name
            },
            'output': {
                'format': output
            }
        }
        timestamp = int(time.time())
        sign = self.create_sign(timestamp, input_data)
        headers = self.create_headers(timestamp, sign)
        response = requests.post(url, headers=headers, json=input_data)
        return response.text

    def query_trans(self, request_id):
        url = query_trans_url
        input_data = {'requestId': request_id}
        timestamp = int(time.time())
        sign = self.create_sign(timestamp, input_data)
        headers = self.create_headers(timestamp, sign)
        response = requests.post(url, headers=headers, json=input_data)
        return response.text

    def create_sign(self, timestamp, input_data):
        query_str = json.dumps(input_data)
        sign_str = '{}{}{}'.format(self.appid, timestamp, query_str)
        sign = base64.b64encode(hmac.new(self.seckey.encode('utf-8'), sign_str.encode('utf-8'), digestmod=hashlib.sha256).digest())
        return sign

    def create_headers(self, timestamp, sign):
        return {
            'Content-Type': 'application/json',
            'X-Appid': self.appid,
            'X-Sign': sign,
            'X-Timestamp': str(timestamp),
        }

    def url_encoder(self, params):
        return urllib.parse.urlencode(params)


def file_download(file_url, download_path):
    try:
        # print("下载链接：" + fileUrl)
        urllib.request.urlretrieve(file_url, filename=download_path)
        return download_path
        # print("成功下载文件")
    except IOError as exception_first:  # 设置抛出异常
        print(1, exception_first)
        return ''
    except Exception as exception_second:  # 设置抛出异常
        print(2, exception_second)
        return ''


# from_lang = 'en'
# to_lang = 'zh'
# file_path = r'.\test.pdf'
# extend = 'pdf'
# output = 'pdf'
# file_name = 'ceshi.pdf'
# trans_obj = Translate()

# 创建报价服务
# quote_ret = trans_obj.create_quote_job(from_lang, to_lang, extend, file_name, file_path)
# print(quote_ret)

# 查询报价结果
# file_id = '71d969e04f62cac86d7d16f6cc6b9413'
# query_quote_ret = trans_obj.query_quote(file_id)
# print(query_quote_ret)

# 创建翻译服务
def do_translate(from_lang, to_lang, input, file_id, file_path, output='pdf'):
    # 文件基准路径
    basedir = target_dir
    # 如果没有这个path则直接创建
    if not os.path.exists(basedir):
        os.makedirs(basedir)
    # 下载到服务器的地址
    file_path = basedir + '/' + str(file_id) + '_translate.pdf'
    # 文件url
    if os.path.exists(file_path):
        return 0, file_path

    trans_obj = Translate()
    trans_ret = json.loads(trans_obj.create_trans_job(from_lang, to_lang, input, file_id, file_path, output))
    if not trans_ret['code'] == 0:
        return 1, '翻译请求失败'
    else:
        request_id = trans_ret['data']['requestId']
        # print(request_id)
        for attmpt in range(999):
            query_trans_ret = json.loads(trans_obj.query_trans(request_id))
            # print(query_trans_ret)
            if not query_trans_ret['code'] == 0:
                return 2, '翻译查询失败'
            elif query_trans_ret['data']['status'] == 2:
                return 3, '翻译执行失败'
            elif query_trans_ret['data']['fileSrcUrl']:
                result_path = file_download(query_trans_ret['data']['fileSrcUrl'], file_path)
                if not result_path:
                    return 4, '结果下载失败'
                else:
                    return 0, result_path
            time.sleep(5)
        return 5, '翻译耗时过长'

# 查询翻译结果
# request_id = 3844576
# query_trans_ret = trans_obj.query_trans(request_id)
# print(query_trans_ret)
