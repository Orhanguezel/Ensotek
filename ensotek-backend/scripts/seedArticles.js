const dotenv = require('dotenv');
const connectDB = require('../config/db');
const ArticleSchema = require('../models/Article');
const articles = require('./articles-data'); // Import article data

// Load environment variables
dotenv.config();

(async () => {
    try {
        // Determine environment and set URI and database name
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const MONGO_URI =
            NODE_ENV === 'development' ? process.env.LOCAL_MONGO_URI : process.env.PROD_MONGO_URI;
        const DB_NAME = process.env.ARTICLES_DB;

        // Construct full URI with authSource
        const fullUri = `${MONGO_URI}/${DB_NAME}?authSource=admin`;

        console.log(`Seeding database in ${NODE_ENV} mode: ${fullUri}`);

        // Connect to the database
        const db = await connectDB(fullUri);
        const Article = db.model('Article', ArticleSchema);

        // Clear existing data and seed new data
        await Article.deleteMany();
        console.log('Existing articles deleted.');

        await Article.insertMany(articles);
        console.log('Articles seeded successfully.');

        process.exit(); // Exit the process
    } catch (err) {
        console.error('Error seeding articles:', err.message);
        process.exit(1); // Exit the process with error
    }
})();

