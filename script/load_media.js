let extension = "";
let video_extensions = ["mp4", "mov"];
let audio_extensions = ["mp3", "wav", "ogg"];
let image_extensions = ["png", "jpg", "gif"];
let current_file = 0;

function checkFileExtension() {
  fileName = document.querySelector("#choose-file").value;
  //split extension path into substrings and pops the last element of the array off
  extension = fileName.split('.').pop();
  extension = extension.toLowerCase();
  document.querySelector(".fa-play").style.display = "block"
  document.querySelector(".fa-pause").style.display = "none"
  console.log(extension);
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
        getCoverArt(file);
        videoNode.style.display = "none"
        document.querySelector(".image-viewer").style.display = "initial"
      }
    } else {
      videoNode.src = null;
      videoNode.style.display = "none"
    }
  }

  var inputNode = document.querySelector(".input-file")
  inputNode.addEventListener('change', playSelectedFile, false)
  document.querySelector('.video-player').style.display = "none";
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
      document.querySelector(".image-viewer").style.visibility = "visible";
    } else {
      //imageNode.src = null
      imageNode.style.display = "none"
    }
  }

  var inputNode = document.querySelector(".input-file")
  inputNode.addEventListener('change', viewSelectedFile, false)
  document.querySelector('.image-viewer').style.display = "none";
}


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
          document.querySelector(".image-viewer").style.width = '100%'
          document.querySelector(".image-viewer").style.height = '500'

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


loadVideo()
loadImage()
