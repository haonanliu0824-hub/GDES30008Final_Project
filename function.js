let questions = [
    "Who usually apologises first after a conflict?",
    "Who is more likely to wait for the other person to reach out first?",
    "Who would be more hurt if you suddenly lost contact?",
    "Who cares more about the future of this relationship?",
    "Who is more likely to overthink a single comment?",
    "Who hides their true feelings more often?",
    "Who is more afraid of rejection?",
    "Who finds it easier to forgive?",
    "Who has a stronger need to be understood?",
    "Who relies more on the sense of security this relationship provides?",
    "Who spends more time guessing what the other person is thinking?",
    "Who is more likely to feel jealous?",
    "Who pretends to be okay more often?",
    "Who cares more about the other person's opinion?",
    "Who is more afraid of the relationship ending?",
    "Who would be more willing to start over?",
    "If this relationship were a scale, who has been holding it steady?",
    "Who still holds onto expectations that no longer matter?",
    "Who wishes they could turn back time more often?",
    "Who needs forgiveness more?",
];
let queIndex = 0;
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

let neutral;
let seaSound;

let x = 800;
let y = 100;

let offsetX = 0;
let offsetY = 0;

let alpha = 0;
let allSet = false;
let startAnimation = true;
let endAnimation = false;
let lastLeftStoneType = "";
let lastRightStoneType = "";
// stick center position

let maxAngle = 0.5;
let maxPossibleWeight = 40;
let lastAngle = 0;
let rockColor = [
    "rgba(237, 207, 131, 1)",
    "rgba(237, 207, 131, 1)"
];

let bgColor;
let currentBgCol;
let targetBgCol;
let bgAlpha = 0.4;
let selectedOption = null;
let leftCount = 0;
let leftYRow = 0;
let rightYRow = 0;
let rightCount = 0;
let seaTop = 80;
let leftInfor = {prev:0, last:0};
let rightInfor = {prev:0, last:0};
let answerOptions = [
    {offsetX: -240, size: 45, currentSize: 45, pos: "left", value: 2},
    {offsetX: -160, size: 35, currentSize: 35, pos: "left", value: 1},
    {offsetX: -80, size: 28, currentSize: 28, pos: "neural", value: 0 },
    {offsetX: 0, size: 35, currentSize: 35, pos: "right", value: 1 },
    {offsetX: 80, size: 45, currentSize: 45, pos: "right", value: 2 }
];
function preload() {
    neutral = loadImage("character/Neutral.png");
    seaSound = loadSound("audio/sea.wav");
    keySound = loadSound("audio/keyborad.mp3")
    stoneImg = loadImage("img/bigRock.png");
    supportRock = loadImage("img/supportRock.png");
    mediumRock = loadImage("img/mediumRock.png");
}

function setup() {
    userStartAudio();
    if (!seaSound.isPlaying()) {
        seaSound.loop();
    }
    createCanvas(windowWidth, windowHeight);
    seaTop += height;
    pixelDensity(window.devicePixelRatio);
    initialRain(rainInfor); 
    bgColor = color("#1d81f2");
    currentBgCol = color("#1d81f2");
    targetBgCol = color("#1d81f2");
    waveY = height - 20;
    preLeft = random(250, 300);
    leftInfor.prev = preLeft;
    leftInfor.last = preLeft + 150;
    preRight = random(700, 850);
    rightInfor.prev = preRight;
    rightInfor.last = preRight + 100;

}

