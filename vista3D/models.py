from django.db import models

# Create your models here.
class Piece(models.Model):
    name_file = models.CharField(max_length=200)
    size = models.CharField(max_length=200)
    posX = models.IntegerField()
    posY = models.IntegerField()
    tipo = models.CharField(max_length=200)
    id = models.IntegerField(primary_key=True)
    image = models.CharField(max_length=200)
