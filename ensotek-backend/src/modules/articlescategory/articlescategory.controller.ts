import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { ArticlesCategory } from ".";
import { isValidObjectId } from "@/core/utils/validation";

// ✅ Create Articles Category
export const createArticlesCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name?.tr || !name?.en || !name?.de) {
    res.status(400).json({ success: false, message: "Name (tr, en, de) is required." });
    return;
  }

  const articlesCategory = await ArticlesCategory.create({ name });

  res.status(201).json({
    success: true,
    message: "Articles category created successfully.",
    data: articlesCategory,
  });
});


// ✅ Get All Articles Categories
export const getAllArticlesCategories = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    const categories = await ArticlesCategory.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });

    return;
  }
);

// ✅ Get Articles Category by ID
export const getArticlesCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid category ID." });
      return;
    }

    const category = await ArticlesCategory.findById(id);

    if (!category) {
      res
        .status(404)
        .json({ success: false, message: "Articles category not found." });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });

    return;
  }
);

// ✅ Update Articles Category
export const updateArticlesCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid category ID." });
    return;
  }

  const category = await ArticlesCategory.findById(id);
  if (!category) {
    res.status(404).json({ success: false, message: "Articles category not found." });
    return;
  }

  category.name = updates.name ?? category.name;
  category.description = updates.description ?? category.description;

  category.isActive = typeof updates.isActive === "boolean" ? updates.isActive : category.isActive;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Articles category updated successfully.",
    data: category,
  });
});


// ✅ Delete Articles Category
export const deleteArticlesCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid category ID." });
      return;
    }

    const deleted = await ArticlesCategory.findByIdAndDelete(id);

    if (!deleted) {
      res
        .status(404)
        .json({ success: false, message: "Articles category not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Articles category deleted successfully.",
    });

    return;
  }
);