function draw() {
    windowResized(windowHeight+sceneOffsetY);
    updateBalanceAngle(left, right);

    

    angle = lerp(angle, targetAngle, 0.01);

    setUpBackground();
    background(bgColor);
    updateBalanceAngle(left, right);

    angle = lerp(angle, targetAngle, 0.01);

    setUpBackground();
    background(bgColor);

    drawStartAnimation();
    
    
    if (finishAnimation) {
        drawFinishAnimation();
    } else {
        if (endAnimation) {
            drawSunAndMoon();
            drawQuestion(queIndex, 0);
        }
    }
    fill("#12bafc14");
    noStroke();
    rect(0, 160, width, height);

    fill(0, 119, 190);
    noStroke();
    rect(0, height / 1.2, width, height / 2);

    drawItems();
    // drawRock();
    image(stoneImg, 100, height - 200, 700, 300);
    drawCentralBall();

    if (abs(angle - targetAngle) < 0.01 && first) {
        targetAngle *= -1;
    }

    drawStick();
    drawSea();
    
    drawRains();

}
function drawQuestion(queIndex, tim) {
    // new question new index
    if (lastQuestionIndex !== queIndex) {
        questionCharIndex = 0;
        lastQuestionIndex = queIndex;
    }

    fullQuestion = questions[queIndex];

    // add word gradually
    if (questionCharIndex < fullQuestion.length) {
        questionCharIndex += questionTypingSpeed;
        if (!keySound.isPlaying()) {
            keySound.loop();
        }

    } else {
        keySound.stop();
    }

    let shownQuestion = fullQuestion.substring(0, questionCharIndex);

    fill("rgba(60, 245, 245, 1)");
    textSize(40);
    textAlign(CENTER, CENTER);
    textFont("fantasy");
    textStyle(BOLD);

    text(shownQuestion, width / 2, 100);

    // options
    let centerX = width / 2;
    let optionY = 180;

    stroke("rgba(55, 217, 55, 1)");
    strokeWeight(3);
    fill("rgba(255, 255, 255, 1)");
    textSize(40);
    textAlign(CENTER, CENTER);

    text("Me", centerX - 320, optionY + 5);

    fill("rgba(241, 252, 255, 1)");
    drawAnswer(centerX, optionY);

    stroke("rgba(55, 217, 55, 1)");
    strokeWeight(3);
    fill("rgba(255, 255, 255, 1)");
    text("The Other Side", centerX + 275, optionY + 5);
}
function drawAnswer(centerX, optionY){
    for (let i = 0; i < answerOptions.length; i++) {
        let option = answerOptions[i];

        let x = centerX + option.offsetX;
        let y = optionY;

        let d = dist(mouseX, mouseY, x, y);

        let targetSize;

        if (d < option.currentSize / 2) {
            targetSize = option.size * 1.4;
        } else {
            targetSize = option.size;
        }

        option.currentSize = lerp(option.currentSize, targetSize, 0.15);

        if (selectedOption === i) {
            stroke("rgba(255, 180, 0, 1)");
            strokeWeight(5);
        } else {
            stroke("rgba(55, 217, 55, 1)");
            strokeWeight(3);
        }

        fill("rgba(241, 252, 255, 1)");
        circle(x, y, option.currentSize);
    }
}

function drawStartAnimation() {
    // "rgba(191, 246, 246, 1)"
    fill(191,246, 246, alpha);
    noStroke();
    textSize(60);
    textAlign(CENTER, CENTER);
    textFont("fantasy");
    textStyle(BOLD);
    text("The Weight of What Was Left Unsaid", 600, 100);
    text("Author: Haonan Liu   Yuqing Fei", 600, 180);

    if (alpha < 255 && startAnimation) {
        alpha += 1;
    } else {
        startAnimation = false;
    }

    if (alpha > 0 && !startAnimation) {
        alpha -= 1;
    }

    if (alpha <= 0) {
        endAnimation = true;
    }
}

function drawStone(x, y, s, type, r, offset) {
    push();

    translate(x, y);
    rotate(r);
    scale(s);

    stroke("rgba(255, 246, 238, 0.85)");
    strokeWeight(3);
    fill("rgba(255, 237, 202, 1)");
    if (type === "big") {
    } else if (type === "medium") {
        image(mediumRock, 0, offset, 400,200);
    } else if (type === "small") {
        image(mediumRock, 0, -16, 250,100);
    }



    
    pop();
}

function updateBalanceAngle(left, right) {

    diff = right - left;
    targetAngle = map(diff, -maxPossibleWeight, maxPossibleWeight, -maxAngle, maxAngle);
    if (left === right) {
        targetAngle = 0;

        if (left > 0 && right > 0) {
            if (!allSet) {
                allSet = true;
                alpha = 0;
            }
            if (!allSet) {
                allSet = true;
                alpha = 0;
            }
        } else {
            if (allSet) {
                allSet = false;
                alpha = 255;
            }
            if (allSet) {
                allSet = false;
                alpha = 255;
            }
        }
    }
}

