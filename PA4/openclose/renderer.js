//References to HTML elements
var muteIndicator = document.getElementById("mute-indicator");
var musicPlayer = document.getElementById("music-player");

//Check the state of the gesture every 20ms
setInterval(checkGesture,20);

//Update when we react to the gesture for the first time
var alreadyResponded = false;

// function will be called at set intervals to check the gesture state
function checkGesture() {
  //We haven't encountered a gesture yet
  if(!alreadyResponded) {
    //A gesture has just occured for the first time
    if(gestureOccuring) { 
      //Call mute or unmute 
      muteOrUnmute()
      //Update state variable to say we have responded to current gesture
      alreadyResponded = true;
    }
  }
  //We already responded and now gesture has ended
  else if(!gestureOccuring) {  
    //Reset to say we haven't yet encountered a new gesture
    alreadyResponded = false;
  }
}

//This function handles volume setting
//Mutes or unmutes the music and displays the corresponding graphic
function muteOrUnmute() {
  if(musicPlayer.muted) {
    musicPlayer.muted = false
    muteIndicator.style.display = 'none'
  }
  else if(!musicPlayer.muted) {
    musicPlayer.muted = true
    muteIndicator.style.display = 'block'
  }
}