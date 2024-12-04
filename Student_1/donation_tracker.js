function handleDonationFormSubmission(event) {
    event.preventDefault();

    // Collect form values
    const charityName = document.getElementById('charityName').value.trim();
    const donationAmount = parseFloat(document.getElementById('donationAmount').value);
    const donationDate = document.getElementById('donationDate').value;
    const donorMessage = document.getElementById('donorMessage').value.trim();

    // Error message element (for feedback instead of alerts)
    const errorMessage = document.createElement('p');
    errorMessage.id = 'error-message';
    errorMessage.style.color = 'red';

    // Clear any previous error message
    const existingErrorMessage = document.getElementById('error-message');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

    // Validate inputs
    if (!charityName || isNaN(donationAmount) || donationAmount <= 0 || !donationDate) {
        errorMessage.textContent = 'Please fill in all required fields correctly.';
        document.getElementById('donationForm').appendChild(errorMessage);
        return;
    }

    // Create a temporary data object
    const donationData = {
        charityName,
        donationAmount,
        donationDate,
        donorMessage,
    };

    // Log the temporary data object (replaceable with backend submission in the future)
    console.log('Donation Data:', donationData);

    // Success message
    const successMessage = document.createElement('p');
    successMessage.id = 'success-message';
    successMessage.style.color = 'green';
    successMessage.textContent = 'Donation successfully added!';

    // Clear any previous success message
    const existingSuccessMessage = document.getElementById('success-message');
    if (existingSuccessMessage) {
        existingSuccessMessage.remove();
    }

    document.getElementById('donationForm').appendChild(successMessage);

    // Reset form fields
    document.getElementById('donationForm').reset();
}

// Attach the function to the form submission event
document.getElementById('donationForm').addEventListener('submit', handleDonationFormSubmission);

// Export the function for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = handleDonationFormSubmission;
}
