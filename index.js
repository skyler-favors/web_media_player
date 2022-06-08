let extension = "";
let video_extensions = ["mp4", "mov"];
let audio_extensions = ["mp3", "wav", "ogg"];
let image_extensions = ["png", "jpg", "gif"];
let current_file = 0;

function getCoverArt(file) {
  //Getting access to CDNJS library and saving to global var
  const jsmediatags = window.jsmediatags;

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
          document.querySelector(".image-viewer").style.display = "initial";
          document.querySelector(".image-viewer").style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;

          //Retrieve metatag and display track info 
          //document.querySelector("#track").textContent = tag.tags.title;
          //document.querySelector("#artist").textContent = tag.tags.artist;
          //document.querySelector("#album").textContent = tag.tags.album;
          //document.querySelector("#genre").textContent = tag.tags.genre;

      },
      onError: function(error){
          console.log(error);
      }
  })
}

var canvas;
var ctx;

function processPPM(fileContents) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  fileContents = fileContents.replace(/^\s+/, '').replace(/\s+$/, '');
  var data = fileContents.split(/\s+/);

  if (fileContents.substr(0, 2) != 'P3' || data[0] != 'P3') {
    console.log('File is not a PPM');
    return;
  } 

  var width = data[1];
  var height = data[2];
  var maxColors = data[3];

  if (data[3] != 255) {
    console.log('MaxColors is not 255');
    return;
  }

  if (data.length != 3 * width * height + 4) {
    console.log('Not enough pixel data.<br>'
      + 'Found: ' + (data.length  -  4) + '<br>'
      + 'Expecting: ' + (3 * width * height) + '<br>'
      + 'Based on width = ' + width 
      + ' and height = ' + height);
    return;
  }

  canvas.width=width; 
  canvas.height=height; 

  var img = ctx.getImageData(0, 0, width, height);
  var pixels = img.data;

  var imageIndex = 0;
  for (var i = 4; i < data.length; i += 3) {
    pixels[imageIndex++] = data[i]; // r
    pixels[imageIndex++] = data[i+1]; // g
    pixels[imageIndex++] = data[i+2]; // b
    pixels[imageIndex++] = 255; // a
  }
  ctx.putImageData(img, 0, 0);
  reloadButton.disabled = false;
}

function loadPPM() {
  var playSelectedFile = function(event) {
    checkFileExtension();
    var file = this.files[current_file];
    var URL = window.URL || window.webkitURL; 
    var fileURL = URL.createObjectURL(file);
    canvas = document.getElementById("imageCanvas");
    ctx = canvas.getContext("2d");

    if (extension == "ppm") {
      canvas.style.display = "initial";
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        processPPM(contents);
      }
      r.readAsText(file);
    } else {
      canvas.style.display = "none"
    }
  }

  var inputNode = document.querySelector('.input-file')
  inputNode.addEventListener('change', playSelectedFile, false)
  document.getElementById("imageCanvas").style.display = "none";
}

loadPPM()


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
      document.querySelector(".video-player").style.visibility = "visible";
      document.querySelector(".buttons").style.visibility = "visible";

      // load cover art if its a audio file
      if (audio_extensions.includes(extension)) {
        getCoverArt(file);
      }
    } else {
      videoNode.src = null;
      videoNode.style.display = "none"
    }
  }

  var inputNode = document.querySelector('.input-file')
  inputNode.addEventListener('change', playSelectedFile, false)
  document.querySelector('.video-player').style.display = "none";
}

function loadImage() {
  var viewSelectedFile = function(event) {
    var file = this.files[current_file]
    var URL = window.URL || window.webkitURL 
    var fileURL = URL.createObjectURL(file)
    var imageNode = document.querySelector('.image-viewer')

    if (image_extensions.includes(extension)) {
      imageNode.style.display = "initial"
      imageNode.src = fileURL
      document.querySelector(".image-viewer").style.visibility = "visible";
    } else {
      imageNode.src = null
      imageNode.style.display = "none"
    }
  }

  var inputNode = document.querySelector('.input-file')
  inputNode.addEventListener('change', viewSelectedFile, false)
  document.querySelector('.image-viewer').style.display = "none";
}


function checkFileExtension() {
  fileName = document.querySelector('#choose-file').value;
  //split extension path into substrings and pops the last element of the array off
  extension = fileName.split('.').pop();
  extension = extension.toLowerCase();
  console.log(extension);
}

function loadFolder() {
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
//loadFolder()
loadVideo()
loadImage()


// -------- MEDIA CONTROLS -------
// Select the HTML5 video
const video = document.querySelector(".video-player")

// set the pause button to display:none by default
//document.querySelector(".fa-pause").style.display = "none"

// update the progress bar
video.addEventListener("timeupdate", () => {
    let curr = (video.currentTime / video.duration) * 100
    if(video.ended){
        document.querySelector(".fa-play").style.display = "block"
        document.querySelector(".fa-pause").style.display = "none"
    }
    document.querySelector('.inner').style.width = `${curr}%`
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

const playbackrate = document.querySelector('.speedcontrolcontainer input');
const display = document.querySelector('.speedcontrolcontainer span');
const displayvalue = val => {
  return parseInt(val * 100, 10) + '%'
}

if (window.localStorage.pbspeed) {
  video.playbackRate = window.localStorage.pbspeed;
  playbackrate.value = window.localStorage.pbspeed;
}
display.innerText = displayvalue(video.playbackRate);
playbackrate.addEventListener('change', e => {
  video.playbackRate = playbackrate.value;
  display.innerText = displayvalue(playbackrate.value);
  window.localStorage.pbspeed = playbackrate.value;
});
