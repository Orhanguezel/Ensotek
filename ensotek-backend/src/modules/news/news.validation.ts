import { body, param } from "express-validator";
import { validateRequest } from "@/core/middleware/validateRequest";

// ✅ Param ID kontrolü
export const validateObjectId = (field: string) => [
  param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId.`),
  validateRequest,
];

// ✅ Create News Validation
export const validateCreateNews = [
  body("title").isObject().withMessage("Title must be an object with tr, en, de."),
  body("title.tr").notEmpty().withMessage("Title (TR) is required."),
  body("title.en").notEmpty().withMessage("Title (EN) is required."),
  body("title.de").notEmpty().withMessage("Title (DE) is required."),

  body("summary").isObject().withMessage("Summary must be an object with tr, en, de."),
  body("summary.tr").notEmpty().withMessage("Summary (TR) is required."),
  body("summary.en").notEmpty().withMessage("Summary (EN) is required."),
  body("summary.de").notEmpty().withMessage("Summary (DE) is required."),

  body("content").isObject().withMessage("Content must be an object with tr, en, de."),
  body("content.tr").notEmpty().withMessage("Content (TR) is required."),
  body("content.en").notEmpty().withMessage("Content (EN) is required."),
  body("content.de").notEmpty().withMessage("Content (DE) is required."),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId."),

  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch {
        throw new Error("Tags must be an array or a JSON array string.");
      }
    }),

  validateRequest,
];

// ✅ Update News Validation
export const validateUpdateNews = [
  body("title").optional().isObject().withMessage("Title must be an object."),
  body("summary").optional().isObject().withMessage("Summary must be an object."),
  body("content").optional().isObject().withMessage("Content must be an object."),
  body("category").optional().isMongoId().withMessage("Category must be a valid MongoDB ObjectId."),
  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed);
      } catch {
        throw new Error("Tags must be an array or a JSON array string.");
      }
    }),
  body("isPublished").optional().isBoolean().withMessage("isPublished must be true or false."),
  body("publishedAt").optional().isISO8601().withMessage("publishedAt must be a valid ISO8601 date."),
  validateRequest,
];
