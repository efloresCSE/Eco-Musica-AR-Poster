// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

// importing css
import './splash-image-background-music/index.css'
// Imports a custom A-Frame component from a file called splash-image.js.
import {splashImageComponent} from './splash-image-background-music/splash-image'

//* *Registers your custom component** with A-Frame using the name `'splash-image'`.
// Now you can use it in HTML like this: <a-entity splash-image></a-entity>
AFRAME.registerComponent('splash-image', splashImageComponent)

import {playSoundRedirectComponent} from './Delayed-Link/playSoundRedirectComponent.js'
AFRAME.registerComponent('play-sound-redirect', playSoundRedirectComponent)

import {fishJumpComponent} from './fish-jump.js'
AFRAME.registerComponent('fish-jump', fishJumpComponent)

import {fishMovementComponent} from './fish-movement.js'
AFRAME.registerComponent('fish-movement', fishMovementComponent)

import { playVideoComponent } from './play-video.js';
AFRAME.registerComponent('play-video', playVideoComponent);