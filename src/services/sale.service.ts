import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Sale } from "@/models/Sale";
import { clearUserCart, getUserCart } from "@/services/cart.service";
import type { SaleResponse } from "@/types/sale";

function validateObjectId(id: string, fieldName: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido`);
  }
}

function serializeSale(sale: {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  products: Array<{
    productId: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}): SaleResponse {
  return {
    _id: sale._id.toString(),
    userId: sale.userId.toString(),
    products: sale.products.map((product) => ({
      productId: product.productId.toString(),
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      subtotal: product.subtotal,
    })),
    total: sale.total,
    createdAt: sale.createdAt.toISOString(),
    updatedAt: sale.updatedAt.toISOString(),
  };
}

export async function checkoutUserSale(userId: string): Promise<SaleResponse> {
  await connectDB();

  validateObjectId(userId, "Usuario");

  const cart = await getUserCart(userId);

  if (cart.products.length === 0) {
    throw new Error("El carrito está vacío");
  }

  const sale = await Sale.create({
    userId: new Types.ObjectId(userId),
    products: cart.products.map((product) => ({
      productId: new Types.ObjectId(product._id),
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      subtotal: product.subtotal,
    })),
    total: cart.total,
  });

  await clearUserCart(userId);

  return serializeSale({
    _id: sale._id,
    userId: sale.userId,
    products: sale.products,
    total: sale.total,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  });
}
