from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter
from studapi import views

#This router deals with the url mapping for api
# router = DefaultRouter()
# router.register('stud_api',views.StudentViewSet,'stud_api')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/file',views.FileUpload.as_view()),
    path('api/signup', views.StudentViewSet.as_view({'post': 'create'})),
    path('api/lab', views.LabView, name='lab_api'),
    path('api/batches', views.BatchView, name='batch_api'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
