const fishMovementComponent = {
    schema: {
      speedX: { type: 'number', default: 1 },
      initialPosition: { type: 'vec3', default: { x: -1, y: 0, z: -2 } },
      distanceX: { type: 'number', default: 4 },
      minDelay: { type: 'number', default: 500 },
      maxDelay: { type: 'number', default: 3000 },
      reverse: { type: 'boolean', default: false } // NEW: makes fish start facing and moving left
    },
  
    init() {
      this.startTime = null;
      this.currentPosition = new THREE.Vector3();
  
      // Set the initial position
      this.moveStartPosition = { ...this.data.initialPosition };
      this.el.setAttribute('position', this.moveStartPosition);
  
      // Set movement direction based on reverse flag
      this.forward = !this.data.reverse;
  
      // If reverse is true, rotate the fish to face left initially
      if (this.data.reverse) {
        this.el.setAttribute('rotation', { x: 0, y: 180, z: 0 });
      }
  
      // Randomized initial delay
      this.randomDelay = Math.random() * (this.data.maxDelay - this.data.minDelay) + this.data.minDelay;
    },
  
    tick() {
      const now = performance.now();
  
      if (this.startTime === null) {
        this.startTime = now;
        return;
      }
  
      const timeSinceStart = now - this.startTime;
      if (timeSinceStart < this.randomDelay) return;
  
      const timeScale = 0.4;
      const t = ((timeSinceStart - this.randomDelay) / 1000) * timeScale;
      const direction = this.forward ? 1 : -1;
  
      const offsetX = t * this.data.speedX * direction;
      const x = this.moveStartPosition.x + offsetX;
      const { y, z } = this.moveStartPosition;
  
      if (Math.abs(offsetX) >= this.data.distanceX) {
        this.forward = !this.forward;
  
        // Flip visual Y rotation
        const rot = this.el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
        this.el.setAttribute('rotation', { x: rot.x, y: (rot.y + 180) % 360, z: rot.z });
  
        // Reset for next movement cycle
        this.moveStartPosition = { x, y, z };
        this.startTime = performance.now();
        this.randomDelay = Math.random() * (this.data.maxDelay - this.data.minDelay) + this.data.minDelay;
        return;
      }
  
      this.currentPosition.set(x, y, z);
      this.el.setAttribute('position', this.currentPosition);
    }
  };
  
  export { fishMovementComponent };
  