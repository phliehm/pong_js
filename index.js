const canvas = document.querySelector('canvas')  // get the canvas, could I have multiple?
const ctx = canvas.getContext("2d")       // get 2d context of canvas which gives access to 2d methods

canvas.width = 1024
canvas.height = 600

var pointsPlayer1 = 0
var pointsPlayer2 = 0


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

let pause = false
let spacebarDown = false      // spacebar currently pressed?
// change state of spacebar
function togglePause() {
    pause = !pause
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
        case ' ': 
            if (spacebarDown) {break}
            spacebarDown = true
            togglePause()
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
        case ' ':
            spacebarDown = false
    }
})

function animate() {

    // independend of time, so right now the frame rate is not fixed
    window.requestAnimationFrame(animate)       // Why do I need the "animate"?
    if (pause) {
        drawPause()    
        return
    }
    // draw black screen and white frame
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(1,1,canvas.width - 2, canvas.height - 2)
    //////////////
    // Player 1 //
    //////////////

    // up
    if (keys.w.pressed) {
        Player.position.y -= 10

    }
    // down
    if (keys.s.pressed) {
        Player.position.y += 10
    }

    fitAItoBall(AI,Ball)            // moves AI Paddle like Ball
    // Collision testing
    PaddleBallCollision(Player,Ball)
    PaddleBallCollision(AI,Ball)
    let statusWallCollision = WallCollision(Ball)
    

    // update and draw everything
    updatePoints(statusWallCollision)   // +1 if left or right wall hit
    drawPoints()
    drawMiddleLine()
    Player.update()
    AI.update()
    Ball.update()
    
}

animate()

// AI Paddle gets same y value as ball
function fitAItoBall(paddle,ball) {
    paddle.position.y = ball.position.y - paddle.height / 2
}

// Draw Pause

function drawPause() {
    ctx.font = '100px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.fillText('Pause',Math.floor(canvas.width / 2),Math.floor(canvas.height /2))
}

// Draw the points

function drawPoints() {
    ctx.font = '40px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.fillText(pointsPlayer1,Math.floor(canvas.width / 4),Math.floor(canvas.height /10))
    ctx.fillText(pointsPlayer2,Math.floor(canvas.width - canvas.width / 4),Math.floor(canvas.height /10))
}

// Update points

function updatePoints(side) {
    if (side === 'left') {
        pointsPlayer2 += 1
    }
    if (side === 'right') {
        pointsPlayer1 += 1
    }
}

// draw middle line

function drawMiddleLine() {
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'
    ctx.lineWidth = 2
    // using canvas.height/51 makes sure the line starts and stops with a stroke
    // any uneven number is fine and will just change the length of each stroke
    ctx.setLineDash([canvas.height/51,canvas.height/51]) // stroke length,space length
    ctx.beginPath()
    ctx.moveTo(canvas.width/2,0)
    ctx.lineTo(canvas.width/2,canvas.height)
    ctx.stroke()
}