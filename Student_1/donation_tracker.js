function handleDonationFormSubmission(event) {
    event.preventDefault();

    // Collect form values
    const charityName = document.getElementById('charityName').value.trim();
    const donationAmount = parseFloat(document.getElementById('donationAmount').value);
    const donationDate = document.getElementById('donationDate').value;
    const donorMessage = document.getElementById('donorMessage').value.trim();

    // Validate inputs
    if (!charityName || isNaN(donationAmount) || donationAmount <= 0 || !donationDate) {
        errorContainer.textContent = 'Please fill in all required fields correctly.';
        return;
    }

    // Create a donation object
    const donation = {
        charityName,
        donationAmount,
        donationDate,
        donorMessage,
    };

    // Save to localStorage
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.push(donation);
    localStorage.setItem('donations', JSON.stringify(donations));

    // Add donation to the table
    addDonationToTable(donation);

    // Update summary
    updateDonationSummary();

    // Reset form fields
    document.getElementById('donationForm').reset();
}

function addDonationToTable(donation) {
    const tableBody = document.querySelector('#donationTable tbody');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${donation.charityName}</td>
        <td>$${donation.donationAmount.toFixed(2)}</td>
        <td>${donation.donationDate}</td>
        <td>${donation.donorMessage}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    // Add delete functionality
    row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteDonation(donation, row);
    });

    tableBody.appendChild(row);
}

function deleteDonation(donation, row) {
    // Update localStorage
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    const updatedDonations = donations.filter(
        (d) =>
            d.charityName !== donation.charityName ||
            d.donationAmount !== donation.donationAmount ||
            d.donationDate !== donation.donationDate
    );
    localStorage.setItem('donations', JSON.stringify(updatedDonations));

    // Remove from table
    row.remove();

    // Update summary
    updateDonationSummary();
}

function loadDonationsFromLocalStorage() {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    const tableBody = document.querySelector('#donationTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    donations.forEach((donation) => {
        addDonationToTable(donation);
    });
}

function updateDonationSummary() {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    const totalAmount = donations.reduce((sum, donation) => sum + donation.donationAmount, 0);
    document.getElementById('totalDonations').textContent = `$${totalAmount.toFixed(2)}`;
}

// Attach the form submission handler
document.getElementById('donationForm').addEventListener('submit', handleDonationFormSubmission);

// Load donations on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDonationsFromLocalStorage();
    updateDonationSummary();
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleDonationFormSubmission,
        addDonationToTable,
        deleteDonation,
        loadDonationsFromLocalStorage,
        updateDonationSummary,
    };
}
