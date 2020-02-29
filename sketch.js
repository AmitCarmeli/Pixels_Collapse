/**
  * Abstract selfie camera - when you take selfie the image collapses.
  *
  * To see the project optimally, it should be opened from the mobile phone. 
  */

const rectSize = 35;
const buttonColor = "#ff685d";

var bnwPixArr = [];

// Saves the state - showing image / video
var showAsImg = false;

// Used as timeout to collapse the photo after taking a selfie
var timeCollapsed;

function preload() {
  soundFormats('wav');
  click = loadSound('photoclick.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();
  
  // Create a button in order to take selfie / turn back to video mode
  var button = createButton('');
  var buttonSize = (width * 0.20);
  button.position((width / 2) - (buttonSize / 2), height - buttonSize - 20);
  button.style("background-color", buttonColor);
  button.style("width", buttonSize + "px");
  button.style("height", buttonSize + "px");
  button.style("border","2px solid black");
  button.style("border-radius","50%");
  button.mousePressed(buttonPressed);
}

function buttonPressed() {
  showAsImg = !showAsImg;
  
  // If the person took selfie - play camera click sound
  if(showAsImg) {
    click.play();
  }
  timeCollapsed = millis();
}

function draw() {
  capture.loadPixels();
  
  if(!showAsImg) {
    clear();
    
    // Convert camera view to cubes
    bnwPixArr = [];
    for(var y=0; y<height; y+=rectSize) {
      for(var x=0; x<width; x+=rectSize) {
        var index = (x + (y * width)) * 4;
        var r = capture.pixels[index];
        var g = capture.pixels[index + 1];
        var b = capture.pixels[index + 2];
            
        var rectColor = 'rgb(' + r + ', ' + g + ', ' + b +')';
        var rectObj = {x: x - (width/2), y: y - (height/2), color: rectColor};
      
        // Save cube position & color to display as image when
        // taking a selfie
        bnwPixArr.push(rectObj);
      
        strokeWeight(2);
        fill(rectColor);
        rect(rectObj.x, rectObj.y, rectSize, rectSize);
      }
    }
  } else {
    clear();    
    strokeWeight(2);        
    
    // Display static selfie
    for (var el = 0; el < bnwPixArr.length; el++) {
      fill(bnwPixArr[el].color);
      rect(bnwPixArr[el].x, bnwPixArr[el].y, rectSize, rectSize);
      
      // Delay of 1 second before collapse 
      if(timeCollapsed + 1000 < millis()) {
        if(bnwPixArr[el].y < (height / 2) + 20)
            bnwPixArr[el].y += random(200);
      }
    }
  }
}

function keyTyped() {
  if(key === 's') {
    save('Creation.jpg');
  }
}
