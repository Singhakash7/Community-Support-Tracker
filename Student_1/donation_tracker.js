document.getElementById('donationForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const charityName = document.getElementById('charityName').value.trim();
    const donationAmount = parseFloat(document.getElementById('donationAmount').value);
    const donationDate = document.getElementById('donationDate').value;
    const donorMessage = document.getElementById('donorMessage').value.trim();

    if (!charityName || isNaN(donationAmount) || donationAmount <= 0 || !donationDate) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    const donationData = {
        charityName,
        donationAmount,
        donationDate,
        donorMessage,
    };
    console.log('Donation Data:', donationData);
    alert('Donation successfully added!');
});