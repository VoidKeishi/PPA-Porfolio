/**
 * Creates an interactive 3D knowledge graph background using 3D-Force-Graph
 * Inspired by Obsidian's network visualization
 */
function initBackground() {
  console.log("Starting background initialization");
  
  // Check if container exists, create if not
  let container = document.getElementById('background-canvas-container');
  if (!container) {
    console.log("Creating background container");
    container = document.createElement('div');
    container.id = 'background-canvas-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1'; // Keep this negative to ensure it stays behind content
    document.body.insertBefore(container, document.body.firstChild);
  }

  // Enable pointer events for interaction
  container.style.pointerEvents = 'auto';

  // Check if ForceGraph3D is available
  if (typeof ForceGraph3D !== 'undefined') {
    console.log("3D-Force-Graph library detected");
    createForceGraph(container);
  } else {
    console.error("3D-Force-Graph library not found. Please ensure it's properly loaded.");
    // Fall back to the original background if the 3D-Force-Graph is not available
    createFallbackBackground(container);
  }
  
  // Create and configure the force graph
  function createForceGraph(container) {
    // Generate knowledge graph data
    const graphData = generateGraphData();
    
    try {
      // Initialize the 3D Force Graph
      const Graph = ForceGraph3D()
        .backgroundColor('rgba(10, 10, 18, 0.05)') // Very subtle dark background
        .width(window.innerWidth)
        .height(window.innerHeight)
        .graphData(graphData)
        .nodeRelSize(6) // Node size
        .nodeColor(node => getNodeColor(node.group))
        .linkWidth(link => link.value * 0.5)
        .linkOpacity(0.4)
        .linkColor(() => 'rgba(155, 155, 255, 0.3)')
        .showNavInfo(false) // Hide navigation info
        .enableNodeDrag(true) // ENABLE dragging nodes
        .enableNavigationControls(true) // ENABLE navigation
        .cooldownTime(3000) // Longer cooldown for more stable graph
        .linkDirectionalParticles(link => link.value * 0.5) // Particles on links
        .linkDirectionalParticleSpeed(0.01) // Slow particle movement
        .linkDirectionalParticleWidth(1.5)
        // Add node labels on hover
        .nodeLabel(node => node.label)
        // Pin nodes on drag end
        .onNodeDragEnd(node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        });
      
      // Apply the graph to the container
      Graph(container);
      
      // Handle window resize
      window.addEventListener('resize', () => {
        Graph.width(window.innerWidth).height(window.innerHeight);
      });
      
      // Set initial camera position slightly back
      Graph.cameraPosition({ z: 180 });
      
      // Add gentle rotation only when not interacting
      const rotationSpeed = 0.0002;
      let isRotating = true;
      let lastInteractionTime = Date.now();
      
      // Detect user interaction to stop rotation
      container.addEventListener('mousemove', () => {
        isRotating = false;
        lastInteractionTime = Date.now();
      });
      
      // Resume rotation after 5 seconds of inactivity
      setInterval(() => {
        if (Date.now() - lastInteractionTime > 5000) {
          isRotating = true;
        }
      }, 1000);
      
      // Apply gentle rotation
      Graph.onEngineTick(() => {
        if (isRotating) {
          const cameraPosition = Graph.cameraPosition();
          Graph.cameraPosition({
            x: cameraPosition.x * Math.cos(rotationSpeed) - cameraPosition.z * Math.sin(rotationSpeed),
            z: cameraPosition.x * Math.sin(rotationSpeed) + cameraPosition.z * Math.cos(rotationSpeed)
          });
        }
      });
      
      console.log("Force graph initialized successfully as background");
    } catch (error) {
      console.error("Error initializing force graph:", error);
      createFallbackBackground(container);
    }
  }
  
  // Fallback to a simple background if the 3D graph fails
  function createFallbackBackground(container) {
    console.log("Creating fallback background");
    
    // Create simple particles background with Three.js
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
      console.error("THREE.js not found for fallback background");
      return;
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    try {
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      
      // Ensure the renderer's canvas is properly positioned
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.zIndex = '-1';
      renderer.domElement.style.pointerEvents = 'none';
      
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 1500;
      
      const posArray = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i++) {
        // Random positions for x, y, z
        posArray[i] = (Math.random() - 0.5) * 5;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      
      // Material
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x89b4fa // Matches --blue in color.css
      });
      
      // Mesh
      const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);
      
      // Position camera
      camera.position.z = 2;
      
      // Animation loop with simplified rotation (no mouse interaction)
      function animate() {
        requestAnimationFrame(animate);
        
        // Subtle constant rotation
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        
        renderer.render(scene, camera);
      }
      
      // Handle window resize
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
      
      animate();
      console.log("Fallback background created successfully");
    } catch (error) {
      console.error("Error creating fallback background:", error);
    }
  }
  
  // Generate nodes and links for the knowledge graph
  function generateGraphData() {
    // Create skill/technology-themed nodes for a portfolio
    const skills = [
      { id: 'javascript', group: 1, size: 10, label: 'JavaScript' },
      { id: 'typescript', group: 1, size: 8, label: 'TypeScript' },
      { id: 'react', group: 2, size: 9, label: 'React' },
      { id: 'vue', group: 2, size: 7, label: 'Vue.js' },
      { id: 'angular', group: 2, size: 7, label: 'Angular' },
      { id: 'node', group: 3, size: 9, label: 'Node.js' },
      { id: 'express', group: 3, size: 7, label: 'Express' },
      { id: 'mongodb', group: 4, size: 8, label: 'MongoDB' },
      { id: 'postgresql', group: 4, size: 8, label: 'PostgreSQL' },
      { id: 'redis', group: 4, size: 6, label: 'Redis' },
      { id: 'aws', group: 5, size: 8, label: 'AWS' },
      { id: 'docker', group: 5, size: 8, label: 'Docker' },
      { id: 'kubernetes', group: 5, size: 7, label: 'Kubernetes' },
      { id: 'git', group: 6, size: 8, label: 'Git' },
      { id: 'github', group: 6, size: 7, label: 'GitHub' },
      { id: 'webpack', group: 7, size: 6, label: 'Webpack' },
      { id: 'babel', group: 7, size: 5, label: 'Babel' },
      { id: 'css', group: 8, size: 8, label: 'CSS' },
      { id: 'sass', group: 8, size: 7, label: 'Sass' },
      { id: 'tailwind', group: 8, size: 7, label: 'Tailwind' },
      { id: 'html', group: 8, size: 8, label: 'HTML' },
      { id: 'python', group: 9, size: 9, label: 'Python' },
      { id: 'django', group: 9, size: 7, label: 'Django' },
      { id: 'flask', group: 9, size: 6, label: 'Flask' },
      { id: 'java', group: 10, size: 8, label: 'Java' },
      { id: 'spring', group: 10, size: 7, label: 'Spring' },
      { id: 'cpp', group: 11, size: 7, label: 'C++' },
      { id: 'rust', group: 11, size: 6, label: 'Rust' },
      { id: 'go', group: 11, size: 6, label: 'Go' },
      { id: 'testing', group: 12, size: 7, label: 'Testing' },
      { id: 'jest', group: 12, size: 6, label: 'Jest' },
      { id: 'cypress', group: 12, size: 6, label: 'Cypress' },
      { id: 'ai', group: 13, size: 7, label: 'AI' },
      { id: 'ml', group: 13, size: 7, label: 'Machine Learning' },
      { id: 'tensorflow', group: 13, size: 6, label: 'TensorFlow' },
      { id: 'pytorch', group: 13, size: 6, label: 'PyTorch' }
    ];
    
    // Create logical connections between related technologies
    const links = [
      // JavaScript ecosystem
      { source: 'javascript', target: 'typescript', value: 3 },
      { source: 'javascript', target: 'react', value: 4 },
      { source: 'javascript', target: 'vue', value: 3 },
      { source: 'javascript', target: 'angular', value: 3 },
      { source: 'javascript', target: 'node', value: 4 },
      { source: 'typescript', target: 'react', value: 3 },
      { source: 'typescript', target: 'angular', value: 4 },
      
      // Frontend frameworks
      { source: 'react', target: 'webpack', value: 2 },
      { source: 'vue', target: 'webpack', value: 2 },
      { source: 'angular', target: 'webpack', value: 2 },
      { source: 'react', target: 'babel', value: 2 },
      
      // Backend
      { source: 'node', target: 'express', value: 4 },
      { source: 'node', target: 'mongodb', value: 3 },
      { source: 'express', target: 'mongodb', value: 3 },
      { source: 'python', target: 'django', value: 3 },
      { source: 'python', target: 'flask', value: 3 },
      { source: 'java', target: 'spring', value: 4 },
      
      // Databases
      { source: 'mongodb', target: 'redis', value: 2 },
      { source: 'postgresql', target: 'redis', value: 2 },
      
      // CSS and HTML
      { source: 'html', target: 'css', value: 4 },
      { source: 'css', target: 'sass', value: 3 },
      { source: 'css', target: 'tailwind', value: 3 },
      { source: 'html', target: 'react', value: 3 },
      { source: 'html', target: 'vue', value: 3 },
      { source: 'html', target: 'angular', value: 3 },
      
      // DevOps
      { source: 'docker', target: 'kubernetes', value: 4 },
      { source: 'aws', target: 'docker', value: 3 },
      { source: 'aws', target: 'kubernetes', value: 3 },
      
      // Version control
      { source: 'git', target: 'github', value: 4 },
      
      // Testing
      { source: 'testing', target: 'jest', value: 3 },
      { source: 'testing', target: 'cypress', value: 3 },
      { source: 'react', target: 'jest', value: 2 },
      { source: 'javascript', target: 'jest', value: 2 },
      
      // Programming languages connections
      { source: 'javascript', target: 'python', value: 1 },
      { source: 'javascript', target: 'java', value: 1 },
      { source: 'python', target: 'java', value: 1 },
      { source: 'cpp', target: 'rust', value: 2 },
      { source: 'cpp', target: 'go', value: 1 },
      
      // AI/ML
      { source: 'python', target: 'ai', value: 3 },
      { source: 'python', target: 'ml', value: 3 },
      { source: 'ai', target: 'ml', value: 4 },
      { source: 'ml', target: 'tensorflow', value: 3 },
      { source: 'ml', target: 'pytorch', value: 3 },
      { source: 'tensorflow', target: 'pytorch', value: 2 }
    ];
    
    return { nodes: skills, links: links };
  }
  
  // Get node color based on category
  function getNodeColor(group) {
    // Catppuccin-inspired color palette
    const colors = [
      '#f5e0dc', // Rosewater
      '#f2cdcd', // Flamingo
      '#f5c2e7', // Pink
      '#cba6f7', // Mauve
      '#f38ba8', // Red
      '#eba0ac', // Maroon
      '#fab387', // Peach
      '#f9e2af', // Yellow
      '#a6e3a1', // Green
      '#94e2d5', // Teal
      '#89dceb', // Sky
      '#74c7ec', // Sapphire
      '#89b4fa', // Blue
      '#b4befe'  // Lavender
    ];
    
    return colors[(group - 1) % colors.length];
  }
}

// Initialize background when the DOM is loaded
document.addEventListener("DOMContentLoaded", initBackground);