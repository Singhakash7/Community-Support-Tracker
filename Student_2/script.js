document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("volunteer-form");
    const charityNameInput = document.getElementById("charity-name");
    const hoursVolunteeredInput = document.getElementById("hours-volunteered");
    const dateInput = document.getElementById("date");
    const experienceRatingInput = document.getElementById("experience-rating");
    const volunteerTable = document.getElementById("volunteer-table");
    const totalHoursSpan = document.getElementById("total-hours");

    let totalHours = 0;

    // Retrieve saved data from localStorage
    function loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem("volunteerData")) || [];
        totalHours = parseFloat(localStorage.getItem("totalHours")) || 0;

        savedData.forEach(({ charityName, hoursVolunteered, date, experienceRating }) => {
            addTableRow(charityName, hoursVolunteered, date, experienceRating);
        });

        updateTotalHoursDisplay();
    }

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

        // Add a delete button
        const actionsCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteRow(row, hoursVolunteered);
        });
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        volunteerTable.querySelector("tbody").appendChild(row);
    }

    // Function to update the total volunteer hours
    function updateTotalHours(hours) {
        totalHours += hours;
        updateTotalHoursDisplay();
        saveData();
    }

    function updateTotalHoursDisplay() {
        totalHoursSpan.textContent = `Total Hours Volunteered: ${totalHours}`;
    }

    // Function to delete a row
    function deleteRow(row, hours) {
        row.remove();
        totalHours -= hours;
        updateTotalHoursDisplay();
        saveData();
    }

    // Function to save data to localStorage
    function saveData() {
        const rows = volunteerTable.querySelectorAll("tbody tr");
        const data = Array.from(rows).map(row => {
            const cells = row.querySelectorAll("td");
            return {
                charityName: cells[0].textContent,
                hoursVolunteered: parseFloat(cells[1].textContent),
                date: cells[2].textContent,
                experienceRating: parseInt(cells[3].textContent, 10)
            };
        });

        localStorage.setItem("volunteerData", JSON.stringify(data));
        localStorage.setItem("totalHours", totalHours.toString());
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

    // Load data on page load
    loadSavedData();
});
