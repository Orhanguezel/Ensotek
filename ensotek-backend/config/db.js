const mongoose = require('mongoose');
const connections = {}; // Cache for database connections

const connectDB = async (uri) => {
    if (connections[uri]) {
        return connections[uri]; // Return cached connection
    }

    try {
        const conn = mongoose.createConnection(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        conn.on('connected', () => console.log(`MongoDB connected to ${uri}`));
        conn.on('error', (err) => {
            console.error(`MongoDB error on ${uri}:`, err.message);
            throw err;
        });

        connections[uri] = conn; // Cache the connection
        return conn;
    } catch (err) {
        console.error(`MongoDB connection error for ${uri}:`, err.message);
        throw err;
    }
};

module.exports = connectDB;





