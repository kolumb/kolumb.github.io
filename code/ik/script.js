'use strict'

const Canvas = document.getElementById('Canvas')
// const dpr = window.devicePixelRatio
let width = window.innerWidth// * dpr
let height = window.innerHeight// * dpr
Canvas.width = width
Canvas.height = height
const ctx = Canvas.getContext('2d')

let BarOutputElem = document.getElementById('BarOutput')
let AddBarElem = document.getElementById('AddBar')
let RemoveBarElem = document.getElementById('RemoveBar')

let barNumber = 4
let bars = []
bars.length = barNumber//10
let barLength = width > height ? height / bars.length / 2 : width / bars.length / 2
let handLength = (barNumber - 1) * barLength
let barWidth = 10
let measureStep = 0.2 /10
const mouse = {}
mouse.pos = new Vector(0, 0)
const targets = [ mouse ]
const ignore = []
let lastBar
let lastTipPos = new Vector(0, 0)

function init () {
  width = window.innerWidth// * dpr
  height = window.innerHeight// * dpr
  Canvas.width = width
  Canvas.height = height
  ctx.textAlign = 'right'
  ctx.font = '50px sans-serif'
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 1
  ctx.fillStyle = 'white'
  bars[0].pos.copy(new Vector(width / 2, height / 2))
  barLength = width > height ? height / bars.length / 2 : width / bars.length / 2
  bars.map(bar => bar.length = barLength)
  handLength = (barNumber - 1) * barLength
  BarOutputElem.textContent = barNumber
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
Vector.prototype.length = function () {
  return Math.sqrt(this.x ** 2 + this.y ** 2)
}
Vector.prototype.clone = function () {
  return new Vector(this.x, this.y)
}
Vector.prototype.copy = function (vec) {
  this.x = vec.x
  this.y = vec.y
  return this
}
Vector.prototype.quadDist = function (vec) {
  return (this.x - vec.x) ** 2 + (this.y - vec.y) ** 2
}

function Bar (params) {
  this.pos = new Vector(params.x || 0, params.y || 0)
  this.angle = params.angle || 0
  this.width = params.width || 1
  this.length = params.length || 0
  this.tip = this.pos.add(new Vector(
    this.length * Math.cos(this.angle)
    , this.length * Math.sin(this.angle)
  ))
  this.gAngle = this.angle
}
Bar.prototype.update = function () {
  if (this.parent) {
    this.gAngle = this.parent.gAngle + this.angle// + 0.01 * (0.5 - Math.random())
    this.tip = this.parent.tip.add(
      new Vector(
        this.length * Math.cos(this.gAngle)
        , this.length * Math.sin(this.gAngle)
      )
    )
  } else {
    this.gAngle = this.angle// + 0.01 * (0.5 - Math.random())
    this.tip = this.pos.add(
      new Vector(
        this.length * Math.cos(this.angle)
        , this.length * Math.sin(this.angle)
      )
    )
  }
  if (this.child) {
    this.child.update()
  }
}
Bar.prototype.draw = function () {
  ctx.save()
  if (this.parent) {
    ctx.translate(this.parent.tip.x, this.parent.tip.y)
    ctx.rotate(this.gAngle)
    ctx.fillRect(
      -this.width / 2
      , -this.width / 2
      , this.length + this.width
      , this.width
    )
  } else {
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.angle)
    ctx.fillRect(
      -this.width / 2
      , -this.width / 2
      , this.length + this.width
      , this.width
    )
  }
  ctx.restore()
  if (this.child) {
    this.child.draw()
  }
}
Bar.prototype.add = function (bar) {
  this.child = bar
  bar.parent = this
}
Bar.moveToTarget = function (bars, target) {
  let root = bars[0]
  // console.log(1, root.angle)
  // root.angle += 0.02 * (Math.atan2(target.pos.y - root.pos.y, target.pos.x - root.pos.x) - ((root.angle + Math.PI * 2) % (Math.PI * 2)))
  // console.log(2, ((root.angle + Math.PI * 2) % (Math.PI * 2)))
  // console.log(0.1 * (Math.atan2(root.pos.x - target.pos.x, root.pos.y - target.pos.y) + Math.PI / 2 - root.angle))
  bars.forEach((bar, i) => {
    let step = measureStep// * Math.abs(half - bars.length)
    // if (i > 0) {
    // step = measureStep * 20
    // step = measureStep * (Math.abs(bar.angle % (Math.PI) - bar.parent.gAngle % (Math.PI))) * 10
    // bar.parent.angle
    // bar.angle += (bar.gAngle - bar.parent.gAngle)/200
    // }
    // let lastBar = bars[bars.length - 1]
    bar.update()
    let measure0 = lastBar.tip.quadDist(target.pos)
    bar.angle += step
    bar.update()
    let measure1 = lastBar.tip.quadDist(target.pos)
    bar.angle -= step * 2
    bar.update()
    let measure2 = lastBar.tip.quadDist(target.pos)
    bar.angle += step
    if (measure0 - measure1 > measure0 - measure2) {
      bar.angle += step * 0.01
      bar.update()
      let measure3 = lastBar.tip.quadDist(target.pos)
      if (measure0 - measure3 < measure0 - measure1) {
        bar.angle += step * 0.1
        bar.update()
        let measure4 = lastBar.tip.quadDist(target.pos)
        if (measure0 - measure4 < measure0 - measure1) {
          bar.angle += step * 0.89
          bar.update()
        }
      }
    } else {
      bar.angle -= step * 0.01
      bar.update()
      let measure3 = lastBar.tip.quadDist(target.pos)
      if (measure0 - measure3 < measure0 - measure2) {
        bar.angle -= step * 0.1
        bar.update()
        let measure4 = lastBar.tip.quadDist(target.pos)
        if (measure0 - measure4 < measure0 - measure2) {
          bar.angle -= step * 0.89
          bar.update()
        }
      }
    }
    // if (bar.parent) {
    // bar.parent.angle
    // bar.angle += (bar.gAngle - bar.parent.gAngle)/200
    // }
    // bar.angle *= 0.99
  })
}
let secondNear = 0
let thisrdNear = 0
Bar.getNearestTarget = function (barTip, targets) {
  let dists = targets.map((t, i) => t.pos.quadDist(bars[0].pos) < handLength ** 2
    ? (ignore[i]
      ? Infinity
      : (barTip.quadDist(t.pos) - 2000000000 / t.pos.quadDist(bars[0].pos)))
    : Infinity
  )
  // console.log(dists[0])
  let near = dists.reduce((nearestIndex, dist, i, arr) => dist < arr[nearestIndex] ? i : nearestIndex, 0)
  secondNear = dists.reduce((nearestIndex, dist, i, arr) => (near !== 0 && (dist !== arr[near]) && (dist < arr[nearestIndex])) ? i : nearestIndex, 0)
  thisrdNear = dists.reduce((nearestIndex, dist, i, arr) => (secondNear !== 0 && (dist !== arr[secondNear]) &&(dist !== arr[near]) && (dist < arr[nearestIndex])) ? i : nearestIndex, 0)
  // console.log({near, secondNear})
  // console.log(near)
  return {nearestTargetIndex: near, nearestDist: dists[near]}
}

