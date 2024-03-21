from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserRegistrationForm
from django.contrib.auth.decorators import login_required
from studapi.models import Lab,File,Student
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
        experiments = File.objects.filter(lab_id__lab_name=lab)
        data_dict = {}
        
        students = Student.objects.filter(batch=batch)
        
        for student in students:
            data_dict[student.roll_no] = {}
            
            for exp in experiments:
                data_dict[student.roll_no][exp.exp_id] = {}
                
                try:
                    file_instance = File.objects.get(std_id=student, lab_id=exp.lab_id, exp_id=exp.exp_id)
                    data_dict[student.roll_no][exp.exp_id]['uploaded'] = True
                    data_dict[student.roll_no][exp.exp_id]['url'] = file_instance.file.url
                except File.DoesNotExist:
                    data_dict[student.roll_no][exp.exp_id]['uploaded'] = False
                    data_dict[student.roll_no][exp.exp_id]['url'] = None
                            
        return render(request, 'users/home.html', {'experiments': data_dict, 'batches': batches})
    
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

def labs(request):
    if request.method == 'GET':
        labs = Lab.objects.filter(batch = request.GET.get('batch'))
        return JsonResponse(list(labs.values('lab_name')), safe=False)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
