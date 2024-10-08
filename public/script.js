document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(event.target);
    const data = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        password: formData.get('password'),
        community: formData.get('community'),
        clan: formData.get('clan'),
        familyname: formData.get('familyname')
    };

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Display the success message
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('success-message').textContent = result.message;

            // Hide error message if it was previously displayed
            document.getElementById('error-message').style.display = 'none';
        } else {
            // Display the error message
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').textContent = result.message || 'User already Exist.';

            // Hide success message if it was previously displayed
            document.getElementById('success-message').style.display = 'none';
        }
    } catch (error) {
        // Display general error message if the request fails
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = 'Server error. Please try again later.';
        document.getElementById('success-message').style.display = 'none';
    }
});






/**  WORKING CODE FOR ERROR DISPLAY INCASE THE OTHER ONE ABOVE MESS UP

document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(event.target);
    const data = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        password: formData.get('password'),
        community: formData.get('community'),
        clan: formData.get('clan'),
        familyname: formData.get('familyname')
    };

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Display the success message
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('success-message').textContent = result.message;

            // Hide error message if it was previously displayed
            document.getElementById('error-message').style.display = 'none';
        } else {
            // Display the error message
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').textContent = result.message || 'User already Exist.';

            // Hide success message if it was previously displayed
            document.getElementById('success-message').style.display = 'none';
        }
    } catch (error) {
        // Display general error message if the request fails
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').textContent = 'Server error. Please try again later.';
        document.getElementById('success-message').style.display = 'none';
    }
});
*/