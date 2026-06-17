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
  const subject = "Bienvenido a Beauty Store";
  const text = [
    `Hola ${normalizedName},`,
    "",
    "Tu cuenta fue creada correctamente en Beauty Store.",
    "Ya puedes iniciar sesion y explorar nuestros productos.",
    "",
    "Explorar productos: /",
    "",
    "Gracias por confiar en Beauty Store.",
  ].join("\n");
  const html = `
    <div style="margin:0; padding:24px; background-color:#fff5f8; font-family:Arial, Helvetica, sans-serif; color:#4b244a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; border-collapse:collapse; background-color:#ffffff; border:1px solid #f9d7e3; border-radius:24px; overflow:hidden;">
              <tr>
                <td style="padding:40px 40px 24px; background:linear-gradient(180deg, #ffe3ed 0%, #fff8fb 100%); text-align:center;">
                  <p style="margin:0 0 12px; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#c75b7a; font-weight:700;">
                    Beauty Store
                  </p>
                  <h1 style="margin:0; font-size:32px; line-height:1.2; color:#9d174d;">
                    Bienvenido a Beauty Store
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px 40px;">
                  <p style="margin:0 0 16px; font-size:16px; line-height:1.7;">
                    Hola <strong>${escapedName}</strong>,
                  </p>
                  <p style="margin:0 0 16px; font-size:16px; line-height:1.7; color:#6b3c58;">
                    Tu cuenta fue creada correctamente y ya puedes descubrir productos pensados para realzar tu rutina de belleza.
                  </p>
                  <p style="margin:0 0 28px; font-size:16px; line-height:1.7; color:#6b3c58;">
                    Nos alegra tenerte con nosotros. Preparamos una experiencia suave, cercana y llena de detalles para ti.
                  </p>
                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 28px; border-collapse:collapse;">
                    <tr>
                      <td align="center" style="border-radius:999px; background-color:#ec4899;">
                        <a href="/" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:700; color:#ffffff; text-decoration:none;">
                          Explorar productos
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:0; font-size:15px; line-height:1.7; color:#6b3c58;">
                    Gracias por elegirnos y ser parte de Beauty Store.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 40px; text-align:center; background-color:#fff1f6; border-top:1px solid #f9d7e3;">
                  <p style="margin:0; font-size:13px; color:#9f5673;">
                    Beauty Store
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
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
