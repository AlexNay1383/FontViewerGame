function startBrickBreaker(font, fontSize) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Function to set font size for canvas
    function setFont() {
            ctx.font = `${fontSize}px Arial`;
    }

    // Random characters for different elements
    function randomChar() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;\':",.<>?/';
        return characters.charAt(Math.floor(Math.random() * characters.length));
    }

    let paddlechars = [];
    for (let i = 0; i <= Math.ceil(canvas.width / fontSize) + 1; i++) {
        paddlechars.push(randomChar());
    }

    // Calculate element sizes based on fontSize
    let paddleWidth = fontSize * 8; // Paddle width proportional to font size
    let paddleHeight = fontSize;    // Paddle height proportional to font size
    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballRadius = fontSize / 2;  // Ball radius proportional to font size

    let brickRowCount = Math.floor(canvas.height / (fontSize * 5));  // Number of brick rows based on fontSize
    let brickColumnCount = Math.floor(canvas.width / (fontSize * 4)); // Number of brick columns based on fontSize
    let brickWidth = canvas.width / brickColumnCount - fontSize / 2;  // Width adjusted based on number of columns and fontSize
    let brickHeight = fontSize * 2; // Height adjusted based on fontSize
    let brickPadding = fontSize / 2; // Padding adjusted based on fontSize
    let brickOffsetTop = fontSize * 3;
    let brickOffsetLeft = fontSize * 2;

    let bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            let isSpecial = Math.random() < 0.2;  // 20% chance of being a special brick
            bricks[c][r] = { x: 0, y: 0, status: 1, special: isSpecial, char: randomChar() };
        }
    }

    let balls = [{ x: canvas.width / 2, y: canvas.height - paddleHeight - ballRadius, dx: 2, dy: -2, char: randomChar() }];
    let rightPressed = false;
    let leftPressed = false;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function drawBall(ball) {
        setFont();
        ctx.fillStyle = "#0095DD";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ball.char, ball.x, ball.y);  // Using random character for the ball
    }

    function drawPaddle() {
        setFont();
        ctx.fillStyle = "#0095DD";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < paddleWidth / fontSize; i++) {
            ctx.fillText(paddlechars[i], paddleX + i * fontSize + fontSize / 2, canvas.height - paddleHeight / 2); // Using random character for the paddle
        }
    }

    function drawBricks() {
        setFont();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.fillStyle = bricks[c][r].special ? "#FF6347" : "#0095DD";  // Red for special bricks
                    ctx.fillText(bricks[c][r].char, brickX + brickWidth / 2, brickY + brickHeight / 2);
                }
            }
        }
    }

    function collisionDetection() {
        balls.forEach((ball) => {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    let b = bricks[c][r];
                    if (b.status === 1) {
                        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                            ball.dy = -ball.dy;
                            b.status = 0;
                            if (b.special) {
                                activatePowerUp(c, r);
                            }
                        }
                    }
                }
            }
        });
    }

    function activatePowerUp(c, r) {
        const powerUpType = Math.random();
        if (powerUpType < 0.33) {
            // Bigger Paddle
            paddleWidth *= 1.5;
            setTimeout(() => paddleWidth /= 1.5, 10000);  // Revert after 10 seconds
        } else if (powerUpType < 0.66) {
            // Larger Ball
            ballRadius *= 1.5;
            setTimeout(() => ballRadius /= 1.5, 10000);  // Revert after 10 seconds
        } else {
            // Multiply Balls
            balls.push({ x: canvas.width / 2, y: canvas.height - paddleHeight - ballRadius, dx: 2, dy: -2, char: randomChar() });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        balls.forEach(drawBall);
        drawPaddle();
        collisionDetection();

        balls.forEach(ball => {
            // Ball movement logic
            if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
                ball.dx = -ball.dx;
            }
            if (ball.y + ball.dy < ballRadius) {
                ball.dy = -ball.dy;
            } else if (ball.y + ball.dy > canvas.height - ballRadius) {
                if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                    ball.dy = -ball.dy;
                } else {
                    balls.splice(balls.indexOf(ball), 1);  // Remove ball if it misses the paddle
                    if (balls.length === 0) {
                        ctx.font = `${fontSize * 2}px ${font}`; // Bigger font for the game over message
                        ctx.fillStyle = "#FF0000";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
                        setTimeout(() => document.location.reload(), 3000);  // Reload after 3 seconds
                    }
                }
            }
            ball.x += ball.dx;
            ball.y += ball.dy;
        });

        // Paddle movement logic
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        requestAnimationFrame(draw);
    }

    draw();
}
