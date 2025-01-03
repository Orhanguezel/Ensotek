const bcrypt = require('bcryptjs');

// Şifreyi hashle
const createHash = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt); // "admin123" örnek şifre
    console.log("Hashed Password:", hashedPassword);
};

createHash();


/*
db.users.insertOne({
...     username: "superadmin",
...     email: "superadmin@example.com",
...     password: "$2a$10$QqSs1iCyODJKxcS.ABpoEuikz/i1CYP7GSr/tQ4KzSo7k.3k8vpJ2", // Hashlenmiş şifre admin123
...     role: "admin",
...     profileImage: null,
...     createdAt: new Date()
... });
*/