function isOnStick(item) {
    if (
        item.x > 100 &&
        item.x < 330 + 680 &&
        item.y < 270 + sceneOffsetY
    ) {
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

function drawItems() {
    let count = 0;

    for (let item of items) {
        fill(rockColor[count % rockColor.length]);

        if (item.falling) {
            item.y = lerp(item.y, item.targetY, 0.08);
            if (abs(item.y - item.targetY) < 1) {
                item.y = item.targetY;
                item.falling = false;
                item.onStick = true;
            }
            item.func(item.x, item.y + sceneOffsetY, item.scale, item.type, 0, item.off);
        } else if (item.onStick) {
            let localX = item.x - stickCenterX;
            let localY = item.y - stickCenterY;

            let drawX =
                stickCenterX + localX * cos(angle) - localY * sin(angle);

            let drawY =
                stickCenterY + localX * sin(angle) + localY * cos(angle);
            
            drawY += sceneOffsetY;
            item.func(drawX, drawY, item.scale, item.type, angle, item.off);
        } else {
            item.func(item.x, item.y, item.scale, item.type, 0, item.new, item.off);
        }
        count++;
    }
}

// function mouseOnBottle(item, checkX, checkY) {
//     let s = item.scale;
// function mouseOnBottle(item, checkX, checkY) {
//     let s = item.scale;

//     let localMouseX = (mouseX - checkX) / s;
//     let localMouseY = (mouseY - checkY) / s;
//     let localMouseX = (mouseX - checkX) / s;
//     let localMouseY = (mouseY - checkY) / s;

//     let onNeck =
//         localMouseX > 0 &&
//         localMouseX < 100 &&
//         localMouseY > -15 &&
//         localMouseY < 65;
//     let onNeck =
//         localMouseX > 0 &&
//         localMouseX < 100 &&
//         localMouseY > -15 &&
//         localMouseY < 65;

//     let onBody =
//         localMouseX > -75 &&
//         localMouseX < 190 &&
//         localMouseY > 60 &&
//         localMouseY < 205;
//     let onBody =
//         localMouseX > -75 &&
//         localMouseX < 190 &&
//         localMouseY > 60 &&
//         localMouseY < 205;

//     return onNeck || onBody;
// }
//     return onNeck || onBody;
// }

function mouseDragged() {
    if (draggingItem) {
        draggingItem.x = mouseX - offsetX;
        draggingItem.y = mouseY - offsetY;
    }
}

function mousePressed() {
    
    if (!startAnimation && !finishAnimation) {
        userChooseAnswer();
    }

    if (finishAlpha > 250) {
        finishAnimation = false;
        finishAlpha = 0
        resetAll();
    }

    
}
function userChooseAnswer() {
    let centerX = width / 2;
    let optionY = 180;

    for (let i = 0; i < answerOptions.length; i++) {
        
        let option = answerOptions[i];

        let x = centerX + option.offsetX;
        let y = optionY;

        let d = dist(mouseX, mouseY, x, y);

        if (d < option.currentSize / 2) {
            selectedOption = i;
            if (questionCharIndex < fullQuestion.length) {
                return false;
            }
            let stoneType;
            let rockOffset;
            if (option.value === 2) {   
                stoneType = "medium";
            } else {
                stoneType = "small";
            }

            if (option.pos == "left") {
                if (lastLeftStoneType == "small"){
                    rockOffset = -80;
                } else {
                    rockOffset = -90;
                }
                lastLeftStoneType = stoneType;
                left += option.value;
                let stoneX = random(leftInfor.prev,leftInfor.last);
                stoneX = constrain(stoneX, 250, 550 - 120);
                leftInfor.prev = stoneX;
                if (stoneX + 120 > 500) {
                    leftInfor.prev = stoneX-60;
                    leftInfor.last = stoneX;
                } else {
                    leftInfor.last = stoneX + 60;
                }
                
                if (leftCount == 1) {
                    leftYRow += 23;
                    leftCount = 0;
                } 
                
                items.push({
                    func: drawStone,
                    x: stoneX,
                    y: optionY,
                    targetY: 350 - leftYRow,
                    realX: stoneX,
                    realY: 350 + sceneOffsetY - leftYRow,
                    scale: 0.5,
                    onStick: false,
                    falling:true,
                    left: true,
                    right: false,
                    type: stoneType,
                    r: 0,
                    new: true,
                    off: rockOffset
                });
                leftCount++;

            } else if (option.pos == "right") {
                if (lastRightStoneType == "small"){
                    rockOffset = -80;
                } else {
                    rockOffset = -80;
                }
                lastRightStoneType = stoneType;
                right += option.value;
                let stoneX = random(rightInfor.prev,rightInfor.last);
                stoneX = constrain(stoneX, 700, 900);
                rightInfor.prev = stoneX;
                if (stoneX + 100 > 900) {
                    rightInfor.prev = stoneX - 60;
                    rightInfor.last = stoneX;
                } else {
                    rightInfor.last = stoneX + 60;
                }
                
        
                if (rightCount == 1) {
                    rightYRow += 23;
                    rightCount = 0;
                } 
                items.push({
                    func: drawStone,
                    x: stoneX,
                    y: optionY - sceneOffsetY,
                    targetY: 350 - rightYRow,
                    realX: stoneX,
                    realY: 350 + sceneOffsetY - rightYRow,
                    scale: 0.5,
                    weight: 2,
                    onStick: false,
                    falling: true,
                    left: false,
                    right: true,
                    type: stoneType,
                    r: 0,
                    new: true,
                    off: rockOffset
                });
                rightCount++;
            }
            if ((350 + sceneOffsetY - leftYRow < 250 || 350 + sceneOffsetY - rightYRow < 250) && option.pos != "neural") {
                sceneOffsetY += 25;
                seaTop -= 15;
            }
            queIndex++;
            if (queIndex >= questions.length) {
                finishAnimation = true;
                finishAlpha = 0;
                finishTextY = height + 80;
        
            }


            return true;
        }
    }

    return false;
}

function mouseReleased() {
    if (draggingItem) {
        if (isOnStick(draggingItem)) {
        draggingItem.y = 250 + sceneOffsetY;

        if (draggingItem.x < stickCenterX && draggingItem.left === false) {
            left += draggingItem.weight;
            draggingItem.left = true;
        } else if (draggingItem.x > stickCenterX && draggingItem.right === false) {
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

    draggingItem = null;
}


function drawSea() {

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
        waveY = height - 30 - sceneOffsetY;
    }
}

function windowResized(winheight) {
  resizeCanvas(windowWidth, winheight);
}