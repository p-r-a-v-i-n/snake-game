const canvas = document.getElementById("myCanvas");
const scoreElement = document.getElementById("score");
const startButton = document.getElementById("start-button");
const tutorialElement = document.getElementById('tutorial');

const FOOD_COLOR = "red";
const SNAKE_BODY_COLOR = "green";
const SNAKE_HEAD_COLOR = "blue";
const BOARD_COLOR = "#181818";
const STEP = 20;

let userScore = 0;
let isGameStarted = false;
let snakeBody = [
    [400, 400],
    [400, 420],
]
let width = 20;
let height = 20;
x = 400;
y = 400;

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

        snakeBody.shift();
        snakeBody.push([x, y]);

        if (x === x_of_food && y === y_of_food) {
            userScore += 1;
            scoreElement.innerText = `Score: ${userScore}`;
            createRectangle(x, y, BOARD_COLOR);
            snakeBody.push([x, y])
            x_of_food = generateRandom();
            y_of_food = generateRandom();
        }

        createSnake();
        generateFood();

    }

    id = states.pop();
    clearInterval(id);
    id = setInterval(travel, 100);
    states.push(id);
}

addEventListener("keydown", (e) => {
    if (isGameStarted === true) {
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
