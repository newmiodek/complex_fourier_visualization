let c, ctx;

let N;
let cornerx;
let cornery;
let xSize;
let ySize;
let scale;
let d;
let dt;
let t;

let iniCornerx;
let iniCornery;
let iniXSize;
let iniYSize;

let drawing;
let drawn;
let seriesMade;
let pressed;

let anchored;
let anchorx;
let anchory;

let path;
let series;

let scrollDir;
let scrollDidRead;
let outerLeftIsPressed;
let outerMousePosX;
let outerMousePosY;

let XPressed;
let WPressed;
let SPressed;

async function main() {
  N = 203;
  cornerx = -20.0;
  cornery = 20.0;
  xSize = 40.0;
  ySize = xSize * window.innerHeight / window.innerWidth;
  scale = window.innerWidth / xSize;
  d = xSize / 800.0;
  dt = 0.01;
  t = 0.0;

  iniCornerx = cornerx * 1;
  iniCornery = cornery * 1;
  iniXSize = xSize * 1;
  iniYSize = ySize * 1;

  drawing = false;
  drawn = false;
  seriesMade = false;
  pressed = false;

  anchored = false;

  path = [];
  series = [];
  for(let i = 0; i < N; i++) {
    series.push([0, 0]);
  }

  scrollDir = "none";
  scrollDidRead = true;
  outerLeftIsPressed = false;
  outerMousePosX = 100;
  outerMousePosY = 100;

  XPressed = false;
  WPressed = false;
  SPressed = false;

  requestAnimationFrame(mainLoop);
  // while(true) {
  //   await new Promise(res => setTimeout(res, 5));
  //   updateModel();
  //   draw();
  // }
}

function mainLoop(timestamp) {
  timestamp;
  updateModel();
  draw();
  requestAnimationFrame(mainLoop);
}

function arctan(x, y) {
  if(x == 0) {
    if(y == 0) return 0;
    else if(y > 0) return Math.PI / 2;
    else return -Math.PI / 2;
  }
  else if(x > 0) {
    if(y == 0) return 0;
    else if(y > 0) return Math.atan(y / x);
    else return 2 * Math.PI - Math.atan(-y / x);
  }
  else {
    if(y == 0) return Math.PI;
    else if(y > 0) return Math.PI - Math.atan(-y / x);
    else return Math.PI + Math.atan(y / x);
  }
}

