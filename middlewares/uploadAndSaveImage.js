const yup = require("yup");
const ImageModel = require("../models/image");
var path = require("path");


const uploadAndSaveImage = async(req, res, next) => {
    let documents = req.files.image;
    var images = [];
    if(documents){
        if(!Array.isArray(documents)){
            documents = [documents];
        }
        for (const document of documents) {
            let filename = document.name;
            let mimetype = document.mimetype;
            let size = document.size;
            let extension = path.extname(filename);
            document.name = "tunivita-image-" + new Date().getTime() + extension;
            document.mv(`./uploads/${document.name}`);
            let pathfile = '/uploads/'+document.name;
            const image = new ImageModel({
                size,
                filename,
                mimetype,
                path : pathfile
            });
            // Save the image document to the database
            await image.save();
            console.log("image id : "+image._id);
            images.push(image._id);
        }
    }
    req.body.imageIds = images;
    next();
}
module.exports = uploadAndSaveImage;