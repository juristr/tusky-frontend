import { test, expect } from '@playwright/test';
import { setupApiMocks } from './fixtures/api-mocks';

test.beforeEach(async ({ page }) => {
  await setupApiMocks(page);
});

test.describe('Product Detail Page', () => {
  test('displays product details when navigating to /product/3', async ({
    page,
  }) => {
    await page.goto('/product/3');

    // Verify product detail container is visible
    const productDetail = page.getByTestId('product-detail');
    await expect(productDetail).toBeVisible();

    // Verify product name
    const productName = page.getByTestId('product-name');
    await expect(productName).toContainText('Leather Crossbody Bag');

    // Verify image loads
    const productImage = productDetail.locator('img').first();
    await expect(productImage).toBeVisible();

    // Verify price is displayed
    await expect(productDetail.locator('text=$79.99')).toBeVisible();

    // Verify rating stars are displayed
    await expect(productDetail.locator('svg').first()).toBeVisible();

    // Verify Add to Cart button
    await expect(
      productDetail.getByRole('button', { name: /Add to Cart/i })
    ).toBeVisible();

    // Verify In Stock status
    await expect(productDetail.locator('text=In Stock')).toBeVisible();
  });

  test('clicking product in grid navigates to detail page', async ({
    page,
  }) => {
    await page.goto('/');

    // Click on first product link
    const productGrid = page.getByTestId('product-grid');
    await productGrid.locator('a').first().click();

    // Verify navigation to product detail
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.getByTestId('product-detail')).toBeVisible();
  });

  test('shows error for invalid product ID', async ({ page }) => {
    await page.goto('/product/999');

    await expect(page.getByTestId('product-not-found')).toBeVisible();
    await expect(page.locator('text=Product Not Found')).toBeVisible();
  });

  test('displays product rating from API', async ({ page }) => {
    await page.goto('/product/3');

    const productDetail = page.getByTestId('product-detail');
    await expect(productDetail).toBeVisible();

    // Rating should load async and display value + count
    // Product 3 has averageRating: 4.8, totalRatings: 256
    // Rating component renders: "{value} ({count} reviews)"
    await expect(productDetail.locator('text=256 reviews')).toBeVisible();
  });

  test('shows skeleton while rating is loading', async ({ page }) => {
    // Delay the ratings API response to catch the skeleton
    await page.route('**/api/ratings/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          productId: 3,
          averageRating: 4.8,
          totalRatings: 256,
        }),
      });
    });

    await page.goto('/product/3');

    // Skeleton should appear briefly (has animate-pulse class)
    const skeleton = page.locator('.animate-pulse');
    await expect(skeleton).toBeVisible();

    // Then rating should appear
    await expect(page.locator('text=256 reviews')).toBeVisible();
  });

  test('hides rating when API returns 404', async ({ page }) => {
    // Override rating mock to return 404
    await page.route('**/api/ratings/*', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Rating not found' }),
      });
    });

    await page.goto('/product/3');

    const productDetail = page.getByTestId('product-detail');
    await expect(productDetail).toBeVisible();

    // Product name should be visible
    await expect(page.getByTestId('product-name')).toContainText(
      'Leather Crossbody Bag'
    );

    // Rating should NOT be visible (hidden on error)
    await expect(page.locator('text=reviews')).toBeHidden();
  });
});
