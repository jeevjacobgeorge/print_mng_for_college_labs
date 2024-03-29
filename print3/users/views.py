from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserRegistrationForm
from django.contrib.auth.decorators import login_required
from studapi.models import Lab,File,Student,Experiment
from django.http import JsonResponse
import json


def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Your account has been created! You are now able to log in')
            return redirect('login')
    else:
        form = UserRegistrationForm()
    return render(request, 'users/signup.html', {'form': form})
@login_required
def home(request):
    batches = Lab.objects.values_list('batch', flat=True).distinct()
    
    if request.method == 'GET':
        return render(request, 'users/home.html', {'batches': batches})
    
    elif request.method == 'POST':
        batch = request.POST.get('batch')
        lab = request.POST.get('lab')
        experiments = Experiment.objects.filter(lab_id__lab_name=lab)
        exp_name_list =  sorted(experiments.values_list('exp_name', flat=True)) 
        data_dict = {}
        
        students = Student.objects.filter(batch=batch)
        roll_list = []
        uploaded = []
        urls = []
        for student in students:
            roll_list.append(student.roll_no)
            for exp in experiments:                
                try:
                    file_instance = File.objects.get(std_id=student, lab_id=exp.lab_id, exp_id=exp.id)
                    uploaded.append(True) 
                    urls.append(file_instance.file.url)
                except File.DoesNotExist:
                    uploaded.append(False)
                    urls.append(None)
                            
        return render(request, 'users/home.html', {'roll_list': roll_list, 'batches': batches,'exp_names_list':exp_name_list,'uploaded':uploaded,'urls':urls})
    
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

def labs(request):
    if request.method == 'GET':
        labs = Lab.objects.filter(batch = request.GET.get('batch'))
        return JsonResponse(list(labs.values('lab_name')), safe=False)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
