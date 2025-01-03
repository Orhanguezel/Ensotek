const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: [true, "Please provide a name"], unique: true },
    email: { 
        type: String, 
        required: [true, 'Please provide an email'], 
        unique: true, 
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please provide a valid email'],
        select: false
    },
    password: { 
        type: String,
        minlength: [6, 'Please provide a password with min length 6'],
        required: true },
    role: { 
        type: String, 
        enum: ['admin', 'user'], 
        default: 'user' },
    profileImage: { type: String, default: "default.jpg" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    blocked: { type: Boolean, default: false }
});

// Şifre hashleme
userSchema.pre('save', async function (next) {
    // Şifre değişmemişse bir sonraki middleware'e geç
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Şifre kontrolü

userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = userSchema;


