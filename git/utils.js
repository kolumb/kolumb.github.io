"use strict";
function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

function clamp(n, limit) {
    if (n < 0) {
        return Math.max(n, limit)
    } else {
        return Math.min(n, limit)
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function createElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild
}

function randomHash() {
    const chars = '0123456789abcde'
    return new Array(6).fill(0).map(() => chars[Math.floor(Math.random()*chars.length)]).join('')
}
