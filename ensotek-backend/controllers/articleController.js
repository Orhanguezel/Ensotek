const connectDB = require('../config/db');
const ArticleSchema = require('../models/Article');
const asyncHandler = require('express-async-handler');
const { authorize } = require('../helpers/authorization'); // Yetkilendirme kontrolü

let Article;

const initArticleModel = async () => {
    const db = await connectDB(process.env.ARTICLES_DB);
    if (!Article) {
        Article = db.model('Article', ArticleSchema);
    }
    return Article;
};

// Tüm makaleleri getir
exports.getAllArticles = asyncHandler(async (req, res) => {
    const ArticleModel = await initArticleModel();
    const articles = await ArticleModel.find();
    res.status(200).json({ success: true, data: articles });
});

// ID ile makale getir
exports.getArticleById = asyncHandler(async (req, res) => {
    const ArticleModel = await initArticleModel();
    const article = await ArticleModel.findById(req.params.id); // ObjectId ile eşleştirme
    if (!article) {
        return res.status(404).json({ success: false, message: 'Makale bulunamadı' });
    }
    res.status(200).json({ success: true, data: article });
});

// Yeni makale oluştur
exports.createArticle = asyncHandler(async (req, res) => {
    const ArticleModel = await initArticleModel();
    const { title, id, summary, content } = req.body;

    if (!title || !id || !summary || !content) {
        return res.status(400).json({ success: false, message: 'Tüm alanlar doldurulmalıdır: title, id, summary, content' });
    }

    const newArticle = await ArticleModel.create({ title, id, summary, content });
    res.status(201).json({ success: true, data: newArticle });
});

// Makaleyi güncelle
exports.updateArticle = asyncHandler(async (req, res) => {
    const ArticleModel = await initArticleModel();
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedArticle) {
        return res.status(404).json({ success: false, message: 'Makale bulunamadı' });
    }

    res.status(200).json({ success: true, data: updatedArticle });
});

// Makaleyi sil
exports.deleteArticle = asyncHandler(async (req, res) => {
    const ArticleModel = await initArticleModel();
    const deletedArticle = await ArticleModel.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
        return res.status(404).json({ success: false, message: 'Makale bulunamadı' });
    }

    res.status(200).json({ success: true, message: 'Makale silindi', data: deletedArticle });
});
