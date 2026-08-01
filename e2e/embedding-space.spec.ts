import { expect, type Page, test } from '@playwright/test';

async function detectRenderingPath(page: Page) {
  const fallback = page.locator('.embedding-fallback');
  const hud = page.locator('.embedding-hud');

  await Promise.race([
    fallback.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
    hud.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null),
  ]);

  return {
    fallback,
    hud,
    isFallback: await fallback.isVisible().catch(() => false),
  };
}

test.describe('Embedding space', () => {
  test('renders the page without errors', async ({ page }) => {
    await page.goto('/embedding-space');

    // Wait for either the HUD (WebGL works) or the fallback (WebGL unavailable).
    const heading = page.getByRole('heading', { name: 'Embedding space' });
    const fallbackHeading = page.getByRole('heading', {
      name: 'Embedding Space',
    });

    const hudVisible = await heading.isVisible().catch(() => false);
    const fallbackVisible = await fallbackHeading
      .isVisible()
      .catch(() => false);

    expect(hudVisible || fallbackVisible).toBe(true);
  });

  test('shows the WebGL fallback or HUD cluster legend', async ({ page }) => {
    await page.goto('/embedding-space');

    // Detect which UI actually rendered rather than probing WebGL support,
    // because headless browsers may report WebGL as available yet Three.js
    // still fails to create a usable context.
    const { hud, isFallback } = await detectRenderingPath(page);

    if (!isFallback) {
      await expect(hud).toBeVisible({ timeout: 5000 });
      await expect(page.locator('.embedding-hud__legend')).toBeVisible();
    } else {
      await expect(
        page.getByText('does not provide a usable WebGL context'),
      ).toBeVisible();
      await expect(page.getByText('Back home')).toBeVisible();
    }
  });

  test('try-it-out button toggles API panel when WebGL is available', async ({
    page,
  }) => {
    await page.goto('/embedding-space');

    const { isFallback } = await detectRenderingPath(page);

    if (isFallback) {
      return;
    }

    const tryBtn = page.locator('.embedding-hud__try-btn');
    await expect(tryBtn).toBeVisible({ timeout: 5000 });
    await tryBtn.click();

    await expect(page.locator('.embedding-api-panel')).toBeVisible();

    await tryBtn.click();
    await expect(page.locator('.embedding-api-panel')).not.toBeVisible();
  });

  test('back navigation works from fallback or HUD', async ({ page }) => {
    await page.goto('/embedding-space');

    const { isFallback } = await detectRenderingPath(page);

    if (isFallback) {
      const backLink = page.getByText('Back home');
      await expect(backLink).toBeVisible();
      await backLink.click();
    } else {
      const backLink = page.locator('.embedding-hud__back');
      await expect(backLink).toBeVisible({ timeout: 5000 });
      await backLink.click();
    }

    await expect(page).toHaveURL('/');
  });

  test('has no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/embedding-space');

    // Wait for either HUD or fallback to render
    await page.waitForTimeout(500);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );

    expect(hasHorizontalOverflow).toBe(false);
  });

  test('keeps the fallback recovery panel in the upper viewport on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/embedding-space');

    const { fallback, isFallback } = await detectRenderingPath(page);

    if (!isFallback) {
      return;
    }

    await expect(fallback).toBeVisible();
    await expect(
      page.getByText('WebGL offline', { exact: true }),
    ).toBeVisible();

    const layout = await page.evaluate(() => {
      const card = document.querySelector(
        '.embedding-fallback',
      ) as HTMLElement | null;
      const copy = document.querySelector(
        '.embedding-fallback-aside__copy',
      ) as HTMLElement | null;

      if (!card) {
        return null;
      }

      const rect = card.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        width: Math.round(rect.width),
        asideCopyWidth: copy
          ? Math.round(copy.getBoundingClientRect().width)
          : 0,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout!.top).toBeLessThanOrEqual(120);
    expect(layout!.width).toBeGreaterThanOrEqual(320);
    expect(layout!.asideCopyWidth).toBeGreaterThanOrEqual(280);

    await expect(
      page.getByRole('link', { name: 'OPEN PRETEXT LAB' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'OPEN CURRICULUM' }),
    ).toBeVisible();
  });

  test('Escape key closes the API panel when WebGL is available', async ({
    page,
  }) => {
    await page.goto('/embedding-space');

    const { isFallback } = await detectRenderingPath(page);

    if (isFallback) {
      return;
    }

    const tryBtn = page.locator('.embedding-hud__try-btn');
    await expect(tryBtn).toBeVisible({ timeout: 5000 });
    await tryBtn.click();

    await expect(page.locator('.embedding-api-panel')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('.embedding-api-panel')).not.toBeVisible();
  });

  test('inherits the app shell main content landmark', async ({ page }) => {
    await page.goto('/embedding-space');
    await expect(page.locator('main#main-content')).toBeVisible();
  });
});
