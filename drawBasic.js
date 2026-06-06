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

    image(supportRock, 500, height - 250, 300, 200);
    
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
    textSize(30);
    
    text("The Weight Has Settled", width / 2, finishTextY - 40);

    textSize(42);
    textStyle(NORMAL);
    fill(255, 255, 255, finishAlpha);

    let finalText = "";
    let absoulutev = abs(left-right);
    if (absoulutev < 4) {
        finalText = "Balance does not mean equal. It means both sides continue to hold.";
    } else if (absoulutev < 16) {
        finalText = "Some relationships survive because one side carries more.";
    } else{
        finalText = "Even the strongest stone has a limit.";
    }
    text(
        finalText,
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