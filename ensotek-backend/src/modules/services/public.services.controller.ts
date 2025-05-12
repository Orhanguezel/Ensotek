import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Services } from ".";
import { isValidObjectId } from "@/core/utils/validation";

// ✅ Get All Services (public)
export const getAllServices = asyncHandler(async (req: Request, res: Response) => {
  const { category, language } = req.query;
  const filter: any = { isActive: true, isPublished: true };

  if (category && isValidObjectId(category.toString())) {
    filter.category = category;
  }

  if (language) {
    filter[`title.${language}`] = { $exists: true, $ne: "" };
  }

  const serviceList = await Services.find(filter)
    .populate("comments")
    .populate("category", "title")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Service list fetched successfully.",
    data: serviceList,
  });
});

// ✅ Get Service by ID (public)
export const getServiceById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { language } = req.query;

  if (!isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid service ID." });
    return;
  }

  const filter: any = { _id: id, isActive: true, isPublished: true };

  if (language) {
    filter[`title.${language}`] = { $exists: true, $ne: "" };
  }

  const service = await Services.findOne(filter)
    .populate("comments")
    .populate("category", "title")
    .lean();

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

// ✅ Get Service by Slug (public)
export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { language } = req.query;

  const filter: any = { slug, isActive: true, isPublished: true };

  if (language) {
    filter[`title.${language}`] = { $exists: true, $ne: "" };
  }

  const service = await Services.findOne(filter)
    .populate("comments")
    .populate("category", "title")
    .lean();

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
