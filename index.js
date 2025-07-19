const canvas = document.getElementById("myCanvas");

const FOOD_COLOR = "red";
const SNAKE_COLOR = "green";
const BOARD_COLOR = "#181818";
const STEP = 20;
let width = 20;
let height = 20;
x = 400;
y = 400;

const ctx = canvas.getContext("2d");

const generateRandom = () => {
    let randomNum = Math.floor(Math.random() * 796)
    if (randomNum % STEP == 0) {
        return randomNum;
    }
    return generateRandom();
}

const createRectangle = (X, Y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(X, Y, width, height);
}

const generateFood = (dx = null, dy = null) => {
    if (dx && dy) {
        createRectangle(dx, dy, FOOD_COLOR);
    } else {
        dx = generateRandom();
        dy = generateRandom();
        createRectangle(dx, dy, FOOD_COLOR);
    }
    return [dx, dy];
}

const generateBoard = () => {
    for (let i = 0; i < 800; i += STEP) {
        for (let j = 0; j < 800; j += STEP) {
            createRectangle(i, j, BOARD_COLOR);
        }
    }
    createRectangle(x, y, SNAKE_COLOR);
};


generateBoard();

[prev_x_of_food, prev_y_of_food] = generateFood();



let states = [null]

const move = (direction) => {

    const travel = () => {
        ctx.reset();
        generateBoard();
        generateFood(prev_x_of_food, prev_y_of_food);

        if (direction === "ArrowUp") {
            y -= STEP;
            if (y < 0) y = 800;
        } else if (direction === "ArrowDown") {
            y += STEP;
            if (y > 800) y = 0;
        } else if (direction === "ArrowLeft") {
            x -= STEP;
            if (x < 0) x = 800;
        } else if (direction === "ArrowRight") {
            x += STEP;
            if (x > 800) x = 0;
        }

        createRectangle(x, y, SNAKE_COLOR);

        if (x === prev_x_of_food && y === prev_y_of_food) {
            createRectangle(x, y, BOARD_COLOR);
            [prev_x_of_food, prev_y_of_food] = generateFood();
        }
    }

    id = states.pop();
    clearInterval(id);
    id = setInterval(travel, 100);
    states.push(id);
}

addEventListener("keydown", (e) => {
    move(e.code);
});