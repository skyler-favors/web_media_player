var canvas = document.getElementById("image-canvas");
var ctx = canvas.getContext("2d");

function processPPM(fileContents) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var meta = [];
  var temp = [];
  var count = 0;
  var data = []
  var commentCount = 0;

  for (var i=0; i<fileContents.length; i++) {
    if (fileContents[i] == "\n") {
      meta.push(temp.join(''));
      temp = [];
      count += 1;
    } else {
      temp.push(fileContents[i]);
    }

    if (fileContents[i] == "#") {
      commentCount += 1;
    }

    if (count == 3 + commentCount) {
      data = fileContents.slice(i, fileContents.length)
      break
    }
  }

  var dim = meta[commentCount + 1].split(' ');
  var width = dim[0]
  var height = dim[1]

  var file_type = meta[0];

  if (file_type == "P3") {
    data = data.split('\n');
  }

  canvas.width=width; 
  canvas.height=height; 

  var img = ctx.getImageData(0, 0, width, height);
  var pixels = img.data;

  var imageIndex = 0;
  if (file_type == "P3") {
    for (var i = commentCount + 3; i < data.length; i += 3) {
      pixels[imageIndex++] = data[i]; // r
      pixels[imageIndex++] = data[i+1]; // g
      pixels[imageIndex++] = data[i+2]; // b
      pixels[imageIndex++] = 255; // a
    }
    ctx.putImageData(img, 0, 0);
  } else if (file_type == "P6") {
    //let temp = get_image_data(data[4])
    let temp = data.slice(commentCount + 3, data.length).split('');

    for (var i = 0; i < temp.length; i += 3) {
      pixels[imageIndex++] = temp[i].charCodeAt(0)
      if (temp.length > i+1) {
        pixels[imageIndex++] = temp[i+1].charCodeAt(0)
      } else {
        pixels[imageIndex++] = 0;
      }
      if (temp.length > i+2) {
        pixels[imageIndex++] = temp[i+2].charCodeAt(0)
      } else {
        pixels[imageIndex++] = 0;
      }

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

    if (extension == "ppm") {
      canvas.style.display = "initial";
      var r = new FileReader();
      r.onload = function(e) {
        var contents = e.target.result;
        processPPM(contents);
      }
      r.readAsBinaryString(file)
    } else {
      canvas.style.display = "none"
    }
  }

  var inputNode = document.querySelector('.input-file')
  inputNode.addEventListener('change', playSelectedFile, false)
  document.getElementsByClassName("imageCanvas").style.display = "none";
}

