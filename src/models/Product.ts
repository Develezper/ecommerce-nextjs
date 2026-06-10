import { Schema, models, model } from "mongoose";

export type ProductDocument = {
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  specifications: string[];
  stock: number;
};

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    specifications: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {
    timestamps: true,
    collection: "products",
  },
);

export const Product = 
  models.Product || model<ProductDocument>("Product", productSchema);
