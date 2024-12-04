const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

describe('Volunteer Hours Tracker', () => {
  let dom, document, form, submitButton, totalHours;

  beforeEach(() => {
    // Initialize the JSDOM and mock DOM environment
    dom = new JSDOM(`
      <form id="volunteer-form">
        <input id="charity-name" value="Charity A" />
        <input id="hours-volunteered" value="5" />
        <input id="date" value="2024-11-26" />
        <input id="experience-rating" value="4" />
        <button type="submit">Log Volunteer Hours</button>
      </form>
      <table id="volunteer-table">
        <tbody></tbody>
      </table>
      <span id="total-hours">0</span>
    `);

    // Set up the document and form elements
    document = dom.window.document;
    form = document.getElementById('volunteer-form');
    submitButton = document.querySelector('button[type="submit"]');
    totalHours = document.getElementById('total-hours');

    // Add event listener to update total hours and table (simulate functionality)
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Get form values
      const charityName = document.getElementById('charity-name').value;
      const hoursVolunteered = parseFloat(document.getElementById('hours-volunteered').value);
      const date = document.getElementById('date').value;
      const experienceRating = parseInt(document.getElementById('experience-rating').value);

      // Validate inputs
      if (!charityName || !hoursVolunteered || !date || isNaN(experienceRating) || experienceRating < 1 || experienceRating > 5 || hoursVolunteered <= 0) {
        return;
      }

      // Update the table
      const tableBody = document.getElementById('volunteer-table').querySelector('tbody');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${charityName}</td>
        <td>${hoursVolunteered}</td>
        <td>${date}</td>
        <td>${experienceRating}</td>
        <td><button class="delete">Delete</button></td>
      `;
      tableBody.appendChild(row);

      // Update total hours
      const currentTotal = parseFloat(totalHours.textContent);
      totalHours.textContent = (currentTotal + hoursVolunteered).toString();

      // Add delete functionality
      row.querySelector('.delete').addEventListener('click', () => {
        const hours = parseFloat(row.querySelectorAll('td')[1].textContent);
        row.remove();
        totalHours.textContent = (parseFloat(totalHours.textContent) - hours).toString();
      });
    });
  });

  // Test 1: Should collect form data correctly
  test('should collect form data correctly', () => {
    const charityName = document.getElementById('charity-name').value;
    const hoursVolunteered = parseFloat(document.getElementById('hours-volunteered').value);
    const date = document.getElementById('date').value;
    const experienceRating = parseInt(document.getElementById('experience-rating').value);

    expect(charityName).toBe('Charity A');
    expect(hoursVolunteered).toBe(5);
    expect(date).toBe('2024-11-26');
    expect(experienceRating).toBe(4);
  });

  // Test 2: Should validate inputs correctly
  test('should validate inputs correctly', () => {
    // Simulate invalid inputs
    document.getElementById('hours-volunteered').value = '-5';
    document.getElementById('experience-rating').value = '6';

    form.dispatchEvent(new dom.window.Event('submit'));

    const rows = document.querySelectorAll('#volunteer-table tbody tr');
    expect(rows.length).toBe(0); // No row should be added due to invalid input
  });

  // Test 3: Should update table with volunteer hours on form submission
  test('should update table with volunteer hours on form submission', () => {
    // Simulate form submission
    form.dispatchEvent(new dom.window.Event('submit'));

    const rows = document.querySelectorAll('#volunteer-table tbody tr');
    expect(rows.length).toBe(1); // Check if a row has been added

    const cells = rows[0].querySelectorAll('td');
    expect(cells[0].textContent).toBe('Charity A');
    expect(cells[1].textContent).toBe('5');
    expect(cells[2].textContent).toBe('2024-11-26');
    expect(cells[3].textContent).toBe('4');
  });

  // Test 4: Should update total hours correctly after multiple submissions
  test('should update total hours correctly after multiple submissions', () => {
    // Simulate first form submission
    form.dispatchEvent(new dom.window.Event('submit'));

    // Change hours and simulate second form submission
    document.getElementById('hours-volunteered').value = 3;
    form.dispatchEvent(new dom.window.Event('submit'));

    // Verify that total hours are updated correctly
    expect(totalHours.textContent).toBe('8'); // 5 + 3 = 8
  });

  // Test 5: Should handle deletion of table row and update total
  test('should handle deletion of table row and update total', () => {
    // Simulate form submission to add a row
    form.dispatchEvent(new dom.window.Event('submit'));

    const tableRow = document.querySelector('#volunteer-table tbody tr');
    const deleteButton = tableRow.querySelector('.delete');

    // Simulate deletion
    deleteButton.click();

    expect(document.querySelectorAll('#volunteer-table tbody tr').length).toBe(0);
    expect(parseFloat(totalHours.textContent)).toBe(0);
  });

  // Test 6: Should handle missing required fields
  test('should flag missing required fields', () => {
    // Remove charity name and hours volunteered
    document.getElementById('charity-name').value = '';
    document.getElementById('hours-volunteered').value = '';

    form.dispatchEvent(new dom.window.Event('submit'));

    const rows = document.querySelectorAll('#volunteer-table tbody tr');
    expect(rows.length).toBe(0); // No row should be added due to missing required fields
  });

  // Test 7: Should flag invalid hours volunteered (negative or non-numeric)
  test('should flag invalid hours volunteered', () => {
    document.getElementById('hours-volunteered').value = '-3';

    form.dispatchEvent(new dom.window.Event('submit'));

    const rows = document.querySelectorAll('#volunteer-table tbody tr');
    expect(rows.length).toBe(0); // No row should be added due to invalid hours
  });

  // Test 8: Should flag invalid experience rating (not between 1-5)
  test('should flag invalid experience rating', () => {
    document.getElementById('experience-rating').value = '6';

    form.dispatchEvent(new dom.window.Event('submit'));

    const rows = document.querySelectorAll('#volunteer-table tbody tr');
    expect(rows.length).toBe(0); // No row should be added due to invalid experience rating
  });

  

  // Test 9: Should load data from localStorage into the table
  test('should load data from localStorage into the table', () => {
    localStorage.setItem('volunteerData', JSON.stringify([{
      charityName: 'Charity A',
      hoursVolunteered: 5,
      date: '2024-11-26',
      experienceRating: 4
    }]));

    // Load data back into the table (simulate page load)
    const volunteerData = JSON.parse(localStorage.getItem('volunteerData'));
    const tableBody = document.getElementById('volunteer-table').querySelector('tbody');
    volunteerData.forEach(data => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${data.charityName}</td>
        <td>${data.hoursVolunteered}</td>
        <td>${data.date}</td>
        <td>${data.experienceRating}</td>
      `;
      tableBody.appendChild(row);
    });

    const rows = document.querySelectorAll('#volunteer-table tbody tr');
    expect(rows.length).toBe(1); // Check if the data from localStorage is added
  });
});
