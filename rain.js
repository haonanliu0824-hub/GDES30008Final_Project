let rains = [];
let rainSpeed = 6;
let rainInfor = {rainDensity: 200, rainAngle: -0.4, rainSpeed:10, rainLength:0, thickness:3};
let rainAlpha = 160;
let targetAlpha = 0.4;
let sunMoveT = 0;
// parameter that control the background


function resetAll() {
    left = 0;
    right = 0;
    targetAlpha = 0.4;
    targetAngle = 0.06;
    queIndex = 0;
    speed = 0.005;
    direction = 0.01;
    startAnimation = true;
    endAnimation = false;
    lastAngle = 0;
    bgAlpha = 0.4;
    selectedOption = null;
    bgColor = color("#1d81f2");
    currentBgCol = color("#1d81f2");
    targetBgCol = color("#1d81f2");
    items = [];
    leftYRow = 0;
    rightYRow = 0;
    leftCount = 0;
    rightCount = 0;
    sceneOffsetY = 0;
    leftInfor = {};
    rightInfor = {};
    preLeft = random(270, 500);
    leftInfor.prev = preLeft;
    leftInfor.last = preLeft + 180;
    preRight = random(700, 950);
    rightInfor.prev = preRight;
    rightInfor.last = preRight + 180;
    seaTop = height - 40;
    questionCharIndex = 0;
    questionTypingSpeed = 0.15;
    lastQuestionIndex = -1;
    fullQuestion = "";
}
function setUpBackground() {
    let angleStrength = abs(targetAngle);

    let blue = color("#1d81f2");
    let orange = color("rgba(236, 71, 0, 1)");
    let gray = color("rgba(92, 90, 89, 1)");

    if (left === right) {
        targetBgCol = blue;
    } else if (angleStrength <= 0.2) {
        let t = map(angleStrength, 0, 0.2, 0, 1);
        t = constrain(t, 0, 1);

        targetBgCol = lerpColor(blue, orange, t);
    } else {
        let t = map(angleStrength, 0.2, 0.5, 0, 1);
        t = constrain(t, 0, 1);

        targetBgCol = lerpColor(orange, gray, t);
    }

    currentBgCol = lerpColor(currentBgCol, targetBgCol, 0.05);
    bgColor = currentBgCol;
}

function calAlpha() {
    let bgScale;
    let angleStrength = abs(targetAngle);

    if (lastAngle <= 0.2 && angleStrength <= 0.2) {
        bgScale = angleStrength / 0.2 * 0.6;
    } else if (lastAngle > 0.2 && angleStrength > 0.2) {
        bgScale = (angleStrength - 0.2) / 0.2 * 0.6;
    } else if (lastAngle <= 0.2 && angleStrength > 0.2) {
        bgScale = (angleStrength - 0.2) / 0.2 * 0.6;
        bgAlpha = 0.4;
    } else if (lastAngle > 0.2 && angleStrength <= 0.2) {
        bgScale = angleStrength / 0.2 * 0.6;
        bgAlpha = 0.4;
    }
    targetAlpha = bgScale + 0.4;
    targetAlpha = constrain(targetAlpha, 0.4, 1);
}
function initialRain() {
    for (let i = 0; i < rainInfor.rainDensity; i++) {
        let rainX = random(-width * 0.2, width * 1.2);
        let rainY = random(-height, -20);
        let thick = random(1, 2.5);
        let rainLen = random(5, 10);
        let infor = {x: rainX, y: rainY, thickness: thick, len: rainLen}
        rains.push(infor);
    }
}

function drawRains() {
    for (let i = 0; i < rains.length; i++) {
        drawRain(rains[i]);
    }
}
function drawRain(infor){
    stroke(220, 240, 255, rainAlpha);
    strokeWeight(infor.thickness);
    line(infor.x, infor.y,infor.x, infor.y + infor.len);
    infor.y += rainSpeed;
    if (infor.y > height){
        infor.y = random(-height, -20);
    }
}

function drawSunAndMoon() {
    let angleStrength = abs(targetAngle);

    // 太阳移动进度：0 ~ 0.2 之间从左上角移动到右上角
    let targetSunT = map(angleStrength, 0, 0.2, 0, 1);
    targetSunT = constrain(targetSunT, 0, 1);

    //control the speed of sun
    sunMoveT = lerp(sunMoveT, targetSunT, 0.01);
    let sunX = lerp(100, width - 120, sunMoveT);
    let sunY = lerp(200, 50, sunMoveT);

    //show sun when background not dark
    let sunAlpha = 255;

    if (angleStrength > 0.2) {
        sunAlpha = map(angleStrength, 0.2, 0.5, 255, 0);
        sunAlpha = constrain(sunAlpha, 0, 255);
    }

    //draw sun
    if (sunAlpha > 1) {
        noStroke();

        //sun shadow
        fill(255, 180, 60, sunAlpha * 0.25);
        circle(sunX, sunY, 120);

        fill(255, 210, 80, sunAlpha * 0.45);
        circle(sunX, sunY, 85);

        //sun body
        fill(255, 235, 120, sunAlpha);
        circle(sunX, sunY, 55);
    }

    //moon
    let moonAlpha = map(angleStrength, 0.2, 0.5, 0, 255);
    moonAlpha = constrain(moonAlpha, 0, 255);

    if (moonAlpha > 1) {
        let moonX = 100;
        let moonY = 90;

        noStroke();

        // moon body part
        fill(235, 240, 255, moonAlpha);
        circle(moonX, moonY, 75);

        // use circle to make the effect of moon
        fill(bgColor);
        circle(moonX + 28, moonY - 5, 72);
    }
}