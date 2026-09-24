const normalizePhone = (value = "") => String(value).replace(/\D/g, "");

const isValidSriLankanPhone = (value = "") => {
  const phone = normalizePhone(value);
  return /^0\d{9}$/.test(phone);
};

module.exports = { normalizePhone, isValidSriLankanPhone };
