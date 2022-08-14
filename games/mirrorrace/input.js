"use strict";

class Input {
    static up = false;
    static down = false;
    static left = false;
    static right = false;
    static pointer = new Vector();
    static speed = new Vector();
    static downState = false;

    static pointerdownHandler(e) {
        Input.pointer.set(e.offsetX, e.offsetY);
        Input.downState = true;
    }
    static pointermoveHandler(e) {
        Input.pointer.set(e.offsetX, e.offsetY);
    }
    static pointerupHandler(e) {
        Input.pointer.set(e.offsetX, e.offsetY);
        Input.downState = false;
    }

    static keydownHandler(e) {
        switch (e.code) {
            case KEY.space:
                if (e.target.tagName === "BUTTON") return;
            case KEY.p:
                pause = !pause;
                if (pause === false) {
                    frame();
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
}

const KEY = {
    space: "Space",
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
};
for (
    let charCode = "a".charCodeAt(0);
    charCode <= "z".charCodeAt(0);
    charCode++
) {
    KEY[String.fromCharCode(charCode)] =
        "Key" + String.fromCharCode(charCode - 32);
}
