import { body, param } from "express-validator";
import { validateRequest } from "@/core/middleware/validateRequest";

export const validateObjectIdParam = [
  param("id")
    .isMongoId()
    .withMessage("Invalid MongoDB ObjectId."),
  validateRequest,
];

export const validateCreateArticlesCategory = [
  body("name.tr").notEmpty().withMessage("Name (TR) is required."),
  body("name.en").notEmpty().withMessage("Name (EN) is required."),
  body("name.de").notEmpty().withMessage("Name (DE) is required."),
  body("description").optional().isString().withMessage("Description must be a string."),

  validateRequest,
];

export const validateUpdateArticlesCategory = [
  body("name.tr").optional().isString().withMessage("Name (TR) must be a string."),
  body("name.en").optional().isString().withMessage("Name (EN) must be a string."),
  body("name.de").optional().isString().withMessage("Name (DE) must be a string."),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean."),
  validateRequest,
];
