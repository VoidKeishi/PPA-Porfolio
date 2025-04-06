// Function to toggle the mobile menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// ASCII Art Logo for terminal
const asciiLogo = "     _________     \n" +
"    / ======= \\   \n" +
"   / __________\\  \n" +
"  | ___________ | \n" +
"  | |         | | \n" +
"  | |   404   | | \n" +
"  | |_________| |_____________________\n" +
"  \\=____________/      keishi         )\n" +
"  / \"\"\"\"\"\"\"\"\"\"\" \\                    /\n" +
" / ::::::::::::: \\               =D-'\n" +
"(_________________)\n";

// Function to initialize the homepage terminal
function initTerminal() {
  // Set ASCII logo
  const logoElement = document.getElementById('ascii-logo');
  if (logoElement) {
    logoElement.textContent = asciiLogo;
  }

  // Initialize Typed.js for typing animation
  const typingElement = document.getElementById('typing-element');
  if (typingElement) {
    new Typed('#typing-element', {
      strings: [
        'Backend Developer',
        'Problem Solver',
        'Stoic Mind',
        'Linux Enthusiast',
        'Dreamer',
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true
    });
  }
}

// Modified: Function to handle the fixed navigation - keep it compact always
function handleFixedNav() {
  // Get all nav elements (desktop and mobile)
  const navElements = document.querySelectorAll('nav');
  
  // Make sure all nav elements always have the compact-nav class
  navElements.forEach(nav => {
    if (!nav.classList.contains('compact-nav')) {
      nav.classList.add('compact-nav');
    }
  });
  
  // No need for scroll event handler as we want it to stay compact always
}

// Initialize everything once the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  handleFixedNav();
  
  // Initialize AOS animations if applicable
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true
    });
  }
});