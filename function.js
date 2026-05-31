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
let alpha = 0;
let allSet = false;
let startAnimation = true;
let color = ["rgba(237, 207, 131, 1)", "rgba(237, 207, 131, 1)"]
function preload(){
    aLie = loadImage("img/aLie.png");
    aMess = loadImage("img/aMess.png");
    aPromise = loadImage("img/aPromise.png");
    seaSound = loadSound("audio/sea.wav");
}
function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(window.devicePixelRatio);
    items.push({func: drawStone, x:40, y:480, realX:40, realY:480, scale:0.7, weight:8, onStick:false, left: false, right:false, type:"big", r: 0});
    items.push({func: drawStone, x:900, y:510, realX:900, realY:510, scale:0.7, weight:8, onStick:false, left: false, right:false, type: "small", r: 0});
    
    waveY = height / 1.2 + 80;
}

function draw() {
    // draw sky
    // fill("rgba(138, 30, 240, 1)")
    drawStartAnimation();
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


    fill("#fdf3f3ff");
    noStroke();
    circle(650, 365, 130);


    fill("rgba(180, 160, 170, 0.35)");
    noStroke();

    beginShape();


    vertex(715, 365);


    bezierVertex(
    705, 395,   
    680, 425,   
    650, 430   
    );

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

function drawQuestion(){

}
function drawStartAnimation() {
    fill(138, 30, 240, alpha);
    noStroke();
    textSize(60);
    text
    textAlign(CENTER, CENTER);
    textFont("fantasy");
    textStyle(BOLD);
    text("The Weight of What Was Left Unsaid", 600, 100);

    if (alpha < 255 && startAnimation) {
        alpha += 1; 
    } else {
        startAnimation = false;
    }
    
    if (alpha > 0 && !startAnimation) {
        alpha -= 1; 
    }
}
function drawStone(x, y, s, type, r) {
    push();
    translate(x, y);
    rotate(r);
    scale(s);
    
    stroke("rgba(120, 110, 100, 0.85)");
    strokeWeight(3);

    beginShape();

    if (type === "big") {
        
        vertex(0, 10);
        bezierVertex(20, -15, 55, -28, 95, -26);
        bezierVertex(150, -24, 230, -22, 310, -24);
        bezierVertex(350, -24, 395, -10, 410, 15);
        bezierVertex(420, 42, 360, 62, 285, 68);
        bezierVertex(200, 74, 90, 68, 25, 52);
        bezierVertex(-8, 40, -10, 22, 0, 10);
    } else if (type === "medium") {
        
        vertex(0, 8);
        bezierVertex(15, -12, 42, -22, 72, -21);
        bezierVertex(115, -20, 170, -18, 225, -19);
        bezierVertex(255, -19, 290, -8, 302, 12);
        bezierVertex(312, 34, 272, 52, 215, 58);
        bezierVertex(145, 64, 72, 58, 18, 45);
        bezierVertex(-6, 34, -7, 18, 0, 8);
    } else if (type === "small") {
        
        vertex(0, 6);
        bezierVertex(10, -8, 28, -16, 48, -15);
        bezierVertex(78, -14, 112, -13, 145, -14);
        bezierVertex(165, -14, 188, -6, 196, 8);
        bezierVertex(202, 24, 178, 38, 140, 43);
        bezierVertex(96, 48, 46, 44, 12, 34);
        bezierVertex(-4, 25, -5, 13, 0, 6);
    }

    endShape(CLOSE);
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
        item.x > 100 &&
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
        fill(color[count]);
        if(item.onStick){

            let localX = item.x - 670;
            let localY = item.y - 285;

            let drawX = 670 + localX * cos(angle) - localY * sin(angle);
            let drawY = 285 + localX * sin(angle) + localY * cos(angle);
            
            item.func(drawX, drawY, item.scale, item.type, angle);

        } else {
            item.func(item.x, item.y, item.scale, item.type, 0);
        }
        count++;
    }
}
function mouseOnBottle(item, checkX, checkY) {
    let s = item.scale;

    
    let localMouseX = (mouseX - checkX) / s;
    let localMouseY = (mouseY - checkY) / s;

    
    let onNeck =
        localMouseX > 0 &&
        localMouseX < 100 &&
        localMouseY > -15 &&
        localMouseY < 65;

    
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
            
            if (item.left) {
                left -= item.weight;
                item.left = false;
            }

            
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
            draggingItem.y = 250;
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

    
    fill("#e59f35");
    rect(0, 0, 680, 30, 30);


    fill(255, 255, 255, 60);
    rect(0, -8, 660, 6, 6);


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