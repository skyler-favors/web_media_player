var videoNode = document.getElementById("video-player");
var imageNode = document.getElementById("image-viewer");
var coverArtNode = document.getElementById("cover-art");
var ppmNode = document.getElementById("imageCanvas");
var musicInfo = document.getElementsByClassName("audiotag");
var allMedia = document.getElementsByClassName("media");

var secondFile = false;
var currentFile = "";

function loadMedia() {
  // play is run when the input file node detects a new file
  var play = function() {
    var extension = checkFileExtension();
    var file = this.files[0];
    var URL = window.URL || window.webkitURL; 
    var fileURL = URL.createObjectURL(file);

    let filetype = getFileType(extension);

    // open second file
    if (secondFile) {
      hideMedia([currentFile, filetype])
    } else {
      hideMedia([filetype])
      currentFile = filetype;
    }
    switch (filetype) {
      case "video":
        videoNode.src = fileURL
        break;

      case "audio":
        getCoverArt(file);
        videoNode.src = fileURL
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

function hideMedia(except) {
  // remove everything
  videoNode.style.display = "none"
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
let ellipsis = document.querySelector(".fa-ellipsis-v");
let closeIcon = document.querySelector(".fa-times");
let musicPlaylist = document.querySelector(".music-playlist");
let playlistDiv = document.querySelector(".playlist-div");
let playlist = document.querySelector(".playlist");
let directory = document.querySelector(".directory");

//event listeners
ellipsis.addEventListener("click", showPlaylist); //three dots icon 
closeIcon.addEventListener("click", hidePlaylist);
directory.addEventListener("click", openDirectory);

//show playlist
function showPlaylist() {
  musicPlaylist.style.zIndex = "1";
}
//hide playlist
function hidePlaylist() {
  musicPlaylist.style.zIndex = "-1";
}

//Directory
function openDirectory(){
  //Music icon added in because original overwritten with new 
  directory.innerHTML = `<label class="test" for="file" title="Music Directory">
  <i class="fas fa-music"></i>
  <input type="file" id="file" style="display: none" name="image" accept="image/gif,image/jpeg,image/jpg,image/png" onchange="displayPlaylist(this.files)" multiple="" data-original-title="upload photos">
  <label>`;
}

//Later versions: add ability to add multiple playlists 
function displayPlaylist(files){
  //Create an ordered list 
  var listHTML = ["<ol id='display-playlist'>"];

  //Loop and display each media file 
  for (let index = 0; index < files.length; index++) {
    
    let file = files[index].name;

    //Display file name in playlist
    listHTML.push("<li id='", (index + 1) ,"'>", (file) ,"</li>");
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

//Add ability to double click to play song from playlist 
function playlistPlayback(number){
  let temp = document.getElementById(`${number}`);
  temp.addEventListener("dblclick", getFileName); //*** update second parameter to initiate file 
}
