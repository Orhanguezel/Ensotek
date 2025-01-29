require('dotenv').config();
const connectDB = require('../config/db');
const userSchema = require('./models/User');

const users = [
    { username: 'admin', email: 'admin@example.com', password: '123456', role: 'admin' },
    { username: 'testuser', email: 'test@example.com', password: '123456', role: 'user' },
];

(async () => {
    try {
        const db = await connectDB(process.env.AUTH_DB);
        const User = db.model('User', userSchema);

        await User.deleteMany();
        console.log('Existing users deleted.');

        for (const user of users) {
            const hashedPassword = await require('bcryptjs').hash(user.password, 10);
            await User.create({ ...user, password: hashedPassword });
        }

        console.log('Users seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error while seeding users:', err.message);
        process.exit(1);
    }
})();

