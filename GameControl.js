var canvas = document.getElementById('myCanvas');
var context = canvas.getContext("2d");

// Ball properties
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;
var ballColor = "#0095DD"

// Paddle properties
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2
var paddleY = (canvas.height - paddleHeight);
var paddleColor = "#143872";
var paddleWrapAround = false;
var paddleMove = 5;

// Keyboard event variables
var rightPressed = false;
var leftPressed = false;

// Brick variables
var brickRowCount = 3;
var brickColumnCount = 1;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricksRemaining = brickRowCount * brickColumnCount;

var bricks;

function reset() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2
    paddleY = (canvas.height - paddleHeight);
    initializeBricks();
    drawBricks();
}

function initializeBricks() {
    bricks = []
    bricksRemaining = brickRowCount * brickColumnCount;

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {
                x: 0,
                y: 0,
                brickStatus: 1
            };
        }
    }
}


function drawBall() {
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    context.fillStyle = ballColor;
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    context.fillStyle = paddleColor;
    context.fill();
    context.closePath();
}

function drawBricks() {
    var brickXPosition = brickOffsetLeft;
    for (var c = 0; c < brickColumnCount; c++) {
        var brickYposition = brickOffsetTop;
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].brickStatus) {
                bricks[c][r].x = brickXPosition;
                bricks[c][r].y = brickYposition;
                context.beginPath();
                context.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                context.fillStyle = "#0095DD"
                context.fill();
                context.closePath();
            }

            brickYposition += brickHeight + brickPadding;
        }
        brickXPosition += brickWidth + brickPadding;
    }
}

function updateAndCheckGameStatus() {
    bricksRemaining--;
    if (bricksRemaining === 0) {
        alert('Game Won!!')
        reset();
    }
}

function collisionDetection() {
    var b;
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            b = bricks[c][r];

            var brickYCollision = (y + ballRadius) > b.y && (y + ballRadius) < (b.y + brickHeight);
            var brickXCollision = (x + ballRadius) > b.x && (x - ballRadius) < (b.x + brickWidth);

            var sideCollision = (x + ballRadius) == b.x || (x - ballRadius) == (b.x + brickWidth);

            if (b.brickStatus && brickXCollision && brickYCollision) {
                updateAndCheckGameStatus();
                b.brickStatus = 0;
                dy = -dy;
            }

            if (b.brickStatus && sideCollision && brickYCollision) {
                updateAndCheckGameStatus();
                b.brickStatus = 0;
                dx = -dx;
            }

        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Control ball movement
    drawBall();
    if (y + dy - ballRadius < 0) {
        dy = -dy;
        ballColor = generateRandomColor();
    } else if (y + dy + ballRadius > canvas.height) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            y -= paddleHeight;
            dy = -dy;
        } else {
            //alert('GAME OVER!!');
            //reset();
        }
    }

    if (x + dx + ballRadius > canvas.width || x + dx - ballRadius < 0) {
        dx = -dx;
        ballColor = generateRandomColor()
    }

    x += dx;
    y += dy;

    // Control paddle movement
    drawPaddle();
    if (!paddleWrapAround) {
        if (rightPressed && (paddleX + paddleWidth) <= canvas.width) {
            paddleX += paddleMove;
        }

        if (leftPressed && paddleX >= 0) {
            paddleX -= paddleMove;
        }
    } else {
        if (rightPressed) {
            paddleX = (paddleX + paddleMove) % canvas.width
        }

        if (leftPressed) {
            paddleX -= paddleMove;
            paddleX = paddleX < 0 ? canvas.width - paddleX : paddleX;
        }
    }

    // Collision Detection
    collisionDetection();

    // Brick logic
    drawBricks();



}

function generateRandomColor() {
    var letters = '0123456789ABCDEF';
    var hexColorCode = '#';
    for (var i = 0; i < 6; i++) {
        hexColorCode += letters[Math.floor(Math.random() * 16)];
    }
    return hexColorCode;
}

function keyDownEventHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = true;
    }

    if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpEventHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = false;
    }

    if (e.keyCode === 37) {
        leftPressed = false;
    }
}

document.addEventListener('keydown', keyDownEventHandler, false);
document.addEventListener('keyup', keyUpEventHandler, false);


initializeBricks();
drawBricks();
setInterval(draw, 10);