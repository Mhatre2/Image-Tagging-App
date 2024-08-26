const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    labels: {
        type: [String],
        required: true
    }
});

// Use `mongoose.models.Image` to avoid redefining the model
const ImageModel = mongoose.models.Image || mongoose.model('Image', ImageSchema);

module.exports = ImageModel;
