const canvas = document.querySelector('canvas')  // get the canvas, could I have multiple?
const ctx = canvas.getContext("2d")       // get 2d context of canvas which gives access to 2d methods

canvas.width = 1024
canvas.height=600


// create a new Paddle for the player
const Player = new Paddle ({
    position: {
        x: 20,
        y: 300,
    },
})

// create AI
const AI = new Paddle ({
    position: {
        x: 980,
        y: 300,
    }
})

// Create the ball

const Ball = new Projectile ({
    position: {
        x: canvas.width/2,
        y: canvas.height/2,
    },
    velocity: {
        x : -6,
        y : 2,
    },
})
// keyboard control

const keys = {
    w: {
        pressed : false
    },
    s: {
        pressed : false
    },
}

// I guess the EventListeners just run in parallel all the time?
// keys pressed
window.addEventListener('keydown',(event) => {
    switch (event.key) {
        case 'w':
            keys.w.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
    }
})

// keys released
window.addEventListener('keyup',(event)=> {
    switch (event.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break     
    }
})

function animate() {
    
    // independend of time, so right now the frame rate is not fixed
    window.requestAnimationFrame(animate)       // Why do I need the "animate"?

    // draw black screen
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(1,1,canvas.width - 2, canvas.height - 2)
    // up
    if (keys.w.pressed) {
        Player.position.y -= 10

    }
    // down
    if (keys.s.pressed) {
        Player.position.y += 10
    }

    fitAItoBall(AI,Ball)
    PaddleBallCollision(Player,Ball)
    PaddleBallCollision(AI,Ball)
    WallCollision(Ball)
    Player.update()
    AI.update()
    Ball.update()
    
}

Player.update()

animate()

// AI Paddle gets same y value as ball
function fitAItoBall(paddle,ball) {
    paddle.position.y = ball.position.y - paddle.height / 2
}