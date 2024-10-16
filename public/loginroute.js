document.getElementById('login-form').addEventListener('send', async function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Handle successful login
            const token = result.token; // Save token if needed
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('success-message').textContent = 'Login successful! Welcome back!';

            // Optionally store the token in localStorage
            localStorage.setItem('token', token);
            
            // Redirect to the success page after a brief delay
            setTimeout(() => {
                window.location.href = '/UserProfiles/profileHome.html'; // Change this to your target URL
            }, 2000); // 2 seconds delay (you can adjust this as needed)

        } else {
            // Display error message
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').textContent = result.message || 'Login failed. Please try again.';
            document.getElementById('success-message').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error); // Log the exact error to the console

        // Display general error message if the request fails
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = 'Server error. Please try again later.';
        document.getElementById('success-message').style.display = 'none';
    }
});


























/**

document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Handle successful login
            const token = result.token; // Save token if needed
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('success-message').textContent = 'Login successful! Welcome back!';

            // Optionally store the token in localStorage
            localStorage.setItem('token', token);
        } else {
            // Display error message
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').textContent = result.message || 'Login failed. Please try again.';
            document.getElementById('success-message').style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error); // Log the exact error to the console

        // Display general error message if the request fails
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = 'Server error. Please try again later.';
        document.getElementById('success-message').style.display = 'none';
    }
});
 */