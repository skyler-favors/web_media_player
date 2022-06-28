const playbackrateSlider = document.querySelector(".speedcontrolcontainer input");
const videoScrubber = document.querySelector(".seekSlider");
const display = document.querySelector(".speedcontrolcontainer span");
const video = document.querySelector("#video-player");
const audio = document.querySelector("#audio-player");
const curTimeText = document.getElementById("curtimetext"); 
const durTimeText = document.getElementById("durtimetext");
const fileButton = document.querySelector(".input-file")

const media = [video, audio];
var curr = 0;
// change pitch checkbox
const pitch = document.querySelector('#pitch');
pitch.addEventListener('change', () => {
  if ('preservesPitch' in audio) {
    audio.preservesPitch = pitch.checked;
  }
});

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
for (i in media) {
  media[i].addEventListener("timeupdate", () => {
      if(media[i].ended){
          showPlayBtn();
      }
  })
}

// pause or play the video
const play = (e) => {
  // Condition when to play a video
  if(media[curr].paused){
      showPauseBtn()
      //media[curr].play();
      video.play()
      audio.play()
  }
  else{
      showPlayBtn()
      //media[curr].pause();
      video.pause()
      audio.pause()
  }
}

//repeat song/video
const repeat = (e) => {
  showPlayBtn()
  media[curr].playbackRate = window.localStorage.pbspeed; //1
  playbackrateSlider.value = window.localStorage.pbspeed; //1
  display.innerText = displayvalue(media[curr].playbackRate);
  media[curr].currentTime = 0;
  videoScrubber.value = 0; 
  media[curr].pause();
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
  previousSong();
  showPlayBtn();
}

// forward the current time by 10 seconds
const forward = (e) => {
  nextSong();
  showPlayBtn();
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
display.innerText = displayvalue(media[curr].playbackRate);

playbackrateSlider.addEventListener("change", e => {
  //sets our video playback rate to the value of our slider
  media[curr].playbackRate = playbackrateSlider.value;
  display.innerText = displayvalue(playbackrateSlider.value);
});

// function playbackSlider() {
//   //set our video playback speed to 1 (100%, normal play speed)
//   window.localStorage.pbspeed = 1;
//   //setting our video playback rate to the value inside of local storage (that we just set above)
//   video.playbackRate = window.localStorage.pbspeed;
//   //setting our sliders value to the value inside of local storage (that we just set above)
//   playbackrateSlider.value = window.localStorage.pbspeed;
//   display.innerText = displayvalue(video.playbackRate);
// }

//displays video length
function vidSeek(){
	var seekto = media[curr].duration * (videoScrubber.value / 100);
	media[curr].currentTime = seekto;  
}

function seektimeupdate(){ 
 //keep track of scrub location
 var nt = media[curr].currentTime * (100 / media[curr].duration);
 videoScrubber.value = nt;
}

setInterval(function() { 
  //KENNY - reformatted scrubber time
  var mins = Math.floor(media[curr].currentTime / 60);
  var secs = Math.floor(media[curr].currentTime % 60);
  if (secs < 10) {
    secs = '0' + String(secs);
  }
  curTimeText.innerHTML = mins + ':' + secs;

  //Display duration time of song 
  var min2 = Math.floor(media[curr].duration / 60);
  var sec2 = Math.floor(media[curr].duration % 60);
  durTimeText.innerHTML = min2 + ':' + sec2;
}, 10);

fileButton.addEventListener("change", postionSliderHome, false)
videoScrubber.addEventListener("change",vidSeek,false);
//media[curr].addEventListener("timeupdate",seektimeupdate,false);
video.addEventListener("timeupdate",seektimeupdate,false);
video.addEventListener('loadeddata', (event) => {
  videoScrubber.value = 0;
  playbackrateSlider.value = 1;
  video.playbackRate = 1;
  display.innerText = "1.0x";
})
