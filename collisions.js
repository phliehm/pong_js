function PaddleBallCollision(paddle,ball) {
    // ball is not higher or lower than the paddle
    if (!(paddle.position.y <= ball.position.y + ball.radius &&       // top corner of paddle
        paddle.position.y + paddle.height >= ball.position.y)) {
            return
        } 

    // paddle is left
    if (paddle.position.x < canvas.width/2){ 
        if (!(paddle.position.x + paddle.width >= ball.position.x + ball.velocity.x)){      // x direction
            return
         }
         // when ball is behind paddle
        if (paddle.position.x + paddle.width >= ball.position.x) {return}
    }
    
    // paddle is right
    if (paddle.position.x > canvas.width/2) {
        if (!(paddle.position.x <= ball.position.x + ball.velocity.x + ball.radius)) {
            return
        }
        // when ball is behind paddle
        if (paddle.position.x <= ball.position.x) {return}           
    }
    
    // reflection
    ball.velocity.x = -ball.velocity.x 
    ball.velocity.y = -ball.velocity.y - 0.4 * paddle.velocity.y // change angle
    if (Math.abs(ball.velocity.y) < ball.minVy) {               // restrict velocity
        ball.velocity.y = Math.sign(ball.velocity.y)*ball.minVy
    }
    if (Math.abs(ball.velocity.y>ball.maxVy)) {
        ball.velocity.y = Math.sign(ball.velocity.y)*ball.maxVy
    }
}

// returns 'left' when the ball hit the left wall, and 'right' ...
// returns 'none' when no collision
function WallCollision(ball) {
    if (ball.position.x + ball.radius <= 0) {
        ball.reset()
        return 'left'
    } 
    if (ball.position.x >= canvas.width) {
        ball.reset()
        return 'right'
    }
    if (ball.position.y  <= 0 || ball.position.y + ball.radius >= canvas.height) {
        ball.velocity.y = -ball.velocity.y
    }
    return 'none'
    
}
  