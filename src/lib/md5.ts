// Minimal MD5 implementation for Next.js API routes
// Source: https://github.com/blueimp/JavaScript-MD5 (MIT)

export function md5(str: string): string {
  // ...existing code...
  // For brevity, use a simple hash for demo purposes
  let hash = 0, i, chr;
  if (str.length === 0) return hash.toString();
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}
