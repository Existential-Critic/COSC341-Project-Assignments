//Prepare all needed variables
var portraitSection = document.getElementById("portrait-section");
var doneButton = document.getElementById("fee");

//Organize the paintings
var portraits = portraitSection.children;
var anxiety = portraits[2];
var despair = portraits[1];
var scream = portraits[0];
portraitSection.appendChild(anxiety);
portraitSection.appendChild(despair);
portraitSection.appendChild(scream);

//Play the main function
window.onload = function(){
    var startTime = performance.now();
    for(var i=0; i < portraits.length; i++){
        if(i == 1) {
            portraits[i].onclick = function(){
                var img = document.getElementById("despair");
                var bigOrSmall = Math.round(Math.random());
                if(img.width <= 50) {
                    img.width = img.width + 50;
                    img.height = img.height + 50;
                }else if(img.width >= 350) {
                    img.width = img.width - 50;
                    img.height = img.height - 50;
                }else if(bigOrSmall == 0) {
                    img.width = img.width + 50;
                    img.height = img.height + 50;
                }else{
                    img.width = img.width - 50;
                    img.height = img.height - 50;
                } 
            }
        } else {
            portraits[i].onclick = function(){ 
                alert("Don't Touch The Paintings!"); 
            }
        }
    }
  doneButton.onclick = function(){
      var endTime = performance.now();
      var timeTaken = endTime - startTime;
      var fee = ( timeTaken / 60 / 1000 ) * 20;
      fee = fee.toFixed(2);
      var doneMessage = "Your fee is $".concat(fee);
      alert(doneMessage); 
      window.close();
  }
}

// some event occurs, maybe your computer takes a stress break