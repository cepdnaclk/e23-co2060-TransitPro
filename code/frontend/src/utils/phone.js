export const normalizePhone = (value = "") => String(value).replace(/\D/g, "").slice(0, 10);

export const formatPhone = (value = "") => {
  const digits = normalizePhone(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
};

export const isValidPhone = (value = "") => /^0\d{9}$/.test(normalizePhone(value));
