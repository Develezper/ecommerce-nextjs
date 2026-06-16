import { Types } from "mongoose";

import { connectDB } from "@/lib/mongodb";
import { Sale } from "@/models/Sale";
import { clearUserCart, getUserCart } from "@/services/cart.service";
import type {
  CurrentMonthSalesReport,
  SaleResponse,
} from "@/types/sale";

type MonthlySalesSummaryAggregation = {
  totalSales: number;
  orderCount: number;
  totalProductsSold: number;
};

type MonthlySaleSummaryAggregation = {
  _id: Types.ObjectId;
  createdAt: Date;
  total: number;
  productsCount: number;
  unitsSold: number;
};

type MonthlySalesReportAggregation = {
  summary: MonthlySalesSummaryAggregation[];
  sales: MonthlySaleSummaryAggregation[];
};

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

function getCurrentMonthRange(referenceDate = new Date()) {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));

  return {
    year,
    month: month + 1,
    start,
    end,
  };
}

export async function getCurrentMonthSalesReport(): Promise<CurrentMonthSalesReport> {
  await connectDB();

  const { year, month, start, end } = getCurrentMonthRange();

  const [report] = await Sale.aggregate<MonthlySalesReportAggregation>([
    {
      $match: {
        createdAt: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $facet: {
        summary: [
          {
            $project: {
              total: 1,
              totalProductsInSale: {
                $sum: "$products.quantity",
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: {
                $sum: "$total",
              },
              orderCount: {
                $sum: 1,
              },
              totalProductsSold: {
                $sum: "$totalProductsInSale",
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalSales: 1,
              orderCount: 1,
              totalProductsSold: 1,
            },
          },
        ],
        sales: [
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: 1,
              createdAt: 1,
              total: 1,
              productsCount: {
                $size: "$products",
              },
              unitsSold: {
                $sum: "$products.quantity",
              },
            },
          },
        ],
      },
    },
  ]);

  const summary = report?.summary[0];

  return {
    year,
    month,
    periodStart: start.toISOString(),
    periodEnd: end.toISOString(),
    totalSales: summary?.totalSales ?? 0,
    orderCount: summary?.orderCount ?? 0,
    totalProductsSold: summary?.totalProductsSold ?? 0,
    sales:
      report?.sales.map((sale) => ({
        saleId: sale._id.toString(),
        createdAt: sale.createdAt.toISOString(),
        total: sale.total,
        productsCount: sale.productsCount,
        unitsSold: sale.unitsSold,
      })) ?? [],
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
