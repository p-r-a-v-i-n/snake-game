'use strict';
const canvas = document.getElementById('myCanvas');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
const tutorialElement = document.getElementById('tutorial');
const restartButton = document.createElement('button');
const FOOD_COLOR = 'red';
const SNAKE_BODY_COLOR = 'green';
const SNAKE_HEAD_COLOR = 'blue';
const BOARD_COLOR = '#181818';
const STEP = 20;
const OPPOSITE_DIRECTION_MAP = {
  ArrowLeft: 'ArrowRight',
  ArrowRight: 'ArrowLeft',
  ArrowUp: 'ArrowDown',
  ArrowDown: 'ArrowUp',
};
let CHECKED_GAME_START_DIRECTION = false;
let gameOver = false;
let isPaused = false;
let gameSpeed = 120; // Starting speed in milliseconds
const MAX_SPEED = 40; // Max speed (maximum difficulty)
const ACCERATION_FACTOR = 0.02; // Speed increase per food eaten
let userScore = 0;
let isGameStarted = false;
let snakeBody = [
  [400, 400],
  [420, 400],
  [440, 400],
];
const snakeInitialBody = [
  [400, 400],
  [420, 400],
  [440, 400],
];
const width = 20;
const height = 20;
let [x, y] = snakeBody.at(-1);
const ctx = canvas.getContext('2d');
const generateRandom = () => {
  const randomNum = Math.floor(Math.random() * 801);
  return randomNum % STEP === 0 ? randomNum : generateRandom();
};
let x_of_food = generateRandom();
let y_of_food = generateRandom();
const createRectangle = (X, Y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(X, Y, width, height);
};
const createSnake = () => {
  for (let i = 0; i < snakeBody.length; i++) {
    const [dx, dy] = snakeBody.at(i);
    const color =
      i === snakeBody.length - 1 ? SNAKE_HEAD_COLOR : SNAKE_BODY_COLOR;
    createRectangle(dx, dy, color);
  }
};
const generateFood = () => {
  createRectangle(x_of_food, y_of_food, FOOD_COLOR);
};
const generateBoard = () => {
  for (let i = 0; i <= 800; i += STEP) {
    for (let j = 0; j <= 800; j += STEP) {
      createRectangle(i, j, BOARD_COLOR);
    }
  }
  createSnake();
  generateFood();
};
const states = [undefined];
let prev_direction = null;
const generateScreenshot = () => {
  generateBoard();
  for (let i = 0; i < states.length; i++) {
    clearInterval(states[i]);
  }
  gameOver = true;
  const [dx, dy] = snakeInitialBody.at(-1);
  x = dx;
  y = dy;
};
const move = (direction) => {
  const travel = () => {
    if (isPaused) return;
    if (direction === 'ArrowUp') {
      if (prev_direction === 'ArrowDown') {
        y += STEP;
        if (y > 800) y = 0;
      } else {
        y -= STEP;
        if (y < 0) y = 800;
        prev_direction = direction;
      }
    } else if (direction === 'ArrowDown') {
      if (prev_direction === 'ArrowUp') {
        y -= STEP;
        if (y < 0) y = 800;
      } else {
        y += STEP;
        if (y > 800) y = 0;
        prev_direction = direction;
      }
    } else if (direction === 'ArrowLeft') {
      if (prev_direction === 'ArrowRight') {
        x += STEP;
        if (x > 800) x = 0;
      } else {
        x -= STEP;
        if (x < 0) x = 800;
        prev_direction = direction;
      }
    } else if (direction === 'ArrowRight') {
      if (prev_direction === 'ArrowLeft') {
        x -= STEP;
        if (x < 0) x = 800;
      } else {
        x += STEP;
        if (x > 800) x = 0;
        prev_direction = direction;
      }
    }
    if (x === x_of_food && y === y_of_food) {
      userScore += 1;
      scoreElement.innerText = `Score: ${userScore}`;
      // Increase speed (decrease interval) by %2 percent of gameSpeed, max  50ms
      if (gameSpeed > MAX_SPEED) {
        gameSpeed = Math.max(
          MAX_SPEED,
          gameSpeed - gameSpeed * ACCERATION_FACTOR
        );
      }
      createRectangle(x, y, BOARD_COLOR);
      x_of_food = generateRandom();
      y_of_food = generateRandom();
    } else {
      const lastPos = snakeBody.shift();
      if (lastPos) {
        createRectangle(lastPos[0], lastPos[1], BOARD_COLOR);
      }
    }
    createRectangle(x, y, SNAKE_HEAD_COLOR);
    const lastHeadPos = snakeBody[snakeBody.length - 1];
    if (lastHeadPos) {
      createRectangle(lastHeadPos[0], lastHeadPos[1], SNAKE_BODY_COLOR);
    }
    snakeBody.push([x, y]);
    // check if snake touch it's own body
    for (let i = 0; i < snakeBody.length - 1; i++) {
      const [xi, yi] = snakeBody.at(i);
      const [xHead, yHead] = snakeBody.at(-1);
      if (xi === xHead && yi === yHead) {
        generateScreenshot();
        createGameOverBanner();
        prev_direction = null;
        return;
      }
    }
    generateFood();
  };
  let id = states.pop();
  if (id !== undefined) clearInterval(id);
  id = setInterval(travel, gameSpeed);
  states.push(id);
};
addEventListener('keydown', (e) => {
  if (gameOver) return;
  const code = e.code;
  if (
    prev_direction === code ||
    prev_direction === OPPOSITE_DIRECTION_MAP[code]
  ) {
    return;
  }
  // Handle pause/resume with spacebar
  if (e.code === 'Space') {
    e.preventDefault();
    if (isGameStarted && CHECKED_GAME_START_DIRECTION) {
      isPaused = !isPaused;
      if (isPaused) {
        showPauseOverlay();
      } else {
        hidePauseOverlay();
      }
    }
    return;
  }
  if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(code))
    return;
  if (['ArrowDown', 'ArrowUp', 'ArrowRight'].includes(code)) {
    CHECKED_GAME_START_DIRECTION = true;
  }
  if (isGameStarted === true && CHECKED_GAME_START_DIRECTION && !isPaused) {
    move(code);
  }
});
startButton.addEventListener('click', () => {
  tutorialElement.classList.add('fadeOut');
  startButton.style.cursor = 'auto';
  isGameStarted = true;
});
restartButton.addEventListener('click', () => {
  tutorialElement.classList.add('fadeOut');
  restartButton.style.cursor = 'auto';
  isGameStarted = true;
  CHECKED_GAME_START_DIRECTION = false;
  gameOver = false;
  isPaused = false;
  gameSpeed = 120;
  hidePauseOverlay();
  userScore = 0;
  scoreElement.innerText = `Score: ${userScore}`;
  snakeBody = [...snakeInitialBody];
  [x, y] = snakeBody.at(-1); // reset head position
  generateBoard();
});
scoreElement.innerText = `Score: ${userScore}`;
generateBoard();
//================================================================================
const showPauseOverlay = () => {
  let pauseOverlay = document.getElementById('pause-overlay');
  if (!pauseOverlay) {
    pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.innerHTML = `
            <div class="pause-content">
                <h2>GAME PAUSED</h2>
                <p>Press SPACE to resume</p>
            </div>
        `;
    const containerElement = document.getElementById('container');
    containerElement.appendChild(pauseOverlay);
  }
  pauseOverlay.style.display = 'flex';
};
const hidePauseOverlay = () => {
  const pauseOverlay = document.getElementById('pause-overlay');
  if (pauseOverlay) {
    pauseOverlay.style.display = 'none';
  }
};
const createGameOverBanner = () => {
  const list = document.getElementById('list');
  restartButton.innerText = 'Restart';
  restartButton.classList.add('button');
  if (list) list.remove();
  if (startButton) startButton.remove();
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  title.innerText = 'GAME OVER';
  description.innerText = `Score: ${userScore}`;
  tutorialElement.appendChild(restartButton);
  tutorialElement.classList.remove('fadeOut');
};
//# sourceMappingURL=index.js.map
