const playbackrateSlider = document.querySelector(".speedcontrolcontainer input");
const videoScrubber = document.querySelector(".seekSlider");
const display = document.querySelector(".speedcontrolcontainer span");
const video = document.querySelector("#video-player");
const audio = document.querySelector("#audio-player");
const curTimeText = document.getElementById("curtimetext"); 
const durTimeText = document.getElementById("durtimetext");
const fileButton = document.querySelector(".input-file");
var inputNode = document.getElementById("choose-file");

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

//for chrome
playbackrateSlider.value = 1;

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
function changePlayBtn() {
  showPlayBtn();
}

// trigger fullscreen
const fullScreen = (e) => {
    e.preventDefault()
    let elem = getCurrentMediaPlayer()

    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullscreen) {
        elem.mozRequestFullscreen();
    }

}

// previousSong
const rewind = (e) => {
  previousSong();
  showPlayBtn();
}

// next song
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

//lets us seek into video/audio files
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
  var mins = Math.floor(media[curr].currentTime / 60);
  var secs = Math.floor(media[curr].currentTime % 60);
  if (secs < 10) {
    secs = '0' + String(secs);
  }
  curTimeText.innerHTML = mins + ':' + secs;

  //Display duration time of audio and video 
  var min2 = Math.floor(media[curr].duration / 60);
  var sec2 = Math.floor(media[curr].duration % 60);
  if (sec2 < 10) {
    sec2 = '0' + String(sec2);
  }
  durTimeText.innerHTML = min2 + ':' + sec2;
}, 10);

//change play/pause button when loading new file
fileButton.addEventListener("change",  changePlayBtn, false)
videoScrubber.addEventListener("change",vidSeek,false);

//keep track of video scrubber
video.addEventListener("timeupdate", seektimeupdate,false);

//keep track of audio scrubber
audio.addEventListener("timeupdate", seektimeupdate, false)

//when a new audio file is loaded revert our slider values back to home
audio.addEventListener('loadeddata', (event) => {
  videoScrubber.value = 0;
  playbackrateSlider.value = 1;
  video.playbackRate = 1;
  display.innerText = "1.0x";
  showPauseBtn()
})

//when a new video file is loaded revert our slider values back to home
video.addEventListener('loadeddata', (event) => {
  videoScrubber.value = 0;
  playbackrateSlider.value = 1;
  video.playbackRate = 1;
  display.innerText = "1.0x";
  showPauseBtn()
})

