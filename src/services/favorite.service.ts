import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Favorite } from "@/models/Favorite";
import type { ProductListItem } from "@/types/product";

function validateObjectId(id: string, fieldName: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido`);
  }
}

export async function getFavoriteProducts(
  userId: string
): Promise<ProductListItem[]> {
  await connectDB();

  validateObjectId(userId, "Usuario");

  const products = await Favorite.aggregate<ProductListItem>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $replaceRoot: {
        newRoot: "$product",
      },
    },
    {
      $project: {
        _id: {
          $toString: "$_id",
        },
        name: 1,
        price: 1,
        image: 1,
        shortDescription: 1,
      },
    },
  ]);

  return products;
}

export async function getFavoriteProductIds(userId: string): Promise<string[]> {
  await connectDB();

  validateObjectId(userId, "Usuario");

  const favorites = await Favorite.find(
    { userId },
    { productId: 1, _id: 0 }
  ).lean();

  return favorites.map((favorite) => favorite.productId.toString());
}

export async function toggleFavorite(userId: string, productId: string) {
  await connectDB();

  validateObjectId(userId, "Usuario");
  validateObjectId(productId, "Producto");

  const favorite = await Favorite.findOne({
    userId,
    productId,
  });

  if (favorite) {
    await favorite.deleteOne();

    return {
      productId,
      isFavorite: false,
    };
  }

  await Favorite.create({
    userId,
    productId,
  });

  return {
    productId,
    isFavorite: true,
  };
}
