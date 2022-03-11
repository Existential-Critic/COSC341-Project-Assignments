// allows video to be paused and played
let video = document.getElementById("videoIn");
let musicPlayer = document.getElementById("music-player");
musicPlayer.volume = 0;
video.addEventListener('click',function(){
  if(!video.paused){
    video.pause();
    musicPlayer.pause();
    document.getElementById("message").innerHTML = "Paused";
  }else{
    video.play();
    musicPlayer.play();
  }
});
// monitor to display when the gesture video has ended
video.addEventListener("ended",function(){
    document.getElementById("message").innerHTML = "Gesture video ended";
})

// ALL CODE BELOW IS CV RELATED

let gestureOccuring = false;
let rotationAngle = 0;

// document.getElementById("canvasOut").setAttribute('crossOrigin', '');
document.getElementById("message").innerHTML = "Loading OpenCV";
const cv = require("./js_assets/opencv.js");
cv["onRuntimeInitialized"] = () => {    
    document.getElementById("message").innerHTML = "Press the video to start the gestures & song";

    let video = document.getElementById("videoIn");
    let cap = new cv.VideoCapture(video);
    let frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    
    // will hold our binary mapped hand
    let hand = new cv.Mat(video.height, video.width, cv.CV_8UC4);

    // defining all state variables and buffers
    let handInFrame = false;
    let rotateBuffer = [];

    const FPS = 30;
    function processVideo(){
        try{
            // will be our output
            //let out = new cv.Mat.zeros(frame.rows, frame.cols, cv.CV_8UC1);
            // if the video is paused, don't bother processing it
            if(video.paused || video.ended){
                //console.log("not processing");
                setTimeout(processVideo, 100);
            }else{
                // save time and read in the current frame
                //console.log("processing");
                let begin = Date.now();
                cap.read(frame);
                
                // threshold to find the hand in the video
                let handLow = new cv.Mat(frame.rows, frame.cols, frame.type(), [40,70,60,0]);
                let handHigh = new cv.Mat(frame.rows, frame.cols, frame.type(), [255,255,255,255]);
                // remove background by finding what is in range and inverting binary image
                cv.inRange(frame, handLow, handHigh, hand);
                cv.threshold(hand,hand,250,255,cv.THRESH_BINARY_INV);
                
                // set structural elements for cleaning binary image
                let SE1 = cv.Mat.ones(2, 2, cv.CV_8U);
                let SE2 = cv.Mat.ones(8,8,cv.CV_8U);
                let anchor = new cv.Point(-1,-1);
                // clean hand a little
                cv.erode(hand, hand, SE1);
                cv.dilate(hand, hand, SE2);

                // try to map out hand (if there is a hand present)
                try{
                    // get contours of hand
                    let contours = new cv.MatVector();
                    let hierarchy = new cv.Mat();
                    cv.findContours(hand, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

                    // now find the convex hull of the largest blob (the hand)
                    let hull = new cv.MatVector();
                    // determine which blob is largest
                    let maxArea = 0;
                    let handInd = -1;
                    for(var i = 0; i < contours.size(); i++){
                        let cnt = contours.get(i);
                        let area = cv.contourArea(cnt, false);
                        if(area > maxArea){
                            maxArea = area;
                            handInd = i;
                        }
                    }
                    // if the major blob is greater than 500px in area, it is definitely not noise, so the user's hand is in view
                    if(maxArea > 500)
                        handInFrame = true;
                    else
                        handInFrame = false;
                    
                    // now we decide what gesture the user is performing and return the proper output
                    if(handInFrame){
                        // calculate convex hull of the determined hand
                        let tmp = new cv.Mat();
                        let cnt = contours.get(handInd);
                        cv.convexHull(cnt, tmp, false, true);
                        hull.push_back(tmp);
                        tmp.delete();

                        // look for a gesture if one hasn't been locked in yet
                        if(!gestureOccuring){
                            // to check for rotation
                            let rotatedRect = cv.fitEllipse(cnt);
                            let rotation = rotatedRect.angle;
                            if(rotation < 100)
                                rotation += 180;
                            rotateBuffer.push(rotation);
                            // now actually check the gesture occurence once the correct number of frames have been buffered
                            if(rotateBuffer.length > 20){
                                // shift queues
                                rotateBuffer.shift();
                                // checking for rotation
                                let rotationDiff = Math.abs(rotateBuffer[19] - rotateBuffer[7]);
                                if(rotationDiff > 9){
                                    document.getElementById("message").innerHTML = "Rotating";
                                    gestureOccuring = true;
                                }
                            }
                        }else{
                            // this runs when the user is rotating their hand, so the value here will be the angle of rotation
                            if(maxArea > 1000){
                                let rotatedRect = cv.fitEllipse(cnt);
                                rotationAngle = rotatedRect.angle;
                                if(rotationAngle < 100)
                                    rotationAngle += 180;
                                document.getElementById("message").innerHTML = "Rotated to " + rotationAngle.toPrecision(5) + " degrees" ;
                            }
                        }
                    }else{
                        // this occurs if no hand is in frame, so every buffer resets so as to expect the next gesture
                        gestureOccuring = false;
                        rotateBuffer = [];
                        document.getElementById("message").innerHTML = "No Gesture";
                    }
                }catch(e){
                    console.log("Error",e.stack);
                    console.log("Error",e.name);
                    console.log("Error",e.message);
                }
                let delay = 1000/FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);
            }
        }catch(err){
            console.log("outer");
            console.log("Error",err);
        }
    }
    processVideo();
}
