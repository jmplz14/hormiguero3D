from django.contrib import admin
from django.conf.urls import url
from django.urls import path
from . import views


urlpatterns = [

    path('piezas/', views.piezas, name='piezas'),

    path('', views.piezas, name='piezas')
    
]