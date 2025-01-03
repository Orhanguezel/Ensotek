const mongoose = require('mongoose');
const News = require('../models/News'); // Haber modelini import edin
const newsData = require('./news-data'); // Haber veri dosyasını import edin

// MongoDB'ye bağlanın
mongoose.connect('mongodb://localhost:27017/ensotekNewsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Haberleri veritabanına ekleme fonksiyonu
const seedNews = async () => {
    try {
        // Mevcut tüm haberleri sil
        await News.deleteMany();
        console.log('Existing news deleted.');

        // Yeni haberleri ekle
        await News.insertMany(newsData.news);
        console.log('News seeded successfully.');
        
        process.exit(); // Scripti sonlandır
    } catch (err) {
        console.error(err);
        process.exit(1); // Hata ile çık
    }
};

// Haber ekleme fonksiyonunu çalıştır
seedNews();
