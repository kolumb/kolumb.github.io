"use strict";

class Input {
    static up = false;
    static down = false;
    static left = false;
    static right = false;
    static pointer = new Vector();
    static speed = new Vector();
    static downState = false;
}

SpawnMoreElem.addEventListener("pointerup", e => {
    e.stopPropagation()
    SpawnMoreElem.style.display = "none"
    putDistance = 50000
    for (let i = 0; i < 50; i++) {
        people.push(new Entity(dudeTexture, new Vector(width * Math.random(), height * Math.random())))
    }
})

const pointerdownHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
    Input.downState = true;
    if (pause === false) {
        pause = true;
        frame()
    }
};
const pointermoveHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
};
const pointerupHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
    Input.downState = false;
    if (pause) {
        pause = false;
        requestAnimationFrame(frame)
    }
};

const KEY = {
    space: "Space",
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    equal: "Equal",
    numAdd: "NumpadAdd",
};
for (
    let charCode = "a".charCodeAt(0);
    charCode <= "z".charCodeAt(0);
    charCode++
) {
    KEY[String.fromCharCode(charCode)] =
        "Key" + String.fromCharCode(charCode - 32);
}

const keydownHandler = function(e) {
    switch (e.code) {
        case KEY.space:
            if (e.target.tagName === "BUTTON") return;
        case KEY.p:
            pause = !pause;
            if (pause === false) {
                requestAnimationFrame(frame)
            }
            break;
        case KEY.up:
        case KEY.w:
            Input.up = true;
            break;
        case KEY.down:
        case KEY.s:
            Input.down = true;
            break;
        case KEY.left:
        case KEY.a:
            Input.left = true;
            break;
        case KEY.right:
        case KEY.d:
            Input.right = true;
            break;
    }
};

const keyupHandler = function(e) {
    switch (e.code) {
        case KEY.up:
        case KEY.w:
            Input.up = false;
            break;
        case KEY.down:
        case KEY.s:
            Input.down = false;
            break;
        case KEY.left:
        case KEY.a:
            Input.left = false;
            break;
        case KEY.right:
        case KEY.d:
            Input.right = false;
            break;
        case KEY.equal:
        case KEY.numAdd:
            people.push(new Entity(dudeTexture, new Vector(width * Math.random(), height * Math.random())))
            break;
    }
};
