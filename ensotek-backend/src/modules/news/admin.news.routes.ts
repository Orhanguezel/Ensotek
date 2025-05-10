import express from "express";
import { authenticate, authorizeRoles } from "@/core/middleware/authMiddleware";
import {
  adminGetAllNews,
  adminGetNewsById,
  updateNews,
  deleteNews,
  createNews,
} from "./admin.news.controller";
import { validateObjectId } from "./news.validation";
import upload from "@/core/middleware/uploadMiddleware";
import { uploadTypeWrapper } from "@/core/middleware/uploadTypeWrapper";
import {transformNestedFields} from "@/core/middleware/transformNestedFields";

const router = express.Router();

// 🌟 Admin Middleware
router.use(authenticate, authorizeRoles("admin", "moderator"));

// 🌟 Admin Endpoints
router.get("/", adminGetAllNews);
router.get("/:id", validateObjectId("id"), adminGetNewsById);

router.post(
  "/",
  uploadTypeWrapper("news"),
  upload.array("images", 5),
  transformNestedFields(["title", "summary", "content", "tags"]),
  createNews
);

router.put(
  "/:id",
  uploadTypeWrapper("news"),
  upload.array("images", 5),
  transformNestedFields(["title", "summary", "content", "tags"]),
  validateObjectId("id"),
  updateNews
);

router.delete("/:id", validateObjectId("id"), deleteNews);

export default router;
