const canvas = document.getElementById("myCanvas");
const scoreElement = document.getElementById("score");

const FOOD_COLOR = "red";
const SNAKE_BODY_COLOR = "green";
const SNAKE_HEAD_COLOR = "blue";
const BOARD_COLOR = "#181818";
const STEP = 20;

let gameOver = false;

let userScore = 0;
let snakeBody = [
    [400, 400],
    [400, 380],
    [400, 360]
]
let snakeLength = snakeBody.length;
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

const checkOtherNeighbour = (firstNeighbourIndex, skipDirsIndex, dirs) => {
    let head = snakeBody[snakeBody.length - 1];
    const [head_x, head_y] = head;
    for (let i = 0; i < snakeBody.length - 1; i++) {
        if (i === firstNeighbourIndex) {
            continue;
        }
        const [cx, cy] = snakeBody[i];
        for (let j = 0; j < dirs.length; j++ ) {
            if (j === skipDirsIndex) {
                continue;
            }
            let [dx, dy] = dirs[j];
            if (dx + head_x === cx && dy + head_y === cy) {
                return true
            }
        }
    }

    return false;
}

const checkIsGameOver = (direction) => {
    let head = snakeBody[snakeBody.length - 1];
    const [head_x, head_y] = head;

    if (direction === 'ArrowUp') {
        let dirs = [[-STEP, 0], [STEP, 0]]
    
        for (let i = 0; i < snakeBody.length - 1; i++) {
            const [cx, cy] = snakeBody[i];
            for (let j = 0; j < dirs.length; j++ ) {
                let [dx, dy] = dirs[j]
                if (dx + head_x === cx && dy + head_y === cy) {
                    return checkOtherNeighbour(i, j, dirs);
                }
            }
        }
    }

    if (direction === 'ArrowDown') {
        let dirs = [[STEP, 0], [-STEP, 0]]

        for (let i = 0; i < snakeBody.length - 1; i++) {
            const [cx, cy] = snakeBody[i];
            for (let j = 0; j < dirs.length; j++ ) {
                let [dx, dy] = dirs[j]
                if (dx + head_x === cx && dy + head_y === cy) {
                    return checkOtherNeighbour(i, j, dirs);
                }
            }
        }
    }

    if (direction === 'ArrowLeft') {
        let dirs = [[0, STEP], [0, -STEP]]

        for (let i = 0; i < snakeBody.length - 1; i++) {
            const [cx, cy] = snakeBody[i];
            for (let j = 0; j < dirs.length; j++ ) {
                let [dx, dy] = dirs[j]
                if (dx + head_x === cx && dy + head_y === cy) {
                    return checkOtherNeighbour(i, j, dirs);
                }
            }
        }
    }

    if (direction === 'ArrowRight') {
        let dirs = [[0, -STEP], [0, STEP]]

        for (let i = 0; i < snakeBody.length - 1; i++) {
            const [cx, cy] = snakeBody[i];
            for (let j = 0; j < dirs.length; j++ ) {
                let [dx, dy] = dirs[j]
                if (dx + head_x === cx && dy + head_y === cy) {
                    return checkOtherNeighbour(i, j, dirs);
                }
            }
        }
    }

    return false;
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
        
        snakeBody.shift();
        snakeBody.push([x, y]);
        
        if (x === x_of_food && y === y_of_food) {
            userScore += 1;
            snakeLength += 1;
            prevLength = snakeLength;
            scoreElement.innerText = `Score: ${userScore}`;
            createRectangle(x, y, BOARD_COLOR);
            snakeBody.push([x, y])
            x_of_food = generateRandom();
            y_of_food = generateRandom();
        }
        
        createSnake();
        // check if snake touch it's own body
        if (checkIsGameOver(prev_direction)) {
            generateScreenshot()
            createGameOverBanner();
            return
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
    move(e.code);
});

scoreElement.innerText = `Score: ${userScore}`;
generateBoard();



//================================================================================

const createGameOverBanner = () => {
    const gameOverDiv = document.createElement("div");
    const gameOverTitle = document.createElement("h4");
    gameOverTitle.innerText = "Game Over";
    const gameOverDivContent = document.createTextNode("you played well, Try again.");
    gameOverDiv.appendChild(gameOverTitle);
    
    scoreElement.insertAdjacentElement("afterbegin", gameOverDiv);
    
}