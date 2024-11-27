console.log("Shared JavaScript file loaded successfully.");
// shared.js

// Load shared components dynamically
function loadSharedComponents() {
    const headerHtml = `
        <header>
            <h1>Community Support Tracker</h1>
        </header>
    `;

    const navbarHtml = `
        <nav>
            <ul>
                <li><a href="../Student_1/donation_tracker.html">Donation Tracker</a></li>
                <li><a href="../Student_2/volunteer_tracker.html">Volunteer Tracker</a></li>
                <li><a href="../Student_3/event_signup.html">Event Signup</a></li>
            </ul>
        </nav>
    `;

    const footerHtml = `
        <footer>
            <p>&copy; 2024 Community Support Tracker</p>
        </footer>
    `;

    // Inject components into the appropriate containers
    document.getElementById('header').innerHTML = headerHtml;
    document.getElementById('navbar').innerHTML = navbarHtml;
    document.getElementById('footer').innerHTML = footerHtml;
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSharedComponents);
