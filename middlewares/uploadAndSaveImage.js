const yup = require("yup");
const categoryModel = require("../models/category");
const multer = require('multer');
const ImageModel = require("../models/image");

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save uploaded files to the "uploads" directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix +".jpg"); // Set the filename
    },
});
  
const upload = multer({ storage });

const uploadAndSaveImage = async(req, res, next) => {
    if(req.file){
        upload.single('image')(req, res, async (err) => {

            if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Something went wrong' });
            }
        
            const { fieldname, originalname , size , destination , filename , mimetype , path } = req.file;
        
            try {
            // Create a new document in the Image collection
            const image = new ImageModel({
                fieldname,
                originalname,
                size,
                destination,
                filename,
                mimetype,
                path
            });
        
            // Save the image document to the database
            await image.save();
        
            req.body.imageId = image._id; // Attach the ID of the saved image to the request object
            console.log("-------------------2---------------------");
            console.log(req.body);
            console.log("----------------------------------------");
            next();
            } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Something went wrong' });
            }
        });
    }else{
        next();
    }  
}
module.exports = uploadAndSaveImage;