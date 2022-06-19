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


var fs = require('fs');
var fileType = [ ".ogg", ".mp4", ".mp3", ".jpg", ".ppm", ".wav", ".gif", ".pst"];
//Rename the file "mynewfile1.txt" into "myrenamedfile.txt":
function fileRename()
{fs.rename(function (err) {
  if (err) throw err;
  console.log('File Renamed!');
});
 let FileStuff = document.getElementsByClassName(".fa-ellipsis-v")}
 FileStuff.addEventListener("click", fileRename(), false)

/*
function saveFile(filename, data) {
    if (isBrowser()) {
        let file;
        if (typeof File === 'function') {
            file = new File([data], filename);
        } else {
            file = new Blob([data], { type: 'application/octet-stream' });
        }
        saveAs(file, filename);
    } else {
        const fs = require('fs');
        fs.writeFileSync(filename, data);
    }
}
*/
