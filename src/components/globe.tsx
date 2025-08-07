import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

// This is the main application component that renders the 3D globe.
const Globe = () => {
  // Use a ref to hold the canvas element for Three.js to render into.
  const mountRef = useRef(null);
  
  // Use a ref to store the Three.js scene, camera, and renderer objects, along with state variables.
  const state = useRef({
    scene: null,
    camera: null,
    renderer: null,
    globe: null,
    particles: null, // New: Reference to the particle system
    mouse: new THREE.Vector2(),
    isMouseDown: false, // Track if the mouse button is pressed
    previousMousePosition: { x: 0, y: 0 }, // Store the previous mouse position for dragging
  });

  // A state variable to track if the scene is ready, useful for showing a loading message.
  const [isReady, setIsReady] = useState(false);

  // useEffect hook to initialize the Three.js scene and event listeners.
  useEffect(() => {
    // Ensure the ref is attached to the DOM element before proceeding.
    const currentMount = mountRef.current;
    if (!currentMount) {
      return;
    }
    
    // ---- SCENE SETUP ----
    state.current.scene = new THREE.Scene();
    // Set the background color to an even darker shade of lavender.
    state.current.scene.background = new THREE.Color(0x2d1f3d);

    // Set up the camera with a perspective view.
    state.current.camera = new THREE.PerspectiveCamera(
      75, // Field of view
      currentMount.clientWidth / currentMount.clientHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    state.current.camera.position.z = 2;

    // Set up the WebGL renderer.
    state.current.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    state.current.renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(state.current.renderer.domElement);
    
    // ---- GLOBE CREATION ----
    // Create the globe's geometry (a sphere).
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Create a texture loader instance.
    const textureLoader = new THREE.TextureLoader();
    
    // Load a realistic map texture for the globe from a public source.
    const texture = textureLoader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'
    );

    // Create a material for the globe using the loaded texture.
    const material = new THREE.MeshStandardMaterial({
      map: texture, // Apply the texture here
      roughness: 0.8,
      metalness: 0.1
    });
    
    // Combine geometry and material into a mesh.
    state.current.globe = new THREE.Mesh(geometry, material);
    state.current.scene.add(state.current.globe);
    
    // ---- PARTICLE SYSTEM ----
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
        // Randomly position particles within a sphere far away from the globe
        positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // Changed particle color to a light color for better contrast
        size: 0.02,
        blending: THREE.AdditiveBlending, // Create a glow effect
        transparent: true,
        sizeAttenuation: true,
    });

    state.current.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    state.current.scene.add(state.current.particles);

    // ---- LIGHTING ----
    // Add an ambient light to provide some base illumination.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    state.current.scene.add(ambientLight);
    
    // Add a directional light for highlights and shadows.
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 5, 5);
    state.current.scene.add(pointLight);

    // Set the component to ready once everything is initialized.
    setIsReady(true);

    // ---- ANIMATION LOOP ----
    const animate = () => {
      if (state.current.globe && state.current.particles) {
        // Globe rotation logic
        if (state.current.isMouseDown) {
          const deltaX = state.current.mouse.x - state.current.previousMousePosition.x;
          const deltaY = state.current.mouse.y - state.current.previousMousePosition.y;

          state.current.globe.rotation.y += deltaX * 0.1;
          state.current.globe.rotation.x += deltaY * 0.1;

          state.current.previousMousePosition.x = state.current.mouse.x;
          state.current.previousMousePosition.y = state.current.mouse.y;
        } else {
          state.current.globe.rotation.y += 0.005;
        }

        // Particle animation logic
        // Apply a subtle rotation to the particles to make them seem alive.
        state.current.particles.rotation.y += 0.0005;
        // Apply a parallax effect based on mouse movement.
        state.current.particles.position.x += (state.current.mouse.x * 0.2 - state.current.particles.position.x) * 0.1;
        state.current.particles.position.y += (state.current.mouse.y * 0.2 - state.current.particles.position.y) * 0.1;
      }

      // Render the scene with the camera.
      state.current.renderer.render(state.current.scene, state.current.camera);
      requestAnimationFrame(animate);
    };
    animate();

    // ---- EVENT LISTENERS ----
    // Handle window resize events to maintain a responsive canvas.
    const handleResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      state.current.renderer.setSize(width, height);
      state.current.camera.aspect = width / height;
      state.current.camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Handle mouse movement to control the globe's rotation.
    const handleMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      // Normalize mouse coordinates to a range of [-1, 1] relative to the canvas.
      state.current.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      state.current.mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    currentMount.addEventListener('mousemove', handleMouseMove);
    
    // Event listeners to track when the mouse enters and leaves the component.
    currentMount.addEventListener('mouseenter', () => state.current.isMouseOver = true);
    currentMount.addEventListener('mouseleave', () => state.current.isMouseOver = false);
    
    // New: Event listeners for mouse down and up
    const handleMouseDown = (event) => {
      state.current.isMouseDown = true;
      // Store the initial mouse position when the click starts.
      const rect = currentMount.getBoundingClientRect();
      state.current.previousMousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      state.current.previousMousePosition.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleMouseUp = () => {
      state.current.isMouseDown = false;
    };
    
    currentMount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp); // Use window to catch mouseup outside the canvas

    // ---- CLEANUP ----
    // Return a cleanup function to remove event listeners and dispose of the renderer.
    return () => {
      if (currentMount) {
        currentMount.removeChild(state.current.renderer.domElement);
        window.removeEventListener('resize', handleResize);
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', () => state.current.isMouseOver = true);
        currentMount.removeEventListener('mouseleave', () => state.current.isMouseOver = false);
        currentMount.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-50 p-4 font-inter">
      <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gray-800">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-3">Loading...</span>
          </div>
        )}
        <div 
          ref={mountRef} 
          className="w-full h-full"
        />
      </div>
      <span className="absolute cursive text-gray-700" >Khyatuuu</span>
    </div>
  );
};

export default Globe;
