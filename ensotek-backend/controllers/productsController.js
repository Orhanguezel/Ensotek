const connectDB = require('../config/db');
const ProductSchema = require('../models/Product');
const asyncHandler = require('express-async-handler');

let ProductModel;

const initProductModel = async () => {
    const db = await connectDB(process.env.PRODUCTS_DB);
    if (!ProductModel) {
        ProductModel = db.model('Product', ProductSchema);
    }
    return ProductModel;
};

// Tüm ürünleri getir
exports.getAllProducts = asyncHandler(async (req, res) => {
    const Product = await initProductModel();
    const products = await Product.find();
    res.status(200).json({ success: true, data: products });
});

// Yeni ürün oluştur
exports.createProduct = asyncHandler(async (req, res) => {
    const Product = await initProductModel();
    const { name, category, price, stock } = req.body;

    if (!name || !category || !price || !stock) {
        return res.status(400).json({ success: false, message: 'Tüm alanlar doldurulmalıdır: name, category, price, stock' });
    }

    const product = await Product.create({ name, category, price, stock });
    res.status(201).json({ success: true, data: product });
});

// Ürünü güncelle
exports.updateProduct = asyncHandler(async (req, res) => {
    const Product = await initProductModel();
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    res.status(200).json({ success: true, data: product });
});

// Ürünü sil
exports.deleteProduct = asyncHandler(async (req, res) => {
    const Product = await initProductModel();
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    res.status(200).json({ success: true, message: 'Ürün silindi' });
});
