// seedReferences.js
require('dotenv').config(); // Ortam değişkenlerini yükle
const connectDB = require('../config/db');
const ReferenceSchema = require('../models/Reference');
const references = require('./referansImg'); // Referans verilerini içe aktar

(async () => {
    try {
        const db = await connectDB(process.env.REFERENCES_DB); // Referans veritabanına bağlan
        const Reference = db.model('Reference', ReferenceSchema);

        await Reference.deleteMany(); // Mevcut verileri temizle
        console.log('Existing references deleted.');

        await Reference.insertMany(references); // Yeni verileri ekle
        console.log('References seeded successfully.');

        process.exit();
    } catch (err) {
        console.error('Error while seeding references:', err.message);
        process.exit(1);
    }
})();




