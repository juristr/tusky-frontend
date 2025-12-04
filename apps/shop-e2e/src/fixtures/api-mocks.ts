import { Page } from '@playwright/test';
import { mockProducts } from './products';
import { mockRatings } from './ratings';

export async function setupApiMocks(page: Page) {
  // Mock GET /api/products
  await page.route('**/api/products', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockProducts),
      });
    } else {
      await route.continue();
    }
  });

  // Mock GET /api/products/:id
  await page.route('**/api/products/*', async (route) => {
    const url = route.request().url();
    const match = url.match(/\/api\/products\/(\d+)/);

    if (match && route.request().method() === 'GET') {
      const id = parseInt(match[1], 10);
      const product = mockProducts.find((p) => p.id === id);

      if (product) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(product),
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Product not found' }),
        });
      }
    } else {
      await route.continue();
    }
  });

  // Mock GET /api/ratings/:productId
  await page.route('**/api/ratings/*', async (route) => {
    const url = route.request().url();
    const match = url.match(/\/api\/ratings\/(\d+)/);

    if (match && route.request().method() === 'GET') {
      const productId = parseInt(match[1], 10);
      const rating = mockRatings.find((r) => r.productId === productId);

      if (rating) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(rating),
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Rating not found' }),
        });
      }
    } else {
      await route.continue();
    }
  });
}
