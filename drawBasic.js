let sceneOffsetY = 0;
let stickCenterX = 670;
let stickCenterY = 385;
let finishAnimation = false;
let finishAlpha = 0;
let finishTextY = 0;
let questionCharIndex = 0;
let questionTypingSpeed = 0.15;
let lastQuestionIndex = -1;
let fullQuestion;
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

function drawFinishAnimation() {
    finishAlpha = lerp(finishAlpha, 255, 0.01);
    finishTextY = lerp(finishTextY, 120, 0.01);
    
    push();

    fill(0, 0, 0, 120);
    noStroke();
    rect(0, 0, width, height);

    fill(255, 245, 230, finishAlpha);
    textAlign(CENTER, CENTER);
    textFont("fantasy");
    textStyle(BOLD);
    textSize(52);
    text("The Weight Has Settled", width / 2, finishTextY - 40);

    textSize(28);
    textStyle(NORMAL);
    fill(255, 255, 255, finishAlpha);
    text(
        "Some things were never said, but they still had weight.",
        width / 2,
        finishTextY + 30
    );
    if (finishTextY < 122){
        textSize(20);
        textStyle(NORMAL);
        fill(255, 255, 255, finishAlpha);
        text(
            "Click Any where to retry",
            150,
            30
        );
    }
    
    pop();
}