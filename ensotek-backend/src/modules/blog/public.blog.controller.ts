import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Blog } from ".";
import { isValidObjectId } from "@/core/utils/validation";

// ✅ Public - Get All Blogs (filtered by language & category)
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { category, language } = req.query;
  const filter: any = {
    isActive: true,
    isPublished: true,
  };


  if (category && isValidObjectId(category.toString())) {
    filter.category = category;
  }

  const blogs = await Blog.find(filter)
    .populate("comments")
    .populate("category", "name")
    .sort({ publishedAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Blogs fetched successfully.",
    data: blogs,
  });
});

// ✅ Public - Get Blog by Slug
export const getBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({
    slug,
    isPublished: true,
    isActive: true,
  })
    .populate("comments")
    .populate("category", "name")
    .lean();

  if (!blog) {
    res.status(404).json({
      success: false,
      message: "Blog not found or inactive.",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Blog fetched successfully.",
    data: blog,
  });
});
