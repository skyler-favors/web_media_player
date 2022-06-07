// adds a event listener to the input that adds the video source
// to the player
function loadVideo() {
    'use strict'
    var playSelectedFile = function(event) {
        alert('im here now')
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var videoNode = document.querySelector('.video-player')
        videoNode.src = fileURL
        document.querySelector(".video-player").style.visibility = "visible";
    }
    
    var inputNode = document.querySelector('.input-file')
    inputNode.addEventListener('change', playSelectedFile, false)
    alert('im here')
}

function loadImage() {
    var viewSelectedFile = function(event) {
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var imageNode = document.querySelector('.image-viewer')
        imageNode.src = fileURL
        document.querySelector(".image-viewer").style.visibility = "visible";
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

    if (extension == 'mov') {
        loadVideo();
    }

};



