// seedArticles.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const ArticleSchema = require('../models/Article');
const articles = require('./articles-data'); // Import article data

(async () => {
    const db = await connectDB(process.env.ARTICLES_DB);
    const Article = db.model('Article', ArticleSchema);

    try {
        await Article.deleteMany(); // Clear existing articles
        console.log('Existing articles deleted.');

        await Article.insertMany(articles); // Insert new articles
        console.log('Articles seeded successfully.');

        process.exit(); // Exit the process
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
