// adds a event listener to the input that adds the video source
// to the player
function loadVideo() {
    'use strict'
    var playSelectedFile = function(event) {
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var videoNode = document.querySelector('.video-player')
        videoNode.src = fileURL
    }

    var inputNode = document.querySelector('.in-video')
    inputNode.addEventListener('change', playSelectedFile, false)
}

function loadAudio() {
    var playSelectedFile = function(event) {
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var audioNode = document.querySelector('.audio-player')
        audioNode.src = fileURL
    }

    var inputNode = document.querySelector('.in-audio')
    inputNode.addEventListener('change', playSelectedFile, false)
}

function loadImage() {
    var viewSelectedFile = function(event) {
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var imageNode = document.querySelector('.image-viewer')
        imageNode.src = fileURL
    }

    var inputNode = document.querySelector('.in-image')
    inputNode.addEventListener('change', viewSelectedFile, false)

}

function checkFileExtension() {
    fileName = document.querySelector('#chooseFile').value;
    extension = fileName.split('.').pop();
    console.log(extension)  
};


