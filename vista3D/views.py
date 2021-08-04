from django.http import HttpResponse, FileResponse
from django.shortcuts import render, HttpResponse, get_object_or_404
from .models import Piece
import json
import os
import mimetypes

def index(request):
    return render(request,'aplicacion.html', {})

def piezas(request):
    pieces = Piece.objects.all()
    pieces = list(pieces)
    array_pieces = []
    for piece in pieces:
        datos = [piece.id, piece.name_file, piece.size, piece.posX, piece.posY, piece.tipo, piece.image]
        

        array_pieces.append(datos)
    return render(request,'piezas.html', {'pieces': array_pieces})

