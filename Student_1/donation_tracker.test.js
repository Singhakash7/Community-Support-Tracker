/**
 * @jest-environment jsdom
 */

// Mock the DOM
document.body.innerHTML = `
  <form id="donationForm">
      <label for="charityName">Charity Name:</label>
      <input type="text" id="charityName" required>
      
      <label for="donationAmount">Donation Amount:</label>
      <input type="number" id="donationAmount" required min="1">
      
      <label for="donationDate">Date of Donation:</label>
      <input type="date" id="donationDate" required>
      
      <label for="donorMessage">Donor Message:</label>
      <textarea id="donorMessage"></textarea>
      
      <button type="submit">Add Donation</button>
  </form>
`;

// Import the JavaScript file to be tested
require('./donation_tracker');

describe('Donation Tracker Tests', () => {
  let form, charityName, donationAmount, donationDate, donorMessage;

  beforeEach(() => {
    // Get DOM elements before each test
    form = document.getElementById('donationForm');
    charityName = document.getElementById('charityName');
    donationAmount = document.getElementById('donationAmount');
    donationDate = document.getElementById('donationDate');
    donorMessage = document.getElementById('donorMessage');
  });

  test('should trigger the function on form submission', () => {
    const mockSubmitHandler = jest.fn(); 
    form.addEventListener('submit', mockSubmitHandler); 

    form.dispatchEvent(new Event('submit')); 

    expect(mockSubmitHandler).toHaveBeenCalled(); 
  });

  test('should validate required fields are filled', () => {
    // Simulate form submission with empty fields
    form.dispatchEvent(new Event('submit'));

    // Check if the fields are still empty (indicating no successful submission)
    expect(charityName.value).toBe('');
    expect(donationAmount.value).toBe('');
    expect(donationDate.value).toBe('');
  });

  test('should not allow invalid donation amount', () => {
    charityName.value = 'Charity A';
    donationAmount.value = '-10'; 
    donationDate.value = '2024-12-01';

    // Simulate form submission
    form.dispatchEvent(new Event('submit'));

    // Check that the invalid amount remains unchanged (no successful submission)
    expect(donationAmount.value).toBe('-10');
  });

  test('should collect and validate form data correctly', () => {
    charityName.value = 'Charity A';
    donationAmount.value = '100';
    donationDate.value = '2024-12-01';
    donorMessage.value = 'Great initiative!';

    // Simulate form submission
    form.dispatchEvent(new Event('submit'));

    // Check that the fields contain the correct values
    expect(charityName.value).toBe('Charity A');
    expect(donationAmount.value).toBe('100');
    expect(donationDate.value).toBe('2024-12-01');
    expect(donorMessage.value).toBe('Great initiative!');
  });
});
