import openai
import zhipuai

gpt_api = ""

Prompt = """你是一个pdf文档解析器，将使用markdown以及Latex语法进行输出，你需要将图片中识别到的表格信息转换为markdown格式进行输出。
在输出过程中，你应当能够：
1.输出语言与图片中的语言相同，在图片中的语言为英语时，你应当以英语进行输出。
2.不要对生成的文字内容进行解释，直接输出图片的内容。
3.内容不要包含在```markdown ```中、段落公式使用 $$ $$ 的形式、行内公式使用 $ $ 的形式、忽略掉长直线、忽略掉页码。
"""


def Zhipu_LLM_chart(img_url):
    client = zhipuai.ZhipuAI(api_key="ac7a9f00db24d0fd11c01a24fdd2c5f1.2Qvt7Al3RHxJGz43") 
    try:
        response = client.chat.completions.create(
            model="glm-4v",  # 填写需要调用的模型名称
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": Prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": img_url
                            }
                        }
                    ]
                }
            ]
        )
        info = response.choices[0].message.content
        return info
    except Exception as e:
        return f"调用大模型出错: {str(e)}"