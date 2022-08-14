'use strict'
/* global Stats, screenfull */
var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const Canvas = document.getElementById('Canvas')
// const dpr = window.devicePixelRatio
let width = window.innerWidth// * dpr
let height = window.innerHeight// * dpr
Canvas.width = width
Canvas.height = height
const ctx = Canvas.getContext('2d')

const carSprite = new Image()
carSprite.src = 'car.png'
const roalLeftSprite = new Image()
roalLeftSprite.src = 'brightroadleft.jpg'
const roalRightSprite = new Image()
roalRightSprite.src = 'brightroadright.jpg'
let loadedImages = 0
const totalImages = 3
let car

function init () {
  width = window.innerWidth// * dpr
  height = window.innerHeight// * dpr
  Canvas.width = width
  Canvas.height = height
  ctx.textAlign = 'right'
  ctx.font = '50px sans-serif'
  ctx.strokeStyle = 'yellow'
  ctx.lineWidth = 3

  roadWidth = width / 2
  maxRoadOffset = height// 909
  roadSpriteWidth = height * 602 / 909

  if (car) {
    car.width = car.sprite.width * width / 15000
    car.height = car.sprite.height * width / 15000
  }
  if (screenfull && !screenfull.isFullscreen) {
    document.getElementById('FullScreenButton').classList.remove('hide')
  }
}

function Vector (x, y) {
  this.x = x
  this.y = y
}
Vector.prototype.add = function (vec) {
  return new Vector(this.x + vec.x, this.y + vec.y)
}
Vector.prototype.mult = function (scale) {
  return new Vector(this.x * scale, this.y * scale)
}

function Car (params) {
  this.sprite = params.sprite || console.error('no sprite provided')
  this.spriteAngle = params.angle || 0
  // let scale = params.scale || 1
  this.width = this.sprite.width / 15
  this.height = this.sprite.height / 15
  this.pos = new Vector(width / 2, height - this.height)
  this.speed = new Vector(0, 0)
  this.acc = new Vector(0, 0)
  this.roadSpeed = 0
  this.angle = 0
  this.angleSpeed = 0
  this.angleForce = 0
}
Car.prototype.update = function () {
  if (this.up) {
    this.acc.y = -1
    if (this.pos.x < (width - roadWidth) / 2 || this.pos.x > (width + roadWidth) / 2) {
      this.acc.y = -this.roadSpeed * 4
    }
  } else {
    if (this.pos.y < height - this.height) {
      this.acc.y = 1
      if (this.pos.x < (width - roadWidth) / 2 || this.pos.x > (width + roadWidth) / 2) {
        this.acc.y = this.roadSpeed * 6
      }
    } else {
      this.acc.y = 0
      this.pos.y = height - this.height
    }
  }
  if (this.left) {
    this.acc.x = -2 * this.roadSpeed
  }
  if (this.right) {
    this.acc.x = 2 * this.roadSpeed
  }
  if (this.left && this.right) {
    this.acc.x = 0
  }
  if (!this.left && !this.right) {
    this.acc.x = 0
  }
  if (this.down) {
    this.roadSpeed -= 0.008
    if (this.roadSpeed < 0) {
      this.roadSpeed = 0
    }
  }
  this.roadSpeed += 0.001
  if (this.roadSpeed > 1) {
    this.roadSpeed = 1
  }

  this.speed = this.speed.add(this.acc).mult(0.9)
  if (this.pos.x < (width - roadWidth) / 2 || this.pos.x > (width + roadWidth) / 2) {
    this.roadSpeed *= 0.97
  }
  // this.speed = this.speed
  this.pos = this.pos.add(this.speed)
}
Car.prototype.draw = function () {
  this.angleForce = -this.angle / 30 + this.acc.x / 100
  if (this.pos.x < (width - roadWidth) / 2 || this.pos.x > (width + roadWidth) / 2) {
    this.angleForce = -this.angle / 150 + this.acc.x * 0.02
  }
  this.angleSpeed += this.angleForce
  this.angle += this.angleSpeed
  this.angle *= 0.85

  ctx.save()
  ctx.translate(this.pos.x + 5, this.pos.y + 5)
  ctx.rotate(this.spriteAngle + this.angle)
  ctx.filter = 'brightness(0%) opacity(40%)'
  ctx.drawImage(this.sprite
    , -this.width / 2, -this.height / 2
    , this.width, this.height)
  ctx.restore()

  ctx.save()
  ctx.translate(this.pos.x, this.pos.y)
  ctx.rotate(this.spriteAngle + this.angle)
  ctx.drawImage(this.sprite
    , -this.width / 2, -this.height / 2
    , this.width, this.height)
  ctx.restore()
}

