const canvas = document.getElementById("myCanvas");

const FOOD_COLOR = "red";
const SNAKE_COLOR = "green";
const BOARD_COLOR = "#181818";
const STEP = 15;
let width = 15;
let height = 15

const ctx = canvas.getContext("2d");

const generateBoard = () => {
    for (let i = 0; i < 800; i += STEP) {
        for (let j = 0; j < 800; j += STEP) {
            ctx.fillStyle = BOARD_COLOR;
            ctx.fillRect(i, j, width, height);
        }
    }
};


generateBoard();

x = 400;
y = 400;
ctx.fillStyle = SNAKE_COLOR;
ctx.fillRect(x, y, width, height);

let prev_dir = null;
let states = [null]

const move = (direction) => {

    const travel = () => {
        ctx.reset();
        if (direction === "ArrowUp") {
            y -= STEP;
            if (y < 0) {
                y = 800;
            }
            ctx.fillStyle = SNAKE_COLOR;
            ctx.fillRect(x, y, width, height);
        } else if (direction === "ArrowDown") {
            y += STEP;
            if (y > 800) {
                y = 0;
            }
            ctx.fillStyle = SNAKE_COLOR;
            ctx.fillRect(x, y, width, height);
        } else if (direction === "ArrowLeft") {
            x -= STEP;
            if (x < 0) {
                x = 800;
            }
            ctx.fillStyle = SNAKE_COLOR;
            ctx.fillRect(x, y, width, height);
        } else if (direction === "ArrowRight") {
            x += STEP;
            if (x > 800) {
                x = 0;
            }
            ctx.fillStyle = SNAKE_COLOR;
            ctx.fillRect(x, y, width, height);
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

