const splashImageComponent = {
    schema: {
      disableWorldTracking: {type: 'bool', default: false},
      requestGyro: {type: 'bool', default: false},
    },
    init() {
      const splashimage = document.getElementById('splashimage')
      const start = document.getElementById('start')
      start.style.display = 'block'
  
      // defines what happens when user taps start
      const addXRWeb = () => {
        // optional request gyro if needed
        if (this.data.requestGyro === true && this.data.disableWorldTracking === true) {
          // If world tracking is disabled, and you still want gyro enabled (i.e. 3DoF mode)
          // Request motion and orientation sensor via XR8's permission API
          XR8.addCameraPipelineModule({
            name: 'request-gyro',
            requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
          })
        }
        // sets up scenes' xrweb attribute dynamically
        this.el.sceneEl.setAttribute('xrweb', `allowedDevices: any; disableWorldTracking: ${this.data.disableWorldTracking}`)
        // hides splash image
        splashimage.classList.add('hidden')
  
        // Play background music (mp3) after user has clicked "Start AR" and the scene has loaded.
        this.el.sceneEl.addEventListener('realityready', () => {
          const snd = document.querySelector('[sound]')
          snd.components.sound.playSound()
        })
      }
      // attaches this logic to the start button
      start.onclick = addXRWeb
    },
  }
  
  export {splashImageComponent}