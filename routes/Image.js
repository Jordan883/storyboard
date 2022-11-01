const formidable = require('formidable');
var sd = require("silly-datetime");
const fs = require('fs');
var IMAGE_UPLOAD_FOLDER = '/image/'; 

exports.uploadImg = function (req, res, next) {
    var form = new formidable.IncomingForm();   
    form.encoding = 'utf-8';        
    form.uploadDir = 'public' + IMAGE_UPLOAD_FOLDER;    
    form.keepExtensions = true;  
    form.maxFieldsSize = 2 * 1024 * 1024; 

    form.parse(req, function (err, fields, files) {

        if (err) {
            return res.json({
                "code": 500,
                "message": "Error"
            })
        }      
        if (files.fulImage.size > form.maxFieldsSize) {
            fs.unlink(files.fulImage.path)
            return res.json({
                "code": 401,
                "message": "Image size should be less than 2M"
            })
        }
        var extName = ''; 
        switch (files.fulImage.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        if (extName.length == 0) {
            return res.json({
                "code": 404,
                "message": "Only images in png and jpg formats are supported"
            })
        }       
        var t = sd.format(new Date(), 'MMDDYYYYHHmmss');       
        var ran = parseInt(Math.random() * 8999 + 10000);       
        var ImageName = t + '_' + ran + '.' + extName;       
        var newPath = form.uploadDir + ImageName;   
        fs.rename(files.fulImage.path, newPath, function (err) {
            if (err) {
                return res.json({
                    "code": 401,
                    "message": "Upload unsuccessfully"
                })
            }
            return res.json({
                "code": 200,
                "message": "Upload successfully",
                result: IMAGE_UPLOAD_FOLDER + ImageName
            })
        })
    });

}
