const playbackrateSlider = document.querySelector(".speedcontrolcontainer input");
const videoScrubber = document.querySelector(".seekSlider");
const display = document.querySelector(".speedcontrolcontainer span");
const video = document.querySelector("#video-player");
const curTimeText = document.getElementById("curtimetext"); 
const durTimeText = document.getElementById("durtimetext");
const fileButton = document.querySelector(".input-file")

// -------- MEDIA CONTROLS -------
videoScrubber.value= 0;
document.querySelector(".fa-pause").style.display = "none"

function showPlayBtn() {
  document.querySelector(".fa-play").style.display = "block"
  document.querySelector(".fa-pause").style.display = "none"
}

function showPauseBtn() {
  document.querySelector(".fa-play").style.display = "none"
  document.querySelector(".fa-pause").style.display = "block"
}

// update the progress bar
video.addEventListener("timeupdate", () => {
    if(video.ended){
        showPlayBtn();
    }
})

// pause or play the video
const play = (e) => {
    // Condition when to play a video
    if(video.paused){
        showPauseBtn()
        video.play()
    }
    else{
        showPlayBtn()
        video.pause()
    }
}

//repeat song/video
const repeat = (e) => {
    showPlayBtn()
    video.playbackRate = window.localStorage.pbspeed; //1
    playbackrateSlider.value = window.localStorage.pbspeed; //1
    display.innerText = displayvalue(video.playbackRate);
    video.currentTime = 0;
    videoScrubber.value = 0; 
    video.pause();
}

//display our play button when a new file is loaded
function postionSliderHome() {
  showPlayBtn();
}

// trigger fullscreen
const fullScreen = (e) => {
    e.preventDefault()
    video.requestFullscreen()
}

// rewind the current time by 10 seconds
const rewind = (e) => {
    video.currentTime = video.currentTime - ((video.duration/65) * 3)
}

// forward the current time by 10 seconds
const forward = (e) => {
    video.currentTime = video.currentTime + ((video.duration/65) * 3)
}

const displayvalue = val => {
  //display video speed as .5x, 1x, etc
  return parseFloat(val * 1).toFixed(1) + 'x'
}

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

//displays vido length
function vidSeek(){
	var seekto = video.duration * (videoScrubber.value / 100);
	video.currentTime = seekto;  
}

function seektimeupdate(){ 
 //keep track of scrub location
 var nt = video.currentTime * (100 / video.duration);
 videoScrubber.value = nt;
 
  var update = setInterval(function() { 
    //KENNY - reformatted scrubber time
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

fileButton.addEventListener("change", postionSliderHome, false)
videoScrubber.addEventListener("change",vidSeek,false);
video.addEventListener("timeupdate",seektimeupdate,false);

// -------- SLIDER STYLING -------
function updateGradient(rangeValue) {
  const percentage = (rangeValue - slider.min) / (playbackrateSlider.max - playbackrateSlider.min) * 100;
  playbackrateSlider.style.backgroundImage = `linear-gradient(90deg, #e22d49 ${percentage}%, transparent ${percentage}%)`;
}

// Update gradient onload
updateGradient(playbackrateSlider.value);

// Update gradient oninput
playbackrateSlider.addEventListener('input', (e) => {
  updateGradient(e.target.value);
});

function changeDuration(rangeValue) {  
  //TESTING
  var time = (rangeValue - videoScrubber.min) / (videoScrubber.max - videoScrubber.min) * 100;
  videoScrubber.style.backgroundImage = `linear-gradient(90deg, #e22d49 ${time}%, transparent ${time}%)`;
}

// Update gradient onload
changeDuration(videoScrubber.value);

// Update gradient oninput
videoScrubber.addEventListener('timeupdate', (e) => {
  changeDuration(e.target.value);
});

