const playVideoComponent = {
    schema: {
      videoId: {type: 'string'},
      buttonId: {type: 'string', default: ''},
    },
  
    init() {
      const setup = () => {
        const video = document.getElementById(this.data.videoId)
        const button = this.data.buttonId ? document.getElementById(this.data.buttonId) : null
        const bgMusic = document.getElementById('bgMusic')
        const plane = document.getElementById('videoPlane')
        const dimmer = document.getElementById('theaterDimmer')
        const fadeGroup = Array.from(document.querySelectorAll('.fade-group'))
  
        if (!video || !plane) {
          console.warn('Missing video or videoPlane.')
          return
        }
  
        const originalScale = '1 1 1'
        const zoomedScale = '3.6 3.6 1'
        const originalPos = '0 0 0'
        const centerPos = '0.25 0.1 0.18'
  
        let hasStarted = false
  
        video.pause()
        video.removeAttribute('autoplay')
        video.load()
  
        video.addEventListener('loadeddata', () => {
          video.currentTime = 1.5
          video.pause()
        }, {once: true})
  
        if (button) button.setAttribute('visible', true)
  
        this.el.addEventListener('click', () => {
          const isPaused = video.paused
  
          // Toggle background music
          if (bgMusic?.components?.sound) {
            isPaused
              ? bgMusic.components.sound.pauseSound()
              : bgMusic.components.sound.playSound()
          }
  
          // Dim background when playing
          if (dimmer) {
            if (isPaused) {
              dimmer.setAttribute('visible', true)
              dimmer.setAttribute('animation__fade', {
                property: 'material.opacity',
                to: 0.85,
                dur: 300,
                easing: 'easeOutQuad',
              })
            } else {
              dimmer.setAttribute('animation__fade', {
                property: 'material.opacity',
                to: 0.0,
                dur: 300,
                easing: 'easeOutQuad',
              })
              setTimeout(() => {
                dimmer.setAttribute('visible', false)
              }, 300)
            }
          }
  
          // Animate background assets
          if (isPaused) {
            // Fade out other assets
            fadeGroup.forEach((el) => {
              el.setAttribute('animation__fade', {
                property: 'material.opacity',
                to: 0.1,
                dur: 400,
                easing: 'easeOutQuad',
              })
            })
          } else {
            // Fade in other assets *smoothly* after short delay
            fadeGroup.forEach((el) => {
              el.setAttribute('visible', true)
              el.setAttribute('animation__fade', {
                property: 'material.opacity',
                to: 1.0,
                dur: 600,
                easing: 'easeInOutSine',
              })
            })
          }
  
          // Handle video playback
          if (isPaused) {
            if (!hasStarted) {
              video.pause()
              video.currentTime = 0.0
              const playCleanly = () => {
                video.removeEventListener('seeked', playCleanly)
                video.muted = false
                video.volume = 1.0
                video.play().catch(err => console.warn('Video playback failed:', err))
                hasStarted = true
              }
              video.addEventListener('seeked', playCleanly)
            } else {
              video.play().catch(err => console.warn('Video resume failed:', err))
            }
          } else {
            video.pause()
          }
  
          if (button) button.setAttribute('visible', !isPaused)
  
          plane.setAttribute('animation__scale', {
            property: 'scale',
            to: isPaused ? zoomedScale : originalScale,
            dur: 400,
            easing: 'easeOutCubic',
          })
  
          plane.setAttribute('animation__pos', {
            property: 'position',
            to: isPaused ? centerPos : originalPos,
            dur: 400,
            easing: 'easeOutCubic',
          })
        })
  
        // Reset on end
        video.addEventListener('ended', () => {
          hasStarted = false
          if (button) button.setAttribute('visible', true)
          if (bgMusic?.components?.sound) {
            bgMusic.components.sound.playSound()
          }
  
          if (dimmer) {
            dimmer.setAttribute('animation__fade', {
              property: 'material.opacity',
              to: 0.0,
              dur: 300,
              easing: 'easeOutQuad',
            })
            setTimeout(() => {
              dimmer.setAttribute('visible', false)
            }, 300)
          }
  
          fadeGroup.forEach((el) => {
            el.setAttribute('visible', true)
            el.setAttribute('animation__fade', {
              property: 'material.opacity',
              to: 1.0,
              dur: 600,
              easing: 'easeInOutSine',
            })
          })
  
          plane.setAttribute('animation__scale', {
            property: 'scale',
            to: originalScale,
            dur: 400,
            easing: 'easeOutCubic',
          })
  
          plane.setAttribute('animation__pos', {
            property: 'position',
            to: originalPos,
            dur: 400,
            easing: 'easeOutCubic',
          })
        })
      }
  
      if (this.el.sceneEl.hasLoaded) {
        setup()
      } else {
        this.el.sceneEl.addEventListener('loaded', setup)
      }
    },
  }
  
  export {playVideoComponent}
  