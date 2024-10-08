
document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(this.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            document.getElementById('success-message').style.display = 'block'; // Show success message
            this.reset(); // Reset form fields
        } else {
            const error = await response.text();
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
