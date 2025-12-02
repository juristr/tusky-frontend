export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  image?: string;
  category?: string;
  originalPrice?: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json() as Promise<Product[]>;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json() as Promise<Product>;
}

