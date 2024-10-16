// Signup form submission script for handling API calls
document.getElementById('signup-forms').addEventListener('send', async function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(event.target);
    const data = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        password: formData.get('password'),
        community: formData.get('community'),
        clan: formData.get('clan'),
        familyname: formData.get('familyname'),
        address: formData.get('address'),
        //maritalstatus: formData.get('maritalstatus'),
        numberofchildren: formData.get('numberofchildren'),
        stateofresidence: formData.get('stateofresidence'),
        lgaofresidence: formData.get('lgaofresidence'),
        dateofbirth: formData.get('dateofbirth'),
        isdobpublic: formData.get('isdobpublic'),
        profile_picture: formData.get('profile_picture')
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
            document.getElementById('error-message').textContent = result.message || 'User already exists.';

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


// Function to handle profile updates
async function updateProfile() {
    const userId = 1; // Replace with the actual user ID

    const profileData = {
        fullName: document.getElementById('modal-name').value,
        email: document.getElementById('modal-email').value,
        community: document.getElementById('modal-community').value,
        clan: document.getElementById('modal-clan').value,
        familyName: document.getElementById('modal-family-name').value,
        address: document.getElementById('modal-address').value,
        stateofresidence: document.getElementById('modal-state').value,
        lgaofresidence: document.getElementById('modal-lga').value,
        occupation: document.getElementById('modal-occupation').value,
        sex: document.getElementById('modal-sex').value,
        maritalstatus: document.getElementById('modal-marital-status').value,
        numberofchildren: document.getElementById('modal-children').value,
        dateofbirth: document.getElementById('modal-dob').value,
        isdobpublic: document.getElementById('dob-visibility').checked,
        profile_picture: document.getElementById('modal-profile-picture').files[0] // Handling file input
    };

    const response = await fetch(`/updateprofile/updateProfile/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    });

    if (response.ok) {
        alert('Profile updated successfully');
        // Optionally refresh profile data on the page
    } else {
        alert('Failed to update profile');
    }
}
