const canvas = document.querySelector('canvas')  // get the canvas, could I have multiple?
const ctx = canvas.getContext("2d")       // get 2d context of canvas which gives access to 2d methods

canvas.width = 1024
canvas.height = 600

var pointsPlayer1 = 0
var pointsPlayer2 = 0

const maxPoints = 5


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
        pressed: false
    },
    s: {
        pressed: false
    },
    o: {
        pressed: false
    },
    l: {
        pressed: false
    },
    enter: {
        pressed: false
    },
}

let pause = false
let spacebarDown = false      // spacebar currently pressed?
// change state of spacebar
function togglePause() {
    pause = !pause
}

let endGame = false
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
        case 'o':
            keys.o.pressed = true
            break
        case 'l':
            keys.l.pressed = true
            break
        case ' ': 
            if (spacebarDown) {break}
            spacebarDown = true
            togglePause()
            break
        case 'Enter':
            keys.enter.pressed = true
            endGame = true
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
        case 'o':
            keys.o.pressed = false
            break
        case 'l':
            keys.l.pressed = false
            break  
        case ' ':
            spacebarDown = false
            break
        case '\n':
            keys.enter.pressed = false
            break
    }
})


function animate() {
    
    // independend of time, so right now the frame rate is not fixed
    window.requestAnimationFrame(animate)       // Why do I need the "animate" --> recursion
     
    if (pause && !endGame) {
        console.log("Pausing Game")
        drawPause()   
        return
    }

    if (endGame) {
        console.log("Ending game")
        checkAndDrawWinner()  
        return
    }

    // check if someone has won
    checkWinLoose()
    
    // draw black screen and white frame
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = 'black'
    ctx.fillRect(1,1,canvas.width - 2, canvas.height - 2)
    //////////////
    // Player 1 //
    //////////////


    //fitAItoBall(AI,Ball)            // moves AI Paddle like Ball
    // simulates AI Movement by chaning the velocity
    botMovement(AI,Ball)

    // Collision testing
    PaddleBallCollision(Player,Ball)
    PaddleBallCollision(AI,Ball)
    let statusWallCollision = WallCollision(Ball)
    

    // update and draw everything
    updatePoints(statusWallCollision)   // +1 if left or right wall hit
    drawPoints()
    drawMiddleLine()
    updateSpeedofPaddle(Player,keys.w.pressed,keys.s.pressed)
    updateSpeedofPaddle(AI,keys.o.pressed,keys.l.pressed)
    Player.update()
    AI.update()
    Ball.update()
    
}
animate()

// AI Paddle gets same y value as ball
function fitAItoBall(bot,ball) {
    bot.position.y = ball.position.y - bot.height / 2
}

// better bot which doesnt always win
function botMovement(bot,ball) {
    let r = Math.random()

    // ball is moving away
    if (ball.velocity.x < 0) {
        bot.velocity.y = 0
        return
    }
    // ball is not close enough yet
    if (ball.position.x < 2 * canvas.width / 4) {
        bot.velocity.y = 0
        keys.o.pressed = false
        keys.l.pressed = false
        return
    }
    // randomly choose if paddle moves, >1 no effect
    if (r > 1) {return}
    // ball is higher than bot, so move up
    if (bot.position.y > ball.position.y - bot.height / 2) {
        keys.o.pressed = true
        keys.l.pressed = false
        return
    }
    // move down
    keys.l.pressed = true
    keys.o.pressed = false
}

// updates the speed of the paddle
function updateSpeedofPaddle(paddle,pressedUp,pressedDown){
    //console.log(pressedUp)
    if (pressedUp == true) {
        if (paddle.velocity.y > 0) {paddle.velocity.y = 0}
        paddle.velocity.y -= 0.7
        return
    }
    if (pressedDown === true) {
        if (paddle.velocity.y < 0) {paddle.velocity.y = 0}
        paddle.velocity.y +=0.7
        return
    }

    // deccelerating
    paddle.velocity.y *= 0.8
    // old function, no velocity

        // up 
    /*
    if (keys.w.pressed) {
        Player.position.y -= 10

    }
    // down
    if (keys.s.pressed) {
        Player.position.y += 10
    }
    */
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

// check who is the winner
function checkAndDrawWinner() {
    // draw rectangle to have proper background, with frame
    drawMiddleRectangle()

    // set text according to state
    if (pointsPlayer1 === pointsPlayer2) {
        text = "It's a draw"
    } 
    if (pointsPlayer1 > pointsPlayer2) {text = "Player 1 won"}   
    if (pointsPlayer1 < pointsPlayer2) {text = "Player 2 won"}
    // write text to the middle of the screen
    drawTextInTheMiddle(text)

    // restart text
    ctx.font = '20px Arial'
    text = 'Hit "s" if you want to restart the game'
    ctx.fillText(text,Math.floor(canvas.width / 2),Math.floor(canvas.height /2)+70)

    resetGame()

}

// resets the game
function resetGame() {
    if (keys.s.pressed === true) {
        pointsPlayer1 = 0
        pointsPlayer2 = 0
        Player.position.y = 300
        AI.position.y = 300
        Ball.position.x = canvas.width/2
        Ball.position.y = canvas.height/2
        //startGame()
        endGame = false
    }
    
}

/*
// countdown to start --> doesnt work right now, sync problem
async function startGame() {
    drawMiddleRectangle()
    drawTextInTheMiddle('3')
    console.log(3)
    await new Promise((resolve) => setTimeout(resolve, 500)); // Delay before proceeding to the next step
    drawMiddleRectangle()
    drawTextInTheMiddle('2')
    console.log(2)
    await new Promise((resolve) => setTimeout(resolve, 500));
    drawMiddleRectangle()
    drawTextInTheMiddle('1')
    console.log(1)
    await new Promise((resolve) => setTimeout(resolve, 500));
}
*/

// sleep function, not really working
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

// draw a rectangle in the middle
function drawMiddleRectangle() {
    // draw rectangle to have proper background, with frame
    ctx.fillStyle = 'white'
    ctx.fillRect(canvas.width/4,canvas.height/4,canvas.width/2,canvas.height/2)
    ctx.fillStyle = 'black'
    ctx.fillRect(canvas.width/4+1,canvas.height/4+1,canvas.width/2-2,canvas.height/2-2)
}

function drawTextInTheMiddle(text) {
    // set properties for the text
    ctx.font = '50px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.fillText(text,Math.floor(canvas.width / 2),Math.floor(canvas.height /2))
}

// ends game after max points for one of the players
function checkWinLoose() {
    if (pointsPlayer1 === maxPoints || pointsPlayer2 === maxPoints) {
        endGame = true
        checkAndDrawWinner()
    }
}