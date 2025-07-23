const canvas = document.getElementById("myCanvas");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("start-button");
const tutorialElement = document.getElementById('tutorial');

const FOOD_COLOR = "red";
const SNAKE_BODY_COLOR = "green";
const SNAKE_HEAD_COLOR = "blue";
const BOARD_COLOR = "#181818";
const STEP = 20;
let CHECKED_GAME_START_DIRECTION = false;

let gameOver = false;

let userScore = 0;
let isGameStarted = false;
let snakeBody = [
    [400, 400],
    [420, 400],
    [440, 400]
]
let snakeLength = snakeBody.length;
let width = 20;
let height = 20;
let [x, y] = snakeBody[snakeLength - 1];

const ctx = canvas.getContext("2d");

const generateRandom = () => {
    let randomNum = Math.floor(Math.random() * 781);
    return randomNum % STEP === 0 ? randomNum : generateRandom();
}

let x_of_food = generateRandom();
let y_of_food = generateRandom();


const createRectangle = (X, Y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(X, Y, width, height);
}

const createSnake = () => {
    for (let i = 0; i < snakeBody.length; i++) {
        const [dx, dy] = snakeBody[i];
        const color = i === snakeBody.length - 1 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
        createRectangle(dx, dy, color);
    }
}

const eraseSnake = () => {
    for (let i = 0; i < snakeBody.length; i++) {
        const [dx, dy] = snakeBody[i];
        createRectangle(dx, dy, BOARD_COLOR);
    }
}

const generateFood = () => {
    createRectangle(x_of_food, y_of_food, FOOD_COLOR);
}

const generateBoard = () => {
    for (let i = 0; i < 800; i += STEP) {
        for (let j = 0; j < 800; j += STEP) {
            createRectangle(i, j, BOARD_COLOR);
        }
    }
    createSnake();
    generateFood();
};



let states = [null]
let prev_direction = null;
let prevLength = snakeLength;


const generateScreenshot = () => {
    generateBoard();
    for (let i =0; i < states.length; i++ ) {
        clearInterval(states[i]);
    }
    gameOver = true;
}

const move = (direction) => {

    const travel = () => {
        eraseSnake();
        if (direction === "ArrowUp") {
            if (prev_direction === "ArrowDown") {
                y += STEP;
                if (y > 800) y = 0;
            } else {
                y -= STEP;
                if (y < 0) y = 800;
                prev_direction = direction;
            }

        } else if (direction === "ArrowDown") {
            if (prev_direction === "ArrowUp") {
                y -= STEP;
                if (y < 0) y = 800;
            } else {
                y += STEP;
                if (y > 800) y = 0;
                prev_direction = direction;
            }
        } else if (direction === "ArrowLeft") {
            if (prev_direction === "ArrowRight") {
                x += STEP;
                if (x > 800) x = 0;
            } else {
                x -= STEP;
                if (x < 0) x = 800;
                prev_direction = direction;
            }
        } else if (direction === "ArrowRight") {
            if (prev_direction === "ArrowLeft") {
                x -= STEP;
                if (x < 0) x = 800;
            } else {
                x += STEP;
                if (x > 800) x = 0;
                prev_direction = direction;
            }
        }
        
        snakeBody.push([x, y]);
        
        if (x === x_of_food && y === y_of_food) {
            userScore += 1;
            scoreElement.innerText = `Score: ${userScore}`;
            createRectangle(x, y, BOARD_COLOR);
            x_of_food = generateRandom();
            y_of_food = generateRandom();
        } else {
            snakeBody.shift();
        }
        
        createSnake();
        // check if snake touch it's own body
        let n = snakeBody.length;
        for (let i = 0; i < snakeBody.length - 1; i++ ) {
            if (snakeBody[i][0] === snakeBody[n - 1][0] && snakeBody[i][1] === snakeBody[n - 1][1]) {

                generateScreenshot()
                createGameOverBanner();
                return
            }
        }

        generateFood();

    }

    id = states.pop();
    clearInterval(id);
    id = setInterval(travel, 100);
    states.push(id);
}

addEventListener("keydown", (e) => {
    if (gameOver) return;
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.code)) return;
    if (['ArrowDown', 'ArrowUp', 'ArrowRight'].includes(e.code)) {
        CHECKED_GAME_START_DIRECTION = true;
    }
    if (isGameStarted === true && CHECKED_GAME_START_DIRECTION) {
        move(e.code);
    }
});

startButton.addEventListener('click', (e) => {
    tutorialElement.classList.add("fadeOut");
    // tutorialElement.animate(ANIMATION_CLASS, ANIMATION_DURATION);
    startButton.classList.remove('button');
    isGameStarted = true;
})

scoreElement.innerText = `Score: ${userScore}`;
generateBoard();



//================================================================================

const createGameOverBanner = () => {
    const gameOverDiv = document.createElement("div");
    const gameOverTitle = document.createElement("h4");
    gameOverTitle.style.color = "white";
    gameOverTitle.innerText = "Game Over";
    const gameOverDivContent = document.createTextNode("you played well, Try again.");
    gameOverDiv.appendChild(gameOverTitle);
    
    tutorialElement.insertAdjacentElement("afterend", gameOverDiv);
    
}