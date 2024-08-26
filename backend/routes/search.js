const express = require('express');
const ImageModel = require('../models/Image');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { label } = req.query;

        const images = await ImageModel.find({ labels: label });

        if (images.length === 0) {
            return res.status(404).json({ message: 'No images found with the given label' });
        }

        res.json({ images });
    } catch (err) {
        console.error('Error searching images:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
