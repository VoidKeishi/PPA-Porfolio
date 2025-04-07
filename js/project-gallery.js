document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById("project-image-track");
  
  if (track) {
    // Get the number of projects
    const projectElements = track.getElementsByClassName("project-image-wrapper");
    const projectCount = projectElements.length;
    
    // Calculate the limits based on the number of projects
    // These limits ensure the first and last projects stop exactly at center
    const maxRightLimit = 0; // First project centered (index 0)
    const maxLeftLimit = -((projectCount - 1) * 20); // Last project centered
    
    // Initialize
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = "-50"; // Start centered on the 3rd project (if there are 6)
    track.dataset.percentage = "-50";
    
    // Initial positioning
    track.animate({
      transform: `translate(-50%, -50%)`
    }, { duration: 0, fill: "forwards" });
    
    const handleOnDown = e => {
      track.dataset.mouseDownAt = e.clientX;
    };

    const handleOnUp = () => {
      track.dataset.mouseDownAt = "0";  
      track.dataset.prevPercentage = track.dataset.percentage;
      
      // Snap to the nearest project after dragging ends
      snapToNearestProject();
    };
    
    // Function to snap to the nearest project
    const snapToNearestProject = () => {
      const currentPercentage = parseFloat(track.dataset.percentage);
      
      // Calculate the ideal positions for each project
      const projectPositions = [];
      for (let i = 0; i < projectCount; i++) {
        projectPositions.push(-i * 20); // Each project is 20% apart
      }
      
      // Find the closest position
      let closestPosition = projectPositions[0];
      let minDistance = Math.abs(currentPercentage - closestPosition);
      
      for (let i = 1; i < projectPositions.length; i++) {
        const distance = Math.abs(currentPercentage - projectPositions[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestPosition = projectPositions[i];
        }
      }
      
      // Animate to the closest position for a smooth snap effect
      track.animate({
        transform: `translate(${closestPosition}%, -50%)`
      }, { duration: 500, fill: "forwards", easing: "ease-out" });
      
      track.dataset.percentage = closestPosition;
      track.dataset.prevPercentage = closestPosition;
    };

    const handleOnMove = e => {
      if(track.dataset.mouseDownAt === "0") return;
      
      const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
      // Adjust maxDelta for smoother scrolling with proper spacing
      const maxDelta = window.innerWidth / 2.5;
      
      const percentage = (mouseDelta / maxDelta) * -100;
      const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
      
      // Apply constraints to limit dragging precisely to our boundaries
      const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, maxRightLimit), maxLeftLimit);
      
      track.dataset.percentage = nextPercentage;
      
      // Animate with improved easing for smoother transitions
      track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
      }, { duration: 800, fill: "forwards", easing: "ease-out" });
    };

    // Mouse events
    window.addEventListener('mousedown', e => handleOnDown(e));
    window.addEventListener('mouseup', e => handleOnUp(e));
    window.addEventListener('mousemove', e => handleOnMove(e));

    // Touch events for mobile
    window.addEventListener('touchstart', e => handleOnDown(e.touches[0]));
    window.addEventListener('touchend', e => handleOnUp(e.touches[0]));
    window.addEventListener('touchmove', e => handleOnMove(e.touches[0]));
    
    // Handle resize
    window.addEventListener('resize', () => {
      const currentPercentage = track.dataset.percentage || "-50";
      
      // Ensure the current position is still within bounds after resize
      const boundedPercentage = Math.max(Math.min(parseFloat(currentPercentage), maxRightLimit), maxLeftLimit);
      
      track.animate({
        transform: `translate(${boundedPercentage}%, -50%)`
      }, { duration: 0, fill: "forwards" });
      
      track.dataset.percentage = boundedPercentage;
      track.dataset.prevPercentage = boundedPercentage;
    });
    
    // Auto-animate slightly on load to show interactivity
    setTimeout(() => {
      // Start at the middle project
      const middleIndex = Math.floor((projectCount - 1) / 2);
      const targetPercentage = -middleIndex * 20;
      
      track.animate({
        transform: `translate(${targetPercentage}%, -50%)`
      }, { duration: 1500, fill: "forwards", easing: "ease-in-out" });
      
      track.dataset.percentage = targetPercentage;
      track.dataset.prevPercentage = targetPercentage;
    }, 1000);
  }
});