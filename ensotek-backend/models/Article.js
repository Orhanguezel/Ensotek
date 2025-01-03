// Article model (models/Article.js)
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true }
});

module.exports = articleSchema;

