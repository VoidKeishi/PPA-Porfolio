// Contact page specific functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    once: true
  });
  
  // Contact form submission handling
  const contactForm = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');
  const formResponseMessage = document.getElementById('form-response-message');
  const formSubmitAnimation = document.querySelector('.form-submit-animation');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Show loading animation
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formSubmitAnimation.classList.add('sending');
      
      // Simulate form submission (In a real implementation, you'd send data to a server)
      setTimeout(() => {
        // Hide loading animation
        formSubmitAnimation.classList.remove('sending');
        formSubmitAnimation.classList.add('sent');
        submitBtn.textContent = 'Message Sent!';
        
        // Show terminal response
        formResponse.style.display = 'block';
        
        // Create typing effect for message
        const message = 'Message sent successfully! I will get back to you soon.';
        let i = 0;
        formResponseMessage.textContent = '';
        
        function typeWriter() {
          if (i < message.length) {
            formResponseMessage.textContent += message.charAt(i);
            i++;
            setTimeout(typeWriter, 20);
          } else {
            // Add blinking cursor at the end
            const cursor = document.querySelector('.cursor-blink');
            cursor.style.display = 'inline-block';
          }
        }
        
        typeWriter();
        
        // Clear the form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          formSubmitAnimation.classList.remove('sent');
        }, 3000);
      }, 1500);
    });
  }
  
  // Close terminal response when clicking the close button
  const closeButton = document.querySelector('#form-response .terminal-close');
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      formResponse.style.display = 'none';
    });
  }
});