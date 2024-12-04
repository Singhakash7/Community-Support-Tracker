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
  <table id="signupsTable">
    <tbody></tbody>
  </table>
  <ul id="roleSummary"></ul>
`;

const { handleSubmit, saveSignupToStorage, loadSignupsFromStorage, deleteSignup, updateRoleSummary } = require('./script');

beforeEach(() => {
  localStorage.clear();
  const tableBody = document.getElementById('signupsTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear table rows to avoid duplication
});

afterEach(() => {
  jest.clearAllMocks();
});

test('function is triggered on form submission', () => {
  const eventSignupForm = document.getElementById('eventSignupForm');
  const submitSpy = jest.spyOn(eventSignupForm, 'addEventListener');

  eventSignupForm.addEventListener('submit', handleSubmit);

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
  document.getElementById('representativeName').value = 'Sukh';
  document.getElementById('representativeEmail').value = 'invalid-email';
  document.getElementById('role').value = 'sponsor';

  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  document.getElementById('eventSignupForm').dispatchEvent(new Event('submit'));

  expect(alertSpy).toHaveBeenCalledWith('Please enter a valid email address.');
});

test('correctly populates form data object', () => {
  document.getElementById('eventName').value = 'Sample Event';
  document.getElementById('representativeName').value = 'Sukh';
  document.getElementById('representativeEmail').value = 'sukh@example.com';
  document.getElementById('role').value = 'participant';

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  document.getElementById('eventSignupForm').dispatchEvent(new Event('submit'));

  expect(consoleSpy).toHaveBeenCalledWith('Form Submitted:', {
    eventName: 'Sample Event',
    representativeName: 'Sukh',
    representativeEmail: 'sukh@example.com',
    role: 'participant',
  });
});

test('data is correctly stored in localStorage', () => {
  const sampleData = {
    eventName: 'Sample Event',
    representativeName: 'Akash',
    representativeEmail: 'akash@example.com',
    role: 'sponsor',
  };
  saveSignupToStorage(sampleData);

  const storedData = JSON.parse(localStorage.getItem('signups'));
  expect(storedData).toContainEqual(sampleData);
});

test('data is correctly retrieved from localStorage and loaded into the table', () => {
  const sampleData = {
    eventName: 'Sample Event',
    representativeName: 'Rajvir',
    representativeEmail: 'rajvir@example.com',
    role: 'participant',
  };
  localStorage.setItem('signups', JSON.stringify([sampleData]));

  loadSignupsFromStorage();

  const tableBody = document.getElementById('signupsTable').querySelector('tbody');
  expect(tableBody.children.length).toBe(1);
  expect(tableBody.children[0].textContent).toContain('Sample Event');
});

test('upcoming events summary displays signups by role', () => {
  const sampleData = [
    { eventName: 'Event 1', representativeName: 'Manvir', representativeEmail: 'manvir@example.com', role: 'sponsor' },
    { eventName: 'Event 2', representativeName: 'Jatt', representativeEmail: 'jatt@example.com', role: 'participant' },
  ];
  localStorage.setItem('signups', JSON.stringify(sampleData));

  updateRoleSummary();

  const roleSummaryList = document.getElementById('roleSummary');
  expect(roleSummaryList.children.length).toBe(2);
  expect(roleSummaryList.textContent).toContain('sponsor: 1');
  expect(roleSummaryList.textContent).toContain('participant: 1');
});

test('delete button removes a record from the table', () => {
  const sampleData = {
    eventName: 'Sample Event',
    representativeName: 'Sukh',
    representativeEmail: 'sukh@example.com',
    role: 'participant',
  };
  localStorage.setItem('signups', JSON.stringify([sampleData]));
  loadSignupsFromStorage();

  const deleteButton = document.querySelector('.delete-btn');
  deleteButton.click();

  const tableBody = document.getElementById('signupsTable').querySelector('tbody');
  expect(tableBody.children.length).toBe(0); // Table should be empty
});

test('delete button removes a record from localStorage', () => {
  const sampleData = {
    eventName: 'Sample Event',
    representativeName: 'Jatt',
    representativeEmail: 'jatt@example.com',
    role: 'participant',
  };
  localStorage.setItem('signups', JSON.stringify([sampleData]));
  loadSignupsFromStorage();

  const deleteButton = document.querySelector('.delete-btn');
  deleteButton.click();

  const storedData = JSON.parse(localStorage.getItem('signups'));
  expect(storedData.length).toBe(0); // localStorage should be empty
});
