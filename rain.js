let rains = [];
let rainSpeed = 8;
let rainInfor = {rainDensity: 200, rainAngle: -0.4, rainSpeed:10, rainLength:0, thickness:3};
let rainAlpha = 160;

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