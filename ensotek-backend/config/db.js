const mongoose = require('mongoose');
const connections = {}; // Cache for database connections

const connectDB = async (uri, dbName) => {
    if (!uri) {
        throw new Error('MongoDB URI is required');
    }
    if (!dbName) {
        throw new Error('Database name is required');
    }

    const fullUri = `${uri}/${dbName}`;

    if (connections[fullUri]) {
        return connections[fullUri]; // Return cached connection
    }

    try {
        const conn = mongoose.createConnection(fullUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Timeout set to 30 seconds
            socketTimeoutMS: 45000, // Increase socket timeout
            maxPoolSize: 10,
        });

        conn.on('connected', () => console.log(`MongoDB connected to ${fullUri}`));
        conn.on('error', (err) => {
            console.error(`MongoDB error on ${fullUri}:`, err.message);
            throw err;
        });

        connections[fullUri] = conn; // Cache the connection
        return conn;
    } catch (err) {
        console.error(`MongoDB connection error for ${fullUri}:`, err.message);
        throw err;
    }
};

module.exports = connectDB;




