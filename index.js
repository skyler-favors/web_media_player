let extension = "mp4";
let video_extensions = ["mp4"];
let audio_extensions = ["mp3", "wav", "ogg"];
let image_extensions = ["png", "ppm", "jpg"];
let current_file = 0;

// adds a event listener to the input that adds the video source
// to the player
function loadVideo() {
    var playSelectedFile = function(event) {
        var file = this.files[current_file]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var videoNode = document.querySelector('.video-player')

        let combined = video_extensions.concat(audio_extensions);
        for (let i in combined) {
          if (extension == combined[i]) {
            videoNode.style.display = "initial"
            videoNode.src = fileURL
            document.querySelector(".video-player").style.visibility = "visible";
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
    
        var file = this.files[current_file]
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
    
    imageNode.src = null
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

loadFiles()
loadVideo()
loadImage()



