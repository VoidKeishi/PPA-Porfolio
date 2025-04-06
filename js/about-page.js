// About page specific functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    once: true
  });
  
  // Fun facts cycling
  const funFacts = [
    "I want to be a CTO one day",
    "I am a cat person",
    "I have a passion for classic anime",
    "I cycle 14km every day to university and back",
    "I built my first computer with less than 20$",
  ];
  
  const funFactElements = document.querySelectorAll('.fun-fact-text');
  let factIndex = 0;
  
  // Initial population
  funFactElements.forEach((el, i) => {
    el.textContent = funFacts[(factIndex + i) % funFacts.length];
  });
  
  // Cycle facts every 4 seconds
  setInterval(() => {
    factIndex = (factIndex + 1) % funFacts.length;
    funFactElements.forEach((el, i) => {
      // Fade out
      el.style.opacity = 0;
      
      // Change text and fade in after a short delay
      setTimeout(() => {
        el.textContent = funFacts[(factIndex + i) % funFacts.length];
        el.style.opacity = 1;
      }, 300);
    });
  }, 4000);
});