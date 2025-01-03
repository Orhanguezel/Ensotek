require('dotenv').config(); // Ortam değişkenlerini yükle
const connectDB = require('../config/db');
const ReferenceSchema = require('../models/Reference');
const references = require('./referansImg'); // Referans verilerini içe aktar

(async () => {
    try {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const MONGO_URI =
            NODE_ENV === 'development' ? process.env.LOCAL_MONGO_URI : process.env.PROD_MONGO_URI;
        const DB_NAME = process.env.REFERENCES_DB;

        const fullUri = `${MONGO_URI}/${DB_NAME}?authSource=admin`;
        console.log(`Seeding references in ${NODE_ENV} mode: ${fullUri}`);

        const db = await connectDB(fullUri);
        const Reference = db.model('Reference', ReferenceSchema);

        await Reference.deleteMany();
        console.log('Existing references deleted.');

        await Reference.insertMany(references);
        console.log('References seeded successfully.');

        process.exit();
    } catch (err) {
        console.error('Error while seeding references:', err.message);
        process.exit(1);
    }
})();





