const express = require('express');
const multer = require('multer');
const path = require('path');
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_KEY}`);


const ImageModel = require('../models/Image'); 

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only'));
    }
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2000000 },
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
});

function predictImage(inputs) {
    return new Promise((resolve, reject) => {
        stub.PostModelOutputs(
            {
                model_id: "aaa03c23b3724a16a56b629203edc62c",
                inputs: inputs
            },
            metadata,
            (error, response) => {
                if (error) {
                    console.error('Clarifai API error:', error);
                    return reject(error);
                }
                if (response.status.code !== 10000) {
                    console.error('Clarifai API response error:', response.status.description);
                    return reject(new Error("Clarifai API Error: " + response.status.description));
                }

                const results = response.outputs[0].data.concepts.map(concept => ({
                    name: concept.name,
                    value: concept.value
                }));
                resolve(results);
            }
        );
    });
}


router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const inputs = [
            {
                data: {
                    image: {
                        base64: req.file.buffer.toString('base64')
                    }
                }
            }
        ];

        const results = await predictImage(inputs);
        res.send({ results });
    } catch (error) {
        console.error('Error in /upload route:', error);
        res.status(400).send({ error: error.message });
    }
});

router.post('/save', async (req, res) => {
    try {
        const { imageUrl, labels } = req.body;

        if (!imageUrl || !labels) {
            console.error('Missing imageUrl or labels', { imageUrl, labels });
            return res.status(400).send({ error: 'Image URL and labels are required' });
        }

        console.log('Received data:', { imageUrl, labels });
        const newImage = new ImageModel({ imageUrl, labels });
        await newImage.save();
        console.log('Image saved successfully');
        res.send({ message: "Image and labels saved successfully!" });
    } catch (error) {
        console.error('Error occurred in /save route:', error);
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
