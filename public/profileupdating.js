
        document.getElementById('profile-form').addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission

            const userId = 'YOUR_USER_ID'; // Replace with the actual user ID (you can fetch it from the session or a global variable)
            const name = document.getElementById('name').value;
            const sex = document.getElementById('sex').value;
            const occupation = document.getElementById('occupation').value;
            const maritalStatus = document.getElementById('marital-status').value;
            const numberOfChildren = document.getElementById('children').value;
            const address = document.getElementById('address').value;
            const state = document.getElementById('state').value;
            const email = document.getElementById('email').value;
            const dob = document.getElementById('dob-input').value;
            const isDobPublic = document.getElementById('toggle-dob-visibility').checked;

            const response = await fetch('/api/users/profile-update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    name,
                    sex,
                    occupation,
                    marital_status: maritalStatus,
                    number_of_children: numberOfChildren,
                    address,
                    state_of_residence: state,
                    email,
                    date_of_birth: dob,
                    is_dob_public: isDobPublic,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Show success message
                document.getElementById('successMessage').style.display = 'block';
            } else {
                // Handle error
                alert(result.error || 'Failed to update profile.');
            }
        });
  

