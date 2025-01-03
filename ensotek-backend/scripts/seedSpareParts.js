require('dotenv').config(); // Ortam değişkenlerini yükle
const connectDB = require('../config/db');
const SparePartSchema = require('../models/SparePart');
const spareParts = require('./sparePartsData'); // Yedek parça verisi

(async () => {
    try {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const MONGO_URI =
            NODE_ENV === 'development' ? process.env.LOCAL_MONGO_URI : process.env.PROD_MONGO_URI;
        const DB_NAME = process.env.SPARE_PARTS_DB;

        const fullUri = `${MONGO_URI}/${DB_NAME}?authSource=admin`;
        console.log(`Seeding spare parts in ${NODE_ENV} mode: ${fullUri}`);

        const db = await connectDB(fullUri);
        const SparePart = db.model('SparePart', SparePartSchema);

        await SparePart.deleteMany();
        console.log('Existing spare parts deleted.');

        await SparePart.insertMany(spareParts);
        console.log('Spare parts seeded successfully.');

        process.exit();
    } catch (err) {
        console.error('Error while seeding spare parts:', err.message);
        process.exit(1);
    }
})();

