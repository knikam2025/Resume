const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

const upload = multer({ dest: './uploads/' });






router.post('/upload', upload.any('image'), async (req, res) => {
  try {
    
    
    console.log("===>", req.files);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }


    // Upload image to Cloudinary
    const file = req.files[0];
    const result = await cloudinary.uploader.upload(file.path);
    const imageur = result.url



    console.log("22222222221222", imageur);

 
    


    res.status(200).json({
      success: true,
      message: 'Uploaded!',
      data: {
        url: result.secure_url, 
      
        public_id: result.public_id, 
       
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,     message: 'Error uploading image',
      error: err.message, 
    });
  }
});

module.exports = router;