//Prepare all needed variables
var closedBox = document.getElementById('closed');
var openBox = document.getElementById('open');
var cat = document.getElementById('cat');

//Play the main function
window.onload = function(){
    //Function to open the box and let the cat out
    closedBox.onclick = function(){
        closedBox.classList.add("opened");
        openBox.classList.remove("opened");
        cat.classList.remove("opened");
        cat.style.display = "block";
    }
    //Function for the cat to chase the cursor
    var catChase = function(e) {
        var userX = e.clientX;
        var userY = e.clientY;
        //Print user's current coordinates
        var coords = document.getElementById("location");
        coords.innerHTML = "You are at: (" + userX + "," + userY + ")";
        cat.style.left = userX + "px";
        cat.style.top = userY + "px";
    }
    //The event monitor to track our mouse
    document.onmousemove = catChase;
}