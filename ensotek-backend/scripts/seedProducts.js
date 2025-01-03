require('dotenv').config(); // Ortam değişkenlerini yükle
const connectDB = require('../config/db');
const ProductSchema = require('../models/Product');
const products = require('./productsData');

(async () => {
    try {
        const db = await connectDB(process.env.PRODUCTS_DB); // Doğru veritabanına bağlan
        const Product = db.model('Product', ProductSchema);

        await Product.deleteMany(); // Mevcut ürünleri sil
        console.log('Existing products deleted.');

        await Product.insertMany(products); // Yeni ürünleri ekle
        console.log('Products seeded successfully.');

        process.exit();
    } catch (err) {
        console.error('Error while seeding products:', err.message);
        process.exit(1);
    }
})();


