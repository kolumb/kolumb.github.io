class Screen {
    static updateSize() {
        width = innerWidth;
        height = innerHeight;
        canvas.height = height;
        canvas.width = width;
        ctx.imageSmoothingEnabled = false;
        lesser = width < height ? width : height;
        bigger = width > height ? width : height;
    }

    static resizeHandler() {
        Screen.updateSize();
        if (pause) render();
    }
}
