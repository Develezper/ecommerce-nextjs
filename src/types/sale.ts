export type SaleProductSnapshot = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type SaleResponse = {
  _id: string;
  userId: string;
  products: SaleProductSnapshot[];
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type CheckoutSaleApiResponse = {
  ok: boolean;
  message: string;
  sale: SaleResponse;
};
