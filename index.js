let extension = "";
let video_extensions = ["mp4", "mov"];
let audio_extensions = ["mp3", "wav", "ogg"];
let image_extensions = ["png", "ppm", "jpg"];

function loadVideo() {
    var playSelectedFile = function(event) {
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var videoNode = document.querySelector('.video-player')

        let combined = video_extensions.concat(audio_extensions);
        for (let i in combined) {
          if (extension == combined[i]) {
            videoNode.style.display = "initial"
            videoNode.src = fileURL
            document.querySelector(".video-player").style.visibility = "visible";
            document.querySelector(".buttons").style.visibility = "visible";
            return
          }
        }

        videoNode.src = null;
        videoNode.style.display = "none"
    }
    
    var inputNode = document.querySelector('.input-file')
    inputNode.addEventListener('change', playSelectedFile, false)
}

function loadImage() {
    var viewSelectedFile = function(event) {
    
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var imageNode = document.querySelector('.image-viewer')

        for (let i in image_extensions) {
            if (extension == image_extensions[i]) {
              imageNode.style.display = "initial"
              imageNode.src = fileURL
              document.querySelector(".image-viewer").style.visibility = "visible";
              return
          }
      }

        imageNode.src = null;
        imageNode.style.display = "none"
    }

    var inputNode = document.querySelector('.input-file')
    inputNode.addEventListener('change', viewSelectedFile, false)

}

function checkFileExtension() {
    fileName = document.querySelector('#choose-file').value;
    //split extension path into substrings and pops the last element of the array off
    extension = fileName.split('.').pop();
    extension = extension.toLowerCase();
    console.log(extension) 
};

loadVideo()
loadImage()

// Select the HTML5 video
const video = document.querySelector(".video-player")

// set the pause button to display:none by default
document.querySelector(".fa-pause").style.display = "none"

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
    video.currentTime = video.currentTime - ((video.duration/100) * 5)
}

// forward the current time
const forward = (e) => {
    video.currentTime = video.currentTime + ((video.duration/100) * 5)
}