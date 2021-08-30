document.addEventListener("keydown", keyDownHandler, false);

var x = 240;
var y = 240;
var dx = -15;
var dy = 0;

let score = 0;

let direction = "right";
let tail = [
  [255, 240],
  [270, 240],
  [285, 240],
  [300, 240],
];

function keyDownHandler(e) {
  e.preventDefault();
  if (e.key == "Right" || e.key == "ArrowRight") {
    dx = 15;
    dy = 0;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    dx = -15;
    dy = 0;
  } else if (e.key == "Up" || e.key == "ArrowUp") {
    dy = -15;
    dx = 0;
  } else if (e.key == "Down" || e.key == "ArrowDown") {
    dy = 15;
    dx = 0;
  }
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.rect(x, y, 13, 13);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawApple(x, y) {}

function drawScore() {
  ctx.fillStyle = "green";

  ctx.font = "32px serif";
  ctx.fillText(`Score: ${score}`, 10, 50);
}

function checkCollision(x, y, apple_x, apple_y) {
  appleHeight = 15;
  appleWidth = 15;
  ballHeight = 13;
  ballWidth = 13;

  if (
    x < apple_x + appleWidth &&
    x + ballWidth > apple_x &&
    y < apple_y + appleHeight &&
    y + ballHeight > apple_y
  ) {
    return true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < tail.length; i++) {
    drawBall(tail[i][0], tail[i][1]);
  }

  if (checkCollision(x, y, apple[0], apple[1])) {
    score++;
    generateApple();
    tail.splice(0, 0, [x, y]);
  } else {
    tail.splice(0, 0, [x, y]);
    tail.pop();
  }

  drawApple(apple[0], apple[1]);

  x += dx;
  y += dy;
  drawScore();
}

module.exports = startGame;

function startGame() {
  console.log("oi");
  setInterval(draw, 100);
}
