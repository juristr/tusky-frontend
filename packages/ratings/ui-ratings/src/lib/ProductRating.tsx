import { useState, useEffect } from 'react';
import { Rating } from '@juristr/tusky-design';
import {
  getProductRating,
  ProductRating as ProductRatingData,
} from '@tusky/data-access-ratings';

interface ProductRatingProps {
  productId: string | number;
  className?: string;
}

export function ProductRating({ productId, className }: ProductRatingProps) {
  const [rating, setRating] = useState<ProductRatingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id =
      typeof productId === 'string' ? parseInt(productId, 10) : productId;
    getProductRating(id)
      .then((r) => setRating(r ?? null))
      .catch(() => setRating(null))
      .finally(() => setLoading(false));
  }, [productId]);

  // Skeleton while loading
  if (loading) {
    return (
      <div
        className={`h-5 w-32 bg-gray-200 rounded animate-pulse ${
          className ?? ''
        }`}
      />
    );
  }

  // Hide on error/not found
  if (!rating) return null;

  return (
    <Rating
      value={rating.averageRating}
      showCount
      count={rating.totalRatings}
      className={className}
    />
  );
}

export default ProductRating;
