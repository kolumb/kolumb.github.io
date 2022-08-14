class Texture {
    loaded = false
    constructor(path, specification) {
        this.image = new Image()
        this.image.src = path
        this.image.addEventListener("load", (e => {
            this.loaded = true
        }).bind(this))
        this.specification = specification
    }
}
