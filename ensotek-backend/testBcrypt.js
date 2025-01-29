const bcrypt = require('bcryptjs');

// Test şifresi ve hash
const testPassword = "admin123";
const testHashedPassword = "$2a$10$1hw0W7fUQtNCPKWIZfaoF.kDdONZMEe2gbJha5tCKWHv2nFt1aSja"; // Veritabanından alınan hash

// Şifreyi hashle
bcrypt.hash(testPassword, 10, (err, hash) => {
    if (err) {
        console.error("Şifre hashleme hatası:", err);
        return;
    }
    console.log("Hashlenmiş Şifre:", hash);

    // Şifre doğrulama
    bcrypt.compare(testPassword, hash, (err, isMatch) => {
        if (err) {
            console.error("Şifre doğrulama hatası:", err);
            return;
        }
        console.log("Şifre doğrulama sonucu:", isMatch);
    });

    // Veritabanındaki hash ile doğrulama
    bcrypt.compare(testPassword, testHashedPassword, (err, isMatch) => {
        if (err) {
            console.error("Veritabanı şifre doğrulama hatası:", err);
            return;
        }
        console.log("Veritabanı şifre doğrulama sonucu:", isMatch);
    });
});

