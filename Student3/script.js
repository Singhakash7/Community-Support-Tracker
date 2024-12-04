function handleSubmit(event) {
  if (event) event.preventDefault();

  const eventName = document.getElementById('eventName').value.trim();
  const representativeName = document.getElementById('representativeName').value.trim();
  const representativeEmail = document.getElementById('representativeEmail').value.trim();
  const role = document.getElementById('role').value;

  if (!eventName || !representativeName || !representativeEmail || !role) {
    alert('All fields are required.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(representativeEmail)) {
    alert('Please enter a valid email address.');
    return;
  }

  const formData = {
    eventName,
    representativeName,
    representativeEmail,
    role,
  };

  console.log('Form Submitted:', formData); // Logging form submission

  saveSignupToStorage(formData);
  addSignupToTable(formData);
  updateRoleSummary();
  alert('Signup Successful!');
  document.getElementById('eventSignupForm').reset();
}

function saveSignupToStorage(formData) {
  const signups = JSON.parse(localStorage.getItem('signups')) || [];
  signups.push(formData);
  localStorage.setItem('signups', JSON.stringify(signups));
}

function loadSignupsFromStorage() {
  const tableBody = document.getElementById('signupsTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Clear existing rows to avoid duplication

  const signups = JSON.parse(localStorage.getItem('signups')) || [];
  signups.forEach(addSignupToTable);
  updateRoleSummary();
}

function addSignupToTable({ eventName, representativeName, representativeEmail, role }) {
  const tableBody = document.getElementById('signupsTable').querySelector('tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
      <td>${eventName}</td>
      <td>${representativeName}</td>
      <td>${representativeEmail}</td>
      <td>${role}</td>
      <td><button class="delete-btn" data-email="${representativeEmail}">Delete</button></td>
  `;

  tableBody.appendChild(row);

  // Attach delete event listener
  const deleteButton = row.querySelector('.delete-btn');
  deleteButton.addEventListener('click', () => deleteSignup(deleteButton, representativeEmail));
}

function deleteSignup(button, email) {
  const row = button.closest('tr'); // Use closest to ensure the correct row is targeted
  if (row) row.remove(); // Remove the row from the table

  const signups = JSON.parse(localStorage.getItem('signups')) || [];
  const updatedSignups = signups.filter((signup) => signup.representativeEmail !== email);
  localStorage.setItem('signups', JSON.stringify(updatedSignups)); // Update localStorage

  updateRoleSummary(); // Ensure the summary is updated
}

function updateRoleSummary() {
  const signups = JSON.parse(localStorage.getItem('signups')) || [];
  const roleCount = signups.reduce((summary, { role }) => {
    summary[role] = (summary[role] || 0) + 1;
    return summary;
  }, {});

  const roleSummaryList = document.getElementById('roleSummary');
  roleSummaryList.innerHTML = ''; // Clear existing summary

  for (const [role, count] of Object.entries(roleCount)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${role}: ${count}`;
    roleSummaryList.appendChild(listItem);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eventSignupForm');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
    loadSignupsFromStorage();
  });
}

module.exports = { handleSubmit, saveSignupToStorage, loadSignupsFromStorage, deleteSignup, updateRoleSummary };
