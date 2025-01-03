require('dotenv').config(); // Ortam değişkenlerini yükle
const connectDB = require('../config/db');
const SparePartSchema = require('../models/SparePart');
const spareParts = require('./sparePartsData'); // Yedek parça verisi

(async () => {
    try {
        const db = await connectDB(process.env.SPARE_PARTS_DB);
        const SparePart = db.model('SparePart', SparePartSchema);

        await SparePart.deleteMany(); // Mevcut yedek parçaları sil
        console.log('Existing spare parts deleted.');

        await SparePart.insertMany(spareParts); // Yeni yedek parçaları ekle
        console.log('Spare parts seeded successfully.');

        process.exit();
    } catch (err) {
        console.error('Error while seeding spare parts:', err.message);
        process.exit(1);
    }
})();
