export type ProductListItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
};

export type ProductDetail = ProductListItem & {
  description: string;
  specifications: string[];
  stock: number;
};

export type CreateProductInput = {
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  description: string;
  specifications: string[];
  stock: number;
};