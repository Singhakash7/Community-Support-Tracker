function handleDonationFormSubmission(event) {
    event.preventDefault(); 

    // Collect form values
    const charityName = document.getElementById('charityName').value.trim();
    const donationAmount = parseFloat(document.getElementById('donationAmount').value);
    const donationDate = document.getElementById('donationDate').value;
    const donorMessage = document.getElementById('donorMessage').value.trim();

    // Validate inputs
    if (!charityName || isNaN(donationAmount) || donationAmount <= 0 || !donationDate) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    // Create a temporary data object
    const donationData = {
        charityName,
        donationAmount,
        donationDate,
        donorMessage,
    };

    // Log the temporary data object
    console.log('Donation Data:', donationData);
    alert('Donation successfully added!');
}

// Attach the function to the form submission event
document.getElementById('donationForm').addEventListener('submit', handleDonationFormSubmission);

// Export the function for testing
module.exports = handleDonationFormSubmission;
