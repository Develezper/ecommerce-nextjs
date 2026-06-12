import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export type CreateProductInput = {
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  specifications: string[];
  stock: number;
};

export async function getProducts() {
  await connectDB();

  const products = await Product.find().sort({ createdAt: -1 }).lean();

  return JSON.parse(JSON.stringify(products));
}

export async function getProductById(id: string) {
  await connectDB();

  const product = await Product.findById(id).lean();

  return JSON.parse(JSON.stringify(product));
}

export async function createProduct(data: CreateProductInput) {
  await connectDB();

  const product = await Product.create(data);

  return JSON.parse(JSON.stringify(product));
}