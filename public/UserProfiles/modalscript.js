
    // Function to toggle the visibility of the edit profile form
    function toggleEditForm() {
        const editForm = document.getElementById('edit-form');
        editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    }
    
    // Function to handle the profile picture upload
    function handleProfilePicUpload(event) {
        const file = event.target.files[0];
        const profilePic = document.getElementById('profile-pic');
    
        // Check if a file was selected
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result; // Update the profile picture preview
            };
            reader.readAsDataURL(file); // Read the uploaded file as a data URL
        }
    }
    
    // Function to handle the profile form submission
    function handleProfileFormSubmit(event) {
        event.preventDefault(); // Prevent the default form submission
    
        // Retrieve form values
        const name = document.getElementById('name').value;
        const sex = document.getElementById('sex').value;
        const address = document.getElementById('address').value;
        const state = document.getElementById('state').value;
        const lga = document.getElementById('lga').value;
        const occupation = document.getElementById('occupation').value;
        const maritalStatus = document.getElementById('marital-status').value;
        const children = document.getElementById('children').value;
        const email = document.getElementById('email').value;
        const dob = document.getElementById('dob-input').value;
        const dobVisibility = document.getElementById('toggle-dob-visibility').checked;
    
        // Basic validation (you can add more complex validation as needed)
        if (!name || !email) {
            alert('Please fill in all required fields.');
            return;
        }
    
        // Log the updated details (you can replace this with actual update logic, such as an API call)
        console.log({
            name,
            sex,
            address,
            state,
            lga,
            occupation,
            maritalStatus,
            children,
            email,
            dob,
            dobVisibility
        });
    
        // Optionally hide the form after submission
        toggleEditForm();
    }
    
    // Event listeners
    document.getElementById('profile-pic-upload').addEventListener('change', handleProfilePicUpload);
    document.getElementById('profile-form').addEventListener('submit', handleProfileFormSubmit);
    
