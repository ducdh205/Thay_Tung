/** Dotted paths of every string that still holds a `[bracketed]` placeholder, e.g. "Em – [Tên của bạn]". */
export function findPlaceholders(obj: unknown, skipKeys: string[] = ['code', 's5', 's7'], path = ''): string[] {
  if (typeof obj === 'string') return /\[[^\]'"]*\p{L}[^\]'"]*\]/u.test(obj) ? [path] : [];
  if (Array.isArray(obj)) return obj.flatMap((v, i) => findPlaceholders(v, skipKeys, path ? `${path}.${i}` : String(i)));
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) =>
      skipKeys.includes(k) ? [] : findPlaceholders(v, skipKeys, path ? `${path}.${k}` : k),
    );
  }
  return [];
}
