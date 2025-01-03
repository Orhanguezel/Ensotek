const connectDB = require('../config/db');
const ReferenceSchema = require('../models/Reference');
const asyncHandler = require('express-async-handler');
const authorize = require('../helpers/authorization');

let ReferenceModel;

const initReferenceModel = async () => {
    const db = await connectDB(process.env.REFERENCES_DB); // Dinamik bağlantı
    if (!ReferenceModel) {
        ReferenceModel = db.model('Reference', ReferenceSchema); // Model oluştur
    }
    return ReferenceModel;
};

// Tüm referansları getir
exports.getAllReferences = asyncHandler(async (req, res) => {
    const Reference = await initReferenceModel();
    const references = await Reference.find();
    res.status(200).json({ success: true, data: references });
});

// Yeni referans oluştur
exports.createReference = asyncHandler(async (req, res) => {
    // Authorization kontrolü
    authorize(req, 'admin');

    const { url, company_name, sector } = req.body;

    // Validation kontrolü
    if (!url || !company_name || !sector) {
        return res.status(400).json({
            success: false,
            message: 'Tüm alanlar doldurulmalıdır: url, company_name, sector',
        });
    }

    const Reference = await initReferenceModel();
    const reference = await Reference.create({ url, company_name, sector });
    res.status(201).json({ success: true, data: reference });
});

// Referansı güncelle
exports.updateReference = asyncHandler(async (req, res) => {
    // Authorization kontrolü
    authorize(req, 'admin');

    const Reference = await initReferenceModel();
    const reference = await Reference.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!reference) {
        return res.status(404).json({ success: false, message: 'Referans bulunamadı' });
    }

    res.status(200).json({ success: true, data: reference });
});

// Referansı sil
exports.deleteReference = asyncHandler(async (req, res) => {
    // Authorization kontrolü
    authorize(req, 'admin');

    const Reference = await initReferenceModel();
    const reference = await Reference.findByIdAndDelete(req.params.id);

    if (!reference) {
        return res.status(404).json({ success: false, message: 'Referans bulunamadı' });
    }

    res.status(200).json({ success: true, message: 'Referans silindi' });
});
