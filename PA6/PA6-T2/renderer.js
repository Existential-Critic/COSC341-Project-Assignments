const app = require('electron').remote.app;
const fileDir = app.getPath('desktop');
const path = require("path");
var fs = require('fs');
//DEFINE GENERAL VARIABLES
//This will hold all the data we need
var dataLog = "";
//This will count how many times we have clicked
var clicks = 0;
//This is the maximum number of trials we are going for
var maxTrials = 60;
//Create array of volumes we can set to
var volumeArray = ["Mute",20,40,60,80,100];
//Reference the pause/play button
var playPauseButton = document.getElementById("player-button")
//Reference the audio player
var musicPlayer = document.getElementById("music-player");
//Make an array to hold counts of how many times each volume has been selected
var volumeCounts = new Array(volumeArray.length).fill(0);
//Reference our start button
var startButton = document.getElementById("start-button");
//Reference the counter for displaying how many tasks are completed
var counterDisplay = document.getElementById("counter");
//Reference the volume to click on
var targetVolume = document.getElementById("volume-target");
//Reference the volume display
var volumeDisplay = document.getElementById("volume-display");
//Element that holds all buttons
var parent = document.getElementById("volume-button-container");
//Get array of the buttons for adjusting size later
var buttonsArray = parent.children;
//Variable to control whether music is playing, intialized to false
var isMusicPlaying = false;
//Create connector array
buttonConnector = new Array(buttonsArray.length);
for(var i=0;i<buttonsArray.length;i++){
  buttonConnector[i] = {
    'id':buttonsArray[i].id,'count':0
  }
}
buttonConnector.sort(function(a,b){return b.count-a.count});

//FUNCTIONS
//Saves data to file
function save() {
    fs.writeFile(path.resolve(fileDir,"ROBIN-T2.csv"),dataLog, (err)=>{
    if(err){
      alert(err);
    }
    alert("Congratulations, all tasks are complete");
    });
}
//Generates random volume to select            
function randomTarget() {
  //Generate a random number in the appropriate range 
  var volumeIndex = Math.floor(Math.random()*6);
  //Check the count of the random index; if it is too high, get a new index
  while(volumeCounts[volumeIndex] >= 10){
    volumeIndex = Math.floor(Math.random()*6);
  }
  //Increment the count of the index
  volumeCounts[volumeIndex]++;
  //Return the index
  return volumeIndex;
}
//Function to do technique specific stuff
function techniqueSpecific(buttonID) {
    for(var j=0;j<buttonsArray.length;j++){
        if(buttonConnector[j].id == buttonID){
            buttonConnector[j].count++;
            break;
        }
    }
    buttonConnector.sort(function(a,b){return b.count-a.count});
    buttonConnector.forEach(argIndex=>parent.appendChild(document.getElementById(argIndex.id)));
}
//Main function
var timedClick = function() {
    //Disables the start button so it can't be clicked twice
    startButton.style.display = "none";
    counterDisplay.style.display = "none";
    //Update task selection instruction
    var targetButtonIndex = randomTarget();
    var targetButton = volumeArray[targetButtonIndex]
    targetVolume.innerHTML = "Set volume to: ".concat(targetButton);
    var targetIndex = buttonsArray[targetButtonIndex].id;
    //Start timer
    var startTime = performance.now();
    //Watch and see which button is clicked on during the task
    for(var i=0;i<buttonsArray.length;i++) {
        //Attach an event listener to each button click
        buttonsArray[i].onclick = function() {
            //Get volume to set
            var newVolume = this.dataset.volume;
            //Adjust volume
            if(newVolume=="0") {
                musicPlayer.muted = true;
            }else{
                musicPlayer.muted = false;
                musicPlayer.volume = newVolume/100;
            }
            //Stop timer
            var endTime = performance.now();
            //Calculate time elapsed
            var totalTime = endTime - startTime;
            //Record whole milliseconds (use Math.round())
            totalTime = Math.round(totalTime);
            //Prevent other buttons from being selected
            for(var i=0;i<buttonsArray.length;i++){
                buttonsArray[i].onclick = function(){}
            }
            //Figure out which button was clicked on
            var buttonClicked = this.id;
            techniqueSpecific(buttonClicked);
            //Increment clicks
            clicks++;
            //Log trial data
            dataLog = dataLog.concat(clicks+","+targetIndex+","+buttonClicked+","+totalTime+"\n");
            //Update/reset various interface elements
            startButton.style.display = "block";
            counterDisplay.style.display = "block";
            counterDisplay.innerHTML = "Trials Completed: ".concat(clicks);
            targetVolume.innerHTML = "Start Trial";
            if(newVolume!="0") {
                volumeDisplay.innerHTML = "Current Volume: ".concat(newVolume);
            }else {
                volumeDisplay.innerHTML = "Music Muted"
            }
            //Check if maxTrials completed yet
            if(clicks >= maxTrials){
                save();
                clicks = 0;
                dataLog = "";
                counterDisplay.innerHTML = "There are 60 trials in total";
                for(var i=0;i<buttonsArray.length;i++){
                  buttonConnector[i] = {
                    'id':buttonsArray[i].id,'count':0
                  }
                }
                buttonConnector.sort(function(a,b){return b.count-a.count});
            }
        }
    }
}
//Play or pause music
playOrPause = function() {
    if(!isMusicPlaying) {
        musicPlayer.play();
        playPauseButton.src = "https://people.ok.ubc.ca/bowenhui/341/2020/project/a8assets/pause.png";
        if(musicPlayer.muted) {
            volumeDisplay.innerHTML = "Music Muted";
        }else {
            volumeDisplay.innerHTML = "Current Volume: ".concat(musicPlayer.volume*100);
        }
        isMusicPlaying = true;
    }else {
        musicPlayer.pause();
        playPauseButton.src = "https://people.ok.ubc.ca/bowenhui/341/2020/project/a8assets/play.png";
        volumeDisplay.innerHTML = "Music Paused"
        isMusicPlaying = false;
    }
}
//Begin when the window loads
window.onload = function() {
    //Play or pause music
    playPauseButton.onclick = playOrPause;
    //Setup the start button
    startButton.onclick = timedClick;
    //Setup technique specific callback function here
}