let items = [];
let angle = 0;
let targetAngle = 0.06;
let speed = 0.005;
let direction = 0.01;
let waveY;
let draggingItem = null;
let left = 0;
let right = 0;
let first = true;
let aLie;
let aMess;
let aPromise;
let x = 800;
let y = 100;
let offsetX = 0;
let offsetY = 0;
let alpha = 255;
let allSet = false;
let color = ["rgba(196, 166, 48, 0.81)", "rgba(206, 46, 46, 0.54)", "rgba(37, 207, 153, 0.38)"]
function preload(){
    aLie = loadImage("img/aLie.png");
    aMess = loadImage("img/aMess.png");
    aPromise = loadImage("img/aPromise.png");
    seaSound = loadSound("audio/sea.wav");
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(window.devicePixelRatio);
    items.push({func: drawBottle, x:40, y:480, realX:40, realY:480, scale:0.7, weight:8, onStick:false, left: false, right:false});
    items.push({func: drawBottle, x:900, y:510, realX:900, realY:510, scale:0.7, weight:8, onStick:false, left: false, right:false});
    
    waveY = height / 1.2 + 80;
}

function draw() {
    // draw sky
    // fill("rgba(138, 30, 240, 1)")
    drawText();
    background("#1d81f285");
    updateBalanceAngle(left, right);
    fill("#12bafc14");
    noStroke();
    rect(0, 0 + 160, width, height / 1);
    // draw sea
    fill(0, 119, 190);
    noStroke();
    rect(0, height / 1.2, width, height / 2);
    drawItems();
    drawRock();

    noStroke();

// 石头主体
fill("#fdf3f3ff");
noStroke();
circle(650, 365, 130);

// 月亮阴影
fill("rgba(180, 160, 170, 0.35)");
noStroke();

beginShape();

// 起点：圆右边中间
vertex(715, 365);

// 这条弧线往里面鼓一点，终点到圆下边中间
bezierVertex(
  705, 395,   // 控制点1：从右边往下弯
  680, 425,   // 控制点2：让弧度更饱满
  650, 430    // 终点：圆下边中间
);

// 用圆外侧边缘闭合，形成阴影区域
bezierVertex(
  680, 430,
  715, 400,
  715, 365
);

endShape(CLOSE);
    
    angle = lerp(angle, targetAngle, 0.01);
    if (abs(angle - targetAngle) < 0.01 && first) {
        targetAngle *= -1;
    }
    drawStick();
    
    drawSea();
    
}

function drawText() {
    if (allSet) {
        fill(138, 30, 240, alpha);
        noStroke();
        textSize(60);
        textAlign(CENTER, CENTER);
        textFont("fantasy");
        text("Question Start Now!!!", 600, 100);

        if (alpha < 255) {
            alpha += 1; // 数字越小，出现越慢
        }
    } else {
        fill(138, 30, 240, alpha);
        noStroke();
        textSize(60);
        textAlign(CENTER, CENTER);
        textFont("fantasy");
        text("Find All The Bottle First", 600, 100);

        if (alpha > 0) {
            alpha -= 1;
        }
    }
}
function drawBottle(x, y, s) {
    push();
    // fill("rgba(218, 190, 62, 0.51)")
    translate(x, y);
    scale(s);   

    beginShape();

    stroke("rgba(247, 191, 36, 0.68)");
    strokeWeight(3);
    vertex(0, 0);
    bezierVertex(20, 20, 0, 60, 0, 60);
    bezierVertex(-20, 70, -30, 70, -40, 80);
    bezierVertex(-75, 105, -75, 175, -30, 205);

    bezierVertex(20, 200, 80, 200, 145, 200);

    bezierVertex(190, 175, 190, 105, 145, 80);
    bezierVertex(130, 70, 120, 70, 100, 60);
    bezierVertex(100, 60, 80, 20, 100, 0);

    bezierVertex(70, -10, 30, -10, 0, 0);

    endShape(CLOSE);
    noFill();
    stroke("rgba(247, 191, 36, 0.8)");
    strokeWeight(3);
    ellipse(50, 5, 95, 24);
    stroke("rgba(255,255,255,0.4)");
    strokeWeight(5);
    noFill();

    bezier(
        -10, 80,
        -25, 110,
        -20, 150,
        -15, 185
    );
    pop();
}
function updateBalanceAngle(left, right){
    if (left > right) {
        targetAngle = -0.2;
    } else if (right > left) {
        targetAngle = 0.2;
    } else if (!first) {
        if(left > 0 && right > 0){
            if (!allSet){
                allSet = true;
                alpha = 0;
            }
        } else {
            if (allSet) {
                allSet = false;
                alpha = 255
            }
            
        }
        targetAngle = 0.06;
        first = true;
    }
}
function isOnStick(item){

    if(
        item.x > 240 &&
        item.x < 330 + 680 &&
        item.y < 270
    ){
        item.onStick = true;
        first = false;
        return true;
    } else {
        allSet = false;
        item.x = item.realX;
        item.y = item.realY;
    }

    return false;
}

