var videoNode = document.getElementById("video-player");
var imageNode = document.getElementById("image-viewer");
var coverArtNode = document.getElementById("cover-art");
var ppmNode = document.getElementById("imageCanvas");
var musicInfo = document.getElementsByClassName("audiotag");
var allMedia = document.getElementsByClassName("media");

function loadMedia() {
  let video_extensions = ["mp4", "mov"];
  let audio_extensions = ["mp3", "wav", "ogg"];
  let image_extensions = ["png", "jpg", "gif"];


  // play is run when the input file node detects a new file
  var play = function() {
    extension = checkFileExtension();
    var file = this.files[0];
    var URL = window.URL || window.webkitURL; 
    var fileURL = URL.createObjectURL(file);

    if (video_extensions.includes(extension)) {
      hideMedia("video");
      videoNode.src = fileURL
    } else if (audio_extensions.includes(extension)) {
      hideMedia("audio");
      getCoverArt(file);
      videoNode.src = fileURL
    } else if (image_extensions.includes(extension)) {
      hideMedia("image");
      imageNode.src = fileURL
    } else if (extension == "ppm") {
      hideMedia("ppm");

      // r reads file as binary once it loads
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        processPPM(contents);
      }
      r.readAsBinaryString(file)
    } else {
      console.log("ERROR: switch statement defualted when it shouldnt");
      hideMedia();
    }
  }

  let inputNode = document.querySelector(".input-file");
  inputNode.addEventListener('change', play, false);
  hideMedia();
}

function checkFileExtension() {
  //split extension path into substrings and pops the last element of the array off
  let fileName = document.querySelector("#choose-file").value;
  let extension = fileName.split('.').pop();
  extension = extension.toLowerCase();
  console.log(extension);
  return extension;
}


function getCoverArt(file) {
  //Getting access to CDNJS library and saving to global var
  const jsmediatags = window.jsmediatags;

  //Return response
  jsmediatags.read(file, {
      onSuccess: function(tag){
        //Retrieve metatag and display track info 
        displayAudioTag(tag);

        //Checks if album cover exists
        let coverData = tag.tags;
        let coverExists = coverData.hasOwnProperty("picture");

        if (coverExists) {
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
          - Displays cover art image
          - Note: Switched the id from img to div container. Review html file
          */
          coverArtNode.style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`; 
          coverArtNode.style.padding = "5px";

        } else {
          coverArtNode.style.backgroundImage = `url("https://youshark.neocities.org/assets/img/default.png")`;
        }    
      },
      onError: function(error){
          console.log(error);
      }
  })
}

function displayAudioTag(tag){
  let track = tag.tags.title;
  let artist = tag.tags.artist;
  let album = tag.tags.album;

  if(track == ""){
    document.querySelector("#track").textContent = "Unknown Music"; //display file name? 
  } else {
    document.querySelector("#track").textContent = tag.tags.title;
  }

  if(artist == null){
    document.querySelector("#artist").textContent = "Unknown Artist";
  } else {
    document.querySelector("#artist").textContent = tag.tags.artist;
  }

  if(album == null){
    document.querySelector("#album").textContent = "Unknown Album";
  } else {
    document.querySelector("#album").textContent = tag.tags.album;
  }
}

//Upload Directory
let directory = document.querySelector(".fa-ellipsis-v");

directory.addEventListener("click", openDirectory);

function openDirectory(){
  //alert("works");
}

function hideMedia(except) {
  switch (except) {
    case "video":
      videoNode.style.display = "initial"
      imageNode.style.display = "none"
      ppmNode.style.display = "none"
      imageNode.style.backgroundImage = null;
      coverArtNode.style.display = "none"
      for (let i=0; i<musicInfo.length; i++) {
        musicInfo[i].style.display = "none"
      }
      break;

    case "image":
      videoNode.style.display = "none"
      imageNode.style.display = "initial"
      ppmNode.style.display = "none"
      imageNode.style.backgroundImage = null;
      coverArtNode.style.display = "none"
      for (let i=0; i<musicInfo.length; i++) {
        musicInfo[i].style.display = "none"
      }

      break;

    case "ppm":
      videoNode.style.display = "none"
      imageNode.style.display = "none"
      ppmNode.style.display = "initial"
      imageNode.style.backgroundImage = null;
      coverArtNode.style.display = "none"
      for (let i=0; i<musicInfo.length; i++) {
        musicInfo[i].style.display = "none"
      }

      break;

    case "audio":
      videoNode.style.display = "none"
      imageNode.style.display = "none"
      ppmNode.style.display = "none"
      coverArtNode.style.display = "initial"
      for (let i=0; i<musicInfo.length; i++) {
        musicInfo[i].style.display = "initial";
      }

      break;

    default:
      for (let i=0; i<allMedia.length; i++) {
          allMedia[i].style.display = "none";
      }
      break;
  }
}

loadMedia();

//test variables for playlist
let ellipsis = document.querySelector(".fa-ellipsis-v");
let closeIcon = document.querySelector(".fa-times");
let musicPlaylist = document.querySelector(".music-playlist");
let playlistDiv = document.querySelector(".playlist-div");
let playlist = document.querySelector(".playlist");

//event listeners
ellipsis.addEventListener("click", showPlaylist);
closeIcon.addEventListener("click", hidePlaylist);

//show playlist
function showPlaylist() {
  musicPlaylist.style.zIndex = "1";
}
//hide playlist
function hidePlaylist() {
  musicPlaylist.style.zIndex = "-1";
}
