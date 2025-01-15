import time
import json
from zhipuai import ZhipuAI

# 初始化智谱AI客户端
client = ZhipuAI(api_key="ac7a9f00db24d0fd11c01a24fdd2c5f1.2Qvt7Al3RHxJGz43")  # 替换为您的 APIKey

def process_with_ai(pdf_text):
    """使用异步任务处理大模型请求并提取结构化信息"""
    try:
        # 构造提示
        prompt = (
            "请从以下文献内容中提取以下结构化信息，返回一个JSON对象，包含：\n"
            "1. 题目（title）\n"
            "2. 摘要（abstract）\n"
            "以下是文献内容：\n" + pdf_text
        )

        # 创建异步任务
        response = client.chat.asyncCompletions.create(
            model="glm-4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
        task_id = response.id

        # 轮询任务状态
        for attempt in range(40):
            result_response = client.chat.asyncCompletions.retrieve_completion_result(id=task_id)
            task_status = result_response.task_status

            if task_status == 'SUCCESS':
                raw_result = result_response.choices[0].message.content
                try:
                    result = json.loads(raw_result.replace("```json", "").replace("```", "").strip())
                    return result['abstract']
                except json.JSONDecodeError:
                    return "任务完成，但结果无法解析为JSON"
            elif task_status == 'FAILED':
                return "任务处理失败！"

            time.sleep(2)

        return "任务超时，未完成！"

    except Exception as e:
        return f"调用大模型出错: {str(e)}"
