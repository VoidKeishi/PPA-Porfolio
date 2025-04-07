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
  
  // Add staggered animation to skill cards
  function animateSkillCards() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
      // Add a delayed fade-in effect
      setTimeout(() => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 100);
      }, index * 150);
    });
  }
  
  // Add floating animation to tech tags
  function animateTechTags() {
    const techTags = document.querySelectorAll('.tech-tag-item');
    
    techTags.forEach((tag, index) => {
      // Add slight vertical float animation with random delays
      const delay = Math.random() * 2000; // Random delay between 0-2s
      const duration = 2000 + Math.random() * 1000; // Random duration between 2-3s
      
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(15px)';
      tag.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
      
      setTimeout(() => {
        tag.style.opacity = '1';
        tag.style.transform = 'translateY(0)';
      }, 300 + index * 50);
      
      // Create subtle floating effect
      setTimeout(() => {
        tag.style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite alternate`;
      }, 800 + index * 50);
    });
    
    // Add keyframes for float animation if not already present
    if (!document.getElementById('float-keyframes')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'float-keyframes';
      styleSheet.textContent = `
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }
  
  // Call animation functions after a short delay
  setTimeout(() => {
    animateSkillBars();
    animateSkillCards();
    animateTechTags();
  }, 500);
  
  // Add click interaction for project references
  const projectReferences = document.querySelectorAll('.project-reference');
  projectReferences.forEach(ref => {
    ref.addEventListener('click', function() {
      // Find the matching project in the gallery by its title
      const projectName = this.textContent;
      const projectElements = document.querySelectorAll('.project-info-overlay h3');
      
      projectElements.forEach(element => {
        if (element.textContent.includes(projectName)) {
          // Scroll to the projects section
          const projectsSection = document.querySelector('.project-gallery-container');
          projectsSection.scrollIntoView({ behavior: 'smooth' });
          
          // Highlight the project card briefly
          const projectCard = element.closest('.project-image-wrapper');
          projectCard.style.transform = 'scale(1.05)';
          projectCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
          
          setTimeout(() => {
            projectCard.style.transform = '';
            projectCard.style.boxShadow = '';
          }, 1500);
        }
      });
    });
  });
});