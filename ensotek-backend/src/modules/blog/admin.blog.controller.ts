import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { Blog } from ".";
import { isValidObjectId } from "@/core/utils/validation";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import {
  getImagePath,
  getFallbackThumbnail,
  processImageLocal,
  shouldProcessImage,
} from "@/core/utils/uploadUtils";

// ✅ Admin - Create Blog
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  let { title, summary, content, tags, category, isPublished, publishedAt, label } = req.body;

  try {
    title = typeof title === "string" ? JSON.parse(title) : title;
    summary = typeof summary === "string" ? JSON.parse(summary) : summary;
    content = typeof content === "string" ? JSON.parse(content) : content;
    tags = typeof tags === "string" ? JSON.parse(tags) : tags;
    label = typeof label === "string" ? JSON.parse(label) : label;
  } catch {
    res.status(400).json({ success: false, message: "Invalid JSON in one of the fields." });
    return;
  }

  const images = [];

  if (Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      const imageUrl = getImagePath(file);
      let { thumbnail, webp } = getFallbackThumbnail(imageUrl);
      const publicId = (file as any).public_id;

      if (shouldProcessImage()) {
        const processed = await processImageLocal(file.path, file.filename, path.dirname(file.path));
        thumbnail = processed.thumbnail;
        webp = processed.webp;
      }

      images.push({ url: imageUrl, thumbnail, webp, publicId });
    }
  }

  if (images.length === 0) {
    res.status(400).json({ success: false, message: "At least one image is required." });
    return;
  }

  const slug = slugify(title?.en || title?.tr || title?.de || "blog", {
    lower: true,
    strict: true,
  });

  const blog = await Blog.create({
    title,
    slug,
    summary,
    content,
    tags,
    category: isValidObjectId(category) ? category : undefined,
    isPublished: isPublished === "true" || isPublished === true,
    publishedAt: isPublished ? publishedAt || new Date() : undefined,
    images,
    author: req.user?.name || "System",
    label,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Blog created successfully.",
    data: blog,
  });
});

// ✅ Admin - Update Blog
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid blog ID." });
    return;
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(404).json({ success: false, message: "Blog not found." });
    return;
  }

  try {
    if (updates.title) updates.title = JSON.parse(updates.title);
    if (updates.summary) updates.summary = JSON.parse(updates.summary);
    if (updates.content) updates.content = JSON.parse(updates.content);
    if (updates.tags) updates.tags = JSON.parse(updates.tags);
    if (updates.label) updates.label = JSON.parse(updates.label);
  } catch {
    res.status(400).json({ success: false, message: "Invalid JSON in update fields." });
    return;
  }

  const files = req.files as Express.Multer.File[] || [];
  const newImages = [];

  for (const file of files) {
    const imageUrl = getImagePath(file);
    let { thumbnail, webp } = getFallbackThumbnail(imageUrl);

    if (shouldProcessImage()) {
      const processed = await processImageLocal(file.path, file.filename, path.dirname(file.path));
      thumbnail = processed.thumbnail;
      webp = processed.webp;
    }

    newImages.push({ url: imageUrl, thumbnail, webp, publicId: (file as any).public_id });
  }

  if (updates.removedImages) {
    try {
      const removed = JSON.parse(updates.removedImages);
      blog.images = blog.images.filter((img) => !removed.includes(img.url));

      for (const img of removed) {
        const localPath = path.join("uploads", "blog-images", path.basename(img.url));
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
      }
    } catch {
      console.warn("⚠️ Invalid removedImages JSON; skipping removal.");
    }
  }

  Object.assign(blog, updates);
  blog.images.push(...newImages);

  await blog.save();

  res.status(200).json({
    success: true,
    message: "Blog updated successfully.",
    data: blog,
  });
});

// ✅ Admin - Delete Blog
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid blog ID." });
    return;
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(404).json({ success: false, message: "Blog not found." });
    return;
  }

  for (const img of blog.images) {
    const localPath = path.join("uploads", "blog-images", path.basename(img.url));
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    if (img.publicId) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch (err) {
        console.error(`❌ Cloudinary delete error for ${img.publicId}:`, err);
      }
    }
  }

  await blog.deleteOne();

  res.status(200).json({
    success: true,
    message: "Blog deleted successfully.",
  });
});

// ✅ Admin - Get All Blogs
export const adminGetAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { category, language, isPublished, isActive } = req.query;
  const filter: any = {};

  if (language) filter[`label.${language}`] = { $exists: true };
  if (category && isValidObjectId(category.toString())) filter.category = category;
  if (isPublished !== undefined) filter.isPublished = isPublished === "true";
  filter.isActive = isActive !== undefined ? isActive === "true" : true;

  const blogs = await Blog.find(filter)
    .populate("comments")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Blogs fetched successfully.",
    data: blogs,
  });
});

// ✅ Admin - Get Blog by ID
export const adminGetBlogById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid blog ID." });
    return;
  }

  const blog = await Blog.findById(id)
    .populate("comments")
    .populate("category", "name")
    .lean();

  if (!blog || !blog.isActive) {
    res.status(404).json({ success: false, message: "Blog not found or inactive." });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Blog fetched successfully.",
    data: blog,
  });
});
