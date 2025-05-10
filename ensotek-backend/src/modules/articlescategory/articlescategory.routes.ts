import express from "express";
import {
  createArticlesCategory,
  getAllArticlesCategories,
  getArticlesCategoryById,
  updateArticlesCategory,
  deleteArticlesCategory,
} from "./articlescategory.controller";
import { authenticate, authorizeRoles } from "@/core/middleware/authMiddleware";
import {
  validateCreateArticlesCategory,
  validateUpdateArticlesCategory,
  validateObjectIdParam,
} from "./articlescategory.validation";
import { analyticsLogger } from "@/core/middleware/analyticsLogger"; 

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));

// ➕ Create Category
router.post(
  "/",
  analyticsLogger,
  validateCreateArticlesCategory,
  createArticlesCategory
);

// 📝 Get All Categories
router.get("/", analyticsLogger, getAllArticlesCategories);

// 🔍 Get Single Category
router.get("/:id", analyticsLogger, validateObjectIdParam, getArticlesCategoryById);

// ✏️ Update Category
router.put(
  "/:id",
  analyticsLogger,
  validateObjectIdParam,
  validateUpdateArticlesCategory,
  updateArticlesCategory
);

// 🗑️ Delete Category
router.delete(
  "/:id",
  analyticsLogger,
  validateObjectIdParam,
  deleteArticlesCategory
);

export default router;
