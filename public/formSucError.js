const form = document.getElementById('signup-form');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Clear previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname: document.getElementById('fullname').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                community: document.getElementById('community').value,
                clan: document.getElementById('clan').value,
                familyname: document.getElementById('familyname').value,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An unknown error occurred.');
        }

        const data = await response.json();
        successMessage.innerText = data.message; // Set success message
        successMessage.style.display = 'block';
    } catch (error) {
        errorMessage.innerText = error.message; // Set error message
        errorMessage.style.display = 'block';
    }
});
