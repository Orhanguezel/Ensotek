const mongoose = require('mongoose');
const connections = {}; // Cache for database connections

const connectDB = async (dbName) => {
    if (connections[dbName]) {
        return connections[dbName]; // Cache'e kaydedilmiş bağlantıyı döndür
    }
    if (!dbName) {
        throw new Error('Database name is required');
    }
    try {
        const conn = mongoose.createConnection(`${process.env.MONGO_URI}/${dbName}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Timeout'u 30 saniye olarak ayarla
            socketTimeoutMS: 45000, // Socket timeout'u artır
            maxPoolSize: 10,
        });

        conn.on('connected', () => console.log(`MongoDB connected to ${dbName}`));
        conn.on('error', (err) => {
            console.error(`MongoDB error on ${dbName}:`, err.message);
            throw err;
        });

        connections[dbName] = conn; // Bağlantıyı cache'e kaydet
        return conn;
    } catch (err) {
        console.error(`MongoDB connection error for ${dbName}:`, err.message);
        throw err;
    }
};

module.exports = connectDB;



