var canvas = document.getElementById("imageCanvas");
var ctx;

function processPPM(fileContents) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var data = fileContents.split(/\r?\n/);

  var file_type = "";

  if (fileContents.substr(0, 2) == 'P3' || data[0] == 'P3') {
    console.log('P3');
    file_type = 'P3'
  } else if (fileContents.substr(0, 2) == 'P6' || data[0] == 'P6') {
    console.log('P6');
    file_type = 'P6'
  } else {
    console.log("not a ppm");
    return
  }

  let dim = data[2].split(' ');
  var width = dim[0];
  var height = dim[1];
  var maxColors = data[3];

  if (data[3] != 255) {
    console.log('MaxColors is not 255');
    return;
  }

  canvas.width=width; 
  canvas.height=height; 

  var img = ctx.getImageData(0, 0, width, height);
  var pixels = img.data;

  var imageIndex = 0;
  if (file_type == "P3") {
    for (var i = 4; i < data.length; i += 3) {
      pixels[imageIndex++] = data[i]; // r
      pixels[imageIndex++] = data[i+1]; // g
      pixels[imageIndex++] = data[i+2]; // b
      pixels[imageIndex++] = 255; // a
    }
    ctx.putImageData(img, 0, 0);
  } else if (file_type == "P6") {
    let temp = data[4];
    temp = temp.split(/[\\]/);
    for (var i = 0; i < temp.length; i += 3) {
      console.log(String.fromCharCode(temp[i]));
      pixels[imageIndex++] = temp[i]
      pixels[imageIndex++] = temp[i+1]
      pixels[imageIndex++] = temp[i+2]
      pixels[imageIndex++] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
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


