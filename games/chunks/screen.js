class Screen {
    static updateSize() {
        Screen.size = new Vector(window.innerWidth, window.innerHeight);
        canvas.width = Screen.size.x;
        canvas.height = Screen.size.y;
        Screen.center = Screen.size.divide(2)
        // ctx.imageSmoothingEnabled = false;
        ctx.font = "15px sans-serif"
        Chunk.limit.x = Math.ceil(Screen.size.x / (Chunk.size * Chunk.tileSize)) + 1
        Chunk.limit.y = Math.ceil(Screen.size.y / (Chunk.size * Chunk.tileSize)) + 1
    }

    static resizeHandler() {
        Screen.updateSize();
        if (pause) render();
    }
}
