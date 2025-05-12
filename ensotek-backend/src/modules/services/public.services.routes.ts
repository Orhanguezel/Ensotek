import express from "express";
import {
  getAllServices,
  getServiceById,
  getServiceBySlug,
} from "./public.services.controller";
import { validateObjectId } from "./services.validation";

const router = express.Router();

// 🌍 Public service endpoints
router.get("/", getAllServices);
router.get("/slug/:slug", getServiceBySlug);
router.get("/:id", validateObjectId("id"), getServiceById);

export default router;
