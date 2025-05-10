// src/modules/blog/public.blog.routes.ts

import express from "express";
import { getAllBlogs, getBlogBySlug } from "./public.blog.controller";
import { validateApiKey } from "@/core/middleware/validateApiKey";
import { analyticsLogger } from "@/core/middleware/analyticsLogger";

const router = express.Router();

// 🌍 Public Routes — Read-only
router.get("/",  analyticsLogger, getAllBlogs);
router.get("/slug/:slug",  analyticsLogger, getBlogBySlug);

export default router;
