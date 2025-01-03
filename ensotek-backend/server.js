const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();

// Ortam Değişkenleri
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5004;
const FRONTEND_URL = NODE_ENV === 'development'
    ? process.env.LOCAL_FRONTEND_URL
    : process.env.PROD_FRONTEND_URL;

// Middleware
app.use(cors({
    origin: FRONTEND_URL, // Dinamik frontend URL'si
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger Dokümantasyonu
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rotalar
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/news', require('./routes/news'));
app.use('/api/spare-parts', require('./routes/spareParts'));
app.use('/api/references', require('./routes/references'));

// Hata yönetimi middleware
app.use(errorHandler);

// Sunucu Başlatma
app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
});
