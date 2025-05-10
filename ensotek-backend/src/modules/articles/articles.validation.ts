import { body, param } from "express-validator";
import { validateRequest } from "@/core/middleware/validateRequest";

// ✅ JSON string olarak gelen ve object olması beklenen alanlar için validator
const isParsableObject = (fieldName: string) =>
  body(fieldName)
    .custom((value) => {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return typeof parsed === "object" && parsed !== null;
      } catch {
        throw new Error(`${fieldName} must be a valid JSON object.`);
      }
    });

// ✅ JSON string olarak gelen ve array olması beklenen alanlar için validator
const isParsableArray = (fieldName: string) =>
  body(fieldName)
    .optional()
    .custom((value) => {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return Array.isArray(parsed);
      } catch {
        throw new Error(`${fieldName} must be a valid JSON array.`);
      }
    });

export const validateCreateArticles = [
  isParsableObject("title"),
  isParsableObject("summary"),
  isParsableObject("content"),
  isParsableArray("tags"),
  isParsableObject("label"),

  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId."),

  validateRequest,
];

export const validateUpdateArticles = [
  body("title").optional().custom((val) => {
    if (typeof val === "string") JSON.parse(val);
    return true;
  }),
  body("summary").optional().custom((val) => {
    if (typeof val === "string") JSON.parse(val);
    return true;
  }),
  body("content").optional().custom((val) => {
    if (typeof val === "string") JSON.parse(val);
    return true;
  }),
  body("tags").optional().custom((val) => {
    if (typeof val === "string") JSON.parse(val);
    return true;
  }),
  body("label").optional().custom((val) => {
    if (typeof val === "string") JSON.parse(val);
    return true;
  }),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid MongoDB ObjectId."),

  validateRequest,
];

export const validateObjectId = (field: string) => [
  param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid MongoDB ObjectId.`),
  validateRequest,
];
