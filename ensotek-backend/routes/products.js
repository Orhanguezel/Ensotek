/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Ürün yönetimi işlemleri
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Tüm ürünleri listele
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ürünler başarıyla listelendi.
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
 * /products:
 *   post:
 *     summary: Yeni bir ürün oluştur
 *     tags: [Products]
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
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Ürün başarıyla oluşturuldu.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Ürünü güncelle
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek ürünün ID'si
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
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Ürün başarıyla güncellendi.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       404:
 *         description: Ürün bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Ürünü sil
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek ürünün ID'si
 *     responses:
 *       200:
 *         description: Ürün başarıyla silindi.
 *       404:
 *         description: Ürün bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productsController');
const authorize = require('../helpers/authorization');

// Ürün rotaları
router.get('/', authorize(['user', 'admin']), asyncHandler(getAllProducts));
router.post('/', authorize(['admin']), asyncHandler(createProduct));
router.put('/:id', authorize(['admin']), asyncHandler(updateProduct));
router.delete('/:id', authorize(['admin']), asyncHandler(deleteProduct));

module.exports = router;
