const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
    url: { type: String, required: true },
    company_name: { type: String, required: true },
    sector: { type: String, required: true },
});

module.exports = referenceSchema;








