# Healthcare Backend System

A Django REST Framework backend for a healthcare management system with JWT authentication, patient and doctor management, and patient-doctor assignment features.

## Features

- **JWT Authentication**: Secure user registration and login
- **Patient Management**: CRUD operations for patient records
- **Doctor Management**: CRUD operations for doctor records
- **Patient-Doctor Mapping**: Assign doctors to patients
- **PostgreSQL Database**: Robust data storage
- **RESTful API**: Clean API endpoints following REST principles

## Technology Stack

- **Backend**: Django 4.2.7, Django REST Framework 3.14.0
- **Authentication**: JWT with djangorestframework-simplejwt 5.3.0
- **Database**: PostgreSQL
- **Environment Management**: python-dotenv

## Prerequisites

- Python 3.8+
- PostgreSQL
- pip

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd healthcare_backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database**
   ```bash
   createdb healthcare_db
   ```

5. **Configure environment variables**
   Create a `.env` file in the project root:
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=healthcare_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

6. **Run migrations**
   ```bash
   python manage.py migrate
   ```

7. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

## API Documentation

### Authentication Endpoints

#### Register User
- **URL**: `/api/auth/register/`
- **Method**: `POST`
- **Authentication**: Not required
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "first_name": "string",
    "last_name": "string"
  }
  ```

#### Login
- **URL**: `/api/auth/login/`
- **Method**: `POST`
- **Authentication**: Not required
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "refresh": "string",
    "access": "string"
  }
  ```

#### Refresh Token
- **URL**: `/api/auth/token/refresh/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "refresh": "string"
  }
  ```

### Patient Endpoints (Authentication Required)

#### List Patients
- **URL**: `/api/patients/`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <access_token>`

#### Create Patient
- **URL**: `/api/patients/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "date_of_birth": "YYYY-MM-DD",
    "gender": "M/F/O",
    "contact_number": "string",
    "address": "string"
  }
  ```

#### Patient Details
- **URL**: `/api/patients/{id}/`
- **Method**: `GET`, `PUT`, `DELETE`
- **Headers**: `Authorization: Bearer <access_token>`

### Doctor Endpoints (Authentication Required)

#### List Doctors
- **URL**: `/api/doctors/`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <access_token>`

#### Create Doctor
- **URL**: `/api/doctors/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "specialization": "CARDIOLOGY/DERMATOLOGY/NEUROLOGY/etc.",
    "contact_number": "string",
    "license_number": "string"
  }
  ```

#### Doctor Details
- **URL**: `/api/doctors/{id}/`
- **Method**: `GET`, `PUT`, `DELETE`
- **Headers**: `Authorization: Bearer <access_token>`

### Mapping Endpoints (Authentication Required)

#### List Mappings
- **URL**: `/api/mappings/`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <access_token>`

#### Create Mapping
- **URL**: `/api/mappings/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "patient": 1,
    "doctor": 1,
    "notes": "string"
  }
  ```

#### Get Patient's Doctors
- **URL**: `/api/mappings/patient/{patient_id}/`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <access_token>`

#### Delete Mapping
- **URL**: `/api/mappings/{id}/`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <access_token>`

## Testing the API

### Using curl

1. **Register a user**:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123", "first_name": "Test", "last_name": "User"}'
   ```

2. **Login to get token**:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/auth/login/ \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "testpass123"}'
   ```

3. **Create a patient (using the access token)**:
   ```bash
   curl -X POST http://127.0.0.1:8000/api/patients/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -d '{"first_name": "John", "last_name": "Doe", "date_of_birth": "1990-05-15", "gender": "M", "contact_number": "123-456-7890", "address": "123 Main St"}'
   ```

### Using Postman

1. Import the provided Postman collection
2. Set up environment variables for base URL and tokens
3. Start with the registration endpoint
4. Use the login endpoint to get JWT tokens
5. Use the tokens to access protected endpoints

## Project Structure

```
healthcare_backend/
├── authentication/          # Custom user model and authentication
│   ├── models.py           # Custom User model
│   ├── serializers.py      # User registration serializers
│   ├── views.py           # Authentication views
│   └── urls.py            # Authentication routes
├── core/                   # Main application logic
│   ├── models.py          # Patient, Doctor, Mapping models
│   ├── serializers.py     # Model serializers
│   ├── views.py           # API views
│   ├── permissions.py     # Custom permissions
│   └── urls.py           # API routes
├── healthcare/
│   ├── settings.py        # Django settings
│   └── urls.py           # Main URL configuration
├── .env                   # Environment variables
├── requirements.txt       # Python dependencies
└── manage.py             # Django management script
```

## Database Models

### User
- Custom user model with email as username
- Extended with additional fields

### Patient
- Personal information and medical details
- Linked to specific users

### Doctor
- Professional information and specialization
- Linked to specific users

### PatientDoctorMapping
- Many-to-many relationship between patients and doctors
- Assignment notes and timestamps

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing using Django's built-in auth system
- Protected endpoints requiring authentication
- User-specific data access (users can only access their own data)

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
```

### Applying Migrations
```bash
python manage.py migrate
```

### Accessing Django Admin
1. Create a superuser: `python manage.py createsuperuser`
2. Visit: `http://127.0.0.1:8000/admin/`

## Deployment Notes

- Set `DEBUG=False` in production
- Use a secure secret key
- Configure proper database settings
- Set up proper CORS origins
- Use a production-ready web server (Gunicorn, uWSGI)
- Set up a reverse proxy (Nginx)
- Use environment variables for sensitive data

## Support

For issues and questions, please check the API documentation or create an issue in the repository.

## License

This project is licensed under the MIT License.

<img width="1920" height="1080" alt="Screenshot 2025-09-06 004655" src="https://github.com/user-attachments/assets/fcf6b254-1b90-41f9-9fd6-d79120eae295" />
<img width="1919" height="372" alt="Screenshot 2025-09-06 005531" src="https://github.com/user-attachments/assets/33d3d09a-e738-42c7-91dc-375420dc5ec8" />