function updateModel() {
  t += dt;
  let innerLeftIsPressed = !!outerLeftIsPressed;
  let innerMousePosX = outerMousePosX * 1;
  let innerMousePosY = outerMousePosY * 1;

  if(!scrollDidRead) {
    if(scrollDir == "up") {
      zoomIn();
      scrollDidRead = true;
    }
    if(scrollDir == "down") {
      zoomOut();
      scrollDidRead = true;
    }
  }
  
  if(!drawn && innerLeftIsPressed) {
    drawing = true;
    path.push([innerMousePosX / scale + cornerx, -innerMousePosY / scale + cornery]);
  }

  if(drawing && !innerLeftIsPressed) {
    drawn = true;
    if(XPressed) {
      path = [];
      series = [];
      for(let i = 0; i < N; i++) {
        series.push([0, 0]);
      }
      drawing = false;
      drawn = false;
      seriesMade = false;
      t = 0;
    }
  }

  if(!seriesMade && drawn) {
    seriesMade = true;
    for(let i = 0; i < series.length; i++) {
      for(let j = 0; j < path.length; j++) {
        series[i][0] += path[j][0] * Math.cos(-2 * Math.PI * (i - ((N-(N%2)) / 2)) * j / path.length) - path[j][1] * Math.sin(-2 * Math.PI * (i - ((N-(N%2)) / 2)) * j / path.length);
        series[i][1] += path[j][0] * Math.sin(-2 * Math.PI * (i - ((N-(N%2)) / 2)) * j / path.length) + path[j][1] * Math.cos(-2 * Math.PI * (i - ((N-(N%2)) / 2)) * j / path.length);
      }
      series[i][0] /= path.length;
      series[i][1] /= path.length;
      let mag = Math.sqrt(series[i][0] * series[i][0] + series[i][1] * series[i][1]);
      let ang = arctan(series[i][0], series[i][1]);
      series[i][0] = mag;
      series[i][1] = ang;
    }
  }

  if(seriesMade) {
    if(innerLeftIsPressed) {
      if(!anchored) {
        anchored = true;
        anchorx = innerMousePosX / scale + cornerx;
        anchory = -innerMousePosY / scale + cornery;
      }
      else {
        cornerx -= innerMousePosX / scale + cornerx - anchorx;
        cornery -= -innerMousePosY / scale + cornery - anchory;
        anchorx = innerMousePosX / scale + cornerx;
        anchory = -innerMousePosY / scale + cornery;
      }
    }
    else {
      anchored = false;
    }
  }

  if(WPressed) {
    dt *= 1.25;
  }
  if(SPressed) {
    dt *= 0.8;
  }

  XPressed = false;
  WPressed = false;
  SPressed = false;
}

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for(let i = 1; i < path.length; i++) {
    drawLine(path[i-1][0], path[i-1][1], path[i][0], path[i][1], "#FFFFFF");
  }
  if(seriesMade) {
    let endxPrev;
    let endyPrev;
    let endx = series[(N-(N%2)) / 2][0] * Math.cos(series[(N-(N%2)) / 2][1]);
    let endy = series[(N-(N%2)) / 2][0] * Math.sin(series[(N-(N%2)) / 2][1]);
    drawLine(0, 0, endx, endy, "#FFFFFF");
    for(let n = 1; n < (N-(N%2)) / 2; n++) {
      endxPrev = endx;
      endyPrev = endy;
      endx += series[(N-(N%2)) / 2 + n][0] * Math.cos(series[(N-(N%2)) / 2 + n][1] + n * t);
      endy += series[(N-(N%2)) / 2 + n][0] * Math.sin(series[(N-(N%2)) / 2 + n][1] + n * t);
      drawLine(endxPrev, endyPrev, endx, endy, "#FFFFFF");
      endxPrev = endx;
      endyPrev = endy;
      endx += series[(N-(N%2)) / 2 - n][0] * Math.cos(series[(N-(N%2)) / 2 - n][1] - n * t);
      endy += series[(N-(N%2)) / 2 - n][0] * Math.sin(series[(N-(N%2)) / 2 - n][1] - n * t);
      drawLine(endxPrev, endyPrev, endx, endy, "#FFFFFF");
    }
    ctx.fillStyle = "#FF0000";
    let rectCoords = translate(endx, endy);
    ctx.fillRect(rectCoords[0] - 3, rectCoords[1] - 3, 6, 6);
  }
}

function translate(x, y) {
  return [(x - cornerx) * scale, (cornery - y) * scale];
}

function drawLine(x1, y1, x2, y2, color) {
  let coords1 = translate(x1, y1);
  let coords2 = translate(x2, y2);
  ctx.beginPath();
  ctx.moveTo(coords1[0], coords1[1]);
  ctx.lineTo(coords2[0], coords2[1]);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function zoomIn() {
  cornerx += 0.1 * xSize;
	cornery -= 0.1 * ySize;
	xSize *= 0.8;
  ySize = xSize * window.innerHeight / window.innerWidth;
  scale = window.innerWidth / xSize;
	d = xSize / 800;
}

function zoomOut() {
  cornerx -= 0.125 * xSize;
	cornery += 0.125 * ySize;
	xSize *= 1.25;
  ySize = xSize * window.innerHeight / window.innerWidth;
  scale = window.innerWidth / xSize;
	d = xSize / 800;
}

function adjust(context) {
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  if(!xSize) xSize = 40;
  ySize = xSize * window.innerHeight / window.innerWidth;
  scale = window.innerWidth / xSize;
  d = xSize / 800.0;
}

window.addEventListener("wheel", event => {
  if(scrollDidRead) {
    scrollDir = event.deltaY > 0 ? "down" : "up";
    scrollDidRead = false;
  }
});

window.addEventListener("mousemove", event => {
  outerMousePosX = event.clientX;
  outerMousePosY = event.clientY;
});

window.onmousedown = (() => {
  outerLeftIsPressed = true;
});

window.onmouseup = (() => {
  outerLeftIsPressed = false;
})

window.addEventListener("keypress", event => {
  if(event.code == "KeyX") {
    XPressed = true;
  }
  if(event.code == "KeyW") {
    WPressed = true;
  }
  if(event.code == "KeyS") {
    SPressed = true;
  }
});

window.onload = (() => {
  c = document.getElementById("mainCanvas");
  ctx = c.getContext("2d");
  adjust(ctx);
  main();
});

window.onresize = (() => {
  adjust(ctx);
});
