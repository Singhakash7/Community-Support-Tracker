// Function to dynamically load shared components
function loadSharedComponents() {
    // Define the header content
    const headerHtml = `
        <header>
            <h1>Community Support Tracker</h1>
        </header>
    `;

    // Define the navigation bar content
    const navbarHtml = `
        <nav>
            <ul>
                <li><a href="../Student_1/donation_tracker.html">Donation Tracker</a></li>
                <li><a href="../Student_2/index.html">Volunteer Tracker</a></li>
                <li><a href="../Student3/index.html">Event Signup</a></li>
            </ul>
        </nav>
    `;

    // Define the footer content
    const footerHtml = `
        <footer>
            <p>&copy; 2024 Community Support Tracker. All rights reserved.</p>
        </footer>
    `;

    // Inject content into the respective elements
    document.getElementById('header').innerHTML = headerHtml;
    document.getElementById('navbar').innerHTML = navbarHtml;
    document.getElementById('footer').innerHTML = footerHtml;
}

// Ensure shared components are loaded after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSharedComponents);
