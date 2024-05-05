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
def home1(request):
    batches = Lab.objects.values_list('batch', flat=True).distinct()
    if request.method == 'POST':
        batch = request.POST.get('batch')
        lab = request.POST.get('lab')
        experiments = Experiment.objects.filter(lab_id__lab_name=lab).order_by('exp_name')
        exp_name_list =  sorted(experiments.values_list('exp_name', flat=True)) 
        data_dict = {}
        
        students = Student.objects.filter(batch=batch)
        #sort by roll no
        students = sorted(students, key=lambda x: x.roll_no)
        for student in students:
            data_dict[student.roll_no] = {}
            
            for exp in experiments:
                data_dict[student.roll_no][exp.exp_name] = [False,'',False]
                try:
                    file_instance = File.objects.get(std_id=student, lab_id=exp.lab_id, exp_id=exp.id)
                    data_dict[student.roll_no][exp.exp_name][0] = True
                    data_dict[student.roll_no][exp.exp_name][1] = file_instance.file.url
                    data_dict[student.roll_no][exp.exp_name][2] = file_instance.printed
                    data_dict[student.roll_no][exp.exp_name].append(file_instance.id)

                except File.DoesNotExist:
                    data_dict[student.roll_no][exp.exp_name][0] = False
                    data_dict[student.roll_no][exp.exp_name][1] = ''
                
        roll_list = json.dumps(list(data_dict.keys()))
        experiments_json = json.dumps(list(data_dict.values())) if data_dict else '[]'
        return render(request, 'users/home.html', {'experiments_json': experiments_json, 'batches': batches,'exp_names_list':exp_name_list, 'roll_list': roll_list})
    

@login_required
def home(request):
    batches = Lab.objects.values_list('batch', flat=True).distinct()
    if request.method == 'GET':
        return render(request, 'users/home.html', {'batches': batches})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

def labs(request):
    if request.method == 'GET':
        labs = Lab.objects.filter(batch = request.GET.get('batch'))
        return JsonResponse(list(labs.values('lab_name')), safe=False)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)


def mark_files_as_printed(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        file_ids = data.get('file_ids')
        if file_ids is not None:
            try:
                File.objects.filter(id=file_ids).update(printed=True)
                print(File.objects.get(id=file_ids))
                return JsonResponse({'success': True})
            except Exception as e:
                return JsonResponse({'success': False, 'error': str(e)})
        else:
            print('data is none')
            return JsonResponse({'success': False, 'error': 'No file_ids provided in the POST data'})

        
