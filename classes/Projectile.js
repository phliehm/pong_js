class Projectile {
    constructor({
        position,
        velocity,
      }) {
        this.position = position
        this.velocity = velocity
        this.radius = 10
        this.minVy = 1
        this.maxVy = 10
        this.standardVx = 6
        this.standardVy = 2
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
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI)
        ctx.fill()
        // or as rectangle, delete above 3 lines
        //ctx.fillRect(this.position.x,this.position.y,this.radius,this.radius)
    }
   // collision()
   // resets the projectiles position and velocity
   reset() {
    // reset position to middle
    this.position.x = canvas.width / 2
    this.position.y = canvas.height / 2
     // reset ball velocity to default
    this.velocity.x = this.standardVx
    this.velocity.y = this.standardVy
   }
}