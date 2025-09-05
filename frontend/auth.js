const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Show/hide forms
function showRegister() {
    console.log('Show register called');
    document.getElementById('register-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function showLogin() {
    console.log('Show login called');
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// Register user
async function registerUser(event) {
    event.preventDefault();
    console.log('Register function called');
    
    const userData = {
        username: document.getElementById('reg-username').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        first_name: document.getElementById('reg-firstname').value,
        last_name: document.getElementById('reg-lastname').value
    };

    console.log('Sending:', userData);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data);
            alert('Registration successful! Please login.');
            showLogin();
        } else {
            const error = await response.json();
            console.error('Registration failed:', error);
            alert(`Registration failed: ${JSON.stringify(error)}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    }
}

// Login user
async function loginUser(event) {
    event.preventDefault();
    console.log('Login function called');
    
    const loginData = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };

    console.log('Sending:', loginData);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);
            
            // Store tokens
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            
            alert('Login successful!');
            // Here you would typically redirect to the dashboard
        } else {
            const error = await response.json();
            console.error('Login failed:', error);
            alert(`Login failed: ${JSON.stringify(error)}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

// Initialize the page
window.onload = function() {
    console.log('Page loaded');
    showLogin(); // Show login form by default
};