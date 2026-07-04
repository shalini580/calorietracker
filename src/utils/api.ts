export const API_BASE = import.meta.env.VITE_API_BASE ?? '';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getFoods() {
  return request('/api/foods');
}

export async function addFood(payload: { name: string; calories: number }) {
  return request('/api/foods', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
