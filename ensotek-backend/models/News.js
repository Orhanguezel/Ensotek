const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: String, required: true },
});

module.exports = newsSchema; // Sadece schema döndürülüyor.
