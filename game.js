// Game Engine for MacVG-style games
let canvas, ctx;
let currentGame = null;
let gameLoop = null;

// Snake Game Implementation
class SnakeGame {
    constructor() {
        this.gridSize = 20;
        this.tileCount = 20;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.speed = 10;
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }

    update() {
        if (this.gameOver) return;

        // Move snake
        if (this.direction.x !== 0 || this.direction.y !== 0) {
            const head = {
                x: this.snake[0].x + this.direction.x,
                y: this.snake[0].y + this.direction.y
            };

            // Check wall collision
            if (head.x < 0 || head.x >= this.tileCount || 
                head.y < 0 || head.y >= this.tileCount) {
                this.gameOver = true;
                return;
            }

            // Check self collision
            for (let segment of this.snake) {
                if (segment.x === head.x && segment.y === head.y) {
                    this.gameOver = true;
                    return;
                }
            }

            this.snake.unshift(head);

            // Check food collision
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10;
                document.getElementById('score').textContent = `Score: ${this.score}`;
                this.food = this.generateFood();
            } else {
                this.snake.pop();
            }
        }
    }

    draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#1a1a1a';
        for (let i = 0; i <= this.tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.gridSize, 0);
            ctx.lineTo(i * this.gridSize, canvas.height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * this.gridSize);
            ctx.lineTo(canvas.width, i * this.gridSize);
            ctx.stroke();
        }

        // Draw snake
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
            ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
            
            // Draw eyes on head
            if (i === 0) {
                ctx.fillStyle = '#000';
                const eyeSize = 3;
                const eyeOffset = 6;
                
                if (this.direction.x === 1) { // Right
                    ctx.fillRect(segment.x * this.gridSize + eyeOffset + 4, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * this.gridSize + eyeOffset + 4, segment.y * this.gridSize + 12, eyeSize, eyeSize);
                } else if (this.direction.x === -1) { // Left
                    ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 12, eyeSize, eyeSize);
                } else if (this.direction.y === 1) { // Down
                    ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + eyeOffset + 4, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + eyeOffset + 4, eyeSize, eyeSize);
                } else if (this.direction.y === -1) { // Up
                    ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 5, eyeSize, eyeSize);
                } else { // Default
                    ctx.fillRect(segment.x * this.gridSize + 5, segment.y * this.gridSize + 8, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * this.gridSize + 12, segment.y * this.gridSize + 8, eyeSize, eyeSize);
                }
            }
        }

        // Draw food
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw game over
        if (this.gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '20px Arial';
            ctx.fillText(`Final Score: ${this.score}`, canvas.width / 2, canvas.height / 2 + 20);
            ctx.fillText('Press Restart to play again', canvas.width / 2, canvas.height / 2 + 50);
        }
    }

    handleInput(key) {
        switch(key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction.y === 0) {
                    this.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction.y === 0) {
                    this.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction.x === 0) {
                    this.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction.x === 0) {
                    this.direction = { x: 1, y: 0 };
                }
                break;
        }
    }
}

// Pong Game Implementation
class PongGame {
    constructor() {
        this.paddleWidth = 10;
        this.paddleHeight = 80;
        this.ballSize = 10;
        this.SPEED_INCREASE_FACTOR = 1.05;
        
        this.leftPaddle = { x: 20, y: 160, dy: 0 };
        this.rightPaddle = { x: 370, y: 160, dy: 0 };
        this.ball = { x: 200, y: 200, dx: 3, dy: 3 };
        
        this.score = { left: 0, right: 0 };
        this.gameOver = false;
    }

