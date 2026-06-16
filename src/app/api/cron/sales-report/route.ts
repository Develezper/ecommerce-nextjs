import { NextRequest, NextResponse } from "next/server";

import { sendCurrentMonthSalesReportEmail } from "@/services/mail.service";
import { getCurrentMonthSalesReport } from "@/services/sale.service";

export const runtime = "nodejs";

function getCronSecret(): string {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    throw new Error("CRON_SECRET no está definida");
  }

  return cronSecret;
}

function getRequestSecret(request: NextRequest): string | null {
  const headerSecret = request.headers.get("x-cron-secret");

  if (headerSecret) {
    return headerSecret;
  }

  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return request.nextUrl.searchParams.get("secret");
}

export async function GET(request: NextRequest) {
  try {
    const requestSecret = getRequestSecret(request);

    if (!requestSecret || requestSecret !== getCronSecret()) {
      return NextResponse.json(
        {
          ok: false,
          message: "No autorizado",
        },
        { status: 401 }
      );
    }

    const report = await getCurrentMonthSalesReport();

    await sendCurrentMonthSalesReportEmail(report);

    return NextResponse.json({
      ok: true,
      message: "Reporte de ventas enviado correctamente",
      report: {
        year: report.year,
        month: report.month,
        totalSales: report.totalSales,
        orderCount: report.orderCount,
        totalProductsSold: report.totalProductsSold,
        salesCount: report.sales.length,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al generar el reporte de ventas";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: 500 }
    );
  }
}
