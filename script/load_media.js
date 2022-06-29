var videoNode = document.getElementById("video-player");
var audioNode = document.getElementById("audio-player");
var imageNode = document.getElementById("image-viewer");
var coverArtNode = document.getElementById("cover-art");
var ppmNode = document.getElementById("image-canvas");
var musicInfo = document.getElementsByClassName("audiotag");
var allMedia = document.getElementsByClassName("media");
var inputNode = document.getElementById("choose-file");

var secondFile = false;
var currentFile = "";
var currentIndex = 0;
var playlistSize = 0;
var currtype = "";

let track; 
let artist;
let album;

function nextSong() {
  if (currentIndex < playlistSize) {
    currentIndex += 1;
    start();
  }
}

function previousSong() {
  if (currentIndex > 0) {
    currentIndex -= 1;
    start();
  }
}

function start() {
  var extension = checkFileExtension();
  var file = inputNode.files[currentIndex];
  var URL = window.URL || window.webkitURL; 
  var fileURL = URL.createObjectURL(file);

  let filetype = getFileType(extension);
  playlistSize = inputNode.files.length;
  currtype = filetype;

  // open second file
  if (secondFile) {
    hideMedia([currentFile, filetype])
  } else {
    hideMedia([filetype])
    currentFile = filetype;
  }

  switch (filetype) {
    case "video":
      curr = 0;
      videoNode.src = fileURL
      audioNode.src = null;
      break;

    case "audio":
      curr = 1;
      getCoverArt(file);
      audioNode.src = fileURL
      videoNode.src = null;
      break;

    case "image":
      imageNode.src = fileURL
      break;

    case "ppm":
      // r reads file as binary once it loads
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        processPPM(contents);
      }
      r.readAsBinaryString(file)
      break;

    default:
      currentFile = "error";
      console.log("ERROR: switch statement defualted when it shouldnt");
      hideMedia();
      break;
  }
}

function loadMedia() {
  // play is run when the input file node detects a new file
  inputNode.addEventListener('change', start, false);
  hideMedia();
}

function checkFileExtension() {
  //split extension path into substrings and pops the last element of the array off
  let fileName = inputNode.files[currentIndex].name;
  let extension = fileName.split('.').pop();
  extension = extension.toLowerCase();
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
  track = tag.tags.title;
  artist = tag.tags.artist;
  album = tag.tags.album;

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

function hideMedia(except) {
  // remove everything
  videoNode.style.display = "none"
  audioNode.style.display = "none"
  imageNode.style.display = "none"
  ppmNode.style.display = "none"
  imageNode.style.backgroundImage = null;
  coverArtNode.style.display = "none"

  for (let i=0; i<musicInfo.length; i++) {
    musicInfo[i].style.display = "none"
  }

  for (let i in except) {
    switch (except[i]) {
      case "video":
        videoNode.style.display = "initial"
        break;

      case "image":
        imageNode.style.display = "initial"
        break;

      case "ppm":
        ppmNode.style.display = "initial"
        break;

      case "audio":
        coverArtNode.style.display = "initial"
        audioNode.style.display = "initial"
        for (let i=0; i<musicInfo.length; i++) {
          musicInfo[i].style.display = "initial";
        }
        break;

      default:
        break;
    }
  }
}

function getFileType(extension) {
  let video_extensions = ["mp4", "mov"];
  let audio_extensions = ["mp3", "wav", "ogg"];
  let image_extensions = ["png", "jpg", "gif"];

  if (video_extensions.includes(extension)) {
    return "video";
  } else if (audio_extensions.includes(extension)) {
    return "audio";
  } else if (image_extensions.includes(extension)) {
    return "image";
  } else if (extension == "ppm") {
    return "ppm";
  } else {
    return "error";
  }
}

function openSecondFile() {
  var toggleButton = document.getElementById("openSecond");
  var toggle = function() {
    secondFile = !secondFile;
    if (secondFile) {
      toggleButton.innerHTML = "Second File On";
    } else {
      toggleButton.innerHTML = "Second File Off";
    }
  };
  toggleButton.addEventListener('click', toggle, false);
}

loadMedia();
openSecondFile();

//Playlist
//let ellipsis = document.querySelector(".fa-ellipsis-v"); //switch to open directory 
let homeSwitch = document.getElementById("switch-home"); //***

//let closeIcon = document.querySelector(".fa-times");
let closeIcon = document.getElementById("switch-playlist");
let musicPlaylist = document.querySelector(".music-playlist");
let playlistDiv = document.querySelector(".playlist-div");
let playlist = document.querySelector(".playlist");
let directory = document.querySelector(".directory");
let playlistVisibility = document.querySelector(".playlist-contents");
let currentPlaylistFile;
let editPlaylist = document.getElementById("playlist-edit");
let selected;

//event listeners
//ellipsis.addEventListener("click", showPlaylist); //three dots icon 
homeSwitch.addEventListener("click", showPlaylist);
closeIcon.addEventListener("click", hidePlaylist);
editPlaylist.addEventListener("click", modifyPlaylist);

//show playlist
function showPlaylist() {
  playlistVisibility.style.visibility = "visible";
  musicPlaylist.style.zIndex = "1";
}

//hide playlist
function hidePlaylist() {  
  musicPlaylist.style.zIndex = "-1";  
  playlistVisibility.style.visibility = "hidden";
}

function modifyPlaylist(){
  alert("Under Construction");
}

//Later versions: add ability to add multiple playlists 
function displayPlaylist() {
  var files = inputNode.files;
  //Create an ordered list 
  var listHTML = ["<ol id='display-playlist'>"];

  //Loop and display each media file 
  for (let index = 0; index < files.length; index++) {
    
    let file = files[index].name;

    //Display file name in playlist
    listHTML.push("<li id='", (index + 1) ,"' onclick='selectedPlaylistFile(", index + 1 ,")'>", (file) ,"</li>");
  }

  //Close list
  listHTML.push("</ol>");

  //Print list
  document.querySelector(".playlist-printout").innerHTML = listHTML.join("");

  //Add playback functionality to each line item***
  for (let index = 0; index < files.length; index++) {
    playlistPlayback(index + 1);    
  }

  //Reset list for new playlist
  listHTML = [];
}

let prevFile = false; 

function selectedPlaylistFile(number){
  if(prevFile == true){
    selected.style.background = "rgba(0,0,0,.9)";
  }
  selected = document.getElementById(`${number}`);
  selected.style.background = "rgba(255,255,255,.2)";
  prevFile = true;
}


//Add ability to double click to play song from playlist 
function playlistPlayback(number){
  currentPlaylistFile = document.getElementById(`${number}`);
  currentPlaylistFile.addEventListener("dblclick", getFileName); //*** update second parameter to initiate file 
}



function getCurrentMediaPlayer() {
  switch (currentFileType) {
    case "video":
      return videoNode;
    case "audio":
      return audioNode;
    case "image":
      return imageNode;
    case "ppm":
      return ppmNode;
    default:
      return "";
  }
}

function getFileName() {
  currentIndex = this.id - 1;
  let temp = document.getElementById(`${currentIndex}`);
  //temp.style.font = "blue";
  start();
}

inputNode.addEventListener("change", displayPlaylist);
