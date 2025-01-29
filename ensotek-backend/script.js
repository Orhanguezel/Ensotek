require('dotenv').config();
const connectDB = require('./config/db');

(async () => {
    try {
        const dbName = 'ensotekAuthDB'; // Test edilecek veritabanı adı
        const db = await connectDB(dbName);
        console.log(`Successfully connected to database: ${dbName}`);
        process.exit(0);
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
})();

