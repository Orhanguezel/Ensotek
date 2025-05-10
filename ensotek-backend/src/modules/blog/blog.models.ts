import mongoose, { Schema, model, models, Document, Types, Model } from "mongoose";

export interface IBlogImage {
  url: string;
  thumbnail?: string;
  webp?: string;
  publicId?: string;
}

export interface IBlog extends Document {
  title: {
    tr?: string;
    en?: string;
    de?: string;
  };
  slug: string;
  content: {
    tr?: string;
    en?: string;
    de?: string;
  };
  summary: {
    tr?: string;
    en?: string;
    de?: string;
  };
  images: IBlogImage[];
  tags: string[];
  author: string;
  category?: Types.ObjectId;
  isPublished: boolean;
  publishedAt?: Date;
  isActive: boolean;
  comments: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      tr: { type: String, trim: true },
      en: { type: String, trim: true },
      de: { type: String, trim: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: {
      tr: { type: String, maxlength: 300 },
      en: { type: String, maxlength: 300 },
      de: { type: String, maxlength: 300 },
    },
    content: {
      tr: { type: String },
      en: { type: String },
      de: { type: String },
    },
    images: [
      {
        url: { type: String, required: true },
        thumbnail: String,
        webp: String,
        publicId: String,
      },
    ],
    tags: [{ type: String }],
    author: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    isActive: { type: Boolean, default: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

// 🔁 Automatic slug generation
blogSchema.pre("validate", function (next) {
  const baseTitle = this.title?.en || this.title?.de || this.title?.tr || "blog";
  if (!this.slug && baseTitle) {
    this.slug = baseTitle
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// ✅ Guard + Model Type
const Blog: Model<IBlog> = models.Blog || model<IBlog>("Blog", blogSchema);

export default Blog;
export { Blog };
