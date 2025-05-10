import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IServiceImage {
  url: string;
  thumbnail?: string;
  webp?: string;
  publicId?: string;
}

export interface IService extends Document {
  title: { tr: string; en: string; de: string };
  slug: string;
  shortDescription: { tr: string; en: string; de: string };
  detailedDescription: { tr: string; en: string; de: string };
  price?: number;
  durationMinutes?: number;
  images: IServiceImage[];
  category: { tr: string; en: string; de: string; slug: string };
  tags?: string[];
  isActive: boolean;
  isPublished: boolean;
}

const imageSchema = new Schema<IServiceImage>(
  {
    url: { type: String, required: true },
    thumbnail: { type: String },  // 💥 Thumbnail path (local veya cloud)
    webp: { type: String },       // 💥 WebP path (local veya cloud)
    publicId: { type: String },   // 💥 Cloudinary için public ID
  },
  { _id: false }
);

const serviceSchema = new Schema<IService>(
  {
    title: {
      tr: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
      de: { type: String, required: true, trim: true },
    },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    shortDescription: {
      tr: { type: String, required: true, maxlength: 300, trim: true },
      en: { type: String, required: true, maxlength: 300, trim: true },
      de: { type: String, required: true, maxlength: 300, trim: true },
    },
    detailedDescription: {
      tr: { type: String, required: true },
      en: { type: String, required: true },
      de: { type: String, required: true },
    },
    price: { type: Number, min: 0 },
    durationMinutes: { type: Number, default: 60, min: 1 },
    images: { type: [imageSchema], default: [] },
    category: {
      tr: { type: String, required: true },
      en: { type: String, required: true },
      de: { type: String, required: true },
      slug: { type: String, required: true, lowercase: true, trim: true },
    },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Slug middleware
serviceSchema.pre("validate", function (next) {
  const baseTitle = this.title?.en || this.title?.de || this.title?.tr || "service";
  if (!this.slug && baseTitle) {
    this.slug = baseTitle
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

// ✅ Guardlı model tanımı
const Service: Model<IService> = models.Service || model<IService>("Service", serviceSchema);

export default Service;
export { Service };
