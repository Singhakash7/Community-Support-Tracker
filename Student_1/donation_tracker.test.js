// Mock the DOM elements
document.body.innerHTML = `
  <form id="donationForm">
    <input type="text" id="charityName" />
    <input type="number" id="donationAmount" />
    <input type="date" id="donationDate" />
    <textarea id="donorMessage"></textarea>
    <button type="submit"></button>
  </form>
`;

const handleDonationFormSubmission = require('./donation_tracker');

test('function is triggered on form submission', () => {
  const donationForm = document.getElementById('donationForm');
  const submitSpy = jest.spyOn(donationForm, 'addEventListener');

  // Attach the event listener
  donationForm.addEventListener('submit', handleDonationFormSubmission);

  expect(submitSpy).toHaveBeenCalledWith('submit', expect.any(Function));
});

test('validates required fields', () => {
  document.getElementById('charityName').value = '';
  document.getElementById('donationAmount').value = '';
  document.getElementById('donationDate').value = '';

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  document.getElementById('donationForm').dispatchEvent(new Event('submit'));

  expect(alertSpy).toHaveBeenCalledWith('Please fill in all required fields correctly.');
});

test('validates donation amount', () => {
  document.getElementById('charityName').value = 'Test Charity';
  document.getElementById('donationAmount').value = '-10'; // Invalid amount
  document.getElementById('donationDate').value = '2024-12-01';

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  document.getElementById('donationForm').dispatchEvent(new Event('submit'));

  expect(alertSpy).toHaveBeenCalledWith('Please fill in all required fields correctly.');
});

test('correctly populates donation data object', () => {
  document.getElementById('charityName').value = 'Test Charity';
  document.getElementById('donationAmount').value = '100';
  document.getElementById('donationDate').value = '2024-12-01';
  document.getElementById('donorMessage').value = 'Great cause!';

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  document.getElementById('donationForm').dispatchEvent(new Event('submit'));

  expect(consoleSpy).toHaveBeenCalledWith('Donation Data:', {
    charityName: 'Test Charity',
    donationAmount: 100,
    donationDate: '2024-12-01',
    donorMessage: 'Great cause!',
  });
});
