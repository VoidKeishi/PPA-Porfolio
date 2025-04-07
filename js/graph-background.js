/**
 * Creates an interactive 3D graph background using Three.js
 * Visualizes an interconnected network of nodes and edges with energy flow effects
 * Inspired by neural networks and knowledge graph visualizations
 */
function initGraphBackground() {
  console.log("Starting graph background initialization");
  
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

  // Scene, camera and renderer setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x11111b); // Matching Catppuccin crust color
  
  const camera = new THREE.PerspectiveCamera(
    75, // Increased FOV even more for wider view (from 70 to 75)
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  );
  camera.position.z = 140; // Adjusted camera position to see wider area
  
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Setup orbit controls for interaction
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.35;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.25;
  
  // Add subtle ambient light
  const ambientLight = new THREE.AmbientLight(0x444444);
  scene.add(ambientLight);
  
  // Create a container for all nodes and edges
  const graphGroup = new THREE.Group();
  scene.add(graphGroup);
  
  // Configuration for nodes and edges - MODIFIED for edge-to-edge coverage
  const config = {
    nodeCount: 50, // INCREASED from 45 to 50 for more nodes
    nodeSize: { min: 0.25, max: 0.6 }, // INCREASED sizes (was 0.15, 0.4)
    distribution: { 
      radius: 140, // INCREASED significantly for edge-to-edge coverage
      minDistance: 20, // Minimum distance from center to ensure some nodes are near edges
      horizontalStretch: 1.5 // Stretch horizontally to ensure coverage of wider screens
    },
    edgeCount: 60, // INCREASED from 55 to 60
    colors: {
      nodes: [
        0x89b4fa, // Blue (Catppuccin)
        0x74c7ec, // Sapphire (Catppuccin)
        0x89dceb, // Sky (Catppuccin)
        0xcba6f7, // Mauve (Catppuccin)
        0xf5c2e7  // Pink (Catppuccin)
      ],
      edges: 0x7f849c, // Overlay1 (Catppuccin)
      pulse: 0xf5e0dc // Rosewater (Catppuccin)
    },
    pulseSpeed: 0.25,
    opacity: {
      nodes: 0.7, // Slightly increased from 0.65
      edges: 0.2  // Slightly increased from 0.15
    }
  };
  
  // Store nodes and their positions
  const nodes = [];
  const nodePositions = [];
  const edges = [];
  const pulses = [];
  
  // Create nodes (spheres)
  function createNodes() {
    for (let i = 0; i < config.nodeCount; i++) {
      // Modified distribution to ensure edge-to-edge coverage
      let x, y, z, radius;
      
      // For some nodes (30%), ensure they are placed near the edges for better width coverage
      if (i < config.nodeCount * 0.3) {
        // Generate positions near the edges
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        // Use a larger radius with less variance for edge nodes
        radius = config.distribution.radius * (0.85 + Math.random() * 0.15);
        
        // Apply horizontal stretching to ensure edge-to-edge coverage
        x = radius * Math.sin(phi) * Math.cos(theta) * config.distribution.horizontalStretch;
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi) * 0.7; // Reduce Z spread to keep within view
      } else {
        // Standard distribution for remaining nodes
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        // Ensure minimum distance from center for some variety
        radius = config.distribution.minDistance + (config.distribution.radius - config.distribution.minDistance) * Math.cbrt(Math.random());
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      }
      
      // Random size within range
      const size = config.nodeSize.min + Math.random() * (config.nodeSize.max - config.nodeSize.min);
      
      // Create sphere geometry
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      
      // Create material with glow effect
      const colorIndex = Math.floor(Math.random() * config.colors.nodes.length);
      const color = config.colors.nodes[colorIndex];
      
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: config.opacity.nodes
      });
      
      // Create mesh and add to scene
      const node = new THREE.Mesh(geometry, material);
      node.position.set(x, y, z);
      
      // Store node and position
      nodes.push(node);
      nodePositions.push({ x, y, z });
      graphGroup.add(node);
    }
  }
  
  // Create edges (connections between nodes)
  function createEdges() {
    // Create a set to track connected pairs
    const connectedPairs = new Set();
    
    for (let i = 0; i < config.edgeCount; i++) {
      // Pick two random nodes to connect
      let nodeA = Math.floor(Math.random() * nodes.length);
      let nodeB = Math.floor(Math.random() * nodes.length);
      
      // Avoid self-connections and duplicates
      const pairKey = nodeA < nodeB ? `${nodeA}-${nodeB}` : `${nodeB}-${nodeA}`;
      
      if (nodeA !== nodeB && !connectedPairs.has(pairKey)) {
        connectedPairs.add(pairKey);
        
        // Create a line connecting the two nodes
        const points = [
          nodes[nodeA].position,
          nodes[nodeB].position
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Updated line material with better quality settings
        const material = new THREE.LineBasicMaterial({
          color: config.colors.edges,
          transparent: true,
          opacity: config.opacity.edges,
          linewidth: 1,
          depthTest: false
        });
        
        const line = new THREE.Line(geometry, material);
        edges.push({
          line,
          pointA: nodeA,
          pointB: nodeB
        });
        graphGroup.add(line);
        
        // Only create pulse for some edges to reduce visual density
        if (Math.random() < 0.7) {
          createPulseForEdge(nodeA, nodeB);
        }
      } else {
        // Try again if we picked a duplicate or self-connection
        i--;
      }
    }
  }
  
  // Create pulse effect (energy flow) along the edges
  function createPulseForEdge(nodeIndexA, nodeIndexB) {
    const posA = nodes[nodeIndexA].position;
    const posB = nodes[nodeIndexB].position;
    
    // Create a small sphere to represent the pulse - INCREASED size
    const geometry = new THREE.SphereGeometry(0.15, 8, 8); // Increased from 0.08
    const material = new THREE.MeshBasicMaterial({
      color: config.colors.pulse,
      transparent: true,
      opacity: 0.5,
      depthTest: false
    });
    
    const pulse = new THREE.Mesh(geometry, material);
    
    // Position at the start node
    pulse.position.copy(posA);
    
    // Add to scene
    graphGroup.add(pulse);
    
    // Store pulse data
    pulses.push({
      pulse,
      nodeA: nodeIndexA,
      nodeB: nodeIndexB,
      progress: 0,
      speed: 0.003 + Math.random() * 0.007,
      material: material
    });
  }
  
  // Update pulse positions in the animation loop WITH BRIGHTNESS VARIATION
  function updatePulses() {
    pulses.forEach(pulseData => {
      // Update progress along the edge
      pulseData.progress += pulseData.speed * config.pulseSpeed;
      
      // Reset when reaching the end
      if (pulseData.progress > 1) {
        pulseData.progress = 0;
      }
      
      // Get node positions
      const posA = nodes[pulseData.nodeA].position;
      const posB = nodes[pulseData.nodeB].position;
      
      // Interpolate position
      pulseData.pulse.position.lerpVectors(posA, posB, pulseData.progress);
      
      // Make pulse brighter in the middle of its journey
      // Create bell curve with peak at 0.5 (middle of journey)
      const brightnessVariation = 1 - Math.abs(pulseData.progress - 0.5) * 2; // 0->0.5->0
      const scaledBrightness = 0.5 + (brightnessVariation * 0.7); // Increased from 0.6 to 0.7
      
      // Update size and opacity based on position along path - INCREASED scale
      pulseData.pulse.scale.set(
        0.9 + brightnessVariation * 0.8, // Increased from 0.8 + 0.6
        0.9 + brightnessVariation * 0.8,
        0.9 + brightnessVariation * 0.8
      );
      
      // Update opacity
      pulseData.material.opacity = scaledBrightness;
      
      // Optional: Add subtle color shift for more energy effect
      const hue = (Date.now() * 0.0002) % 1;
      if (brightnessVariation > 0.8) {
        // Only change color when near peak brightness
        pulseData.material.color.setHSL(hue, 0.8, 0.7);
      } else {
        pulseData.material.color.set(config.colors.pulse);
      }
    });
  }
  
  // Function to add subtle movement to nodes
  function addNodesMovement() {
    nodes.forEach((node, index) => {
      // Create subtle floating effect
      const time = Date.now() * 0.0003;
      const offset = index * 0.1;
      
      // Small undulation around original position
      node.position.x = nodePositions[index].x + Math.sin(time + offset) * 0.25; // Increased from 0.2
      node.position.y = nodePositions[index].y + Math.cos(time + offset * 1.3) * 0.25;
      node.position.z = nodePositions[index].z + Math.sin(time * 0.7 + offset) * 0.25;
    });
  }
  
  // Update edge geometry to follow node positions
  function updateEdges() {
    edges.forEach(edge => {
      const pointA = nodes[edge.pointA].position;
      const pointB = nodes[edge.pointB].position;
      
      // Update line geometry with new positions
      const points = [pointA, pointB];
      edge.line.geometry.setFromPoints(points);
      edge.line.geometry.verticesNeedUpdate = true;
    });
  }
  
  // Initialize the graph
  function initGraph() {
    createNodes();
    createEdges();
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update node positions with subtle movements
    addNodesMovement();
    
    // Update edges to follow nodes
    updateEdges();
    
    // Update pulses along edges
    updatePulses();
    
    // Render the scene
    renderer.render(scene, camera);
  }
  
  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  window.addEventListener('resize', onWindowResize, false);
  
  // Initialize and start animation
  initGraph();
  animate();
  
  console.log("Graph background initialized successfully");
}

// Initialize the graph background when the DOM is loaded
document.addEventListener("DOMContentLoaded", initGraphBackground);