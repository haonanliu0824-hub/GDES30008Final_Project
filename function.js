let items = [];
let angle = 0;
let targetAngle = 0.1;
let speed = 0.001;
let direction = 0.01;
function setup() {
    createCanvas(windowWidth, windowHeight);
    items.push({img:"🌛", x: 120, y: 120, size: 40, weight:8});
    items.push({img:"🌞", x: 200, y: 120, size: 40, weight:8});
    items.push({img:"🪨", x: 280, y: 120, size: 40, weight:8});
    items.push({img:"🏡", x: 360, y: 120, size: 40, weight:8});
}

function draw() {
    // draw sky
    
    background("#1d81f285");
    fill("#12bafc14");
    noStroke();
    rect(0, 0 + 160, width, height / 1);
    // draw sea
    fill(0, 119, 190);
    noStroke();
    rect(0, height / 1.2, width, height / 2);
    
    drawRock();
    fill("#c5c5c5ff");
    circle(650, 365, 130);
    angle = lerp(angle, targetAngle, 0.01);
    if (abs(angle - targetAngle) < 0.01) {
        targetAngle *= -1;
    }
    drawStick();
}

function updateBalanceAngle(left, right){
    if (left > right) {

    }
}
function drawStick(){

    push();

    noStroke();

    // 移动到 rect 中心
    translate(670, 285);
    
    rotate(angle);
    fill("#e59f35ff");

    rectMode(CENTER);

    // 现在画回自己的尺寸
    rect(0, 0, 680, 30, 30);

    pop();
}


function drawRock(){

    strokeCap(ROUND);
    stroke("#bac7c371");
    noStroke();
    strokeWeight(8);
    beginShape();
    fill("#737784ff");
    let x = 250;
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