function srartGame () {
  car = new Car({ sprite: carSprite, angle: -Math.PI / 2, scale: 0.1 })
  init()
  frame()
}
function frame () {
  stats.begin()
  ctx.fillStyle = 'rgba(70,70,70,' + ((1 - car.roadSpeed) ** 5 * 0.80 + 0.20) + ')'
  ctx.fillRect(0, 0, width, height)
  drawRoad()
  car.update()
  car.draw()
  ctx.fillStyle = 'yellow'
  ctx.fillText(Math.floor(car.roadSpeed * 400 + (car.up ? 9 : car.acc.y > 0 ? -14 : 0)) + ' km/h', width - 6, height - 10)
  stats.end()
  window.requestAnimationFrame(frame)
}
let lineOffset = 0
let maxSpeed = 400
let roadType = 0
let roadOffset = 0
let maxRoadOffset = height// 909
let roadSpriteWidth = height * 602 / 909
const roadShrink = 35
let roadWidth
function drawRoad () {
  roadOffset += car.roadSpeed * 90
  roadOffset = (roadOffset + maxRoadOffset) % maxRoadOffset - maxRoadOffset
  ctx.filter = 'opacity(' + ((1 - car.roadSpeed) * 92 + 8) + '%)'
  ctx.drawImage(roalLeftSprite, (width - roadWidth) / 2 - roadSpriteWidth + roadShrink, roadOffset
    , roadSpriteWidth, maxRoadOffset * 2)
  ctx.drawImage(roalRightSprite, (width + roadWidth) / 2 - roadShrink, roadOffset
    , roadSpriteWidth, maxRoadOffset * 2)
  ctx.filter = 'none'
  if (Math.random() < 0.01 && car.roadSpeed > 0.5) {
    roadType = Math.floor(Math.random() * 4)
  }
  lineOffset = (lineOffset - maxSpeed * 0.2 * car.roadSpeed) % maxSpeed // (lineOffset - 10) % 100
  ctx.lineDashOffset = lineOffset
  ctx.beginPath()
  if (roadType === 0) {
    ctx.setLineDash([maxSpeed * 0.3, maxSpeed * 0.7])
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
  } else if (roadType === 1) {
    ctx.setLineDash([])
    ctx.moveTo(width / 2 - 5, 0)
    ctx.lineTo(width / 2 - 5, height)
    ctx.moveTo(width / 2 + 5, 0)
    ctx.lineTo(width / 2 + 5, height)
  } else if (roadType === 2) {
    ctx.setLineDash([maxSpeed * 0.25, maxSpeed * 0.75])
    ctx.moveTo(width / 2 - 5, 0)
    ctx.lineTo(width / 2 - 5, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([])
    ctx.moveTo(width / 2 + 5, 0)
    ctx.lineTo(width / 2 + 5, height)
  } else if (roadType === 3) {
    ctx.setLineDash([])
    ctx.moveTo(width / 2 - 5, 0)
    ctx.lineTo(width / 2 - 5, height)
    ctx.stroke()
    ctx.beginPath()
    ctx.setLineDash([maxSpeed * 0.25, maxSpeed * 0.75])
    ctx.moveTo(width / 2 + 5, 0)
    ctx.lineTo(width / 2 + 5, height)
  }
  ctx.stroke()
}

init()
ctx.fillText('Loading...', (width - ctx.measureText('Loading...').width) / 2, (height + 25) / 2)

carSprite.addEventListener('load', e => {
  loadedImages++
  if (loadedImages === totalImages) {
    srartGame()
  }
})
roalLeftSprite.addEventListener('load', e => {
  loadedImages++
  if (loadedImages === totalImages) {
    srartGame()
  }
})
roalRightSprite.addEventListener('load', e => {
  loadedImages++
  if (loadedImages === totalImages) {
    srartGame()
  }
})

window.addEventListener('resize', init)

window.addEventListener('keydown', e => {
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      car.up = true
      break
    case 'ArrowRight':
    case 'KeyD':
      car.right = true
      break
    case 'ArrowDown':
    case 'KeyS':
      car.down = true
      break
    case 'ArrowLeft':
    case 'KeyA':
      car.left = true
      break
  }
})
window.addEventListener('keyup', e => {
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      car.up = false
      break
    case 'ArrowRight':
    case 'KeyD':
      car.right = false
      break
    case 'ArrowDown':
    case 'KeyS':
      car.down = false
      break
    case 'ArrowLeft':
    case 'KeyA':
      car.left = false
      break
  }
})
function checkControl (x, y) {
  if (y < height / 2) {
    car.up = true
  }
  if (x < (width - roadWidth) / 2) {
    car.left = true
  } else if (x < (width + roadWidth) / 2) {
    if (y > height / 2) {
      car.down = true
    }
  } else {
    car.right = true
  }
}
function mouseHandle (e) {
  car.up = car.right = car.down = car.left = false
  checkControl(e.pageX, e.pageY)
}
Canvas.addEventListener('mousedown', e => {
  Canvas.addEventListener('mousemove', mouseHandle)
  mouseHandle(e)
})
Canvas.addEventListener('mouseup', e => {
  Canvas.removeEventListener('mousemove', mouseHandle)
  car.up = car.right = car.down = car.left = false
})

Canvas.addEventListener('touchstart', e => {
  e.preventDefault()
  e.stopPropagation()
  car.up = car.right = car.down = car.left = false
  Array.prototype.slice.call(e.touches).map(e => checkControl(e.pageX, e.pageY))
})
Canvas.addEventListener('touchmove', e => {
  e.preventDefault()
  e.stopPropagation()
  car.up = car.right = car.down = car.left = false
  Array.prototype.slice.call(e.touches).map(e => checkControl(e.pageX, e.pageY))
})
Canvas.addEventListener('touchend', e => {
  car.up = car.right = car.down = car.left = false
  Array.prototype.slice.call(e.touches).map(e => checkControl(e.pageX, e.pageY))
})

document.getElementById('FullScreenButton').addEventListener('click', e => {
  if (screenfull && screenfull.enabled) {
    screenfull.toggle()
    document.getElementById('FullScreenButton').classList.add('hide')
  }
})