function Firefly (x, y) {
  let startX = x || width * Math.random()
  let startY = y || height * Math.random()
  this.pos = new Vector(startX, startY)
  this.vel = new Vector(0.5 - Math.random(), 0.5 - Math.random())
  this.acc = new Vector(0.5 - Math.random(), 0.5 - Math.random())
  this.color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
  this.size = 5 + Math.random() * 10
}
Firefly.prototype.update = function () {
  if (Math.random() < 0.01) {
    // this.acc = this.acc.add().mult(.9)
    this.vel = this.vel.add(new Vector(0.5 - Math.random(), 0.5 - Math.random()).mult(2))
  }
  this.vel = this.vel.mult(.99)
  this.pos = this.pos.add(this.vel)
  if (this.pos.x > width + 15) {
    // this.pos = new Vector(width * Math.random(), height * Math.random())
    this.pos.x = -10
  } else if (this.pos.x < -15) {
    // this.pos = new Vector(width * Math.random(), height * Math.random())
    this.pos.x = width + 10
  }
  if (this.pos.y > height + 15) {
    // this.pos = new Vector(width * Math.random(), height * Math.random())
    this.pos.y = -10
  } else if (this.pos.y < -15) {
    // this.pos = new Vector(width * Math.random(), height * Math.random())
    this.pos.y = height + 10
  }
  // console.log(this.pos.x, this.pos.y, this.vel.x, this.vel.y)
}
Firefly.prototype.draw = function () {
  ctx.beginPath()
  ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
  ctx.fillStyle = this.color
  ctx.fill()
}


