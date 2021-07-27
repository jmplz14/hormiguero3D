from django.http import HttpResponse
from django.shortcuts import render, HttpResponse, get_object_or_404

def index(request):
    return render(request,'aplicacion.html', {})
def piezas(request):
    return render(request,'piezas.html', {})