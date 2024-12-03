from django.db import models

class UploadedFile(models.Model):
    file = models.FileField(upload_to="uploaded_files/")  # 文件存储路径
    original_name = models.CharField(max_length=255, default="default_name")  # 文件原始名称
    size = models.PositiveIntegerField(default=0)  # 文件大小（字节）
    uploaded_at = models.DateTimeField(auto_now_add=True)  # 上传时间

    def __str__(self):
        return self.original_name
