var fs = require('fs');
var image = require('imageinfo');

function readFileList(path, filesList) {
        var files = fs.readdirSync(path);
        files.forEach(function (itm, index) {
            var stat = fs.statSync(path + itm);
            if (stat.isDirectory()) {
                readFileList(path + itm + "/", filesList)
            } else {
                var obj = {};
                obj.path = path;
                obj.filename = itm;
                filesList.push(obj);
            }    
        })
    }

 var getFiles = {
        getFileList: function (path) {
            var filesList = [];
            readFileList(path, filesList);
            return filesList;
        },
        getImageFiles: function (path) {
            var imageList = [];
            this.getFileList(path).forEach((item) => {		
                var ms = image(fs.readFileSync(item.path + item.filename));
				console.log(ms);
                ms.mimeType && (imageList.push(item.filename))
            });
            return imageList;
        }
    };

// getFiles.getImageFiles("XXX");
// getFiles.getFileList("XXX");
