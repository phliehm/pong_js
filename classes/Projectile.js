class Projectile {
    constructor({
        position,
        velocity
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 20
    }


    update() {
        this.updatePosition()
        this.draw()
    }

    updatePosition() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    draw() {
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x,this.position.y,this.radius,this.radius)
    }
   // collision()
}