// src/modules/Articles/public.Articles.routes.ts

import express from "express";
import { getAllArticles, getArticleBySlug } from "./public.articles.controller";
import { analyticsLogger } from "@/core/middleware/analyticsLogger";

const router = express.Router();

// 🌍 Public Routes — Read-only
router.get("/", analyticsLogger, getAllArticles);
router.get("/slug/:slug", analyticsLogger, getArticleBySlug);

export default router;
