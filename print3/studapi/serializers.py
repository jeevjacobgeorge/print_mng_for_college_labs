from rest_framework import serializers
from .models import File,Student,Lab

class FormSerializer(serializers.Serializer):
    batch = serializers.CharField(max_length=3)
    roll_no = serializers.IntegerField()
    lab_id = serializers.IntegerField()
    exp_id = serializers.IntegerField()
    file = serializers.FileField()
    def validate_roll_no(self, value):
        if value < 0:
            raise serializers.ValidationError("Roll number cannot be negative")
        return value
    def validate_lab_id(self,value):
        batch1 = self.initial_data.get('batch') 
        lab = Lab.objects.get(id=value)
        if batch1 != lab.batch:
            raise serializers.ValidationError("Batch does not match")
        return value


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'std_id', 'lab_id', 'exp_id', 'file']
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'batch', 'roll_no']