require('dotenv').config(); //To read data from .env file as key value pair[value is always a string]
const express = require('express')
const multer = require('multer')
const path = require('path')
const { v2: cloudinary } = require('cloudinary'); // Import cloudinary as K:V
const { error } = require('console');

const app = express();
const PORT = 5001;

// Cloudinary config setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'), // File destination to upload files
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
})

// Setting the upload to multer storage
const upload = multer({ storage })

// Display upload in homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})


app.post('/upload', upload.single('file'), async (req, res) => { //Used multer as middleware
    try {
        // If no file is present
        if (!req.file) {
            return res.status(400).json({ message: "No File Found" })
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'uploads', // This is only if the folder in cloudinary is present
        })

        res.status(200).json({
            message: "File Uploaded Successfully",
            imageUrl: result.secure_url
        })

    } catch (e) {
        console.error(`Error in uploading file : ${e}`)
        res.status(500).json({ message: "Internal Server Error", error: e.message })
    }
})


app.listen(PORT, () => {
    console.log(`Server started at : http://localhost:${PORT}/`)
})


