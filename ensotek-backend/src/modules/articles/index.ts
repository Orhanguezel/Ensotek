// src/modules/articles/index.ts

import express from "express";
import adminRoutes from "./admin.articles.routes";
import publicRoutes from "./public.articles.routes";
import Articles, { IArticles } from "./articles.models";
import * as adminController from "./admin.articles.controller";
import * as publicController from "./public.articles.controller";
import * as validation from "./articles.validation";

const router = express.Router();

// 🌍 Public Routes
router.use("/", publicRoutes);

// 🔐 Admin Routes
router.use("/admin", adminRoutes);

// ✅ Exports (standardized)
export { Articles, IArticles, adminController, publicController, validation };

export default router;
