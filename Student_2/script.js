document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("volunteer-form");
    const tableBody = document.querySelector("#volunteer-table tbody");
    const totalHoursElement = document.getElementById("total-hours");
  
    // Load existing data from localStorage
    const loadData = () => {
      const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
      logs.forEach(log => addTableRow(log));
      updateTotalHours();
    };
  
    // Save data to localStorage
    const saveData = logs => {
      localStorage.setItem("volunteerLogs", JSON.stringify(logs));
    };
  
    // Update total hours
    const updateTotalHours = () => {
      const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
      const totalHours = logs.reduce((sum, log) => sum + log.hoursVolunteered, 0);
      totalHoursElement.textContent = totalHours;
    };
  
    // Add row to the table
    const addTableRow = log => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${log.charityName}</td>
        <td>${log.hoursVolunteered}</td>
        <td>${log.date}</td>
        <td>${log.experienceRating}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      row.querySelector(".delete-btn").addEventListener("click", () => deleteLog(row, log));
      tableBody.appendChild(row);
    };
  
    // Delete log
    const deleteLog = (row, log) => {
      row.remove();
      const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
      const updatedLogs = logs.filter(l => l !== log);
      saveData(updatedLogs);
      updateTotalHours();
    };
  
    // Form submission handler
    form.addEventListener("submit", event => {
      event.preventDefault();
      const charityName = form["charity-name"].value;
      const hoursVolunteered = parseFloat(form["hours-volunteered"].value);
      const date = form["date"].value;
      const experienceRating = parseInt(form["experience-rating"].value, 10);
  
      // Validation
      if (!charityName || isNaN(hoursVolunteered) || !date || isNaN(experienceRating) || hoursVolunteered <= 0 || experienceRating < 1 || experienceRating > 5) {
        alert("Please fill out all fields correctly.");
        return;
      }
  
      const log = { charityName, hoursVolunteered, date, experienceRating };
      const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
      logs.push(log);
      saveData(logs);
      addTableRow(log);
      updateTotalHours();
  
      // Reset form
      form.reset();
    });
  
    loadData();
  });
  