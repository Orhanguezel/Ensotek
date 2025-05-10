import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Service } from "@/modules/services";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import fs from "fs";
import path from "path";
import { isValidObjectId } from "@/core/utils/validation";
import { processImageLocal, getImagePath, shouldProcessImage, getFallbackThumbnail } from "@/core/utils/uploadUtils";

// ✅ Create Service
export const createService = asyncHandler(async (req: Request, res: Response) => {
  let { title, shortDescription, detailedDescription, price, durationMinutes, category, tags, isPublished } = req.body;

  try {
    title = typeof title === "string" ? JSON.parse(title) : title;
    shortDescription = typeof shortDescription === "string" ? JSON.parse(shortDescription) : shortDescription;
    detailedDescription = typeof detailedDescription === "string" ? JSON.parse(detailedDescription) : detailedDescription;
    category = typeof category === "string" ? JSON.parse(category) : category;
    tags = typeof tags === "string" ? JSON.parse(tags) : tags;
    isPublished = typeof isPublished === "string" ? JSON.parse(isPublished) : isPublished;
  } catch {
    res.status(400).json({ success: false, message: "Invalid JSON in fields." });
    return;
  }

  const images = [];

  if (Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      let imageUrl = getImagePath(file);
      let { thumbnail, webp } = getFallbackThumbnail(imageUrl);

      if (shouldProcessImage()) {
        const processed = await processImageLocal(file.path, file.filename, path.dirname(file.path));
        thumbnail = processed.thumbnail;
        webp = processed.webp;
      }

      images.push({ url: imageUrl, thumbnail, webp, publicId: (file as any).public_id });
    }
  }

  const slug = slugify(title?.en || "", { lower: true, strict: true });

  const service = await Service.create({
    title,
    slug,
    shortDescription,
    detailedDescription,
    price,
    durationMinutes,
    category,
    tags,
    isPublished,
    images,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Service created successfully.",
    data: service,
  });
});

// ✅ Get All Services (with optional categorySlug)
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const { categorySlug } = req.query;
  const filter = categorySlug ? { "category.slug": categorySlug, isActive: true } : { isActive: true };

  const services = await Service.find(filter).sort({ createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    message: "Services fetched successfully.",
    data: services,
  });
});

// ✅ Get Single Service
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid service ID." });
    return;
  }

  const service = await Service.findById(id).lean();
  if (!service) {
    res.status(404).json({ success: false, message: "Service not found." });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Service fetched successfully.",
    data: service,
  });
});

// ✅ Update Service
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid service ID." });
    return;
  }

  const service = await Service.findById(id);
  if (!service) {
    res.status(404).json({ success: false, message: "Service not found." });
    return;
  }

  let updates = req.body;

  try {
    if (updates.title) updates.title = typeof updates.title === "string" ? JSON.parse(updates.title) : updates.title;
    if (updates.shortDescription) updates.shortDescription = typeof updates.shortDescription === "string" ? JSON.parse(updates.shortDescription) : updates.shortDescription;
    if (updates.detailedDescription) updates.detailedDescription = typeof updates.detailedDescription === "string" ? JSON.parse(updates.detailedDescription) : updates.detailedDescription;
    if (updates.category) updates.category = typeof updates.category === "string" ? JSON.parse(updates.category) : updates.category;
    if (updates.tags) updates.tags = typeof updates.tags === "string" ? JSON.parse(updates.tags) : updates.tags;
  } catch {
    res.status(400).json({ success: false, message: "Invalid JSON in update fields." });
    return;
  }

  Object.assign(service, updates);

  if (updates.title?.en) {
    service.slug = slugify(updates.title.en, { lower: true, strict: true });
  }

  if (Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      let imageUrl = getImagePath(file);
      let { thumbnail, webp } = getFallbackThumbnail(imageUrl);

      if (shouldProcessImage()) {
        const processed = await processImageLocal(file.path, file.filename, path.dirname(file.path));
        thumbnail = processed.thumbnail;
        webp = processed.webp;
      }

      service.images.push({ url: imageUrl, thumbnail, webp, publicId: (file as any).public_id });
    }
  }

  await service.save();

  res.status(200).json({
    success: true,
    message: "Service updated successfully.",
    data: service,
  });
});

// ✅ Soft Delete Service
export const softDeleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid service ID." });
    return;
  }

  const service = await Service.findById(id);
  if (!service) {
    res.status(404).json({ success: false, message: "Service not found." });
    return;
  }

  service.isActive = false;
  await service.save();

  res.status(200).json({
    success: true,
    message: "Service archived successfully.",
  });
});

// ✅ Hard Delete Service
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid service ID." });
    return;
  }

  const service = await Service.findById(id);
  if (!service) {
    res.status(404).json({ success: false, message: "Service not found." });
    return;
  }

  for (const img of service.images) {
    const localPath = path.join("uploads", "service-images", path.basename(img.url));
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

    if (img.publicId) {
      await cloudinary.uploader.destroy(img.publicId);
    }
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    message: "Service deleted successfully.",
  });
});

// ✅ Get services by category slug
export const getServicesByCategory = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    res.status(400).json({ success: false, message: "Category slug is required." });
    return;
  }

  const services = await Service.find({ "category.slug": slug, isActive: true, isPublished: true }).sort({ createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    message: `Services fetched successfully for category '${slug}'.`,
    data: services,
  });
});
