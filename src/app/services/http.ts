const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

export async function http<T>(
  input: RequestInfo,
  init?: RequestInit & { signal?: AbortSignal }
): Promise<T> {
  const res = await fetch(typeof input === 'string' ? `${BASE_URL}${input}` : input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}
