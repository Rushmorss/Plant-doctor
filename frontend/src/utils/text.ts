export function normalizeVietnamese(value: string): string {
  return value.
  normalize('NFD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/đ/g, 'd').
  replace(/Đ/g, 'D').
  toLowerCase().
  trim();
}

export function matchesQuery(query: string, ...fields: string[]): boolean {
  const q = normalizeVietnamese(query);
  if (!q) return true;
  return fields.some((field) => normalizeVietnamese(field).includes(q));
}