function drawItems(){
    let count = 0;
    for(let item of items){
        fill(color[count])
        if(item.onStick){

            let localX = item.x - 670;
            let localY = item.y - 285;

            let drawX = 670 + localX * cos(angle) - localY * sin(angle);
            let drawY = 285 + localX * sin(angle) + localY * cos(angle);
            
            item.func(drawX, drawY, item.scale);

        } else {
            item.func(item.x, item.y, item.scale);
        }
        count++;
    }
}
function mouseOnBottle(item, checkX, checkY) {
    let s = item.scale;

    // 把鼠标坐标转换成 bottle 自己的局部坐标
    let localMouseX = (mouseX - checkX) / s;
    let localMouseY = (mouseY - checkY) / s;

    // 区域 1：瓶口 / 瓶颈
    let onNeck =
        localMouseX > 0 &&
        localMouseX < 100 &&
        localMouseY > -15 &&
        localMouseY < 65;

    // 区域 2：瓶身
    let onBody =
        localMouseX > -75 &&
        localMouseX < 190 &&
        localMouseY > 60 &&
        localMouseY < 205;

    return onNeck || onBody;
}

function mouseDragged() {
    if (draggingItem) {
        draggingItem.x = mouseX - offsetX;
        draggingItem.y = mouseY - offsetY;

    }
}

function mousePressed() {
    userStartAudio();
    if (!seaSound.isPlaying()) {
        seaSound.loop();
    }
    for (let item of items) {

        let checkX = item.x;
        let checkY = item.y;

        if(item.onStick){
            let localX = item.x - 670;
            let localY = item.y - 285;

            checkX = 670 + localX * cos(angle) - localY * sin(angle);
            checkY = 285 + localX * sin(angle) + localY * cos(angle);
        }

        if (mouseOnBottle(item, checkX, checkY)) {
            draggingItem = item;
            offsetX = mouseX - checkX;
            offsetY = mouseY - checkY;
            // 如果原来在左边，拿起来就减左边
            if (item.left) {
                left -= item.weight;
                item.left = false;
            }

            // 如果原来在右边，拿起来就减右边
            if (item.right) {
                right -= item.weight;
                item.right = false;
            }

            item.x = checkX;
            item.y = checkY;
            item.onStick = false;

            break;
        }
    }
}

function mouseReleased(){
    
    if(draggingItem){
        if(isOnStick(draggingItem)){
            draggingItem.y = 130;
            if (draggingItem.x < 670 && draggingItem.left === false) {
                left += draggingItem.weight;
                draggingItem.left = true;
            } else if (draggingItem.x > 670 && draggingItem.right === false) {
                right += draggingItem.weight;
                draggingItem.right = true;
            }
        } else {
            if (draggingItem.left) {
                left -= draggingItem.weight;
                draggingItem.left = false;
            } else if (draggingItem.right) {
                right -= draggingItem.weight;
                draggingItem.right = false;
            }
            draggingItem.onStick = false;
        }
        
    }
    // console.log(
    //     "onStick:",
    //     isOnStick(draggingItem),
    //     "left:",
    //     left,
    //     "right:",
    //     right
    // );

    draggingItem = null;
}
function drawStick() {

    push();

    translate(670, 285);
    rotate(angle);

    rectMode(CENTER);
    noStroke();

    // 主体
    fill("#e59f35");
    rect(0, 0, 680, 30, 30);

    // 上方高光
    fill(255, 255, 255, 60);
    rect(0, -8, 660, 6, 6);

    // 下方阴影
    fill(0, 0, 0, 50);
    rect(0, 10, 660, 6, 6);

    pop();
}


function drawRock(){

    strokeCap(ROUND);
    stroke("#00000071");
    strokeWeight(8);
    beginShape();
    fill("#737784ff");
    let x = 50;
    let y = 550;
    let yOffsets = [-70,-86,-90,-90,-100,-120];

    let step = 70;
    for(let i = 0; i < 12; i++){
        let yOffset = 0;
        if (i > 5 ) {
            yOffset = yOffsets[5];
        } else {
            yOffset = yOffsets[i];
        }
        curveVertex(x, y+yOffset);
        x += step
    }
    curveVertex(x-step, y+70);
    curveVertex(300, y+50);

    endShape(CLOSE);
}


function drawSea() {
  let seaTop = height / 1.2;

  fill("#7fdcff");
  stroke("#ffffff");
  strokeWeight(3);

  beginShape();

  vertex(0, height);

  for (let x = 0; x <= width; x += 40) {
    let wave = map(
      noise(x * 0.01, frameCount * 0.02),
      0,
      1,
      -30,
      30
    );

    curveVertex(x, waveY + wave);
  }

  vertex(width, height);
  vertex(0, height);

  endShape(CLOSE);

  waveY -= 0.1;

  if (waveY < seaTop) {
    waveY = height / 1.2+ 80;
  }
}