from django.shortcuts import render
from .models import File,Student,Lab
from rest_framework import viewsets, permissions
from .serializers import FileSerializer,StudentSerializer,FormSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import io
import json
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
class FileUpload(APIView):
    def post(self,request,format = None):
        serializer = FormSerializer(data = request.data)
        if serializer.is_valid():
            try:
                student = Student.objects.get(batch=serializer.validated_data['batch'],roll_no=serializer.validated_data['roll_no'])
            except Student.DoesNotExist:
                return Response({"message":"Student does not exist"},status=status.HTTP_404_NOT_FOUND)
            file_data = {
                'std_id':student.id,
                'lab_id':serializer.validated_data['lab_id'],
                'exp_id':serializer.validated_data['exp_id'],
                'file':serializer.validated_data['file']
            }
            file_serializer= FileSerializer(data=file_data)
            if file_serializer.is_valid():
                file_serializer.save()
                return Response(file_serializer.data,status=status.HTTP_201_CREATED)
            else:
                return Response(file_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

def LabView(request):
    if request.method == 'GET':
        batch = request.GET.get('batch')  # Get the 'batch' query parameter from the URL
        
        if batch is not None:
            labs = Lab.objects.filter(batch=batch)
            lab_dict = {lab.id: lab.lab_name for lab in labs}
            return JsonResponse(lab_dict, safe=False)
        
    return JsonResponse({'error': 'Invalid request'}, status=400)

def BatchView(request):
    if request.method == 'GET':
        batches = Lab.objects.values_list('batch', flat=True).distinct()
        return JsonResponse(list(batches), safe=False)
        
