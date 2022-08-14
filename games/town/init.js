"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let pause = false;
let frames = 0
let lastFrameTime = 0;
const pixelSize = 10
let globalAngle

let width;
let height;
let lesser;
let bigger;
Screen.updateSize();

Input.pointer.x = Input.pointer.y = 200

const bgCanvas = document.createElement("canvas")
bgCanvas.width = Math.ceil(width / pixelSize)
bgCanvas.height = Math.ceil(height / pixelSize)
const bgCtx = bgCanvas.getContext("2d")
const bgImage = new Image()
bgImage.src = "grassbg.png"
bgImage.addEventListener("load", e => {
    bgCtx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height)
})

// const grassColors = ["#7ea046", "#58a046", "#58b846", "#8db846", "#8dc956", "#8dc946"]
const grassColors = ["#6aca35", "#6aca4b", "#00b938", "#6da13c", "#00a13c", "#77b938"]
const dirtColors = ["#716036", "#68502d", "#5c482b", "#705a2f", "#59542b", "#59542b"]
// const sandColors = ["#e5bd4d", "#e7c851", "#f4d05b", "#f4d66c", "#edd35a", "#efc652"]
const sandColors = ["#d2bc7d", "#c4ad70", "#c5b172", "#d5c388", "#ccba78", "#ccb577"]
// const sandColors = ["#baa87a", "#bbac7c", "#c8b787", "#ccbe91", "#c2b081", "#c2b482"]
const rockColors = ["#686e5e", "#626e5e", "#667663", "#707663", "#767f6d", "#727b66"]

const people = []
const spritePath = "miniguyspritesheet.png"
// const spritePath = "miniguyspritesheetDebug.png"
const dudeTexture = new Texture(spritePath,
    { standings:
        [ { start: new Vector(0, 0 * 7), length: 1 }
        , { start: new Vector(0, 1 * 7), length: 1 }
        , { start: new Vector(0, 2 * 7), length: 1 }
        , { start: new Vector(0, 3 * 7), length: 1 }
        , { start: new Vector(0, 4 * 7), length: 1 }
        , { start: new Vector(0, 5 * 7), length: 1 }
        , { start: new Vector(0, 6 * 7), length: 1 }
        , { start: new Vector(0, 7 * 7), length: 1 }
        ]
    , walkings:
        [ { start: new Vector(7, 0 * 7), length: 4 }
        , { start: new Vector(7, 1 * 7), length: 4 }
        , { start: new Vector(7, 2 * 7), length: 4 }
        , { start: new Vector(7, 3 * 7), length: 4 }
        , { start: new Vector(7, 4 * 7), length: 4 }
        , { start: new Vector(7, 5 * 7), length: 4 }
        , { start: new Vector(7, 6 * 7), length: 4 }
        , { start: new Vector(7, 7 * 7), length: 4 }
        ]
    , bringings:
        [ { start: new Vector(35, 0 * 7), length: 4 }
        , { start: new Vector(35, 1 * 7), length: 4 }
        , { start: new Vector(35, 2 * 7), length: 4 }
        , { start: new Vector(35, 3 * 7), length: 4 }
        , { start: new Vector(35, 4 * 7), length: 4 }
        , { start: new Vector(35, 5 * 7), length: 4 }
        , { start: new Vector(35, 6 * 7), length: 4 }
        , { start: new Vector(35, 7 * 7), length: 4 }
        ]
    , size: new Vector(7, 7)
    }
)
people.push(new Entity(dudeTexture, new Vector(100, 100)))
people.push(new Entity(dudeTexture, new Vector(300, 100)))
people.push(new Entity(dudeTexture, new Vector(100, 300)))
people.push(new Entity(dudeTexture, new Vector(400, 200)))
people.push(new Entity(dudeTexture, new Vector(600, 150)))

frame();

window.addEventListener(EVENT.resize, Screen.resizeHandler);
canvas.addEventListener(EVENT.pointerdown, pointerdownHandler);
canvas.addEventListener(EVENT.pointermove, pointermoveHandler);
window.addEventListener(EVENT.pointerup, pointerupHandler);
window.addEventListener(EVENT.keydown, keydownHandler);
window.addEventListener(EVENT.keyup, keyupHandler);
