const app = require('electron').remote.app;
const fileDir = app.getPath('desktop');
const path = require("path");
var fs = require('fs');
//This will hold all the data we need
var dataLog = "";
//This will count how many clicks have occured
var clicks = 0;
//Max number of trials to run 
var maxTrials = 10;
//Reference our start button
var startButton = document.getElementById("startBtn");
//Display how many tasks a user has completed (choose the correct HTML element)
var counterDisplay = document.getElementById("counter");
//Display the target icon to click (find the element with this HTML tag)
var indicator = document.getElementById("indicator");
//Element that holds all your icons 
var parent = document.getElementById("iconDrawer");
//Array of all icons (hint: use the parent var to reference its children icons)
var icons = parent.children;
//Make an array to hold counts of how many times each icon has been selected
iconCounts = new Array(icons.length).fill(0);
//Set the max icon count
maxIconCount = maxTrials/icons.length;

function save(){
    fs.writeFile(path.resolve(fileDir,"JStest.csv"),dataLog, (err)=>{
    if(err){
      alert(err);
    }
    alert("Congratulations, all tasks are complete");
  });
}
function randomIcon(){
  //Generate a random number in the appropriate range 
  var iconIndex = Math.floor(Math.random()*5);
  while(iconCounts[iconIndex] >= maxIconCount){
    iconIndex = Math.floor(Math.random()*5);
  }
  iconCounts[iconIndex]++;
  return iconIndex;
}

var timedClick = function(){
  startButton.onclick = function(){}
  //Call randomIcon function to get random index and the matching icon
  var targetIndex = randomIcon();
  var targetIcon = icons[targetIndex];
  //Update the 'indicator' element to show the target icon
  indicator.src = targetIcon.src;
  //Start timing right here
  startTime = performance.now();
  //This is where we are going to start watching for clicks on icons
  //This loop will add an onclick function to each icon
  for(var i=0; i < icons.length; i++){
    icons[i].onclick = function(){
      //Everything in here will occur when an icon is pressed
      //Stop timing and record how long it took
      endTime = performance.now();
      //Calculate time elapsed
      totalTime = endTime - startTime;
      //Record whole milliseconds (use Math.round())
      totalTime = Math.round(totalTime);

      //We want to ensure only 1 icon can be clicked at a time, so disable all the onclicks now! 
      for(var i=0; i < icons.length; i++){
        icons[i].onclick = function(){}
      }
      //Record the time and positions of the target icon and the icon the user actually pressed
      var iconClicked = this.id[1]; // INCLUDE THIS
      //Increment clicks completed
      clicks++;
      //Now add to the end of the 'dataLog' variable as explained above
      dataLog = dataLog.concat(clicks+","+targetIndex+","+iconClicked+","+totalTime+"\n");
      //Update what the counterDisplay says!
      cdMessage = clicks + " tasks out of ".concat(maxTrials).concat(" completed");
      counterDisplay.innerHTML = cdMessage;
      //If maxTrials is reached, then data collection is over, so call save and reset 'clicks' and 'dataLog'
      if(clicks >= maxTrials){
        save();
        clicks = 0;
        dataLog = "";
        counterDisplay.innerHTML = "";
        indicator.src = "";
      }
      //Reactivate the start button by changing the onclick function from nothing back to starting the trial
      //The event monitor to track our mouse
      startButton.onclick = timedClick;
    }
  }
}

var iconGrowth = function(e){
  var userX = e.clientX;
  var userY = e.clientY;
  //Print user's current coordinates
  var coords = document.getElementById("location");
  coords.innerHTML = "You are at: (" + userX + "," + userY + ")";
  //Get the images' bounding boxes, get dist between box and mouse, and grow the image appropriately
  for(var i=0;i<icons.length;i++){
    imgBoundingBox = icons[i].getBoundingClientRect();
    var imgX = imgBoundingBox.left+icons[i].width/2;
    var imgY = imgBoundingBox.top+icons[i].height/2;
    var a = userX - imgX;
    var b = userY - imgY;
    var dist = Math.round(Math.sqrt((a*a)+(b*b)));
    imgSize = Math.max(50,150-dist)+'px';
    icons[i].style.width = imgSize;
    icons[i].style.height = imgSize;
  }
}

window.onload = function() { 
  //Majority of the work will be done in timedClick
  startButton.onclick = timedClick;
  //Function for the images to grow with proximity
  document.onmousemove = iconGrowth;
}
