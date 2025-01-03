require('dotenv').config(); // Ortam değişkenlerini yükle
const connectDB = require('../config/db');
const UserSchema = require('../models/User');

const users = [
    { username: 'admin', email: 'admin@example.com', password: '123456', role: 'admin' },
    { username: 'testuser', email: 'test@example.com', password: '123456', role: 'user' },
];

(async () => {
    try {
        const db = await connectDB(process.env.AUTH_DB);
        const User = db.model('User', UserSchema);

        await User.deleteMany(); // Mevcut kullanıcıları sil
        console.log('Existing users deleted.');

        await User.insertMany(users); // Yeni kullanıcıları ekle
        console.log('Users seeded successfully.');

        process.exit();
    } catch (err) {
        console.error('Error while seeding users:', err.message);
        process.exit(1);
    }
})();
