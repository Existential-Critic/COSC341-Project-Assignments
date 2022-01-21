// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Prepare all needed variables
var game = document.getElementById("message");
var userNumber = document.getElementById("number");
var gameButton = document.getElementById("startGame");
var result = document.getElementById("resultMessage");
var wins = document.getElementById("wins");
var losses = document.getElementById("losses");
var winsRatio = document.getElementById("winsRatio");
const incorrectMessages = ["Sorry, that's not it.","Not quite, try again!","Not this time!","Keep trying, you can do this."];

//Function to get the current wins number
function getWins(){
  var winText = wins.textContent;
  const winSplit = winText.split(" ");
  var winNum = parseInt(winSplit[1]);
  return winNum;
}
//Function to get the current losses number
function getLosses(){
  var lossText = losses.textContent;
  const lossSplit = lossText.split(" ");
  var lossNum = parseInt(lossSplit[1]);
  return lossNum;
}
//Main game function
gameButton.onclick = function(){
  //Get the user's inputted number and a random integer
  var userNum = parseInt(userNumber.value);
  var randomNum = Math.random()*9 + 1;  
  randomNum = Math.round(randomNum);
  //Case if not correct input type
  if(!Number.isInteger(userNum)){
    result.innerHTML = "Sorry, that's not a digit. Please try again!"
  }
  //Case if integer out of bounds (below 1 or above 10)
  else if(userNum < 0 || userNum > 10){
    result.innerHTML = "Sorry, that number is out of bounds. Please try again!"
  }
  //Case if the user is correct
  else if(userNum == randomNum) {
    result.innerHTML = "You got it, good job!"
    var newWins = getWins()+1;
    winMess = "Wins: ".concat(newWins);
    wins.innerHTML = winMess;
    wins.classList.add("tab");
  //Case if the user is incorrect
  } else {
    var messageNum = Math.random()*3;  
    messageNum = Math.round(messageNum);
    var incorrectMess = incorrectMessages[messageNum].concat(" The correct answer is ").concat(randomNum).concat(".");
    result.innerHTML = incorrectMess;
    var newLosses = getLosses()+1;
    lossMess = "Losses: ".concat(newLosses);
    losses.innerHTML = lossMess;
    losses.classList.add("tab");
  }
//Update the win ratio
var winCount = getWins();
var lossCount = getLosses();
var winRate = 0;
if(winCount > 0 && lossCount == 0){
  winRate = 100;
} else {
  winRate = ((winCount/lossCount)*100).toFixed(2);
}
winsRatioMess = "Wins Ratio: ".concat(winRate).concat("%");
winsRatio.innerHTML = winsRatioMess;
winsRatio.classList.add("tab");
}