// Genel hata yönetimi middleware'i
module.exports = (err, req, res, next) => {
    console.error('Hata Ayrıntıları:', err.stack); // Hata loglama

    const statusCode = err.status || 500; // Varsayılan olarak 500

    if (err.name === 'ValidationError') {
        // Mongoose validation hatası
        const errors = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            errorType: 'ValidationError',
            errors: errors,
            message: 'Validation error occurred. Please check your inputs.',
        });
    }

    if (err.name === 'CastError') {
        // Mongoose CastError (örneğin geçersiz ObjectId)
        return res.status(400).json({
            success: false,
            errorType: 'CastError',
            message: `Invalid ${err.path}: ${err.value}. Please provide a valid value.`,
        });
    }

    if (err.code === 11000) {
        // Mongoose duplicate key hatası
        const field = Object.keys(err.keyValue);
        return res.status(409).json({
            success: false,
            errorType: 'DuplicateKeyError',
            message: `Duplicate value for field: ${field}. Please use a unique value.`,
        });
    }

    if (['JsonWebTokenError', 'TokenExpiredError'].includes(err.name)) {
        // JWT hataları
        return res.status(401).json({
            success: false,
            errorType: err.name,
            message: err.name === 'JsonWebTokenError' 
                ? 'Invalid token. Please log in again.' 
                : 'Your token has expired. Please log in again.',
        });
    }

    if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
        // JSON parse hatası
        return res.status(400).json({
            success: false,
            errorType: 'SyntaxError',
            message: 'Invalid JSON format. Please check your request body.',
        });
    }

    if (err.name === 'ReferenceError') {
        // ReferenceError (genel kod hatası)
        return res.status(500).json({
            success: false,
            errorType: 'ReferenceError',
            message: 'An internal reference error occurred. Please contact support.',
        });
    }

    if (err.name === 'TypeError') {
        // TypeError (genel kod hatası)
        return res.status(500).json({
            success: false,
            errorType: 'TypeError',
            message: 'An internal type error occurred. Please contact support.',
        });
    }

    if (err.name === 'NetworkError') {
        // Ağ hatası
        return res.status(503).json({
            success: false,
            errorType: 'NetworkError',
            message: 'A network error occurred. Please try again later.',
        });
    }

    if (err.name === 'TimeoutError') {
        // Timeout hatası
        return res.status(504).json({
            success: false,
            errorType: 'TimeoutError',
            message: 'The request timed out. Please try again later.',
        });
    }

    if (err.name === 'AuthenticationError') {
        // Kimlik doğrulama hatası
        return res.status(403).json({
            success: false,
            errorType: 'AuthenticationError',
            message: 'Authentication failed. You do not have access to this resource.',
        });
    }

    if (err.name === 'NotFoundError') {
        // Kaynak bulunamadı
        return res.status(404).json({
            success: false,
            errorType: 'NotFoundError',
            message: 'The requested resource could not be found.',
        });
    }

    if (err.name === 'PermissionError') {
        // İzin hatası
        return res.status(403).json({
            success: false,
            errorType: 'PermissionError',
            message: 'You do not have permission to perform this action.',
        });
    }

    // Ek hata türlerini yönetmek için genişletilebilir alan
    if (err.name === 'CustomError') {
        // Özel hata türleri
        return res.status(err.status || 400).json({
            success: false,
            errorType: 'CustomError',
            message: err.message || 'A custom error occurred.',
        });
    }

    // Diğer hatalar için varsayılan yanıt
    res.status(statusCode).json({
        success: false,
        errorType: err.name || 'UnknownError',
        message: err.message || 'An unexpected error occurred.',
    });

    next(); // Sonraki middleware'e geç (genelde gereksizdir çünkü son middleware olduğu varsayılır)
};
