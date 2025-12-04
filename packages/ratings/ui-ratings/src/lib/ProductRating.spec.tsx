import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { getProductRating } from '@tusky/data-access-ratings';
import { ProductRating } from './ProductRating';

vi.mock('@tusky/data-access-ratings', () => ({
  getProductRating: vi.fn(),
}));

const mockGetProductRating = vi.mocked(getProductRating);

describe('ProductRating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should show skeleton while loading', () => {
      mockGetProductRating.mockImplementation(
        () => new Promise<undefined>(() => {})
      );

      const { container } = render(<ProductRating productId={1} />);

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeTruthy();
    });

    it('should apply className to skeleton', () => {
      mockGetProductRating.mockImplementation(
        () => new Promise<undefined>(() => {})
      );

      const { container } = render(
        <ProductRating productId={1} className="mt-2" />
      );

      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton?.className).toContain('mt-2');
    });
  });

  describe('Success state', () => {
    it('should render rating after successful fetch', async () => {
      mockGetProductRating.mockResolvedValueOnce({
        productId: 1,
        averageRating: 4.5,
        totalRatings: 128,
      });

      render(<ProductRating productId={1} />);

      await waitFor(() => {
        // Rating component renders text in span: "{value} ({count} reviews)"
        expect(screen.getByText(/128.*reviews/)).toBeTruthy();
      });
    });

    it('should display rating stars', async () => {
      mockGetProductRating.mockResolvedValueOnce({
        productId: 1,
        averageRating: 4.5,
        totalRatings: 100,
      });

      render(<ProductRating productId={1} />);

      await waitFor(() => {
        expect(screen.getByTestId('rating-stars')).toBeTruthy();
      });
    });

    it('should call API with correct product ID (number)', async () => {
      mockGetProductRating.mockResolvedValueOnce({
        productId: 42,
        averageRating: 3.5,
        totalRatings: 50,
      });

      render(<ProductRating productId={42} />);

      await waitFor(() => {
        expect(mockGetProductRating).toHaveBeenCalledWith(42);
      });
    });

    it('should parse string productId to number', async () => {
      mockGetProductRating.mockResolvedValueOnce({
        productId: 99,
        averageRating: 4.0,
        totalRatings: 75,
      });

      render(<ProductRating productId="99" />);

      await waitFor(() => {
        expect(mockGetProductRating).toHaveBeenCalledWith(99);
      });
    });
  });

  describe('Error state', () => {
    it('should render nothing when API returns undefined', async () => {
      mockGetProductRating.mockResolvedValueOnce(undefined);

      const { container } = render(<ProductRating productId={999} />);

      await waitFor(() => {
        const skeleton = container.querySelector('.animate-pulse');
        expect(skeleton).toBeFalsy();
      });

      expect(container.firstChild).toBeNull();
    });

    it('should render nothing when API throws error', async () => {
      mockGetProductRating.mockRejectedValueOnce(new Error('Network error'));

      const { container } = render(<ProductRating productId={1} />);

      await waitFor(() => {
        const skeleton = container.querySelector('.animate-pulse');
        expect(skeleton).toBeFalsy();
      });

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Re-fetch on productId change', () => {
    it('should fetch new rating when productId changes', async () => {
      mockGetProductRating
        .mockResolvedValueOnce({
          productId: 1,
          averageRating: 4.0,
          totalRatings: 100,
        })
        .mockResolvedValueOnce({
          productId: 2,
          averageRating: 5.0,
          totalRatings: 200,
        });

      const { rerender } = render(<ProductRating productId={1} />);

      await waitFor(() => {
        expect(screen.getByText(/100.*reviews/)).toBeTruthy();
      });

      rerender(<ProductRating productId={2} />);

      await waitFor(() => {
        expect(screen.getByText(/200.*reviews/)).toBeTruthy();
      });

      expect(mockGetProductRating).toHaveBeenCalledTimes(2);
      expect(mockGetProductRating).toHaveBeenNthCalledWith(1, 1);
      expect(mockGetProductRating).toHaveBeenNthCalledWith(2, 2);
    });
  });
});
