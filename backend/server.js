const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

const predictRouter = require('./routes/predict');
const searchRouter = require('./routes/search');

const app = express();

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.use('/predict', predictRouter);
app.use('/search', searchRouter);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
    console.log('Listening on ' + port);
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).send('Something broke!');
});
