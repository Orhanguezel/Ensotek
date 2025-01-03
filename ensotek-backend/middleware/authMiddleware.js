const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.token; // Cookie'den token al

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token gerekli' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Doğrulanmış kullanıcıyı req.user'a ekle
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Geçersiz token' });
    }
};



module.exports = authenticate;


