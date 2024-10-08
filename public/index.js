 
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Clear previous messages
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';

        // Collect form data
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
                // If the response is successful
                const result = await response.json();
                document.getElementById('success-message').textContent = result.message || 'Form submitted successfully!';
                document.getElementById('success-message').style.display = 'block';
                this.reset(); // Reset the form fields
            } else {
                // If there's an error in response
                const errorResult = await response.json();
                document.getElementById('error-message').textContent = errorResult.error || 'An error occurred. Please try again.';
                document.getElementById('error-message').style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('error-message').textContent = 'An unexpected error occurred. Please try again.';
            document.getElementById('error-message').style.display = 'block';
        }
    });

