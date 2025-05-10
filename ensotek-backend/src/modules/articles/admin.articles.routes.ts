// src/modules/Articles/admin.Articles.routes.ts

import express from "express";
import {
  createArticles,
  updateArticles,
  deleteArticles,
  adminGetAllArticless,
  adminGetArticlesById,
} from "./admin.articles.controller";
import { authenticate, authorizeRoles } from "@/core/middleware/authMiddleware";
import { validateObjectId } from "./articles.validation";
import upload from "@/core/middleware/uploadMiddleware";
import { uploadTypeWrapper } from "@/core/middleware/uploadTypeWrapper";
import { transformNestedFields } from "@/core/middleware/transformNestedFields";

const router = express.Router();

// 🔐 Admin Authentication & Authorization
router.use(authenticate, authorizeRoles("admin", "moderator"));

// 📥 Create Articles
router.post(
  "/",
  uploadTypeWrapper("articles"),
  upload.array("images", 5),
  transformNestedFields(["label", "tags"]),
  createArticles
);

// ✏️ Update Articles
router.put(
  "/:id",
  uploadTypeWrapper("articles"),
  upload.array("images", 5),
  transformNestedFields(["label", "tags"]),
  validateObjectId("id"),
  updateArticles
);

// 🗑️ Delete Articles
router.delete("/:id", validateObjectId("id"), deleteArticles);

// 📄 Get All / Get By ID
router.get("/", adminGetAllArticless);
router.get("/:id", validateObjectId("id"), adminGetArticlesById);

export default router;
