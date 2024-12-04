// Mock the DOM
document.body.innerHTML = `
  <form id="donationForm">
    <div id="errorContainer" style="color: red; margin-bottom: 10px;"></div>
    <input type="text" id="charityName" />
    <input type="number" id="donationAmount" />
    <input type="date" id="donationDate" />
    <textarea id="donorMessage"></textarea>
    <button type="submit">Add Donation</button>
  </form>
  <table id="donationTable">
    <tbody></tbody>
  </table>
  <h3>Total Donations: <span id="totalDonations">$0</span></h3>
`;

const {
    handleDonationFormSubmission,
    addDonationToTable,
    deleteDonation,
    loadDonationsFromLocalStorage,
    updateDonationSummary,
} = require('./donation_tracker');

describe('Donation Tracker Tests', () => {
    let charityName, donationAmount, donationDate, donorMessage, form, errorContainer;

    beforeEach(() => {
        // Clear form, localStorage, and DOM before each test
        document.querySelector('#donationTable tbody').innerHTML = '';
        document.getElementById('donationForm').reset();
        localStorage.clear();

        charityName = document.getElementById('charityName');
        donationAmount = document.getElementById('donationAmount');
        donationDate = document.getElementById('donationDate');
        donorMessage = document.getElementById('donorMessage');
        form = document.getElementById('donationForm');
        errorContainer = document.getElementById('errorContainer');
    });

    test('function is triggered on form submission', () => {
        const submitSpy = jest.spyOn(form, 'addEventListener');
        form.addEventListener('submit', handleDonationFormSubmission);
        expect(submitSpy).toHaveBeenCalledWith('submit', expect.any(Function));
    });

    test('validates required fields', () => {
        // Simulate form submission with empty fields
        form.dispatchEvent(new Event('submit'));

        // Verify that no donation is added to localStorage
        expect(localStorage.getItem('donations')).toBeNull();

        // Verify that the error message is displayed in the error container
        expect(errorContainer.textContent).toBe('Please fill in all required fields correctly.');
    });

    test('validates donation amount', () => {
        // Set invalid donation amount
        charityName.value = 'Test Charity';
        donationAmount.value = '-10'; // Invalid amount
        donationDate.value = '2024-12-01';

        // Simulate form submission
        form.dispatchEvent(new Event('submit'));

        // Verify that no donation is added to localStorage
        expect(localStorage.getItem('donations')).toBeNull();

        // Verify that the error message is displayed in the error container
        expect(errorContainer.textContent).toBe('Please fill in all required fields correctly.');
    });

    test('correctly collects form data', () => {
        // Fill in valid data
        charityName.value = 'Test Charity';
        donationAmount.value = '100';
        donationDate.value = '2024-12-01';
        donorMessage.value = 'Great cause!';

        // Simulate form submission
        form.dispatchEvent(new Event('submit'));

        // Verify that the donation is added to localStorage
        const storedData = JSON.parse(localStorage.getItem('donations'));
        expect(storedData).toHaveLength(1);
        expect(storedData[0]).toEqual({
            charityName: 'Test Charity',
            donationAmount: 100,
            donationDate: '2024-12-01',
            donorMessage: 'Great cause!',
        });
    });

    test('data is stored in localStorage', () => {
        const donation = {
            charityName: 'Charity A',
            donationAmount: 100,
            donationDate: '2024-12-01',
            donorMessage: 'Great cause!',
        };
        localStorage.setItem('donations', JSON.stringify([donation]));

        const storedData = JSON.parse(localStorage.getItem('donations'));
        expect(storedData).toHaveLength(1);
        expect(storedData[0]).toEqual(donation);
    });

    test('retrieves data from localStorage and populates table', () => {
        const donation = {
            charityName: 'Charity A',
            donationAmount: 100,
            donationDate: '2024-12-01',
            donorMessage: 'Great cause!',
        };
        localStorage.setItem('donations', JSON.stringify([donation]));

        loadDonationsFromLocalStorage();

        const tableRows = document.querySelectorAll('#donationTable tbody tr');
        expect(tableRows).toHaveLength(1);
        expect(tableRows[0].textContent).toContain('Charity A');
        expect(tableRows[0].textContent).toContain('$100.00');
    });

    test('updates total donations in the summary section', () => {
        const donations = [
            { charityName: 'Charity A', donationAmount: 100 },
            { charityName: 'Charity B', donationAmount: 200 },
        ];
        localStorage.setItem('donations', JSON.stringify(donations));

        updateDonationSummary();

        const totalDonations = document.getElementById('totalDonations').textContent;
        expect(totalDonations).toBe('$300.00');
    });

    test('deletes a donation record from the table and localStorage', () => {
        const donation = {
            charityName: 'Charity A',
            donationAmount: 100,
            donationDate: '2024-12-01',
            donorMessage: 'Great cause!',
        };
        localStorage.setItem('donations', JSON.stringify([donation]));
        loadDonationsFromLocalStorage();

        const deleteButton = document.querySelector('.delete-btn');
        deleteButton.click();

        const tableRows = document.querySelectorAll('#donationTable tbody tr');
        expect(tableRows).toHaveLength(0);

        const storedData = JSON.parse(localStorage.getItem('donations'));
        expect(storedData).toHaveLength(0);
    });

    test('summary updates correctly after deletion', () => {
        const donations = [
            { charityName: 'Charity A', donationAmount: 100 },
            { charityName: 'Charity B', donationAmount: 200 },
        ];
        localStorage.setItem('donations', JSON.stringify(donations));
        loadDonationsFromLocalStorage();

        const deleteButton = document.querySelector('.delete-btn');
        deleteButton.click();

        updateDonationSummary();

        const totalDonations = document.getElementById('totalDonations').textContent;
        expect(totalDonations).toBe('$200.00');
    });
});
