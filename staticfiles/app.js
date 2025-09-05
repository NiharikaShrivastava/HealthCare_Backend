// Show different sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).style.display = 'block';
}

// Patient functions
function showPatientForm() {
    document.getElementById('patient-form').style.display = 'block';
    document.getElementById('patients-list').style.display = 'none';
    // Clear form
    document.getElementById('patient-id').value = '';
    document.getElementById('patient-form').reset();
}

function hidePatientForm() {
    document.getElementById('patient-form').style.display = 'none';
    document.getElementById('patients-list').style.display = 'block';
}

async function savePatient(event) {
    event.preventDefault();
    
    const patientData = {
        first_name: document.getElementById('patient-firstname').value,
        last_name: document.getElementById('patient-lastname').value,
        date_of_birth: document.getElementById('patient-dob').value,
        gender: document.getElementById('patient-gender').value,
        contact_number: document.getElementById('patient-phone').value,
        address: document.getElementById('patient-address').value
    };
    
    const patientId = document.getElementById('patient-id').value;
    const url = patientId ? 
        `${API_BASE_URL}/patients/${patientId}/` : 
        `${API_BASE_URL}/patients/`;
    const method = patientId ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(patientData)
        });
        
        if (response.ok) {
            alert('Patient saved successfully!');
            hidePatientForm();
            loadPatients();
        } else {
            const error = await response.json();
            alert(`Error saving patient: ${JSON.stringify(error)}`);
        }
    } catch (error) {
        alert('Error saving patient: ' + error.message);
    }
}

async function loadPatients() {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const patients = await response.json();
            const tbody = document.getElementById('patients-table').querySelector('tbody');
            tbody.innerHTML = '';
            
            patients.forEach(patient => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.first_name} ${patient.last_name}</td>
                    <td>${patient.date_of_birth}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.contact_number}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editPatient(${patient.id})">Edit</button>
                        <button class="action-btn delete-btn" onclick="deletePatient(${patient.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Also update the mapping patient dropdown
            const patientSelect = document.getElementById('mapping-patient');
            patientSelect.innerHTML = '<option value="">Select Patient</option>';
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient.id;
                option.textContent = `${patient.first_name} ${patient.last_name}`;
                patientSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

async function editPatient(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/patients/${id}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const patient = await response.json();
            document.getElementById('patient-id').value = patient.id;
            document.getElementById('patient-firstname').value = patient.first_name;
            document.getElementById('patient-lastname').value = patient.last_name;
            document.getElementById('patient-dob').value = patient.date_of_birth;
            document.getElementById('patient-gender').value = patient.gender;
            document.getElementById('patient-phone').value = patient.contact_number;
            document.getElementById('patient-address').value = patient.address;
            
            showPatientForm();
        }
    } catch (error) {
        console.error('Error loading patient:', error);
    }
}

async function deletePatient(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                alert('Patient deleted successfully!');
                loadPatients();
            }
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    }
}

// Doctor functions (similar to patient functions)
function showDoctorForm() {
    document.getElementById('doctor-form').style.display = 'block';
    document.getElementById('doctors-list').style.display = 'none';
    document.getElementById('doctor-id').value = '';
    document.getElementById('doctor-form').reset();
}

function hideDoctorForm() {
    document.getElementById('doctor-form').style.display = 'none';
    document.getElementById('doctors-list').style.display = 'block';
}

async function saveDoctor(event) {
    event.preventDefault();
    
    const doctorData = {
        first_name: document.getElementById('doctor-firstname').value,
        last_name: document.getElementById('doctor-lastname').value,
        specialization: document.getElementById('doctor-specialization').value,
        contact_number: document.getElementById('doctor-phone').value,
        license_number: document.getElementById('doctor-license').value
    };
    
    const doctorId = document.getElementById('doctor-id').value;
    const url = doctorId ? 
        `${API_BASE_URL}/doctors/${doctorId}/` : 
        `${API_BASE_URL}/doctors/`;
    const method = doctorId ? 'PUT' : 'POST';
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(doctorData)
        });
        
        if (response.ok) {
            alert('Doctor saved successfully!');
            hideDoctorForm();
            loadDoctors();
        } else {
            const error = await response.json();
            alert(`Error saving doctor: ${JSON.stringify(error)}`);
        }
    } catch (error) {
        alert('Error saving doctor: ' + error.message);
    }
}

async function loadDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const doctors = await response.json();
            const tbody = document.getElementById('doctors-table').querySelector('tbody');
            tbody.innerHTML = '';
            
            doctors.forEach(doctor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Dr. ${doctor.first_name} ${doctor.last_name}</td>
                    <td>${doctor.specialization}</td>
                    <td>${doctor.contact_number}</td>
                    <td>${doctor.license_number}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editDoctor(${doctor.id})">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteDoctor(${doctor.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Also update the mapping doctor dropdown
            const doctorSelect = document.getElementById('mapping-doctor');
            doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.id;
                option.textContent = `Dr. ${doctor.first_name} ${doctor.last_name} (${doctor.specialization})`;
                doctorSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

async function editDoctor(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const doctor = await response.json();
            document.getElementById('doctor-id').value = doctor.id;
            document.getElementById('doctor-firstname').value = doctor.first_name;
            document.getElementById('doctor-lastname').value = doctor.last_name;
            document.getElementById('doctor-specialization').value = doctor.specialization;
            document.getElementById('doctor-phone').value = doctor.contact_number;
            document.getElementById('doctor-license').value = doctor.license_number;
            
            showDoctorForm();
        }
    } catch (error) {
        console.error('Error loading doctor:', error);
    }
}

async function deleteDoctor(id) {
    if (confirm('Are you sure you want to delete this doctor?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                alert('Doctor deleted successfully!');
                loadDoctors();
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    }
}

// Mapping functions
async function assignDoctor(event) {
    event.preventDefault();
    
    const mappingData = {
        patient: document.getElementById('mapping-patient').value,
        doctor: document.getElementById('mapping-doctor').value,
        notes: document.getElementById('mapping-notes').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/mappings/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(mappingData)
        });
        
        if (response.ok) {
            alert('Doctor assigned to patient successfully!');
            document.getElementById('mapping-notes').value = '';
            loadMappings();
        } else {
            const error = await response.json();
            alert(`Error assigning doctor: ${JSON.stringify(error)}`);
        }
    } catch (error) {
        alert('Error assigning doctor: ' + error.message);
    }
}

async function loadMappings() {
    try {
        const response = await fetch(`${API_BASE_URL}/mappings/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (response.ok) {
            const mappings = await response.json();
            const tbody = document.getElementById('mappings-table').querySelector('tbody');
            tbody.innerHTML = '';
            
            mappings.forEach(mapping => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${mapping.patient_first_name} ${mapping.patient_last_name}</td>
                    <td>Dr. ${mapping.doctor_first_name} ${mapping.doctor_last_name}</td>
                    <td>${mapping.assigned_date}</td>
                    <td>${mapping.notes}</td>
                    <td>
                        <button class="action-btn delete-btn" onclick="deleteMapping(${mapping.id})">Remove</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading mappings:', error);
    }
}

async function deleteMapping(id) {
    if (confirm('Are you sure you want to remove this assignment?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/mappings/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                alert('Assignment removed successfully!');
                loadMappings();
            }
        } catch (error) {
            console.error('Error deleting mapping:', error);
        }
    }
}