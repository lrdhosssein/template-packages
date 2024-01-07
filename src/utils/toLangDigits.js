
export default function toLangDigits(text) {
  if (text === null || text === undefined) {
    return null;
  }
  const lang = localStorage.getItem("lang") || 'fa';
  const numbers = lang === 'fa' ? "۰۱۲۳۴۵۶۷۸۹" : lang === 'ar' ? "٠١٢٣٤٥٦٧٨٩" : "0123456789";
  return ("" + text).replace(/[0-9]/g, function (t) {
    return numbers.slice(+t, +t + 1);
  });
}
