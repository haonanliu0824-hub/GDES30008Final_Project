




function setup() {
    createCanvas(windowWidth, windowHeight);
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

}