function PaddleBallCollision(paddle,ball) {

    if (!(paddle.position.y <= ball.position.y + ball.radius &&       // top corner of paddle
        paddle.position.y + paddle.height >= ball.position.y)) {
            return
        } 

    // paddle is left
    if (paddle.position.x < canvas.width/2){ 
        if (!(paddle.position.x + paddle.width >= ball.position.x)){      // x direction
            return
         }
    }
    
    // paddle is right
    if (paddle.position.x > canvas.width/2) {
        if (!(paddle.position.x <= ball.position.x + ball.radius)) {
            return
        }           
    }
    ball.velocity.x = -ball.velocity.x
    ball.velocity.y = -ball.velocity.y 
}

function WallCollision(ball) {
    if (ball.position.x + ball.radius <= 0 || ball.position.x >= canvas.width) {
        ball.position.x = canvas.width / 2
        ball.position.y = canvas.height / 2
    }
    if (ball.position.y + ball.radius <= 0 || ball.position.y >= canvas.height) {
        ball.velocity.y = -ball.velocity.y
    }
    
}
  