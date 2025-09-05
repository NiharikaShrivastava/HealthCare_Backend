from rest_framework import serializers
from .models import Patient, Doctor, PatientDoctorMapping

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

class PatientDoctorMappingSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True)
    
    class Meta:
        model = PatientDoctorMapping
        fields = '__all__'
        read_only_fields = ('assigned_date',)

class PatientDetailSerializer(PatientSerializer):
    doctors = serializers.SerializerMethodField()
    
    def get_doctors(self, obj):
        mappings = obj.doctor_mappings.all()
        return [mapping.doctor.get_full_name() for mapping in mappings]

class DoctorDetailSerializer(DoctorSerializer):
    patients = serializers.SerializerMethodField()
    
    def get_patients(self, obj):
        mappings = obj.patient_mappings.all()
        return [mapping.patient.get_full_name() for mapping in mappings]