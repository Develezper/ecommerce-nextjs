import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import type {
  CreateProductInput,
  ProductDetail,
  ProductListItem,
} from "@/types/product";

export async function getProducts(): Promise<ProductListItem[]> {
  await connectDB();

  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  await connectDB();

  const product = await Product.findById(id).lean();

  return JSON.parse(JSON.stringify(product));
}

export async function createProduct(data: CreateProductInput) {
  await connectDB();

  const product = await Product.create(data);

  return JSON.parse(JSON.stringify(product));
}
