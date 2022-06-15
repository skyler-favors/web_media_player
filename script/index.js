

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
    document.getElementById("demo").innerHTML = fileText;
}


