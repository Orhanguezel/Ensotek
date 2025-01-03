const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        try {
            const token = req.cookies.token || req.headers['authorization'];
            if (!token) {
                return res.status(401).json({ success: false, message: 'Token gerekli' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ success: false, message: 'Erişim yetkiniz yok' });
            }

            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Geçersiz token' });
        }
    };
};

module.exports = authorize;





