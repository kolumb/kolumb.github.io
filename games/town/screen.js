class Screen {
    static updateSize() {
        width = innerWidth;
        height = innerHeight;
        canvas.height = height;
        canvas.width = width;
        lesser = width < height ? width : height;
        bigger = width > height ? width : height;
        ctx.imageSmoothingEnabled = false;
    }
}

function resizeHandler() {
    Screen.updateSize();
    if (pause) render();
}
