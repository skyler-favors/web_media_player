const playbackrate = document.querySelector(".speedcontrolcontainer input");
const display = document.querySelector(".speedcontrolcontainer span");
const video = document.querySelector(".video-player");

// -------- MEDIA CONTROLS -------

// set the pause button to display:none by default
//document.querySelector(".fa-pause").style.display = "none"

// update the progress bar
video.addEventListener("timeupdate", () => {
    let curr = (video.currentTime / video.duration) * 100
    if(video.ended){
        document.querySelector(".fa-play").style.display = "block"
        document.querySelector(".fa-pause").style.display = "none"
    }
    //document.querySelector('.inner').style.width = `${curr}%`
})

// pause or play the video
const play = (e) => {
    // Condition when to play a video
    if(video.paused){
        document.querySelector(".fa-play").style.display = "none"
        document.querySelector(".fa-pause").style.display = "block"
        video.play()
    }
    else{
        document.querySelector(".fa-play").style.display = "block"
        document.querySelector(".fa-pause").style.display = "none"
        video.pause()
    }
}

// trigger fullscreen
const fullScreen = (e) => {
    e.preventDefault()
    video.requestFullscreen()
}

// rewind the current time
const rewind = (e) => {
    video.currentTime = video.currentTime - ((video.duration/50) * 3.3)
}

// forward the current time
const forward = (e) => {
    video.currentTime = video.currentTime + ((video.duration/50) * 3.3)
}

const displayvalue = val => {
  return parseInt(val * 100, 10) + '%'
}

window.localStorage.pbspeed = 1;

if (window.localStorage.pbspeed) {
  //setting the value of our slider to pbspeed in local storage
  playbackrate.value = window.localStorage.pbspeed;
}

//setting our speed display to our video playback rate
display.innerText = displayvalue(video.playbackRate);

playbackrate.addEventListener("change", e => {
  //sets our video playback rate to the value of our slider
  video.playbackRate = playbackrate.value;
  display.innerText = displayvalue(playbackrate.value);
});

function playbackSlider() {
  //set our video playback speed to 1 (100%, normal play speed)
  window.localStorage.pbspeed = 1;
  //setting our video playback rate to the value inside of local storage (that we just set above)
  video.playbackRate = window.localStorage.pbspeed;
  //setting our sliders value to the value inside of local storage (that we just set above)
  playbackrate.value = window.localStorage.pbspeed;
  display.innerText = displayvalue(video.playbackRate);
  
}
