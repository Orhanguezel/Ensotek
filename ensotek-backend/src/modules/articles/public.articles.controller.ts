import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Articles } from ".";
import { isValidObjectId } from "@/core/utils/validation";

// ✅ Public - Get All Articless (filtered by language & category)
export const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
  const { category, language } = req.query;
  const filter: any = {
    isActive: true,
    isPublished: true,
  };


  if (category && isValidObjectId(category.toString())) {
    filter.category = category;
  }

  const articles = await Articles.find(filter)
    .populate("comments")
    .populate("category", "name")
    .sort({ publishedAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Articless fetched successfully.",
    data: articles,
  });
});

// ✅ Public - Get Articles by Slug
export const getArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const articles = await Articles.findOne({
    slug,
    isPublished: true,
    isActive: true,
  })
    .populate("comments")
    .populate("category", "name")
    .lean();

  if (!articles) {
    res.status(404).json({
      success: false,
      message: "Articles not found or inactive.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Articles fetched successfully.",
    data: articles,
  });
});
