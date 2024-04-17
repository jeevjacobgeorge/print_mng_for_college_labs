from django.shortcuts import render
from .models import File,Student,Lab,Experiment
from rest_framework import viewsets, permissions
from .serializers import FileSerializer,StudentSerializer,FormSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import io
import json
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from .models import Student
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
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



        

def ExperimentView(request):
    if request.method == 'GET':
        experiments = Experiment.objects.filter(lab_id=request.GET.get('lab_id'))
        final_dict = dict()
        for exp in experiments:
            final_dict[exp.id] = {'exp_name': exp.exp_name}
            try:
                file_row = File.objects.get(std_id__batch=request.GET.get('batch'), std_id__roll_no=request.GET.get('roll_no'), lab_id=request.GET.get('lab_id'), exp_id=exp.id)
                final_dict[exp.id]['uploaded'] = True
                final_dict[exp.id]['url'] = file_row.file.url
                final_dict[exp.id]['printed'] = file_row.printed
            except File.DoesNotExist:
                final_dict[exp.id]['uploaded'] = False
                final_dict[exp.id]['printed'] = False
                final_dict[exp.id]['url'] = None  # Set url to None or any other appropriate value
        return JsonResponse(final_dict, safe=False)
    

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

def StudentCheck(request):
    if request.method == 'GET':
        students = Student.objects.filter(roll_no=request.GET.get('roll_no'), batch=request.GET.get('batch'))
        if students:
            return JsonResponse({'statusText': ' Valid request'}, status=200)
        else:
            return JsonResponse({'statusText': 'Invalid request'}, status=400)