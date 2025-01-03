/**
 * @swagger
 * tags:
 *   name: SpareParts
 *   description: Yedek parça yönetimi işlemleri
 */

/**
 * @swagger
 * /spare-parts:
 *   get:
 *     summary: Tüm yedek parçaları listele
 *     tags: [SpareParts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Yedek parçalar başarıyla listelendi.
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
 * /spare-parts:
 *   post:
 *     summary: Yeni bir yedek parça oluştur
 *     tags: [SpareParts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Yedek parça başarıyla oluşturuldu.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /spare-parts/{id}:
 *   put:
 *     summary: Yedek parçayı güncelle
 *     tags: [SpareParts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek yedek parçanın ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Yedek parça başarıyla güncellendi.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       404:
 *         description: Yedek parça bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /spare-parts/{id}:
 *   delete:
 *     summary: Yedek parçayı sil
 *     tags: [SpareParts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek yedek parçanın ID'si
 *     responses:
 *       200:
 *         description: Yedek parça başarıyla silindi.
 *       404:
 *         description: Yedek parça bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
    getAllSpareParts,
    createSparePart,
    updateSparePart,
    deleteSparePart,
} = require('../controllers/sparePartsController');
const authorize = require('../helpers/authorization');

// Yedek parça rotaları
router.get('/', authorize(['user', 'admin']), asyncHandler(getAllSpareParts));
router.post('/', authorize(['admin']), asyncHandler(createSparePart));
router.put('/:id', authorize(['admin']), asyncHandler(updateSparePart));
router.delete('/:id', authorize(['admin']), asyncHandler(deleteSparePart));

module.exports = router;
