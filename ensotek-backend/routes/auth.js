/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Kullanıcı kimlik doğrulama ve yönetim işlemleri
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi yap
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Başarıyla giriş yapıldı, JWT döner.
 *       401:
 *         description: Geçersiz email veya şifre.
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı yap
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla kaydedildi.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Kullanıcı çıkışı yap
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarıyla çıkış yapıldı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /auth/profile-image:
 *   put:
 *     summary: Profil resmini güncelle
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil resmi başarıyla güncellendi.
 *       401:
 *         description: Yetkilendirme hatası.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */

/**
 * @swagger
 * /auth/profile-image:
 *   delete:
 *     summary: Profil resmini sil
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil resmi başarıyla silindi.
 *       401:
 *         description: Yetkilendirme hatası.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */

/**
 * @swagger
 * /auth/update-user:
 *   put:
 *     summary: Kullanıcı bilgilerini güncelle
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               updates:
 *                 type: object
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri başarıyla güncellendi.
 *       401:
 *         description: Yetkilendirme hatası.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   get:
 *     summary: Yeni bir access token al
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yeni access token başarıyla alındı.
 *       401:
 *         description: Refresh token geçersiz.
 */

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
    login,
    register,
    updateProfileImage,
    deleteProfileImage,
    logout, 
    updateUser,
    refreshToken,
} = require('../controllers/authController');
const authorize = require('../helpers/authorization');
const authenticate = require('../middleware/authMiddleware');

router.post('/login', asyncHandler(login));
router.post('/register', asyncHandler(register));
router.post('/logout', authenticate, asyncHandler(logout)); 
router.put('/profile-image', authenticate, authorize(['user', 'admin']), asyncHandler(updateProfileImage));
router.delete('/profile-image', authenticate, authorize(['user', 'admin']), asyncHandler(deleteProfileImage));
router.put('/update-user', authenticate, authorize(['admin']), asyncHandler(updateUser));
router.get('/refresh-token', authenticate, asyncHandler(refreshToken)); 

module.exports = router;
