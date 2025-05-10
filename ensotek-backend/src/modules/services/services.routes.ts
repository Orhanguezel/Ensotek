import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  softDeleteService,
  getServicesByCategory,
} from "./services.controller";

import { authenticate, authorizeRoles } from "@/core/middleware/authMiddleware";
import upload from "@/core/middleware/uploadMiddleware";
import { uploadTypeWrapper } from "@/core/middleware/uploadTypeWrapper";
import { checkFileSizeMiddleware } from "@/core/middleware/checkFileSizeMiddleware";
import { transformNestedFields } from "@/core/middleware/transformNestedFields";

import {
  validateCreateService,
  validateUpdateService,
  validateObjectId,
} from "./services.validation";

const router = express.Router();

// 🌿 Public routes
router.get("/", getAllServices);
router.get("/category/:slug", getServicesByCategory);
router.get("/:id", validateObjectId("id"), getServiceById);

// 🛠 Admin routes
router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  uploadTypeWrapper("service"),
  checkFileSizeMiddleware,
  upload.array("images", 10),
  transformNestedFields(["title", "shortDescription", "detailedDescription", "category", "tags"]),
  validateCreateService,
  createService
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  uploadTypeWrapper("service"),
  checkFileSizeMiddleware,
  upload.array("images", 10),
  transformNestedFields(["title", "shortDescription", "detailedDescription", "category", "tags"]),
  validateObjectId("id"),
  validateUpdateService,
  updateService
);

router.patch(
  "/soft-delete/:id",
  authenticate,
  authorizeRoles("admin"),
  validateObjectId("id"),
  softDeleteService
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validateObjectId("id"),
  deleteService
);

export default router;
