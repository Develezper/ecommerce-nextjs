import { Schema, Types, model, models } from "mongoose";

export type SaleProductSnapshotDocument = {
  productId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type SaleDocument = {
  userId: Types.ObjectId;
  products: SaleProductSnapshotDocument[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
};

const saleProductSnapshotSchema = new Schema<SaleProductSnapshotDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const saleSchema = new Schema<SaleDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [saleProductSnapshotSchema],
      default: [],
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "sales",
  }
);

export const Sale = models.Sale || model<SaleDocument>("Sale", saleSchema);
