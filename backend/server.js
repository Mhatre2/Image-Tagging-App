const express = require('express');
const path = require('path');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

const predictRouter = require('./routes/predict');
const searchRouter = require('./routes/search');

const app = express();

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

const allowedOrigins = [
  'https://image-tagging-frontend-app.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
}));

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


