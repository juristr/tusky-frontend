export interface ProductRating {
  productId: number;
  averageRating: number;
  totalRatings: number;
}

export const mockRatings: ProductRating[] = [
  { productId: 1, averageRating: 4.5, totalRatings: 128 },
  { productId: 2, averageRating: 4.2, totalRatings: 89 },
  { productId: 3, averageRating: 4.8, totalRatings: 256 },
  { productId: 4, averageRating: 4.6, totalRatings: 167 },
  { productId: 5, averageRating: 4.3, totalRatings: 94 },
  { productId: 6, averageRating: 4.1, totalRatings: 52 },
  { productId: 7, averageRating: 4.4, totalRatings: 143 },
  { productId: 8, averageRating: 4.7, totalRatings: 201 },
];
