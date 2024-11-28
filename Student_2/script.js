// Volunteer Hours Tracker JavaScript
const { JSDOM } = require('jsdom');
const { TextEncoder, TextDecoder } = require('util');   // Already imported

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("volunteer-form");
    const charityNameInput = document.getElementById("charity-name");
    const hoursVolunteeredInput = document.getElementById("hours-volunteered");
    const dateInput = document.getElementById("date");
    const experienceRatingInput = document.getElementById("experience-rating");
    const volunteerTable = document.getElementById("volunteer-table");
    const totalHoursSpan = document.getElementById("total-hours");

    let totalHours = 0;

    // Function to add a row to the volunteer table
    function addTableRow(charityName, hoursVolunteered, date, experienceRating) {
        const row = document.createElement("tr");

        const charityCell = document.createElement("td");
        charityCell.textContent = charityName;
        row.appendChild(charityCell);

        const hoursCell = document.createElement("td");
        hoursCell.textContent = hoursVolunteered;
        row.appendChild(hoursCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = date;
        row.appendChild(dateCell);

        const experienceCell = document.createElement("td");
        experienceCell.textContent = experienceRating;
        row.appendChild(experienceCell);

        volunteerTable.querySelector("tbody").appendChild(row);
    }

    // Function to update the total volunteer hours
    function updateTotalHours(hours) {
        totalHours += hours;
        totalHoursSpan.textContent = totalHours;
    }

    // Function to validate input data
    function validateInputs(hoursVolunteered, experienceRating) {
        if (hoursVolunteered <= 0) {
            alert("Please enter a valid number of hours volunteered.");
            return false;
        }

        if (experienceRating < 1 || experienceRating > 5) {
            alert("Experience rating must be between 1 and 5.");
            return false;
        }

        return true;
    }

    // Event listener for form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const charityName = charityNameInput.value.trim();
        const hoursVolunteered = parseFloat(hoursVolunteeredInput.value.trim());
        const date = dateInput.value.trim();
        const experienceRating = parseInt(experienceRatingInput.value.trim(), 10);

        if (validateInputs(hoursVolunteered, experienceRating)) {
            addTableRow(charityName, hoursVolunteered, date, experienceRating);
            updateTotalHours(hoursVolunteered);

            // Clear form inputs after submission
            form.reset();
        }
    });
});
