import os
import django
from django.conf import settings

# 设置 Django 环境变量
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')  # 替换为你的项目名.settings
django.setup()

from Home.models import UploadedFile

def clear_uploaded_files():
    """
    清空数据库记录并删除文件存储
    """
    # 删除数据库记录
    print("正在删除数据库中的文件记录...")
    count = UploadedFile.objects.count()
    if count > 0:
        UploadedFile.objects.all().delete()
        print(f"成功删除 {count} 条文件记录")
    else:
        print("没有文件记录需要删除")

    # 删除存储在 MEDIA_ROOT 的文件
    media_root = settings.MEDIA_ROOT
    if not os.path.exists(media_root):
        print(f"目录 {media_root} 不存在，无需删除文件")
        return

    print("正在删除文件存储...")
    for root, dirs, files in os.walk(media_root):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                os.remove(file_path)
                print(f"删除文件: {file_path}")
            except Exception as e:
                print(f"删除文件 {file_path} 失败: {e}")

    print("文件存储清空完成！")

if __name__ == "__main__":
    clear_uploaded_files()
