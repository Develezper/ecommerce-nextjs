import { Schema, models, model, Types } from "mongoose";

export type FavoriteDocument = {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
};

const favoriteSchema = new Schema<FavoriteDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "favorites",
  }
);

favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Favorite =
  models.Favorite || model<FavoriteDocument>("Favorite", favoriteSchema);