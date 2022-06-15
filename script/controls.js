const playbackrateSlider = document.querySelector(".speedcontrolcontainer input");
const videoScrubber = document.querySelector(".seekSlider");
const display = document.querySelector(".speedcontrolcontainer span");
const video = document.querySelector(".video-player");
const curTimeText = document.getElementById("curtimetext"); const durTimeText = document.getElementById("durtimetext");

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
  playbackrateSlider.value = window.localStorage.pbspeed;
}

//setting our speed display to our video playback rate
display.innerText = displayvalue(video.playbackRate);

playbackrateSlider.addEventListener("change", e => {
  //sets our video playback rate to the value of our slider
  video.playbackRate = playbackrateSlider.value;
  display.innerText = displayvalue(playbackrateSlider.value);
});

function playbackSlider() {
  //set our video playback speed to 1 (100%, normal play speed)
  window.localStorage.pbspeed = 1;
  //setting our video playback rate to the value inside of local storage (that we just set above)
  video.playbackRate = window.localStorage.pbspeed;
  //setting our sliders value to the value inside of local storage (that we just set above)
  playbackrateSlider.value = window.localStorage.pbspeed;
  display.innerText = displayvalue(video.playbackRate);
}

function vidSeek(){
	var seekto = video.duration * (videoScrubber.value / 100);
	video.currentTime = seekto;  
}

function seektimeupdate(){
  /*
	var nt = video.currentTime * (100 / video.duration);
	videoScrubber.value = nt;
  curTimeText.innerHTML = (Math.round(video.currentTime * 100) / 100).toFixed(2);
  durTimeText.innerHTML = (Math.round(video.duration * 100) / 100).toFixed(2);
  */
 
  //KENNY - reformatted to scrubber
  //Keep track of scrub location
  var nt = video.currentTime * (100 / video.duration);
  videoScrubber.value = nt;

  var update = setInterval(function() {
    var mins = Math.floor(video.currentTime / 60);
    var secs = Math.floor(video.currentTime % 60);
    if (secs < 10) {
      secs = '0' + String(secs);
    }
    curTimeText.innerHTML = mins + ':' + secs;

    //Display duration time of song 
    var min2 = Math.floor(video.duration / 60);
    var sec2 = Math.floor(video.duration % 60);
    durTimeText.innerHTML = min2 + ':' + sec2;

  }, 10);
}

videoScrubber.addEventListener("change",vidSeek,false);
video.addEventListener("timeupdate",seektimeupdate,false);

// -------- SLIDER STYLING -------
//Slider 1
let slider = document.getElementById("pbrate");

function updateGradient(rangeValue) {
  const percentage = (rangeValue - slider.min) / (slider.max - slider.min) * 100;
  slider.style.backgroundImage = `linear-gradient(90deg, #e22d49 ${percentage}%, transparent ${percentage}%)`;
}

// Update gradient onload
updateGradient(slider.value);

// Update gradient oninput
slider.addEventListener('input', (e) => {
  updateGradient(e.target.value);
});

//Slider 2
let slider2 = document.getElementById("scrubtimer");

function changeDuration(rangeValue) {  
  //TESTING

  var time = (rangeValue - slider2.min) / (slider2.max - slider2.min) * 100;

  slider2.style.backgroundImage = `linear-gradient(90deg, #e22d49 ${time}%, transparent ${time}%)`;
    
}

// Update gradient onload
changeDuration(slider2.value);

// Update gradient oninput
slider2.addEventListener('timeupdate', (e) => {
  changeDuration(e.target.value);
});

