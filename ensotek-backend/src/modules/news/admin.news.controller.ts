import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { News,INews } from ".";
import { isValidObjectId } from "@/core/utils/validation";
import slugify from "slugify";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import {
  getImagePath,
  getFallbackThumbnail,
  processImageLocal,
  shouldProcessImage,
} from "@/core/utils/uploadUtils";

// ✅ Create News
export const createNews = asyncHandler(async (req: Request, res: Response) => {
  let { title, summary, content, tags, category, isPublished, publishedAt } = req.body;

  try {
    title = typeof title === "string" ? JSON.parse(title) : title;
    summary = typeof summary === "string" ? JSON.parse(summary) : summary;
    content = typeof content === "string" ? JSON.parse(content) : content;
    tags = typeof tags === "string" ? JSON.parse(tags) : tags;
  } catch (e) {
    console.warn("Invalid JSON in fields:", e);
    res.status(400).json({
      success: false,
      message: "Invalid JSON in one of the fields: title, summary, content, tags.",
    });
    return;
  }

  const images: { url: string; thumbnail: string; webp?: string; publicId?: string }[] = [];

  if (Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      let imageUrl = getImagePath(file);
      let { thumbnail, webp } = getFallbackThumbnail(imageUrl);
      let publicId: string | undefined = (file as any).public_id;

      if (shouldProcessImage()) {
        const processed = await processImageLocal(file.path, file.filename, path.dirname(file.path));
        thumbnail = processed.thumbnail;
        webp = processed.webp;
      }

      images.push({ url: imageUrl, thumbnail, webp, publicId });
    }
  }

  const slug = slugify(title?.en || title?.tr || title?.de || "news", {
    lower: true,
    strict: true,
  });

  const news = await News.create({
    title,
    slug,
    summary,
    content,
    tags,
    category: isValidObjectId(category) && category !== "" ? category : undefined,
    isPublished: isPublished === "true" || isPublished === true,
    publishedAt: isPublished ? publishedAt || new Date() : undefined,
    images,
    author: req.user?.name || "System",
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "News created successfully.",
    data: news,
  });
});

// ✅ Admin - Get All News (Advanced filter)


export const adminGetAllNews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { language, category, isPublished, isActive } = req.query;

  const filter: Record<string, any> = {};

  // ✅ Dil kontrolü: yalnızca geçerli diller işleme alınır
  if (
    typeof language === "string" &&
    ["tr", "en", "de"].includes(language)
  ) {
    filter[`title.${language}`] = { $exists: true };
  }

  // ✅ Kategori kontrolü
  if (typeof category === "string" && isValidObjectId(category)) {
    filter.category = category;
  }

  // ✅ Yayın durumu (true/false string olarak geldiğinde)
  if (typeof isPublished === "string") {
    filter.isPublished = isPublished === "true";
  }

  // ✅ Aktiflik kontrolü (default: true)
  if (typeof isActive === "string") {
    filter.isActive = isActive === "true";
  } else {
    filter.isActive = true;
  }

  const newsList = await News.find(filter)
    .populate([
      { path: "comments" },
      { path: "category", select: "name" }, 
    ])
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "News list fetched successfully.",
    data: newsList,
  });
});

// ✅ Admin - Get Single News by ID
export const adminGetNewsById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid news ID." });
    return;
  }

  const news = await News.findById(id)
    .populate([{ path: "comments" }, { path: "category", select: "title" }])
    .lean();

  if (!news || !news.isActive) {
    res.status(404).json({ success: false, message: "News not found or inactive." });
    return;
  }

  res.status(200).json({
    success: true,
    message: "News fetched successfully.",
    data: news,
  });
});

// ✅ Update News
export const updateNews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid news ID." });
    return;
  }

  const news = await News.findById(id);
  if (!news) {
    res.status(404).json({ success: false, message: "News not found." });
    return;
  }

  try {
    if (updates.title) updates.title = JSON.parse(updates.title);
    if (updates.summary) updates.summary = JSON.parse(updates.summary);
    if (updates.content) updates.content = JSON.parse(updates.content);
    if (updates.tags) updates.tags = JSON.parse(updates.tags);
  } catch (e) {
    console.warn("Invalid JSON in update fields:", e);
    res.status(400).json({ success: false, message: "Invalid JSON in update fields." });
    return;
  }

  Object.assign(news, updates);

  if (!Array.isArray(news.images)) news.images = [];

  if (Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      let imageUrl = getImagePath(file);
      let { thumbnail, webp } = getFallbackThumbnail(imageUrl);

      if (shouldProcessImage()) {
        const processed = await processImageLocal(file.path, file.filename, path.dirname(file.path));
        thumbnail = processed.thumbnail;
        webp = processed.webp;
      }

      news.images.push({ url: imageUrl, thumbnail, webp, publicId: (file as any).public_id });
    }
  }

  if (updates.removedImages) {
    try {
      const removed = JSON.parse(updates.removedImages);
      news.images = news.images.filter((img: any) => !removed.includes(img.url));

      for (const img of removed) {
        const localPath = path.join("uploads", "news-images", path.basename(img.url));
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
      }
    } catch (e) {
      console.warn("Invalid removedImages JSON:", e);
    }
  }

  await news.save();

  res.status(200).json({
    success: true,
    message: "News updated successfully.",
    data: news,
  });
});

// ✅ Delete News
export const deleteNews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid news ID." });
    return;
  }

  const news = await News.findById(id);
  if (!news) {
    res.status(404).json({ success: false, message: "News not found." });
    return;
  }

  for (const img of news.images) {
    const localPath = path.join("uploads", "news-images", path.basename(img.url));
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

    if (img.publicId) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch (err) {
        console.error(`Cloudinary delete error for ${img.publicId}:`, err);
      }
    }
  }

  await news.deleteOne();

  res.status(200).json({
    success: true,
    message: "News deleted successfully.",
  });
});
