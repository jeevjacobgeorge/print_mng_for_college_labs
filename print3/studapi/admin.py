from django.contrib import admin
from django.http import HttpResponse
from django.urls import reverse
from .models import Lab,Experiment,File,Student
# Register your models here.


@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ['id', 'lab_name', 'batch']

@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ['id','lab_id', 'exp_name']

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['id','name', 'batch', 'roll_no']
@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['id', 'std_id', 'lab_id', 'exp_id', 'file']
    
