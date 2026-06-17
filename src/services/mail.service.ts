import nodemailer, { type Transporter } from "nodemailer";

import type { CurrentMonthSalesReport } from "@/types/sale";

type MailEnvironment = {
  gmailUser: string;
  gmailAppPassword: string;
};

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type WelcomeEmailInput = {
  to: string;
  name: string;
};

let transporter: Transporter | null = null;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getMailEnvironment(): MailEnvironment {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser) {
    throw new Error("GMAIL_USER no está definida");
  }

  if (!gmailAppPassword) {
    throw new Error("GMAIL_APP_PASSWORD no está definida");
  }

  return {
    gmailUser,
    gmailAppPassword,
  };
}

function getSalesReportEmail(): string {
  const salesReportEmail = process.env.SALES_REPORT_EMAIL;

  if (!salesReportEmail) {
    throw new Error("SALES_REPORT_EMAIL no está definida");
  }

  return salesReportEmail;
}

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const { gmailUser, gmailAppPassword } = getMailEnvironment();

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return transporter;
}

function formatMonthYear(report: CurrentMonthSalesReport): string {
  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(report.year, report.month - 1, 1)));
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatReportDate(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailInput): Promise<void> {
  const { gmailUser } = getMailEnvironment();

  await getTransporter().sendMail({
    from: `Beauty Store <${gmailUser}>`,
    to,
    subject,
    html,
    text,
  });
}

export async function sendWelcomeEmail({
  to,
  name,
}: WelcomeEmailInput): Promise<void> {
  const normalizedName = name.trim() || "cliente";
  const escapedName = escapeHtml(normalizedName);
  const subject = "Bienvenido a nuestra tienda";
  const text = `Hola ${normalizedName}, tu cuenta fue creada correctamente. Gracias por registrarte en nuestra tienda.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h1 style="margin-bottom: 16px;">Bienvenido a nuestra tienda</h1>
      <p>Hola ${escapedName},</p>
      <p>Tu cuenta fue creada correctamente y ya puedes iniciar sesion para explorar productos y comprar.</p>
      <p>Gracias por registrarte con nosotros.</p>
    </div>
  `;

  await sendEmail({
    to,
    subject,
    html,
    text,
  });
}

export async function sendCurrentMonthSalesReportEmail(
  report: CurrentMonthSalesReport
): Promise<void> {
  const to = getSalesReportEmail();
  const monthLabel = formatMonthYear(report);
  const subject = `Reporte diario de ventas - ${monthLabel}`;
  const summaryLines = [
    `Periodo: ${monthLabel}`,
    `Total de ventas: ${formatAmount(report.totalSales)}`,
    `Cantidad de órdenes: ${report.orderCount}`,
    `Cantidad total de productos vendidos: ${report.totalProductsSold}`,
  ];
  const salesLines =
    report.sales.length > 0
      ? report.sales.map(
          (sale, index) =>
            `${index + 1}. ${formatReportDate(sale.createdAt)} | Venta ${sale.saleId} | Total ${formatAmount(sale.total)} | Productos ${sale.productsCount} | Unidades ${sale.unitsSold}`
        )
      : ["No se registraron ventas en el mes actual."];
  const text = [...summaryLines, "", "Resumen de ventas:", ...salesLines].join(
    "\n"
  );
  const htmlSales =
    report.sales.length > 0
      ? report.sales
          .map(
            (sale) => `
              <li>
                <strong>${escapeHtml(formatReportDate(sale.createdAt))}</strong>
                <span> | Venta ${escapeHtml(sale.saleId)} | Total ${escapeHtml(formatAmount(sale.total))} | Productos ${sale.productsCount} | Unidades ${sale.unitsSold}</span>
              </li>
            `
          )
          .join("")
      : "<li>No se registraron ventas en el mes actual.</li>";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h1 style="margin-bottom: 16px;">Reporte diario de ventas</h1>
      <p><strong>Periodo:</strong> ${escapeHtml(monthLabel)}</p>
      <p><strong>Total de ventas:</strong> ${escapeHtml(formatAmount(report.totalSales))}</p>
      <p><strong>Cantidad de órdenes:</strong> ${report.orderCount}</p>
      <p><strong>Cantidad total de productos vendidos:</strong> ${report.totalProductsSold}</p>
      <h2 style="margin-top: 24px; margin-bottom: 12px;">Resumen de ventas</h2>
      <ul style="padding-left: 20px;">
        ${htmlSales}
      </ul>
    </div>
  `;

  await sendEmail({
    to,
    subject,
    html,
    text,
  });
}
