// adds a event listener to the input that adds the video source
// to the player

//Getting access to CDNJS library and saving to global var
const jsmediatags = window.jsmediatags;

//Get access to input button on HTML
document.querySelector("#test-audiodata").addEventListener("change", (event) => {
    //Storing event into this var 
    const file = event.target.files[0];

    //Return api response
    jsmediatags.read(file, {
        onSuccess: function(tag){
            //TEST
            //console.log(tag);

            
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
})


function loadVideo() {
    var playSelectedFile = function(event) {
        var file = this.files[0]
        var URL = window.URL || window.webkitURL 
        var fileURL = URL.createObjectURL(file)
        var videoNode = document.querySelector('.video-player')

        if (extension != "mp4") {
        videoNode.src = null;
        videoNode.style.display = "none"
        return
        }

        videoNode.style.display = "initial"
        videoNode.src = fileURL
        document.querySelector(".video-player").style.visibility = "visible";
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

        if (extension != "png") {
           imageNode.src = null
           imageNode.style.display = "none"
           return
        }

        imageNode.style.display = "initial"
        imageNode.src = fileURL
        document.querySelector(".image-viewer").style.visibility = "visible";
    }

    var inputNode = document.querySelector('.input-file')
    inputNode.addEventListener('change', viewSelectedFile, false)

}

let extension = "";

function checkFileExtension() {
    fileName = document.querySelector('#choose-file').value;
    //split extension path into substrings and pops the last element of the array off
    extension = fileName.split('.').pop();
    extension = extension.toLowerCase();
    console.log(extension) 
};

loadVideo()
loadImage()



