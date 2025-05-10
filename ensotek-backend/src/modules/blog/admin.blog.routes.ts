// src/modules/blog/admin.blog.routes.ts

import express from "express";
import {
  createBlog,
  updateBlog,
  deleteBlog,
  adminGetAllBlogs,
  adminGetBlogById,
} from "./admin.blog.controller";
import { authenticate, authorizeRoles } from "@/core/middleware/authMiddleware";
import { validateObjectId } from "./blog.validation";
import upload from "@/core/middleware/uploadMiddleware";
import { uploadTypeWrapper } from "@/core/middleware/uploadTypeWrapper";
import { transformNestedFields } from "@/core/middleware/transformNestedFields";

const router = express.Router();

// 🔐 Admin Authentication & Authorization
router.use(authenticate, authorizeRoles("admin", "moderator"));

// 📥 Create Blog
router.post(
  "/",
  uploadTypeWrapper("blog"),
  upload.array("images", 5),
  transformNestedFields(["label", "tags"]),
  createBlog
);

// ✏️ Update Blog
router.put(
  "/:id",
  uploadTypeWrapper("blog"),
  upload.array("images", 5),
  transformNestedFields(["label", "tags"]),
  validateObjectId("id"),
  updateBlog
);

// 🗑️ Delete Blog
router.delete("/:id", validateObjectId("id"), deleteBlog);

// 📄 Get All / Get By ID
router.get("/", adminGetAllBlogs);
router.get("/:id", validateObjectId("id"), adminGetBlogById);

export default router;
