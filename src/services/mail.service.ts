import nodemailer, { type Transporter } from "nodemailer";

type MailEnvironment = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
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
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM;

  if (!host) {
    throw new Error("SMTP_HOST no está definida");
  }

  if (!process.env.SMTP_PORT || Number.isNaN(port)) {
    throw new Error("SMTP_PORT no es válida");
  }

  if (!user) {
    throw new Error("SMTP_USER no está definida");
  }

  if (!pass) {
    throw new Error("SMTP_PASS no está definida");
  }

  if (!from) {
    throw new Error("MAIL_FROM no está definida");
  }

  return {
    host,
    port,
    user,
    pass,
    from,
  };
}

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const { host, port, user, pass } = getMailEnvironment();

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  });

  return transporter;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailInput): Promise<void> {
  const { from } = getMailEnvironment();

  await getTransporter().sendMail({
    from,
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
