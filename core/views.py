from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import models
from .models import Patient, Doctor, PatientDoctorMapping
from .serializers import (
    PatientSerializer, DoctorSerializer, PatientDoctorMappingSerializer,
    PatientDetailSerializer, DoctorDetailSerializer
)
from .permissions import IsOwner

# Patient Views
class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Patient.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientDetailSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Patient.objects.filter(user=self.request.user)

# Doctor Views
class DoctorListCreateView(generics.ListCreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Doctor.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DoctorDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DoctorDetailSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        return Doctor.objects.filter(user=self.request.user)

# Patient-Doctor Mapping Views
class PatientDoctorMappingListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientDoctorMappingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only show mappings where the patient or doctor belongs to the user
        return PatientDoctorMapping.objects.filter(
            models.Q(patient__user=self.request.user) | 
            models.Q(doctor__user=self.request.user)
        )
    
    def perform_create(self, serializer):
        # Verify that the patient and doctor belong to the user
        patient_id = self.request.data.get('patient')
        doctor_id = self.request.data.get('doctor')
        
        patient = get_object_or_404(Patient, id=patient_id, user=self.request.user)
        doctor = get_object_or_404(Doctor, id=doctor_id, user=self.request.user)
        
        serializer.save(patient=patient, doctor=doctor)

class PatientDoctorMappingDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = PatientDoctorMappingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PatientDoctorMapping.objects.filter(
            models.Q(patient__user=self.request.user) | 
            models.Q(doctor__user=self.request.user)
        )

class PatientDoctorsListView(generics.ListAPIView):
    serializer_class = PatientDoctorMappingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        patient_id = self.kwargs['patient_id']
        return PatientDoctorMapping.objects.filter(
            patient_id=patient_id,
            patient__user=self.request.user
        )