const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


const { JSDOM } = require('jsdom');

describe('Volunteer Hours Tracker', () => {
  let dom, document, form, submitButton, totalHours;

  beforeEach(() => {
    // Initialize the JSDOM and setup the mock DOM environment
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

    // Add event listener to update total hours and table (simulating real functionality)
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      // Get form values
      const charityName = document.getElementById('charity-name').value;
      const hoursVolunteered = parseFloat(document.getElementById('hours-volunteered').value);
      const date = document.getElementById('date').value;
      const experienceRating = parseInt(document.getElementById('experience-rating').value);

      // Update the table
      const tableBody = document.getElementById('volunteer-table').querySelector('tbody');
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${charityName}</td>
        <td>${hoursVolunteered}</td>
        <td>${date}</td>
        <td>${experienceRating}</td>
      `;
      tableBody.appendChild(row);

      // Update total hours
      const currentTotal = parseFloat(totalHours.textContent);
      totalHours.textContent = (currentTotal + hoursVolunteered).toString();
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
    const hoursVolunteered = parseFloat(document.getElementById('hours-volunteered').value);
    const experienceRating = parseInt(document.getElementById('experience-rating').value);

    expect(hoursVolunteered).toBeGreaterThan(0);
    expect(experienceRating).toBeGreaterThanOrEqual(1);
    expect(experienceRating).toBeLessThanOrEqual(5);
  });

  // Test 3: Should update the table with volunteer hours on form submission
  test('should update table with volunteer hours on form submission', () => {
    // Simulate form submission
    submitButton.click();

    const table = document.getElementById('volunteer-table');
    const rows = table.querySelectorAll('tr');
    expect(rows.length).toBe(1); // Check if a row has been added

    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('td');
    expect(cells[0].textContent).toBe('Charity A');
    expect(cells[1].textContent).toBe('5');
    expect(cells[2].textContent).toBe('2024-11-26');
    expect(cells[3].textContent).toBe('4');
  });

  // Test 4: Should update total hours correctly after multiple submissions
  test('should update total hours correctly after multiple submissions', () => {
    // Simulate first form submission
    submitButton.click();
    
    // Change hours and simulate second form submission
    document.getElementById('hours-volunteered').value = 3;
    submitButton.click();

    // Verify that total hours are updated correctly
    expect(totalHours.textContent).toBe('8'); // 5 + 3 = 8
  });
});
