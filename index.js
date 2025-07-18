const canvas = document.getElementById("myCanvas");
const FOOD_COLOR   = "red";
const SNAKE_COLOR  = "green";
const BOARD_COLOR   = "#181818";
const STEP = 15;
let width = 15;
let height = 15

const ctx = canvas.getContext("2d");

const generateBoard = () => {
    for (let i = 0; i < 800; i += STEP) {
        for (let j = 0; j < 800; j += STEP) {
            ctx.fillStyle = BOARD_COLOR;
            ctx.fillRect(i,j, width, height);
        } 
    }
};


generateBoard();

x = 400;
y = 400;
ctx.fillStyle = SNAKE_COLOR;
ctx.fillRect(x, y, width, height);

const move = (direction) => {
    ctx.reset();
    if (direction === "ArrowUp") {
        y -= STEP;
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(x, y, width, height);
    } else if ( direction ===  "ArrowDown" ) {
        y += STEP;
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(x, y, width, height);
    } else if ( direction === "ArrowLeft" ) {
        x -= STEP;
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(x, y, width, height);
    } else if ( direction === "ArrowRight" ) {
        x += STEP;
        ctx.fillStyle = SNAKE_COLOR;
        ctx.fillRect(x, y, width, height);
    }
}

addEventListener("keydown", (e)=> {
    move(e.code);
});
