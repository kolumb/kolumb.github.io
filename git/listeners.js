"use strict";
const resizeHandler = () => {
    width = innerWidth / 2;
    height = innerHeight;
    canvas.height = height;
    canvas.width = width;
    // if (pause) render();
};
window.addEventListener("resize", resizeHandler);

const pointerdownHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
    Input.downState = true;
};
Canvas.addEventListener("pointerdown", pointerdownHandler);

const pointermoveHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
};
Canvas.addEventListener("pointermove", pointermoveHandler);

const pointerupHandler = function(e) {
    Input.pointer.set(e.offsetX, e.offsetY);
    Input.downState = false;
};
Canvas.addEventListener("pointerup", pointerupHandler);

const keydownHandler = function(e) {
    switch (e.code) {
        case "Space":
            if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        case "KeyP":
            pause = !pause;
            if (pause === false) {
                frame();
            }
            break;
        case "ArrowUp":
        case "KeyW":
            Input.up = true;
            break;
        case "ArrowDown":
        case "KeyS":
            Input.down = true;
            break;
        case "ArrowLeft":
        case "KeyA":
            Input.left = true;
            break;
        case "ArrowRight":
        case "KeyD":
            Input.right = true;
            break;
    }
};
window.addEventListener("keydown", keydownHandler);

const keyupHandler = function(e) {
    switch (e.code) {
        case "ArrowUp":
        case "KeyW":
            Input.up = false;
            break;
        case "ArrowDown":
        case "KeyS":
            Input.down = false;
            break;
        case "ArrowLeft":
        case "KeyA":
            Input.left = false;
            break;
        case "ArrowRight":
        case "KeyD":
            Input.right = false;
            break;
    }
};
window.addEventListener("keyup", keyupHandler);


document.querySelector("#CommandLineInput").addEventListener('keydown', (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
        if(e.currentTarget.value.startsWith("git commit")) {

            commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
            commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
            commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
            commits.push(new Commit(commits[Math.floor(Math.random() * commits.length)]))
        }
        // HistoryElem.innerHTML += e.currentTarget.value + '\n'
        HistoryElem.insertAdjacentElement('beforeend', createElement(`<li>${e.currentTarget.value}</li>`))
        e.currentTarget.value = ''
    }
})