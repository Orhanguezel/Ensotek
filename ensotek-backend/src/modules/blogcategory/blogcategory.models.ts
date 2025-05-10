import mongoose, { Schema, model, models, Document, Model } from "mongoose";

export interface IBlogCategory extends Document {
  name: {
    tr: string;
    en: string;
    de: string;
  };
  slug: string;
  description?: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: {
      tr: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
      de: { type: String, required: true, trim: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

blogCategorySchema.pre("validate", function (next) {
  const base = this.name?.en || this.name?.tr || this.name?.de || "category";
  if (!this.slug && base) {
    this.slug = base
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});


const BlogCategory: Model<IBlogCategory> =
  models.BlogCategory || model<IBlogCategory>("BlogCategory", blogCategorySchema);

export default BlogCategory;
export { BlogCategory };
