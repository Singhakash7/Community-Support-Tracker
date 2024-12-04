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
            <button class="navbar-toggle">☰ Menu</button>
            <ul class="mobile-hidden">
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
    const headerElement = document.getElementById('header');
    const navbarElement = document.getElementById('navbar');
    const footerElement = document.getElementById('footer');

    if (headerElement) headerElement.innerHTML = headerHtml;
    if (navbarElement) navbarElement.innerHTML = navbarHtml;
    if (footerElement) footerElement.innerHTML = footerHtml;

    // Add toggle functionality for mobile navigation
    const toggleButton = document.querySelector('.navbar-toggle');
    const navbarList = document.querySelector('#navbar ul');

    if (toggleButton && navbarList) {
        toggleButton.addEventListener('click', () => {
            if (navbarList.classList.contains('mobile-hidden')) {
                navbarList.classList.remove('mobile-hidden');
                navbarList.classList.add('mobile-visible');
            } else {
                navbarList.classList.add('mobile-hidden');
                navbarList.classList.remove('mobile-visible');
            }
        });
    }

    // Ensure the navbar is always visible on larger screens
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    function handleMediaChange(e) {
        if (e.matches) {
            // On larger screens, ensure the navbar is visible
            if (navbarList) {
                navbarList.classList.remove('mobile-hidden');
                navbarList.classList.add('mobile-visible');
            }
        } else {
            // On smaller screens, reset to hidden state
            if (navbarList) {
                navbarList.classList.remove('mobile-visible');
                navbarList.classList.add('mobile-hidden');
            }
        }
    }

    // Set initial state and attach the listener
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaChange);
}

// Ensure shared components are loaded after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSharedComponents);
