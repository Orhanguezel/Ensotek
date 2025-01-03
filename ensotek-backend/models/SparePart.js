const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
});

module.exports = sparePartSchema;

