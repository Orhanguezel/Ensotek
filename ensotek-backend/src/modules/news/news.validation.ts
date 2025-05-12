import { body, param } from "express-validator";
import { validateRequest } from "@/core/middleware/validateRequest";
import { query } from "express-validator";

// ✅ Param ID kontrolü
export const validateObjectId = (field: string) => [
  param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId.`),
  validateRequest,
];

// ✅ Create News Validation
export const validateCreateNews = [
  body("title")
    .custom((value) => {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return parsed.tr && parsed.en && parsed.de;
      } catch {
        return false;
      }
    })
    .withMessage("Title must be a valid JSON with tr, en, de."),

  body("summary")
    .custom(
      (value) => typeof value === "object" && value.tr && value.en && value.de
    )
    .withMessage("Summary must be an object with tr, en, de."),
  body("content")
    .custom(
      (value) => typeof value === "object" && value.tr && value.en && value.de
    )
    .withMessage("Content must be an object with tr, en, de."),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId."),

  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          throw new Error("Tags must be a JSON array string or array.");
        }
      }
      return false;
    }),

  validateRequest,
];

export const validateUpdateNews = [
  body("title")
    .optional()
    .custom((v) => typeof v === "object")
    .withMessage("Title must be an object."),
  body("summary")
    .optional()
    .custom((v) => typeof v === "object")
    .withMessage("Summary must be an object."),
  body("content")
    .optional()
    .custom((v) => typeof v === "object")
    .withMessage("Content must be an object."),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId."),
  body("tags")
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return true;
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed);
        } catch {
          throw new Error("Tags must be a JSON array string or array.");
        }
      }
      return false;
    }),
  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be true or false."),
  body("publishedAt")
    .optional()
    .isISO8601()
    .withMessage("publishedAt must be a valid ISO8601 date."),
  validateRequest,
];

export const validateAdminQuery = [
  (req, _res, next) => {
    console.log("✅ validateAdminQuery çalıştı, gelen query:", req.query);
    next();
  },
  query("language").optional().isIn(["tr", "en", "de"]).withMessage("Invalid language."),
  query("category").optional().isMongoId().withMessage("Invalid category ID."),
  query("isPublished").optional().toBoolean().isBoolean().withMessage("isPublished must be boolean."),
  query("isActive").optional().toBoolean().isBoolean().withMessage("isActive must be boolean."),
  validateRequest
];


