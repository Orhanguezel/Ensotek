require('dotenv').config(); // Ortam değişkenlerini yükle
const connectDB = require('../config/db');
const UserSchema = require('../models/User');

const users = [
    { username: 'admin', email: 'admin@example.com', password: '123456', role: 'admin' },
    { username: 'testuser', email: 'test@example.com', password: '123456', role: 'user' },
];

(async () => {
    try {
        const NODE_ENV = process.env.NODE_ENV || 'development';
        const MONGO_URI =
            NODE_ENV === 'development' ? process.env.LOCAL_MONGO_URI : process.env.PROD_MONGO_URI;
        const DB_NAME = process.env.AUTH_DB;

        const fullUri = `${MONGO_URI}/${DB_NAME}?authSource=admin`;
        console.log(`Seeding users in ${NODE_ENV} mode: ${fullUri}`);

        const db = await connectDB(fullUri);
        const User = db.model('User', UserSchema);

        await User.deleteMany();
        console.log('Existing users deleted.');

        await User.insertMany(users);
        console.log('Users seeded successfully.');

        process.exit();
    } catch (err) {
        console.error('Error while seeding users:', err.message);
        process.exit(1);
    }
})();

