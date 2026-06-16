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

export type CurrentMonthSaleSummary = {
  saleId: string;
  createdAt: string;
  total: number;
  productsCount: number;
  unitsSold: number;
};

export type CurrentMonthSalesReport = {
  year: number;
  month: number;
  periodStart: string;
  periodEnd: string;
  totalSales: number;
  orderCount: number;
  totalProductsSold: number;
  sales: CurrentMonthSaleSummary[];
};

export type CheckoutSaleApiResponse = {
  ok: boolean;
  message: string;
  sale: SaleResponse;
};
