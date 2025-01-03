const dotenv = require('dotenv');
const connectDB = require('../config/db');
const NewsSchema = require('../models/News'); // Haber modelini import edin
const newsData = require('./news-data'); // Haber veri dosyasını import edin

// Ortam değişkenlerini yükle
dotenv.config();

(async () => {
    try {
        // Ortam değişkenlerine göre URI ve veritabanı seçimi
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const MONGO_URI =
            NODE_ENV === 'development' ? process.env.LOCAL_MONGO_URI : process.env.PROD_MONGO_URI;
        const DB_NAME = process.env.NEWS_DB;

        // Tam URI'yi oluştur
        const fullUri = `${MONGO_URI}/${DB_NAME}?authSource=admin`;

        console.log(`Seeding database in ${NODE_ENV} mode: ${fullUri}`);

        // MongoDB'ye bağlan
        const db = await connectDB(fullUri);
        const News = db.model('News', NewsSchema);

        // Mevcut tüm haberleri sil
        await News.deleteMany();
        console.log('Existing news deleted.');

        // Yeni haberleri ekle
        await News.insertMany(newsData.news);
        console.log('News seeded successfully.');

        process.exit(); // Scripti sonlandır
    } catch (err) {
        console.error('Error seeding news:', err.message);
        process.exit(1); // Hata ile çık
    }
})();


