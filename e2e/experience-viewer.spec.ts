import { expect, test } from '@playwright/test';

test.describe('Experience viewer', () => {
  test('renders one pdf page at a time and advances with the pager', async ({
    page,
  }) => {
    await page.goto('/experience');

    const toolbar = page.locator('.experience-viewer__toolbar');

    await expect(page.getByText('~/fardust-web/experience')).toBeVisible();
    await expect(toolbar.getByText('Status', { exact: true })).toBeVisible();
    await expect(toolbar).toContainText(/Ready|Indexed/);
    await expect(toolbar.getByText('1 of 3', { exact: true })).toBeVisible();
    await expect(toolbar.getByText('100%', { exact: true })).toBeVisible();
    await expect(
      page.locator('.experience-viewer__pdf-shell .page'),
    ).toHaveCount(1);
    await expect(
      page.locator('.experience-viewer__hotspot').first(),
    ).toBeVisible();

    await page.getByRole('button', { name: 'NEXT' }).click();

    await expect(toolbar.getByText('2 of 3', { exact: true })).toBeVisible();
    await expect(
      page.locator('.experience-viewer__pdf-shell .page'),
    ).toHaveCount(1);
  });

  test('can search the extracted curriculum index and jump to the matching page', async ({
    page,
  }) => {
    await page.goto('/experience');

    const searchInput = page.getByPlaceholder('LLMOps, Angular, Betterfly…');
    await searchInput.fill('Betterfly');

    const result = page.locator('.experience-signal-panel__result').filter({
      hasText: 'Betterfly',
    });

    await expect(result.first()).toBeVisible();
    await result.first().click();

    await expect(page.locator('.experience-viewer__toolbar')).toContainText(
      '2 of 3',
    );
  });

  test('keeps the footer in document flow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/experience');

    const footer = page.locator('app-footer footer').first();
    const viewerFrame = page.locator('.experience-viewer__frame').first();

    await expect(footer).toBeVisible();
    await expect(viewerFrame).toBeVisible();

    const footerPosition = await footer.evaluate(
      (node) => getComputedStyle(node).position,
    );
    expect(footerPosition).toBe('relative');

    const layout = await page.evaluate(() => {
      const frame = document.querySelector(
        '.experience-viewer__frame',
      ) as HTMLElement | null;
      const footerEl = document.querySelector(
        'app-footer footer',
      ) as HTMLElement | null;

      if (!frame || !footerEl) {
        return null;
      }

      return {
        frameBottom: frame.offsetTop + frame.offsetHeight,
        footerTop: footerEl.offsetTop,
      };
    });

    expect(layout).not.toBeNull();
    expect(layout!.footerTop).toBeGreaterThan(layout!.frameBottom);
  });

  test('keeps toolbar chips readable on mobile without overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/experience');

    const toolbar = page.locator('.experience-viewer__toolbar');

    await expect(toolbar).toContainText(/Ready|Indexed/);
    await expect(toolbar.getByText('1 of 3', { exact: true })).toBeVisible();
    await expect(toolbar.getByText('100%', { exact: true })).toBeVisible();

    const toolbarOverflow = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('.experience-viewer__chip'),
      ).some((node) => node.scrollWidth > node.clientWidth + 1),
    );

    expect(toolbarOverflow).toBe(false);

    const controlsWrap = await page.evaluate(() => {
      const buttons = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.experience-viewer__controls .experience-viewer__button',
        ),
      );

      if (!buttons.length) {
        return true;
      }

      const top = buttons[0].offsetTop;
      return buttons.some((button) => button.offsetTop !== top);
    });

    expect(controlsWrap).toBe(false);

    await expect(
      page.locator('.experience-viewer__pdf-shell .page'),
    ).toHaveCount(1);

    const shellGap = await page.evaluate(() => {
      const shell = document.querySelector(
        '.experience-viewer__pdf-shell',
      ) as HTMLElement | null;
      const pageEl = shell?.querySelector('.page') as HTMLElement | null;

      if (!shell || !pageEl) {
        return null;
      }

      const shellRect = shell.getBoundingClientRect();
      const pageRect = pageEl.getBoundingClientRect();

      return Math.round(shellRect.bottom - pageRect.bottom);
    });

    expect(shellGap).not.toBeNull();
    expect(shellGap!).toBeLessThanOrEqual(24);
  });

  test('reduces mobile density with panel tabs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/experience');

    await page.getByRole('button', { name: 'copilot' }).click();
    await expect(
      page.getByRole('button', { name: 'Warm local model' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'search' }).click();
    await expect(
      page.getByPlaceholder('LLMOps, Angular, Betterfly…'),
    ).toBeVisible();
  });
});
