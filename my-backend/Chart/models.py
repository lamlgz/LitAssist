from django.db import models

# Create your models here.d
class ImageInfo(models.Model):
    img = models.ImageField(upload_to='img/')
    image_id = models.CharField(max_length=200, verbose_name='图片id')    
    file_id = models.CharField(max_length=200, verbose_name='文件id')
    create_time = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')

    class Meta:
        verbose_name = '图片信息'
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"Image {self.image_id} from file {self.file_id}"