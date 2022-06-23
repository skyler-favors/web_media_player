function getFileName() {
    var fileName = document.getElementById("choose-file");
    var fileText = "";

    if ('files' in fileName) {
        if (fileName.files.length == 0) {
            fileText = "No file selected";
        }
        else {
            for (var i = 0; i < fileName.files.length; i++) {
                fileText += "<br> <strong>" + (i + 1) + ".File </strong> <br>";
                var file = fileName.files[i];
                if ('name' in file) {
                    fileText += "Name:" + file.name + "<br>";
                }
                if ('size' in file) {
                    fileText += "Size:" + file.size + "bytes <br>";
                }
            }
        }
    }
    else {
        if (fileName.value == "") {
            fileText += "Please select a file";
        }
        else {
            fileText += "The file property is not supported";
            fileText += "<br> The file path selected:" + fileName.value;
        }
    }
}

function toggleColorscheme() {
  var colorState = true;
  var body = document.getElementById("main");
  var toggleButton = document.getElementById("colorscheme");

  var toggle = function() {
    colorState = !colorState;

    if (colorState) {
      body.style.animationPlayState = "running";
      toggleButton.innerHTML = "Animating"
    } else {
      body.style.animationPlayState = "paused";
      toggleButton.innerHTML = "Paused"

    }
  };

  toggleButton.addEventListener('click', toggle, false);
}

toggleColorscheme();
