import { expect, test } from '@playwright/test';

test.describe('Not found route', () => {
  test('keeps the 404 heading readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/definitely-missing-route');

    const panel = page.locator('.page-not-found');
    const title = page.locator('.page-not-found__title');

    await expect(panel).toBeVisible();
    await expect(title).toContainText('Page not found!');

    const layout = await page.evaluate(() => {
      const titleEl = document.querySelector(
        '.page-not-found__title',
      ) as HTMLElement | null;

      if (!titleEl) {
        return null;
      }

      const rect = titleEl.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });

    expect(layout).not.toBeNull();
    expect(layout!.width).toBeGreaterThanOrEqual(180);
    expect(layout!.height).toBeLessThanOrEqual(180);

    await expect(
      page.getByRole('link', { name: 'BACK TO CONSOLE' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'OPEN CURRICULUM' }),
    ).toBeVisible();
  });
});
