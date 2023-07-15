class Paddle {
    constructor({
        position
    }) {
    this.position = position
    this.velocity = {
        x: 0,
        y: 0,
    }
    this.width = 20
    this.height = 100
    }
    update() {
        this.move()
        this.draw()
    }
    draw() {
        ctx.fillStyle = 'rgb(255,255,255)'
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    move() {
        this.position.y += this.velocity.y
        // upper border
        if (this.position.y < 0) {
            this.position.y = 0
        }
        if (this.position.y >ctx.canvas.height - this.height) {
            this.position.y = ctx.canvas.height - this.height
        }
    }
}