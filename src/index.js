const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Url = require('../models/Url');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Local MongoDB URI
const MONGODB_URI = 'mongodb+srv://boomtanapon030:P1eKvGwg2fm7VRXt@tanapon.tknboue.mongodb.net/urlShortener';

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to local MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.post('/api/shorten', async (req, res) => {
    const { fullUrl } = req.body;
    const url = new Url({ full: fullUrl });
    await url.save();
    res.json(url);
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const url = await Url.findOne({ short: req.params.shortUrl });
        if (url) {
            url.clicks++;
            await url.save();
            res.redirect(url.full);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/api/urls', async (req, res) => {
    try {
        const urls = await Url.find();
        res.json(urls);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.delete('/api/urls/:id', async (req, res) => {
    try {
        const result = await Url.findByIdAndDelete(req.params.id);
        if (result) {
            res.json({ message: 'Successfully deleted', deletedUrl: result });
        } else {
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
