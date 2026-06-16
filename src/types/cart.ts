export type CartProduct = {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  subtotal: number;
};

export type CartResponse = {
  products: CartProduct[];
  total: number;
};

export type CartApiResponse = CartResponse & {
  ok: boolean;
  message?: string;
};