    update() {
        if (this.gameOver) return;

        // Move paddles
        this.leftPaddle.y += this.leftPaddle.dy;
        this.rightPaddle.y += this.rightPaddle.dy;

        // Keep paddles in bounds
        this.leftPaddle.y = Math.max(0, Math.min(canvas.height - this.paddleHeight, this.leftPaddle.y));
        this.rightPaddle.y = Math.max(0, Math.min(canvas.height - this.paddleHeight, this.rightPaddle.y));

        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Ball collision with top and bottom
        if (this.ball.y <= 0 || this.ball.y >= canvas.height - this.ballSize) {
            this.ball.dy *= -1;
        }

        // Ball collision with paddles
        if (this.ball.x <= this.leftPaddle.x + this.paddleWidth &&
            this.ball.y >= this.leftPaddle.y &&
            this.ball.y <= this.leftPaddle.y + this.paddleHeight) {
            this.ball.dx *= -1;
            this.ball.dx *= this.SPEED_INCREASE_FACTOR;
        }

        if (this.ball.x >= this.rightPaddle.x - this.ballSize &&
            this.ball.y >= this.rightPaddle.y &&
            this.ball.y <= this.rightPaddle.y + this.paddleHeight) {
            this.ball.dx *= -1;
            this.ball.dx *= this.SPEED_INCREASE_FACTOR;
        }

        // Score points
        if (this.ball.x < 0) {
            this.score.right++;
            this.resetBall();
        } else if (this.ball.x > canvas.width) {
            this.score.left++;
            this.resetBall();
        }

        document.getElementById('score').textContent = `Score: ${this.score.left} - ${this.score.right}`;
    }

    resetBall() {
        this.ball = { x: 200, y: 200, dx: (Math.random() > 0.5 ? 3 : -3), dy: (Math.random() > 0.5 ? 3 : -3) };
    }

    draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw center line
        ctx.strokeStyle = '#444';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw paddles
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(this.leftPaddle.x, this.leftPaddle.y, this.paddleWidth, this.paddleHeight);
        ctx.fillRect(this.rightPaddle.x, this.rightPaddle.y, this.paddleWidth, this.paddleHeight);

        // Draw ball
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(this.ball.x, this.ball.y, this.ballSize, this.ballSize);
    }

    handleInput(key) {
        switch(key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.rightPaddle.dy = -5;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.rightPaddle.dy = 5;
                break;
        }
    }

    handleKeyUp(key) {
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'w' || key === 'W' || key === 's' || key === 'S') {
            this.rightPaddle.dy = 0;
        }
    }
}

// Simple AI for left paddle in Pong
function updatePongAI() {
    if (currentGame instanceof PongGame) {
        const paddleCenter = currentGame.leftPaddle.y + currentGame.paddleHeight / 2;
        const ballCenter = currentGame.ball.y + currentGame.ballSize / 2;
        
        if (paddleCenter < ballCenter - 20) {
            currentGame.leftPaddle.dy = 3;
        } else if (paddleCenter > ballCenter + 20) {
            currentGame.leftPaddle.dy = -3;
        } else {
            currentGame.leftPaddle.dy = 0;
        }
    }
}

// Game loop
function runGameLoop() {
    if (currentGame) {
        currentGame.update();
        
        if (currentGame instanceof PongGame) {
            updatePongAI();
        }
        
        currentGame.draw();
    }
}

// Initialize game
function initGame(gameType) {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 400;
    
    switch(gameType) {
        case 'snake':
            currentGame = new SnakeGame();
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(runGameLoop, 100);
            break;
        case 'pong':
            currentGame = new PongGame();
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(runGameLoop, 1000 / 60);
            break;
        default:
            currentGame = new SnakeGame();
            if (gameLoop) clearInterval(gameLoop);
            gameLoop = setInterval(runGameLoop, 100);
    }
    
    document.getElementById('score').textContent = 'Score: 0';
    
    // Set up keyboard controls (cleanup handled in stopGame)
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    if (currentGame) {
        e.preventDefault();
        currentGame.handleInput(e.key);
    }
}

function handleKeyUp(e) {
    if (currentGame && currentGame.handleKeyUp) {
        e.preventDefault();
        currentGame.handleKeyUp(e.key);
    }
}

function stopGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    currentGame = null;
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
}
