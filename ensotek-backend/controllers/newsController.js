const connectDB = require('../config/db');
const newsSchema = require('../models/News');
const asyncHandler = require('express-async-handler');

let News; // Model için değişken tanımlandı.

const initNewsModel = async () => {
    const db = await connectDB(process.env.NEWS_DB); // Doğru veritabanını bağla.
    if (!News) {
        News = db.model('News', newsSchema); // Schema'yı kullanarak model oluştur.
    }
    return News;
};

// Tüm haberleri getir
exports.getAllNews = asyncHandler(async (req, res) => {
    const NewsModel = await initNewsModel();
    const news = await NewsModel.find();
    res.status(200).json({ success: true, data: news });
});

// Yeni bir haber oluştur
exports.createNews = [
    asyncHandler(async (req, res) => {
        const NewsModel = await initNewsModel();
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Başlık ve içerik zorunludur.' });
        }

        const news = await NewsModel.create({ title, content });
        res.status(201).json({ success: true, data: news });
    }),
];

// Haberi güncelle
exports.updateNews = [
    asyncHandler(async (req, res) => {
        const NewsModel = await initNewsModel();
        const news = await NewsModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!news) {
            return res.status(404).json({ success: false, message: 'Haber bulunamadı' });
        }
        res.status(200).json({ success: true, data: news });
    }),
];

// Haberi sil
exports.deleteNews = [
    asyncHandler(async (req, res) => {
        const NewsModel = await initNewsModel();
        const news = await NewsModel.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).json({ success: false, message: 'Haber bulunamadı' });
        }
        res.status(200).json({ success: true, message: 'Haber silindi' });
    }),
];

