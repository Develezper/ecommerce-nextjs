import { Schema, models, model, Types } from "mongoose";

export type CartProduct = {
  productId: Types.ObjectId;
  quantity: number;
};

export type CartDocument = {
  userId: Types.ObjectId;
  products: CartProduct[];
};

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "cart",
  }
);

export const Cart = models.Cart || model<CartDocument>("Cart", cartSchema);