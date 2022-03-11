//References to HTMl elements
var knob = document.getElementById("volume-knob");
var volumeDisplay = document.getElementById("volume-display");
var musicPlayer = document.getElementById("music-player");

//Check the state of the gesture every 20ms
setInterval(checkGesture,20);

//Holds the most recently sampled gesture value
var currGestureValue = -1;

//Function will be called at set intervals to check the gesture state
function checkGesture() {
  //If a gesture is in fact occuring, we want to sample gesture values
  if(gestureOccuring) {
    var angle = rotationAngle;
    if(currGestureValue != angle) {
      currGestureValue = angle;
      rangeValue = currGestureValue-160;
      rangeValue = rangeValue/46;
      setVolume(rangeValue)
    }
  }
}

//This function handles volume setting
//Translates the desired volume into the actual angle of rotation of the knob 
function setVolume(vol) {
  musicPlayer.volume = vol;
  volDisplay = vol*100;
  volumeDisplay.innerText = Math.round(volDisplay);
  volRotation = vol*180;
  knob.style.transform = 'rotate(' + volRotation + 'deg)';
}
