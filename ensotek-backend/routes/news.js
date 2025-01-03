/**
 * @swagger
 * tags:
 *   name: News
 *   description: Haber yönetimi işlemleri
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Tüm haberleri listele
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Haberler başarıyla listelendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Yeni bir haber oluştur
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Haber başarıyla oluşturuldu.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Haberi güncelle
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek haberin ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Haber başarıyla güncellendi.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       404:
 *         description: Haber bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Haberi sil
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek haberin ID'si
 *     responses:
 *       200:
 *         description: Haber başarıyla silindi.
 *       404:
 *         description: Haber bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
    getAllNews,
    createNews,
    updateNews,
    deleteNews,
} = require('../controllers/newsController');
const authorize = require('../helpers/authorization');

// Haber rotaları
router.get('/', authorize(['user', 'admin']), asyncHandler(getAllNews));
router.post('/', authorize(['admin']), asyncHandler(createNews));
router.put('/:id', authorize(['admin']), asyncHandler(updateNews));
router.delete('/:id', authorize(['admin']), asyncHandler(deleteNews));

module.exports = router;
