const playbackrate = document.querySelector(".speedcontrolcontainer input");
const display = document.querySelector(".speedcontrolcontainer span");
const video = document.querySelector(".video-player");
let extension = "";
let video_extensions = ["mp4", "mov"];
let audio_extensions = ["mp3", "wav", "ogg"];
let image_extensions = ["png", "ppm", "jpg", "gif"];
let current_file = 0;

function getCoverArt() {
  //Getting access to CDNJS library and saving to global var
  const jsmediatags = window.jsmediatags;

  //Get access to input button on HTML
  const file = this.files[0];

  //Return api response
  jsmediatags.read(file, {
      onSuccess: function(tag){

          const data = tag.tags.picture.data;
          const format = tag.tags.picture.format;
          let base64String = "";

          //Display the cover art
          for (let i = 0; i < data.length; i++) {
              base64String += String.fromCharCode(data[i]);                            
          }

          /* Takes base64String and converts ascii data to binary data 
          - url(url )
          - btoa() = creates a Base64-encoded ASCII string from a binary string (i.e., a String object in which each character in the string is treated as a byte of binary data)
           */
          document.querySelector("#cover").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;

          //Retrieve metatag and display track info 
          document.querySelector("#track").textContent = tag.tags.title;
          document.querySelector("#artist").textContent = tag.tags.artist;
          document.querySelector("#album").textContent = tag.tags.album;
          document.querySelector("#genre").textContent = tag.tags.genre;

      },
      onError: function(error){
          console.log(error);
      }
  })
}

function loadVideo() {
  var playSelectedFile = function(event) {
    checkFileExtension();
    var file = this.files[current_file];
    var URL = window.URL || window.webkitURL; 
    var fileURL = URL.createObjectURL(file);
    var videoNode = document.querySelector('.video-player');
    let combined = video_extensions.concat(audio_extensions);

    if (combined.includes(extension)) {
      videoNode.style.display = "initial"
      videoNode.src = fileURL

      // load cover art if its a audio file
      if (audio_extensions.includes(extension)) {
        getCoverArt();
      }

      return
    }

    videoNode.src = null;
    videoNode.style.display = "none"
  }

  var inputNode = document.querySelector(".input-file")
  inputNode.addEventListener('change', playSelectedFile, false)
}

function loadImage() {
  var viewSelectedFile = function(event) {
    var file = this.files[current_file]
    var URL = window.URL || window.webkitURL 
    var fileURL = URL.createObjectURL(file)
    var imageNode = document.querySelector(".image-viewer")

    if (image_extensions.includes(extension)) {
      imageNode.style.display = "initial"
      imageNode.src = fileURL
      return
    }

    imageNode.src = null
    imageNode.style.display = "none"
  }

  var inputNode = document.querySelector(".input-file")
  inputNode.addEventListener('change', viewSelectedFile, false)

}

function checkFileExtension() {
  fileName = document.querySelector("#choose-file").value;
  //split extension path into substrings and pops the last element of the array off
  extension = fileName.split('.').pop();
  extension = extension.toLowerCase();
  document.querySelector(".fa-play").style.display = "block"
  document.querySelector(".fa-pause").style.display = "none"
  console.log(extension);
}

function loadFiles() {
  const picker = document.getElementById("filepicker");
  picker.addEventListener("change", function(event) {
    let output = document.getElementById("listing");
    let files = event.target.files;

    for (let i=0; i<files.length; i++) {
      let item = document.createElement("li");
      item.innerHTML = files[i].webkitRelativePath;
      item.className = "file_path";
      item.addEventListener("click", function(e) {
        var list_elements = document.getElementsByClassName("file_path");

        for (let i in list_elements) {
          if (list_elements[i].innerHTML == this.innerHTML) {
            current_file = i;
            alert(i)
          }
        }
      });
      output.appendChild(item);
    };
  }, false);
}

// disabling folder loader for now
//loadFiles()
loadVideo()
loadImage()


// -------- MEDIA CONTROLS -------

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
  
