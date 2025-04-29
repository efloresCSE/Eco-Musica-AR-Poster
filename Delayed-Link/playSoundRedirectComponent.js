const playSoundRedirectComponent = {
    schema: {
      url: {type: 'string'},
      delay: {type: 'int', default: 1000},  // milliseconds
    },
    init() {
      this.el.addEventListener('sound-loaded', () => {
        this.soundReady = true
      })
  
      this.el.addEventListener('click', () => {
        if (this.soundReady && this.el.components.sound) {
          try {
            this.el.components.sound.playSound()
          } catch (err) {
            console.warn('Sound play failed:', err)
          }
        } else {
          console.warn('Sound not ready yet.')
        }
  
        // Redirect after delay
        setTimeout(() => {
          window.location.href = this.data.url
        }, this.data.delay)
      })
    },
  }
  
  export {playSoundRedirectComponent}
  