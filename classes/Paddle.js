class Paddle {
    constructor({
        position
    }) {
    this.position = position
    this.width = 20
    this.height = 100
    }
    update() {
        this.draw()
    }
    draw() {
        ctx.fillStyle = 'rgb(255,255,255)'
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}