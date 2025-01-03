/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Makale yönetimi için API endpointleri
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Tüm makaleleri getir
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı, makaleler listesi döner.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Yeni makale oluştur
 *     tags: [Articles]
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
 *               summary:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Makale başarıyla oluşturuldu.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Makaleyi güncelle
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Güncellenecek makalenin ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Makale başarıyla güncellendi.
 *       404:
 *         description: Makale bulunamadı.
 */

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Makaleyi sil
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Silinecek makalenin ID'si
 *     responses:
 *       200:
 *         description: Makale başarıyla silindi.
 *       404:
 *         description: Makale bulunamadı.
 */

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
    getAllArticles,
    createArticle,
    updateArticle,
    deleteArticle,
} = require('../controllers/articleController');
const authorize = require('../helpers/authorization');

router.get('/', authorize(['user', 'admin']), asyncHandler(getAllArticles));
router.post('/', authorize(['admin']), asyncHandler(createArticle));
router.put('/:id', authorize(['admin']), asyncHandler(updateArticle));
router.delete('/:id', authorize(['admin']), asyncHandler(deleteArticle));

module.exports = router;
