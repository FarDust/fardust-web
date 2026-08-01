import { expect, test } from '@playwright/test';

test.describe('Page titles', () => {
  test('home page has the correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('G. Faundez — ML Engineer');
  });

  test('experience page has the correct title', async ({ page }) => {
    await page.goto('/experience');
    await expect(page).toHaveTitle('Experience — G. Faundez');
  });

  test('embedding space page has the correct title', async ({ page }) => {
    await page.goto('/embedding-space');
    await expect(page).toHaveTitle('Embedding Space — G. Faundez');
  });

  test('pretext lab page has the correct title', async ({ page }) => {
    await page.goto('/pretext');
    await expect(page).toHaveTitle('Pretext Lab — G. Faundez');
  });

  test('legacy /ball route redirects to /embedding-space', async ({ page }) => {
    await page.goto('/ball');
    await expect(page).toHaveURL(/\/embedding-space/);
    await expect(page).toHaveTitle('Embedding Space — G. Faundez');
  });

  test('404 page has the correct title', async ({ page }) => {
    await page.goto('/nonexistent-route');
    await expect(page).toHaveTitle('Not Found — G. Faundez');
  });
});
