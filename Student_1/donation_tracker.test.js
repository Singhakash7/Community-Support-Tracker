// Mock the DOM
document.body.innerHTML = `
  <form id="donationForm">
    <input type="text" id="charityName" />
    <input type="number" id="donationAmount" />
    <input type="date" id="donationDate" />
    <textarea id="donorMessage"></textarea>
    <button type="submit">Add Donation</button>
  </form>
`;

const handleDonationFormSubmission = require('./donation_tracker');

describe('Donation Tracker Tests', () => {
  let form, charityName, donationAmount, donationDate, donorMessage;

  beforeEach(() => {
    form = document.getElementById('donationForm');
    charityName = document.getElementById('charityName');
    donationAmount = document.getElementById('donationAmount');
    donationDate = document.getElementById('donationDate');
    donorMessage = document.getElementById('donorMessage');
  });

  test('function is triggered on form submission', () => {
    const submitSpy = jest.spyOn(form, 'addEventListener');
    form.addEventListener('submit', handleDonationFormSubmission);
    expect(submitSpy).toHaveBeenCalledWith('submit', expect.any(Function));
  });

  test('validates required fields', () => {
    // Simulate empty fields and form submission
    form.dispatchEvent(new Event('submit'));
    // Expect some indication of error in the DOM
    const errorMessage = document.querySelector('#error-message');
    expect(errorMessage.textContent).toBe('Please fill in all required fields correctly.');
  });

  test('validates donation amount', () => {
    // Set invalid donation amount
    charityName.value = 'Test Charity';
    donationAmount.value = '-10'; // Invalid amount
    donationDate.value = '2024-12-01';

    form.dispatchEvent(new Event('submit'));
    const errorMessage = document.querySelector('#error-message');
    expect(errorMessage.textContent).toBe('Please fill in all required fields correctly.');
  });

  test('correctly collects form data', () => {
    // Fill in valid data
    charityName.value = 'Test Charity';
    donationAmount.value = '100';
    donationDate.value = '2024-12-01';
    donorMessage.value = 'Great cause!';

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    form.dispatchEvent(new Event('submit'));

    expect(consoleSpy).toHaveBeenCalledWith('Donation Data:', {
      charityName: 'Test Charity',
      donationAmount: 100,
      donationDate: '2024-12-01',
      donorMessage: 'Great cause!',
    });

    consoleSpy.mockRestore();
  });

  test('temporary data object is correctly populated', () => {
    // Fill in valid data
    charityName.value = 'Test Charity';
    donationAmount.value = '100';
    donationDate.value = '2024-12-01';
    donorMessage.value = 'Great cause!';

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    form.dispatchEvent(new Event('submit'));

    expect(consoleSpy).toHaveBeenCalledWith('Donation Data:', {
      charityName: 'Test Charity',
      donationAmount: 100,
      donationDate: '2024-12-01',
      donorMessage: 'Great cause!',
    });

    consoleSpy.mockRestore();
  });
});
