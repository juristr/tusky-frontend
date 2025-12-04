import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Rating } from '@juristr/tusky-design';
import {
  getProductRating,
  getAllProductRatings,
  ProductRating as ProductRatingData,
  IndividualRating,
} from '@tusky/data-access-ratings';

interface ProductRatingProps {
  productId: string | number;
  className?: string;
}

export function ProductRating({ productId, className }: ProductRatingProps) {
  const [rating, setRating] = useState<ProductRatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allRatings, setAllRatings] = useState<IndividualRating[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

  useEffect(() => {
    const id =
      typeof productId === 'string' ? parseInt(productId, 10) : productId;
    getProductRating(id)
      .then((r) => setRating(r ?? null))
      .catch(() => setRating(null))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleCountClick = () => {
    setDialogOpen(true);
    setLoadingRatings(true);
    const id =
      typeof productId === 'string' ? parseInt(productId, 10) : productId;
    getAllProductRatings(id)
      .then(setAllRatings)
      .catch(() => setAllRatings([]))
      .finally(() => setLoadingRatings(false));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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

  const dialog = dialogOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDialogOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">All Reviews</h2>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {loadingRatings ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : allRatings.length === 0 ? (
                <p className="text-gray-500 text-center">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {allRatings.map((r) => (
                    <div key={r.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <Rating value={r.stars} size="sm" />
                        <span className="text-sm text-gray-500">
                          {formatDate(r.createdAt)}
                        </span>
                      </div>
                      {r.comment && (
                        <p className="text-gray-700">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <Rating
        value={rating.averageRating}
        onCountClick={handleCountClick}
        showCount
        count={rating.totalRatings}
        className={className}
      />
      {dialog}
    </>
  );
}

export default ProductRating;
