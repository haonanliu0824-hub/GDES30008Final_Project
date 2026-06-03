let sceneOffsetY = 0;
let stickCenterX = 670;
let stickCenterY = 385;
function drawStick() {
    push();
    translate(stickCenterX, stickCenterY + sceneOffsetY);
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

function drawCentralBall(){

    noStroke();
    fill("#fdf3f3ff");
    circle(650, 465 + sceneOffsetY, 130);

    fill("rgba(180, 160, 170, 0.35)");
    noStroke();

    beginShape();

    vertex(715, 465 + sceneOffsetY);

    bezierVertex(
        705, 495 + sceneOffsetY,
        680, 525 + sceneOffsetY,
        650, 530 + sceneOffsetY
    );

    bezierVertex(
        680, 530 + sceneOffsetY,
        715, 500 + sceneOffsetY,
        715, 465 + sceneOffsetY
    );

    endShape(CLOSE);
}

function drawRock() {
    strokeCap(ROUND);
    stroke("#00000071");
    strokeWeight(8);

    beginShape();

    fill("#737784ff");
    let x = 50;
    let y = 650 + sceneOffsetY;

    let yOffsets = [-70, -86, -90, -90, -100, -120];

    let step = 70;

    for (let i = 0; i < 12; i++) {
        let yOffset = 0;

        if (i > 5) {
            yOffset = yOffsets[5];
        } else {
            yOffset = yOffsets[i];
        }

        curveVertex(x, y + yOffset);
        x += step;
    }

    curveVertex(x - step, y + 70);
    curveVertex(50, y + 50);

    endShape(CLOSE);
}
