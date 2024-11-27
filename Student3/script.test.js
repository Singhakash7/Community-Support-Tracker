// Mock the DOM elements
document.body.innerHTML = `
  <form id="eventSignupForm">
    <input type="text" id="eventName" />
    <input type="text" id="representativeName" />
    <input type="email" id="representativeEmail" />
    <select id="role">
      <option value="" disabled selected>Select a role</option>
      <option value="sponsor">Sponsor</option>
      <option value="participant">Participant</option>
      <option value="organizer">Organizer</option>
    </select>
    <button type="submit"></button>
  </form>
`;

const handleSubmit = require('./script');

test('function is triggered on form submission', () => {
  const eventSignupForm = document.getElementById('eventSignupForm');
  const submitSpy = jest.spyOn(eventSignupForm, 'addEventListener');
  
  handleSubmit(); // Call the event listener setup
  expect(submitSpy).toHaveBeenCalledWith('submit', expect.any(Function));
});

test('validates required fields', () => {
  document.getElementById('eventName').value = '';
  document.getElementById('representativeName').value = '';
  document.getElementById('representativeEmail').value = '';
  document.getElementById('role').value = '';

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  document.getElementById('eventSignupForm').dispatchEvent(new Event('submit'));
  
  expect(alertSpy).toHaveBeenCalledWith('All fields are required.');
});

test('validates email format', () => {
  document.getElementById('eventName').value = 'Sample Event';
  document.getElementById('representativeName').value = 'John Doe';
  document.getElementById('representativeEmail').value = 'invalid-email';
  document.getElementById('role').value = 'sponsor';

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  document.getElementById('eventSignupForm').dispatchEvent(new Event('submit'));
  
  expect(alertSpy).toHaveBeenCalledWith('Please enter a valid email address.');
});

test('correctly populates form data object', () => {
  document.getElementById('eventName').value = 'Sample Event';
  document.getElementById('representativeName').value = 'John Doe';
  document.getElementById('representativeEmail').value = 'john.doe@example.com';
  document.getElementById('role').value = 'participant';

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  document.getElementById('eventSignupForm').dispatchEvent(new Event('submit'));

  expect(consoleSpy).toHaveBeenCalledWith('Form Submitted:', {
    eventName: 'Sample Event',
    representativeName: 'John Doe',
    representativeEmail: 'john.doe@example.com',
    role: 'participant',
  });
});
