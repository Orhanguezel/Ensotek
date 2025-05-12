import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Services } from ".";
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


// ✅ Create Service
export const createService = asyncHandler(
  async (req: Request, res: Response) => {
    const langs = ["tr", "en", "de"];

    const title = Object.fromEntries(langs.map((l) => [l, req.body[`title.${l}`] || ""]));
    const summary = Object.fromEntries(langs.map((l) => [l, req.body[`summary.${l}`] || ""]));
    const content = Object.fromEntries(langs.map((l) => [l, req.body[`content.${l}`] || ""]));

    let { tags: rawTags, category, isPublished, publishedAt, price, durationMinutes } = req.body;
    let tags: string[] = [];

    try {
      tags = typeof rawTags === "string" ? JSON.parse(rawTags) : [];
    } catch (e) {
      res.status(400).json({ success: false, message: "Invalid JSON in tags field." });
      return;
    }

    const images = [];

    if (Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        let imageUrl = getImagePath(file);
        let { thumbnail, webp } = getFallbackThumbnail(imageUrl);
        let publicId = (file as any).public_id;

        if (shouldProcessImage()) {
          const processed = await processImageLocal(
            file.path,
            file.filename,
            path.dirname(file.path)
          );
          thumbnail = processed.thumbnail;
          webp = processed.webp;
        }

        images.push({ url: imageUrl, thumbnail, webp, publicId });
      }
    }

    const service = await Services.create({
      title,
      summary,
      content,
      tags,
      category: isValidObjectId(category) ? category : undefined,
      isPublished: isPublished === "true" || isPublished === true,
      publishedAt: isPublished ? publishedAt || new Date() : undefined,
      images,
      author: req.user?.name || "System",
      price: parseFloat(price),
      durationMinutes: parseInt(durationMinutes),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: service,
    });
  }
);



// ✅ Get All Services
// ✅ Get All Services (Admin)
export const adminGetAllServices = asyncHandler(
  async (req: Request, res: Response) => {
    const { language, category, isPublished, isActive } = req.query;
    const filter: any = {};

    // 🔐 Güvenli dil kontrolü
    if (
      language &&
      typeof language === "string" &&
      ["tr", "en", "de"].includes(language)
    ) {
      filter[`title.${language}`] = { $exists: true, $ne: "" };
    }

    // 📌 Kategori kontrolü
    if (category && typeof category === "string" && isValidObjectId(category)) {
      filter.category = category;
    }

    // 🟢 Yayınlanma durumu (isteğe bağlı)
    if (typeof isPublished === "string") {
      filter.isPublished = isPublished === "true";
    }

    // 🟢 Aktiflik kontrolü (varsayılan true)
    filter.isActive =
      typeof isActive === "string" ? isActive === "true" : true;

    console.log("🔍 Service Admin Filter:", filter);

    const serviceList = await Services.find(filter)
      .populate([
        { path: "comments" },
        { path: "category", select: "title" },
      ])
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Services list fetched successfully.",
      data: serviceList,
    });
    return 
  }
);


// ✅ Get Single Service
export const adminGetServiceById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid service ID." });
      return;
    }

    const service = await Services.findById(id)
      .populate([{ path: "comments" }, { path: "category", select: "title" }])
      .lean();

    if (!service || !service.isActive) {
      res
        .status(404)
        .json({ success: false, message: "Service not found or inactive." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Service fetched successfully.",
      data: service,
    });
  }
);

// ✅ Update Service
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid service ID." });
    return;
  }

  const service = await Services.findById(id);
  if (!service) {
    res.status(404).json({ success: false, message: "Service not found." });
    return;
  }

  // ✅ FormData'dan gelen alanlar
  const title = {
    tr: req.body["title.tr"],
    en: req.body["title.en"],
    de: req.body["title.de"],
  };

  const summary = {
    tr: req.body["summary.tr"],
    en: req.body["summary.en"],
    de: req.body["summary.de"],
  };

  const content = {
    tr: req.body["content.tr"],
    en: req.body["content.en"],
    de: req.body["content.de"],
  };

  let {
    tags,
    category,
    isPublished,
    publishedAt,
    price,
    durationMinutes,
    removedImages,
  } = req.body;

  // ✅ tags JSON kontrolü
  try {
    tags = typeof tags === "string" ? JSON.parse(tags) : tags;
  } catch (e) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON in 'tags' field.",
    });
    return;
  }

  // ✅ Alanları ata
  service.title = title;
  service.summary = summary;
  service.content = content;
  service.tags = Array.isArray(tags) ? tags : [];
  service.category = isValidObjectId(category) ? category : service.category;
  service.isPublished = isPublished === "true" || isPublished === true;
  service.publishedAt = service.isPublished ? publishedAt || new Date() : undefined;
  service.price = parseFloat(price);
  service.durationMinutes = parseInt(durationMinutes);

  // ✅ Yeni görselleri işle
  if (Array.isArray(req.files)) {
    for (const file of req.files as Express.Multer.File[]) {
      let imageUrl = getImagePath(file);
      let { thumbnail, webp } = getFallbackThumbnail(imageUrl);

      if (shouldProcessImage()) {
        const processed = await processImageLocal(file.path, file.filename, path.dirname(file.path));
        thumbnail = processed.thumbnail;
        webp = processed.webp;
      }

      service.images.push({
        url: imageUrl,
        thumbnail,
        webp,
        publicId: (file as any).public_id,
      });
    }
  }

  // ✅ Silinecek görselleri işleme
  if (removedImages) {
    try {
      const removed = JSON.parse(removedImages);
      service.images = service.images.filter((img: any) => !removed.includes(img.url));

      for (const img of removed) {
        const localPath = path.join("uploads", "service-images", path.basename(img.url));
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
      }
    } catch (e) {
      console.warn("Invalid removedImages JSON:", e);
    }
  }

  await service.save();

  res.status(200).json({
    success: true,
    message: "Service updated successfully.",
    data: service,
  });
});



// ✅ Delete Service
export const deleteService = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ success: false, message: "Invalid service ID." });
      return;
    }

    const service = await Services.findById(id);
    if (!service) {
      res.status(404).json({ success: false, message: "Service not found." });
      return;
    }

    for (const img of service.images) {
      const localPath = path.join(
        "uploads",
        "service-images",
        path.basename(img.url)
      );
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      if (img.publicId) {
        try {
          await cloudinary.uploader.destroy(img.publicId);
        } catch (err) {
          console.error(`Cloudinary delete error for ${img.publicId}:`, err);
        }
      }
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  }
);
