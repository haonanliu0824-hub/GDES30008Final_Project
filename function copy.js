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
    function preload(){
        aLie = loadImage("img/aLie.png");
        aMess = loadImage("img/aMess.png");
        aPromise = loadImage("img/aPromise.png");
    }
    function setup() {
        createCanvas(windowWidth, windowHeight);
        pixelDensity(window.devicePixelRatio);
        items.push({img:aLie, x:120, y:120, realX:120, realY:120, size:120, weight:8, onStick:false, left: false, right:false});
        items.push({img:aMess, x:300, y:120, realX:200, realY:120, size:120, weight:8, onStick:false, left: false, right:false});
        items.push({img:aPromise, x:480, y:120, realX:280, realY:120, size:120, weight:7, onStick:false, left: false, right:false});
        
        waveY = height / 1.2 + 80;
    }

    function draw() {
        // draw sky
        
        background("#1d81f285");
        updateBalanceAngle(left, right);
        fill("#12bafc14");
        noStroke();
        rect(0, 0 + 160, width, height / 1);
        // draw sea
        fill(0, 119, 190);
        noStroke();
        rect(0, height / 1.2, width, height / 2);
        
        drawRock();
        stroke("#148caa98");
        fill("#c5c5c5ff");
        circle(650, 365, 130);
        angle = lerp(angle, targetAngle, 0.01);
        if (abs(angle - targetAngle) < 0.01 && first) {
            targetAngle *= -1;
        }
        drawStick();
        drawSea();
        drawItems();
        drawBottle(800,100);
    }
    function drawBottle(x, y) {
        push();

    beginShape();
    stroke(210, 190, 150);
    strokeWeight(3);

    // 顶部中间
    vertex(x, y);

    // 左边
    bezierVertex(
        x + 20, y + 20,
        x, y + 60,
        x, y + 60
    );

    bezierVertex(
        x - 20, y + 70,
        x - 30, y + 70,
        x - 40, y + 80
    );

    bezierVertex(
        x - 40, y + 100,
        x - 40, y + 100,
        x - 40, y + 200
    );

    // 底部左到右
    bezierVertex(
        x + 20, y + 200,
        x + 80, y + 200,
        x + 140, y + 200
    );

    // 右边
    bezierVertex(
        x + 140, y + 100,
        x + 140, y + 100,
        x + 140, y + 80,
    );

    bezierVertex(
        x + 130, y + 70,
        x + 120, y + 70,
        x + 100, y + 60
    );

    bezierVertex(
        x + 100, y + 60,
        x + 80, y + 20,
        x + 100, y
    );

    // 回到顶部
    bezierVertex(
        x + 70, y - 10,
        x + 30, y - 10,
        x, y
    );

    endShape(CLOSE);

    pop();

    }
    function updateBalanceAngle(left, right){
        if (left > right) {
            targetAngle = -0.2;
        } else if (right > left) {
            targetAngle = 0.2;
        } else if (!first) {
            targetAngle = 0.06;
            first = true;
        }
    }
    function isOnStick(item){

        if(
            item.x > 330 &&
            item.x < 330 + 680 &&
            item.y < 270
        ){
            item.onStick = true;
            first = false;
            return true;
        }

        return false;
    }

    function drawItems(){

        imageMode(CENTER);

        for(let i = 0; i < items.length; i++){

            let item = items[i];

            
            if(item.onStick){

                let localX = item.x - 670;
                let localY = item.y - 275;

                let rotatedX =
                    localX * cos(angle) -
                    localY * sin(angle);

                let rotatedY =
                    localX * sin(angle) +
                    localY * cos(angle);

                item.realX = 670 + rotatedX;
                item.realY = 270 + rotatedY;

                let w = item.size;
                let h = item.size * item.img.height / item.img.width;
                image(
                    item.img,
                    item.realX, 
                    item.realY,
                    w,
                    h
                );

            } else {

                item.realX = item.x;
                item.realY = item.y;
                let w = item.size;
                let h = item.size * item.img.height / item.img.width;
                image(
                    item.img,
                    item.x,
                    item.y,
                    w,
                    h
                );
            }
        }
    }

    function mouseDragged() {
        if (draggingItem) {
            draggingItem.x = mouseX;
            draggingItem.y = mouseY;

        }
    }

    function mousePressed() {

        for (let item of items) {

            let d = dist(
                mouseX,
                mouseY,
                item.realX,
                item.realY
            );

            if (d < item.size) {

                draggingItem = item;

                
                item.x = item.realX;
                item.y = item.realY;

                item.onStick = false;

                break;
            }
        }
    }

    function mouseReleased(){

        if(draggingItem){
            if(isOnStick(draggingItem)){
                draggingItem.y = 240;
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