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

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 249.99,
    imageUrl: 'https://picsum.photos/seed/headphones/400/400',
    rating: 4.5,
    category: 'Electronics',
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 199.99,
    imageUrl: 'https://picsum.photos/seed/watch/400/400',
    rating: 4.2,
    category: 'Electronics',
  },
  {
    id: 3,
    name: 'Leather Crossbody Bag',
    description: 'Stylish leather crossbody bag for everyday use',
    price: 79.99,
    imageUrl: 'https://picsum.photos/seed/bag/400/400',
    rating: 4.8,
    category: 'Accessories',
  },
  {
    id: 4,
    name: 'Running Shoes',
    description: 'Lightweight running shoes for performance',
    price: 129.99,
    imageUrl: 'https://picsum.photos/seed/shoes/400/400',
    rating: 4.6,
    category: 'Footwear',
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    description: 'Portable bluetooth speaker with rich sound',
    price: 89.99,
    imageUrl: 'https://picsum.photos/seed/speaker/400/400',
    rating: 4.3,
    category: 'Electronics',
  },
  {
    id: 6,
    name: 'Sunglasses',
    description: 'UV-protected sunglasses with polarized lenses',
    price: 59.99,
    imageUrl: 'https://picsum.photos/seed/sunglasses/400/400',
    rating: 4.1,
    category: 'Accessories',
  },
  {
    id: 7,
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment',
    price: 69.99,
    imageUrl: 'https://picsum.photos/seed/backpack/400/400',
    rating: 4.4,
    category: 'Accessories',
  },
  {
    id: 8,
    name: 'Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitor',
    price: 149.99,
    imageUrl: 'https://picsum.photos/seed/tracker/400/400',
    rating: 4.7,
    category: 'Electronics',
  },
];
