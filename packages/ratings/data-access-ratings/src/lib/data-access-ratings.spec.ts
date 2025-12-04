import { getProductRating } from './data-access-ratings.js';

describe('getProductRating', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch and return rating', async () => {
    const mockRating = {
      productId: 1,
      averageRating: 4.5,
      totalRatings: 100,
    };
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockRating),
    } as Response);

    const result = await getProductRating(1);
    expect(result).toEqual(mockRating);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/ratings/1');
  });

  it('should return undefined on 404', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const result = await getProductRating(999);
    expect(result).toBeUndefined();
  });

  it('should throw on error', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(getProductRating(1)).rejects.toThrow('Failed to fetch rating');
  });
});
