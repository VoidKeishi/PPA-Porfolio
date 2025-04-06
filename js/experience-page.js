// Experience page specific functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll) library
  AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-in-out'
  });
  
  // Initialize skill bars animation
  function animateSkillBars() {
    document.querySelectorAll('.skill-level').forEach(bar => {
      // Get width from the element's style attribute
      const width = bar.style.width;
      
      // First set width to 0
      bar.style.width = '0';
      
      // Then animate to the target width
      setTimeout(() => {
        bar.style.width = width;
      }, 200);
    });
  }
  
  // Call the animation function after a delay
  setTimeout(animateSkillBars, 500);
});