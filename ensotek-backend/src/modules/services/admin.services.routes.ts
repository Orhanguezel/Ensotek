import express from "express";
import { authenticate, authorizeRoles } from "@/core/middleware/authMiddleware";
import {
  adminGetAllServices,
  adminGetServiceById,
  createService,
  updateService,
  deleteService,
} from "./admin.services.controller";
import { validateObjectId } from "./services.validation";
import upload from "@/core/middleware/uploadMiddleware";
import { uploadTypeWrapper } from "@/core/middleware/uploadTypeWrapper";
import { transformNestedFields } from "@/core/middleware/transformNestedFields";

const router = express.Router();

// 🔐 Admin access
router.use(authenticate, authorizeRoles("admin", "moderator"));

router.get("/", adminGetAllServices);
router.get("/:id", validateObjectId("id"), adminGetServiceById);

router.post(
  "/",
  uploadTypeWrapper("services"),
  upload.array("images", 5),
  transformNestedFields(["title", "summary", "content", "tags"]),
  createService
);

router.put(
  "/:id",
  uploadTypeWrapper("services"),
  upload.array("images", 5),
  transformNestedFields(["title", "summary", "content", "tags"]),
  validateObjectId("id"),
  updateService
);

router.delete("/:id", validateObjectId("id"), deleteService);

export default router;