let frameCount = 0
function frame () {
  // frameCount++
  // if ((frameCount % 10)) {
  //   window.requestAnimationFrame(frame)
  //   return
  // }

  ctx.clearRect(0, 0, width, height)
  // ctx.fillStyle = 'rgba(41, 60, 78, 0.2)'
  // ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgb(30, 45, 58)'
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, handLength, 0, Math.PI * 2)
  ctx.stroke()
  for (let i = 1; i < targets.length; i++) {
    targets[i].update()
    targets[i].draw()
  }
  // let {nearestTargetIndex, nearestDist} = Bar.getNearestTarget(bars[0].pos, targets)
  let {nearestTargetIndex, nearestDist} = Bar.getNearestTarget(lastBar.tip, targets)
  // console.log(typeof targets[nearestTargetIndex] === 'object')
  // console.log(nearestTargetIndex)
  let nearestTarget = targets[nearestTargetIndex]
  if(nearestTargetIndex === 0){
    if(mouse.pos.quadDist(bars[0].pos) < handLength ** 2){
      Bar.moveToTarget(bars, mouse)
    }
  } else {
    Bar.moveToTarget(bars, nearestTarget)
  }

  ctx.strokeStyle = '#fff'
  ctx.beginPath()
  ctx.arc(nearestTarget.pos.x, nearestTarget.pos.y, 20, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#777'
  ctx.beginPath()
  ctx.arc(targets[secondNear].pos.x, targets[secondNear].pos.y, 17, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#000'
  ctx.beginPath()
  ctx.arc(targets[thisrdNear].pos.x, targets[thisrdNear].pos.y, 15, 0, Math.PI * 2)
  ctx.stroke()


  if(nearestTargetIndex > 0 && lastBar.tip.quadDist(nearestTarget.pos) < 100) {
    nearestTarget.vel.copy((new Vector(lastBar.tip.x - lastTipPos.x, lastBar.tip.y - lastTipPos.y)))
    ignore[nearestTargetIndex] = true
  }
  lastTipPos.copy(lastBar.tip)

  ctx.fillStyle = 'white'
  bars[0].draw()
  window.requestAnimationFrame(frame)
}
let fireflyNumber = Math.ceil(width > height ? height / 6 : width / 6)
Array(fireflyNumber).fill(0).map(_ => targets.push(new Firefly()))
targets.map((_, i) => ignore[i] = false)
setInterval(_ => targets.map((_, i) => ignore[i] = false), 2000)

bars = bars.fill(0).map(_ => new Bar({ x: 0, y: 0, angle: 0.1, length: barLength, width: barWidth }))
bars.map((bar, i) => bars[i + 1] ? bar.add(bars[i + 1]) : i)

lastBar = bars[bars.length - 1]

init()
frame()



window.addEventListener('resize', init)

window.addEventListener('wheel', e => {
  let delta = e.deltaY / 100
  if (delta > 0) {
    if(barNumber === 1) return
    barNumber--
    bars.pop()
  } else {
    if(barNumber > 98) return
    barNumber++
    bars.push(new Bar({ x: 0, y: 0, angle: 0.1, length: barLength, width: barWidth }))
    lastBar.add(bars[bars.length - 1])
  }
  lastBar = bars[bars.length - 1]
  lastBar.child = undefined
  bars.map(bar => bar.length = width > height ? height / bars.length / 2 : width / bars.length / 2)
  BarOutputElem.textContent = barNumber
})

Canvas.addEventListener('mousemove', e => {
  mouse.pos.x = e.pageX
  mouse.pos.y = e.pageY
})
Canvas.addEventListener('click', e => {
  mouse.pos.x = e.pageX
  mouse.pos.y = e.pageY
  targets.push(new Firefly(e.pageX, e.pageY))
})

Canvas.addEventListener('touchstart', e => {
  e.preventDefault()
  e.stopPropagation()
  mouse.pos.x = e.changedTouches[0].pageX
  mouse.pos.y = e.changedTouches[0].pageY
  targets.push(new Firefly(e.changedTouches[0].pageX, e.changedTouches[0].pageY))
})
Canvas.addEventListener('touchmove', e => {
  e.preventDefault()
  e.stopPropagation()
  mouse.pos.x = e.changedTouches[0].pageX
  mouse.pos.y = e.changedTouches[0].pageY
})
AddBarElem.addEventListener('click', e => {
  if(barNumber > 98) return
  barNumber++
  bars.push(new Bar({ x: 0, y: 0, angle: 0.1, length: barLength, width: barWidth }))
  lastBar.add(bars[bars.length - 1])
  lastBar = bars[bars.length - 1]
  lastBar.child = undefined
  bars.map(bar => bar.length = width > height ? height / bars.length / 2 : width / bars.length / 2)
  BarOutputElem.textContent = barNumber
})
RemoveBarElem.addEventListener('click', e => {
  if(barNumber === 1) return
  barNumber--
  bars.pop()
  lastBar = bars[bars.length - 1]
  lastBar.child = undefined
  bars.map(bar => bar.length = width > height ? height / bars.length / 2 : width / bars.length / 2)
  BarOutputElem.textContent = barNumber
})
