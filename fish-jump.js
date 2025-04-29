const fishJumpComponent = {
    schema: {
      // Horizontal speed of the fish (units per second)
      speedX: { type: 'number', default: 1 },
  
      // Starting position of the fish
      initialPosition: { type: 'vec3', default: { x: -1, y: 0, z: -2 } },
  
      // Upward velocity when the fish jumps
      initialVelocityY: { type: 'number', default: 2 },
  
      // Gravity force (should be negative)
      gravity: { type: 'number', default: -9.81 },
  
      // How far it jumps horizontally before reversing
      distanceX: { type: 'number', default: 4 },
  
      // Min and max delay before each jump (in milliseconds)
      minDelay: { type: 'number', default: 500 },
      maxDelay: { type: 'number', default: 3000 },
  
      // If true, fish starts facing left and moves right to left
      reverse: { type: 'boolean', default: false },
  
      // Controls how fast time progresses in the animation
      timeScale: { type: 'number', default: 0.1 }
    },
  
    init() {
      // Start time tracker (null until first tick)
      this.startTime = null;
  
      // Position vector used for movement
      this.currentPosition = new THREE.Vector3();
  
      // Store the jump start position and apply it to the fish
      this.jumpStartPosition = { ...this.data.initialPosition };
      this.el.setAttribute('position', this.jumpStartPosition);
  
      // Set movement direction based on reverse flag
      this.forward = !this.data.reverse;
  
      // If reverse is true, start rotated 180° on Y-axis (face left)
      if (this.data.reverse) {
        this.el.setAttribute('rotation', { x: 0, y: 180, z: 0 });
      }
  
      // Generate initial random delay before first jump
      this.randomDelay = Math.random() * (this.data.maxDelay - this.data.minDelay) + this.data.minDelay;
    },
  
    tick() {
      const now = performance.now();
  
      // On the first frame, record the start time
      if (this.startTime === null) {
        this.startTime = now;
        return;
      }
  
      // Check if the delay time has passed
      const timeSinceStart = now - this.startTime;
      if (timeSinceStart < this.randomDelay) return;
  
      // Apply time scaling to slow/speed up motion
      const t = ((timeSinceStart - this.randomDelay) / 1000) * this.data.timeScale;
  
      // Direction multiplier: 1 for forward, -1 for backward
      const direction = this.forward ? 1 : -1;
  
      // Horizontal offset using speed and direction
      const offsetX = (t * this.data.speedX * direction) % this.data.distanceX;
  
      // Vertical offset using basic physics: v*t + 0.5*g*t²
      const offsetY = (this.data.initialVelocityY * t) + 0.5 * this.data.gravity * t * t;
  
      // Compute final position of the fish for this frame
      const x = this.jumpStartPosition.x + offsetX;
      const y = this.jumpStartPosition.y + offsetY;
      const { z } = this.jumpStartPosition;
  
      // If the fish has landed (below or at initial height)
      if (y < this.data.initialPosition.y) {
        // Reverse direction
        this.forward = !this.forward;
  
        // Visually flip the fish by rotating Y 180°
        const currentRot = this.el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
        const newY = (currentRot.y + 180) % 360;
        this.el.setAttribute('rotation', { x: currentRot.x, y: newY, z: currentRot.z });
  
        // Start next jump from landing position (y reset)
        this.jumpStartPosition = { x, y: this.data.initialPosition.y, z };
  
        // Reset timer and generate new random delay
        this.startTime = performance.now();
        this.randomDelay = Math.random() * (this.data.maxDelay - this.data.minDelay) + this.data.minDelay;
        return;
      }
  
      // Update fish position
      this.currentPosition.set(x, y, z);
      this.el.setAttribute('position', this.currentPosition);
    }
  };
  
  export { fishJumpComponent };
  