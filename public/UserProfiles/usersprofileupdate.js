async function fetchUserProfile(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const userData = await response.json();

        if (response.ok) {
            // Populate user data on the dashboard
            document.getElementById('fullnameDisplay').innerText = userData.fullname;
            document.getElementById('emailDisplay').innerText = userData.email;
            document.getElementById('communityDisplay').innerText = userData.community;
            document.getElementById('clanDisplay').innerText = userData.clan;
            document.getElementById('familynameDisplay').innerText = userData.familyname;
        } else {
            console.error(userData.error);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}
