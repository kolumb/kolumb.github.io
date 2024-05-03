"use strict";

class Input {
    static up = false;
    static down = false;
    static left = false;
    static right = false;
    static pointer = new Vector();
    static speed = new Vector();
    static downState = false;
    static startPos = new Vector();
    static gestureDeadZone = 30;
    static gestureDeadAngle = 0.2;

    static pointerdownHandler(e) {
        Input.pointer.set(e.offsetX, e.offsetY);
        Input.startPos = Input.pointer.copy()
        Input.downState = true;
    }
    static pointermoveHandler(e) {
        Input.pointer.set(e.offsetX, e.offsetY);
    }
    static pointerupHandler(e) {
        Input.pointer.set(e.offsetX, e.offsetY);
        Input.downState = false;
        Input.up = Input.down = Input.left = Input.right = false
    }

    static keydownHandler(e) {
        switch (e.code) {
            case KEY.space:
                if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;
            case KEY.p:
                pause = !pause;
                if (pause === false) {
                    frame();
                }
                break;
            case KEY.bracketL:
                Vehicle.followLooser()
                break;
            case KEY.bracketR:
                Vehicle.followLeader()
                break;
            case KEY.escape:
                cameraTarget = car
                break;
            case KEY.g:
                Input.graphicsToggle()
                break;
            case KEY.h:
                car.toggleHelicopter()
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
    }
    static keyupHandler(e) {
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
        }
    }
    static graphicsToggle(e) {
        lowGraphics = !lowGraphics
        localStorage.setItem("lowGraphicsSetting", String(lowGraphics))
        if (graphicsSettingsInput) graphicsSettingsInput.checked = lowGraphics
        render()
    }
}

const KEY = {
    space: "Space",
    escape: "Escape",
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    bracketL: "BracketLeft",
    bracketR: "BracketRight",
};
for (
    let charCode = "a".charCodeAt(0);
    charCode <= "z".charCodeAt(0);
    charCode++
) {
    KEY[String.fromCharCode(charCode)] =
        "Key" + String.fromCharCode(charCode - 32);
}
