// JavaScript for handling form submission and validation
function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
  
    // Collect form data
    const eventName = document.getElementById('eventName').value.trim();
    const representativeName = document.getElementById('representativeName').value.trim();
    const representativeEmail = document.getElementById('representativeEmail').value.trim();
    const role = document.getElementById('role').value;
  
    // Validation
    if (!eventName || !representativeName || !representativeEmail || !role) {
      alert('All fields are required.');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(representativeEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    // Temporary data object
    const formData = {
      eventName,
      representativeName,
      representativeEmail,
      role,
    };
  
    console.log('Form Submitted:', formData);
    alert('Signup Successful!');
  }
  
  // Attach the event listener in the browser environment
  if (typeof document !== 'undefined') {
    const form = document.getElementById('eventSignupForm');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
  }
  
  // Export the function for testing purposes
  module.exports = handleSubmit;
  