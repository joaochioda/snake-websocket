const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let apple = [];
generateApple();

let players = [];

let tail1 = [
  [255, 240],
  [270, 240],
  [285, 240],
  [300, 240],
];

let tail2 = [
  [240, 240],
  [240, 255],
  [240, 270],
  [240, 285],
];

var dx1 = 15;
var dy1 = 0;

var dx2 = 0;
var dy2 = 15;

var x1 = 240;
var y1 = 240;

var x2 = 240;
var y2 = 240;

let score1 = 0;
let score2 = 0;

function generateApple() {
  x = Math.floor(Math.random() * (32 - 0)) * 15;
  y = Math.floor(Math.random() * (32 - 0)) * 15;

  apple = [x, y];
}

io.on("connection", async (socket) => {
  socket.on("sendMessage", () => {
    players.push(socket.id);
    socket.emit("playerId", socket.id);
  });
  socket.on("disconnect", () => {
    players = players.filter((player) => player !== socket.id);
  });
  socket.on("move", (data) => {
    if (players[0] === socket.id) {
      dx1 = data.dx;
      dy1 = data.dy;
    } else {
      dx2 = data.dx;
      dy2 = data.dy;
    }
  });
});
setInterval(draw, 100);

function checkCollision(x, y, apple_x, apple_y) {
  appleHeight = 13;
  appleWidth = 13;
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
  if (players?.length === 2) {
    // console.log(`${socket.id} - ${tail1[0]}`);
    if (checkCollision(x1, y1, apple[0], apple[1])) {
      score1++;
      generateApple();
      tail1.splice(0, 0, [x1, y1]);
    } else {
      tail1.splice(0, 0, [x1, y1]);
      tail1.pop();
    }

    if (checkCollision(x2, y2, apple[0], apple[1])) {
      score2++;
      generateApple();
      tail2.splice(0, 0, [x2, y2]);
    } else {
      tail2.splice(0, 0, [x2, y2]);
      tail2.pop();
    }

    const a = {
      [players[0]]: score1,
    };

    io.emit("drawGame", apple, tail1, tail2, {
      [players[0]]: score1,
      [players[1]]: score2,
    });

    x1 += dx1;
    y1 += dy1;

    x2 += dx2;
    y2 += dy2;

    if (x1 > 480) {
      x1 = 0;
    }
    if (x1 < 0) {
      x1 = 480;
    }
    if (y1 > 480) {
      y1 = 0;
    }
    if (y1 < 0) {
      y1 = 480;
    }

    if (x2 > 480) {
      x2 = 0;
    }
    if (x2 < 0) {
      x2 = 480;
    }
    if (y2 > 480) {
      y2 = 0;
    }
    if (y2 < 0) {
      y2 = 480;
    }
  }
}

server.listen(3000);
