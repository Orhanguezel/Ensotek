const mongoose = require('mongoose');
const connections = {}; // Cached connections

const connectDB = async (dbName) => {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const MONGO_URI =
        NODE_ENV === 'development'
            ? process.env.LOCAL_MONGO_URI
            : process.env.PROD_MONGO_URI;

    if (!MONGO_URI || !dbName) {
        throw new Error('MongoDB URI and database name are required.');
    }

    // Geçersiz karakter kontrolü
    if (dbName.includes('/')) {
        throw new Error(`Invalid database name: '${dbName}'`);
    }

    const uri = `${MONGO_URI}/${dbName}`; // Tam URI oluşturma

    if (connections[uri]) {
        console.log(`Using cached connection for ${uri}`);
        return connections[uri];
    }

    try {
        console.log(`Connecting to MongoDB with URI: ${uri}`);
        const conn = mongoose.createConnection(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        conn.on('connected', () => console.log(`MongoDB connected to ${uri}`));
        conn.on('error', (err) => {
            console.error(`MongoDB error on ${uri}:`, err.message);
            throw err;
        });

        connections[uri] = conn;
        return conn;
    } catch (err) {
        console.error(`MongoDB connection error for ${uri}:`, err.message);
        throw err;
    }
};

module.exports = connectDB;













