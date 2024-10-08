function toggleEditForm() {
    const editForm = document.getElementById('edit-form');
    if (editForm.style.display === 'none') {
        editForm.style.display = 'block'; // Show the form
    } else {
        editForm.style.display = 'none'; // Hide the form
    }
}
