import multer from 'multer';
import path from 'path';
import catchErrors from '../utils/catchErrors.js';

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Folder where images will be stored
    },
    filename: (req, file, cb) => {
        // Create a unique filename using timestamp and original file extension
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filter to allow only specific image formats
const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('File format not supported'), false);
    }
    cb(null, true);
};

// Maximum file size (8MB)
const maxSize = 8 * 1024 * 1024;

// Initialize multer for handling multiple image uploads
const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: maxSize }
}).array('images', 10);  // Expecting an array of files named 'images[]', with a limit of 10 files

// Controller to handle image uploads
export const uploadImage = catchErrors(async (req, res) => {

    console.log(req.body)
    upload(req, res, (err) => {
        if (err) {
            // Handle errors (e.g., file type, file size, etc.)
            return res.status(400).json({ message: err.message });
        }

        // Handle the success response with file information
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Respond with a list of filenames for uploaded images
        const fileNames = req.files.map(file => file.filename);
        res.json({
            message: 'Images uploaded successfully',
            files: fileNames // Return the filenames of uploaded files
        });
    });

})
