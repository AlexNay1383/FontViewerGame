function startBrickBreaker(font, fontSize) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Function to generate a random character
    const randomChar = () => String.fromCharCode(33 + Math.floor(Math.random() * 94));

    // Generate random characters for different elements
    let paddleChar = randomChar();
    let ballChar = randomChar();

    // Initial sizes
    let paddleWidth = canvas.width / 8;
    let paddleHeight = 10;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let ballRadius = canvas.width / 50;
    let currentFontSize = fontSize;  // Use passed font size

    // Size calculations
    let brickRowCount = Math.floor(canvas.height / 100);
    let brickColumnCount = Math.floor(canvas.width / 80);
    let brickWidth = canvas.width / brickColumnCount - 10;
    let brickHeight = canvas.height / (brickRowCount * 2);
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;

    let bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            let isSpecial = Math.random() < 0.2;
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1,
                special: isSpecial,
                char: randomChar()
            };
        }
    }

    let balls = [{ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2 }];
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
        ctx.font = `${currentFontSize}px ${font}`;
        ctx.fillStyle = "#0095DD";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ballChar, ball.x, ball.y);  // Using random character for the ball
    }

    function drawPaddle() {
        ctx.font = `${currentFontSize}px ${font}`;
        ctx.fillStyle = "#0095DD";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < paddleWidth / currentFontSize; i++) {
            ctx.fillText(paddleChar, paddleX + i * currentFontSize + currentFontSize / 2, canvas.height - paddleHeight / 2); // Using random character for the paddle
        }
    }

    function drawBricks() {
        ctx.font = `${currentFontSize}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.fillStyle = bricks[c][r].special ? "#FF6347" : "#0095DD";  // Red for special bricks, blue for normal bricks
                    ctx.fillText(bricks[c][r].char, brickX + brickWidth / 2, brickY + brickHeight / 2);  // Use the unique character for the brick
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
            currentFontSize *= 1.5;  // Increase font size
            setTimeout(() => {
                ballRadius /= 1.5;  // Revert ball size
                currentFontSize /= 1.5;  // Revert font size
            }, 10000);  // Revert after 10 seconds
        } else {
            // Multiply Balls
            balls.push({ x: canvas.width / 2, y: canvas.height - 30, dx: 2, dy: -2 });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        balls.forEach(drawBall);
        drawPaddle();
        collisionDetection();

        // Move ball
        balls.forEach((ball) => {
            if (!isPaused) {
                ball.x += ball.dx;
                ball.y += ball.dy;

                if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) {
                    ball.dx = -ball.dx;
                }
                if (ball.y + ball.dy < ballRadius) {
                    ball.dy = -ball.dy;
                } else if (ball.y + ball.dy > canvas.height - ballRadius) {
                    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                        ball.dy = -ball.dy;
                    } else {
                        // Game Over logic here
                        document.location.reload();
                    }
                }
            }
        });

        // Paddle movement
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        requestAnimationFrame(draw);
    }

    draw(); // Start the draw loop
}
