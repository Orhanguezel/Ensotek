/**
 * @swagger
 * tags:
 *   name: References
 *   description: Referans yönetimi işlemleri
 */

/**
 * @swagger
 * /references:
 *   get:
 *     summary: Tüm referansları listele
 *     tags: [References]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Referanslar başarıyla listelendi.
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
 * /references:
 *   post:
 *     summary: Yeni bir referans oluştur
 *     tags: [References]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               company_name:
 *                 type: string
 *               sector:
 *                 type: string
 *     responses:
 *       201:
 *         description: Referans başarıyla oluşturuldu.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /references/{id}:
 *   put:
 *     summary: Referansı güncelle
 *     tags: [References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Güncellenecek referansın ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               company_name:
 *                 type: string
 *               sector:
 *                 type: string
 *     responses:
 *       200:
 *         description: Referans başarıyla güncellendi.
 *       400:
 *         description: Gerekli bilgiler eksik veya hatalı.
 *       404:
 *         description: Referans bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

/**
 * @swagger
 * /references/{id}:
 *   delete:
 *     summary: Referansı sil
 *     tags: [References]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Silinecek referansın ID'si
 *     responses:
 *       200:
 *         description: Referans başarıyla silindi.
 *       404:
 *         description: Referans bulunamadı.
 *       401:
 *         description: Yetkilendirme hatası.
 */

const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
    getAllReferences,
    createReference,
    updateReference,
    deleteReference,
} = require('../controllers/referencesController');
const authorize = require('../helpers/authorization');

// Referans rotaları
router.get('/', authorize(['user', 'admin']), asyncHandler(getAllReferences));
router.post('/', authorize(['admin']), asyncHandler(createReference));
router.put('/:id', authorize(['admin']), asyncHandler(updateReference));
router.delete('/:id', authorize(['admin']), asyncHandler(deleteReference));

module.exports = router;





