import time
from zhipuai import ZhipuAI

# 初始化智谱AI客户端
client = ZhipuAI(api_key="ac7a9f00db24d0fd11c01a24fdd2c5f1.2Qvt7Al3RHxJGz43")  # 替换为您的 APIKey

def process_with_ai(pdf_text):
    """使用异步任务处理大模型请求"""
    try:
        # 创建异步任务
        response = client.chat.asyncCompletions.create(
            model="glm-4-plus",  # 替换为您的模型名称
            messages=[
                {
                    "role": "user",
                    "content": pdf_text
                }
            ],
        )
        task_id = response.id  # 获取任务 ID
        print(f"Task ID: {task_id}")

        # 轮询任务状态
        task_status = ''
        get_cnt = 0
        while task_status != 'SUCCESS' and task_status != 'FAILED' and get_cnt <= 40:
            result_response = client.chat.asyncCompletions.retrieve_completion_result(id=task_id)
            print(f"Polling task status: {result_response}")
            task_status = result_response.task_status

            if task_status == 'SUCCESS':
                # 返回生成的内容
                message_content = result_response.choices[0].message.content  # 提取 message
                return message_content  # 提取生成结果
            elif task_status == 'FAILED':
                print("Task failed!")
                return "任务处理失败！"

            time.sleep(2)  # 间隔 2 秒后再检查
            get_cnt += 1

        if task_status != 'SUCCESS':
            print("Task polling timeout!")
            return "任务超时，未完成！"

    except Exception as e:
        print(f"Error in process_with_ai_async: {e}")
        return f"调用大模型出错: {str(e)}"
