from django.db import models
import os
class Student(models.Model):
    name = models.CharField(max_length=25)
    batch = models.CharField(max_length=3)
    roll_no = models.IntegerField()

    def __str__(self):
        return str(self.batch)+"_"+str(self.roll_no)+"_"+str(self.name)
    def save(self, *args, **kwargs):
        # Capitalize the CharField before saving
        if self.batch:
            self.batch = self.batch.upper()
        super().save(*args, **kwargs)
    
class Lab(models.Model):
    lab_name = models.CharField(max_length=25)
    batch = models.CharField(max_length=3)
    def save(self, *args, **kwargs):
        # Capitalize the CharField before saving
        if self.batch:
            self.batch = self.batch.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.batch)+"_"+str(self.lab_name)

class Experiment(models.Model):
    lab_id = models.ForeignKey(Lab, on_delete=models.CASCADE)
    exp_name = models.CharField(max_length=25)

    def __str__(self):
        return str(self.lab_id)+"_"+str(self.exp_name)

def file_upload_location(instance, filename):
    # Constructing the path for file upload
    std_batch_folder = str(instance.lab_id.batch)
    std_roll_no_folder = str(instance.std_id.roll_no)
    lab_id_folder = str(instance.lab_id.lab_name)
    exp_name = instance.exp_id.exp_name
    filename = exp_name + ".txt"  # Rename the file to EXP_NAME.txt

    return os.path.join(std_batch_folder,std_roll_no_folder, lab_id_folder, filename)
    #This function returns the path where file will be saved and doesn't save or anything
class File(models.Model):
    std_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    lab_id = models.ForeignKey(Lab, on_delete=models.CASCADE)
    exp_id = models.ForeignKey(Experiment, on_delete=models.CASCADE)
    file = models.FileField(upload_to=file_upload_location)
    printed = models.BooleanField(default=False)  # Added boolean field to track if the file has been printed      
    class Meta:
        unique_together = ('std_id', 'lab_id', 'exp_id')
    def __str__(self):
        return str(self.lab_id.batch)+"_"+str(self.std_id.roll_no)+"_"+str(self.lab_id.lab_name)+"_"+str(self.exp_id.exp_name)
    
    def delete(self, *args, **kwargs):
        # Delete the file from the server
        if os.path.isfile(self.file.path):
            os.remove(self.file.path)
        # Call the superclass's delete method
        super().delete(*args, **kwargs)
