const connectDB = require('../config/db');
const SparePartSchema = require('../models/SparePart');
const asyncHandler = require('express-async-handler');

let SparePartModel;

const initSparePartModel = async () => {
    const db = await connectDB(process.env.SPARE_PARTS_DB);
    if (!SparePartModel) {
        SparePartModel = db.model('SparePart', SparePartSchema);
    }
    return SparePartModel;
};

// Tüm yedek parçaları getir
exports.getAllSpareParts = asyncHandler(async (req, res) => {
    const SparePart = await initSparePartModel();
    const spareParts = await SparePart.find();
    res.status(200).json({ success: true, data: spareParts });
});

// Yeni yedek parça oluştur
exports.createSparePart = asyncHandler(async (req, res) => {
    const { name, category, stock, price } = req.body;

    // Validation kontrolü
    if (!name || !category || stock === undefined || price === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Tüm alanlar doldurulmalıdır: name, category, stock, price',
        });
    }

    const SparePart = await initSparePartModel();
    const sparePart = await SparePart.create({ name, category, stock, price });
    res.status(201).json({ success: true, data: sparePart });
});

// Yedek parçayı güncelle
exports.updateSparePart = asyncHandler(async (req, res) => {
    const SparePart = await initSparePartModel();
    const sparePart = await SparePart.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!sparePart) {
        return res.status(404).json({ success: false, message: 'Yedek parça bulunamadı' });
    }

    res.status(200).json({ success: true, data: sparePart });
});

// Yedek parçayı sil
exports.deleteSparePart = asyncHandler(async (req, res) => {
    const SparePart = await initSparePartModel();
    const sparePart = await SparePart.findByIdAndDelete(req.params.id);

    if (!sparePart) {
        return res.status(404).json({ success: false, message: 'Yedek parça bulunamadı' });
    }

    res.status(200).json({ success: true, message: 'Yedek parça silindi' });
});
