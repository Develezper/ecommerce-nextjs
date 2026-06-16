import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";

export type CartItemResponse = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  subtotal: number;
};

export type CartResponse = {
  products: CartItemResponse[];
  total: number;
};

type AggregatedCartItem = CartItemResponse;

function validateObjectId(id: string, fieldName: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido`);
  }
}

async function ensureProductExists(productId: Types.ObjectId) {
  const productExists = await Product.exists({ _id: productId });

  if (!productExists) {
    throw new Error("Producto no encontrado");
  }
}

export async function getUserCart(userId: string): Promise<CartResponse> {
  await connectDB();

  validateObjectId(userId, "Usuario");

  const userObjectId = new Types.ObjectId(userId);

  const products = await Cart.aggregate<AggregatedCartItem>([
    {
      $match: {
        userId: userObjectId,
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: {
          $toString: "$product._id",
        },
        name: "$product.name",
        price: "$product.price",
        image: "$product.image",
        quantity: "$products.quantity",
        subtotal: {
          $multiply: ["$product.price", "$products.quantity"],
        },
      },
    },
  ]);

  const total = products.reduce((sum, product) => sum + product.subtotal, 0);

  return {
    products,
    total,
  };
}

export async function addProductToCart(
  userId: string,
  productId: string
): Promise<CartResponse> {
  await connectDB();

  validateObjectId(userId, "Usuario");
  validateObjectId(productId, "Producto");

  const userObjectId = new Types.ObjectId(userId);
  const productObjectId = new Types.ObjectId(productId);

  await ensureProductExists(productObjectId);

  const existingProduct = await Cart.exists({
    userId: userObjectId,
    "products.productId": productObjectId,
  });

  if (existingProduct) {
    await Cart.updateOne(
      {
        userId: userObjectId,
        "products.productId": productObjectId,
      },
      {
        $inc: {
          "products.$.quantity": 1,
        },
      }
    );
  } else {
    await Cart.updateOne(
      {
        userId: userObjectId,
      },
      {
        $setOnInsert: {
          userId: userObjectId,
        },
        $push: {
          products: {
            productId: productObjectId,
            quantity: 1,
          },
        },
      },
      {
        upsert: true,
      }
    );
  }

  return getUserCart(userId);
}

export async function updateCartProductQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartResponse> {
  await connectDB();

  validateObjectId(userId, "Usuario");
  validateObjectId(productId, "Producto");

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("La cantidad debe ser mayor a 0");
  }

  const result = await Cart.updateOne(
    {
      userId: new Types.ObjectId(userId),
      "products.productId": new Types.ObjectId(productId),
    },
    {
      $set: {
        "products.$.quantity": quantity,
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Producto no encontrado en el carrito");
  }

  return getUserCart(userId);
}

export async function removeProductFromCart(
  userId: string,
  productId: string
): Promise<CartResponse> {
  await connectDB();

  validateObjectId(userId, "Usuario");
  validateObjectId(productId, "Producto");

  const result = await Cart.updateOne(
    {
      userId: new Types.ObjectId(userId),
    },
    {
      $pull: {
        products: {
          productId: new Types.ObjectId(productId),
        },
      },
    }
  );

  if (result.modifiedCount === 0) {
    throw new Error("Producto no encontrado en el carrito");
  }

  return getUserCart(userId);
}

export async function clearUserCart(userId: string): Promise<CartResponse> {
  await connectDB();

  validateObjectId(userId, "Usuario");

  await Cart.updateOne(
    {
      userId: new Types.ObjectId(userId),
    },
    {
      $set: {
        products: [],
      },
    }
  );

  return {
    products: [],
    total: 0,
  };
}
