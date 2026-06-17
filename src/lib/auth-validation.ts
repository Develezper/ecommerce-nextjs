export const MIN_NAME_LENGTH = 2;
export const MIN_PASSWORD_LENGTH = 6;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeName(name: string) {
  return name.trim();
}

export function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

export function isValidEmail(email: string) {
  return EMAIL_REGEX.test(normalizeEmail(email));
}
