import zhipuai
import base64

api_key = "ae335e23c9ee4a28b65746fbc8e5559e.6iBV9vqAhDgcp14K"

Prompt = """
尽量详细地描述图片的内容，并将图表所示的数据信息进行详细的说明。
"""


def Zhipu_LLM_chart(img_url):
    client = zhipuai.ZhipuAI(api_key=api_key) 
    try:
        response = client.chat.completions.create(
            model="glm-4v-flash",  # 填写需要调用的模型名称
            messages=[{
                    "role": "user",
                    "content": [{"type": "text", "text": Prompt},
                                {"type": "image_url","image_url": {"url": img_url}
                    }]
                }]
        )
        info = response.choices[0].message.content
        return info
    except Exception as e:
        return f"调用大模型出错: {str(e)}"
    
if __name__ == "__main__":
    img_path = "test.png"
    with open(img_path, 'rb') as img_file:
        img_base = base64.b64encode(img_file.read()).decode('utf-8')
    print(Zhipu_LLM_chart(img_base))