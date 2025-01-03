const mongoose = require('mongoose');
const dotenv = require('dotenv');
const News = require('../models/News'); // Haber modelini import edin
const newsData = require('./news-data'); // Haber veri dosyasını import edin

// Ortam değişkenlerini yükle
dotenv.config();

// Haberleri veritabanına ekleme fonksiyonu
const seedNews = async () => {
    try {
        // Ortam değişkenlerine göre URI ve veritabanı seçimi
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const MONGO_URI =
            NODE_ENV === 'development' ? process.env.LOCAL_MONGO_URI : process.env.PROD_MONGO_URI;
        const DB_NAME = process.env.NEWS_DB;

        console.log(`Seeding database in ${NODE_ENV} mode: ${MONGO_URI}/${DB_NAME}`);

        // MongoDB'ye bağlan
        await mongoose.connect(`${MONGO_URI}/${DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected.');

        // Mevcut tüm haberleri sil
        await News.deleteMany();
        console.log('Existing news deleted.');

        // Yeni haberleri ekle
        await News.insertMany(newsData.news);
        console.log('News seeded successfully.');

        process.exit(); // Scripti sonlandır
    } catch (err) {
        console.error('Error seeding news:', err);
        process.exit(1); // Hata ile çık
    }
};

// Haber ekleme fonksiyonunu çalıştır
seedNews();

