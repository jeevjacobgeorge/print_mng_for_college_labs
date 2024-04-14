from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
urlpatterns = [
    path('signup', views.register, name="signup"),
    path('home', views.home, name="home"),
    path('home1', views.home1, name="home1"),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name='logout'),
    path('labs/',views.labs,name='labs'),
    path('mark_files_as_printed/', views.mark_files_as_printed, name='mark_files_as_printed'),

]