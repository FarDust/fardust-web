import { expect, test } from '@playwright/test';

test.describe('Pretext lab', () => {
  test('renders the lab sections on desktop without horizontal overflow', async ({
    page,
  }) => {
    await page.goto('/pretext');

    await expect(
      page.getByRole('heading', { name: 'Subspace type control' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Copy routed around live telemetry' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Packets that fit their payload' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Signals that should survive first contact',
      }),
    ).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );

    expect(hasHorizontalOverflow).toBe(false);
  });

  test('updates packet telemetry and allows telemetry nodes to move', async ({
    page,
  }) => {
    await page.goto('/pretext');

    const slider = page.locator('#pretext-width');
    await slider.evaluate((node) => {
      const input = node as HTMLInputElement;
      input.value = '260';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await expect(page.getByText('Packet width 260px')).toBeVisible();

    const node = page.getByRole('button', { name: 'Move Embedding' });
    await node.scrollIntoViewIfNeeded();
    await expect(node).toBeVisible();

    const beforeStyle = await node.getAttribute('style');
    const before = await node.boundingBox();
    expect(before).not.toBeNull();

    await page.mouse.move(
      before!.x + before!.width / 2,
      before!.y + before!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      before!.x + before!.width / 2 + 80,
      before!.y + before!.height / 2 + 56,
      { steps: 8 },
    );
    await page.mouse.up();

    const afterStyle = await node.getAttribute('style');
    expect(afterStyle).not.toBe(beforeStyle);
  });

  test('stays within the viewport on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pretext');

    await expect(
      page.getByRole('heading', { name: 'Subspace type control' }),
    ).toBeVisible();
    await expect(page.locator('#pretext-width')).toBeVisible();
    await expect(
      page.getByText('CHANNEL SATURATED. REPOSITION A NODE OR WIDEN'),
    ).toHaveCount(0);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );

    expect(hasHorizontalOverflow).toBe(false);
  });

  test('keeps the editorial routing readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pretext');

    const routingStats = await page.evaluate(() => {
      const stage = document.querySelector<HTMLElement>(
        '.pretext-editorial__stage',
      );
      const lines = Array.from(
        document.querySelectorAll<HTMLElement>('.pretext-editorial__line'),
      ).map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          rightGap: stage
            ? stage.getBoundingClientRect().right - rect.right
            : 0,
        };
      });

      const inspected = lines.slice(0, Math.max(0, lines.length - 4));
      const overlaps = inspected.slice(1).filter((line, index) => {
        const previous = inspected[index];
        return line.top < previous.bottom - 1;
      }).length;

      return {
        crampedLines: inspected.filter((line) => line.width < 140).length,
        sidePinnedLines: inspected.filter(
          (line) => line.width < 170 && line.rightGap < 72,
        ).length,
        overlaps,
      };
    });

    expect(routingStats.crampedLines).toBeLessThanOrEqual(1);
    expect(routingStats.sidePinnedLines).toBe(0);
    expect(routingStats.overlaps).toBe(0);
  });

  test('keeps the editorial stage compact on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pretext');

    const stageHeight = await page.evaluate(
      () =>
        document
          .querySelector<HTMLElement>('.pretext-editorial__stage')
          ?.getBoundingClientRect().height ?? 0,
    );

    expect(stageHeight).toBeLessThan(580);
  });

  test('stacks hero actions cleanly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pretext');

    const primaryAction = page.getByRole('link', { name: 'Back to console' });
    const libraryAction = page.getByRole('link', { name: 'Open Pretext docs' });

    await expect(primaryAction).toBeVisible();
    await expect(libraryAction).toBeVisible();

    const primaryBox = await primaryAction.boundingBox();
    const libraryBox = await libraryAction.boundingBox();

    expect(primaryBox).not.toBeNull();
    expect(libraryBox).not.toBeNull();

    expect(primaryBox!.width).toBeGreaterThan(250);
    expect(libraryBox!.width).toBeGreaterThan(250);
    expect(libraryBox!.y).toBeGreaterThan(
      primaryBox!.y + primaryBox!.height - 1,
    );

    const buttonsOverflow = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('.pretext-hero__action'),
      ).some((node) => node.scrollWidth > node.clientWidth + 1),
    );

    expect(buttonsOverflow).toBe(false);
  });

  test('keeps the validation canaries compact on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pretext');

    const validationMetrics = await page.evaluate(() => {
      const section = document.querySelector<HTMLElement>(
        'app-pretext-validation-section',
      );
      const sampleOverflow = Array.from(
        document.querySelectorAll<HTMLElement>('.pretext-validation__sample'),
      ).some((node) => node.scrollWidth > node.clientWidth + 1);

      return {
        height: section?.getBoundingClientRect().height ?? 0,
        sampleOverflow,
      };
    });

    expect(validationMetrics.sampleOverflow).toBe(false);
    expect(validationMetrics.height).toBeLessThan(1250);
  });

  test('switches validation canaries through mobile tabs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/pretext');

    const section = page.locator('app-pretext-validation-section');
    await section.scrollIntoViewIfNeeded();

    const tab = page.getByRole('tab', { name: 'Pre-wrap' });
    await expect(tab).toBeVisible();
    await tab.click();

    const panel = page.locator('.pretext-validation__mobile-card');
    await expect(panel).toContainText('Prompt queue:');
    await expect(panel).toContainText('1. Capture intent');
    await expect(panel).toContainText('3. Ship the experiment');

    const tabMetrics = await page.evaluate(() => {
      const tablist = document.querySelector<HTMLElement>(
        '.pretext-validation__tabs',
      );
      const panel = document.querySelector<HTMLElement>(
        '.pretext-validation__mobile-card',
      );

      return {
        sectionOverflow:
          (document.querySelector<HTMLElement>('app-pretext-validation-section')
            ?.scrollWidth ?? 0) >
          (document.querySelector<HTMLElement>('app-pretext-validation-section')
            ?.clientWidth ?? 0) +
            1,
        tabRows: new Set(
          Array.from(
            document.querySelectorAll<HTMLElement>('.pretext-validation__tab'),
          ).map((node) => Math.round(node.getBoundingClientRect().top)),
        ).size,
        tablistWidth: tablist?.getBoundingClientRect().width ?? 0,
        panelHeight: panel?.getBoundingClientRect().height ?? 0,
      };
    });

    expect(tabMetrics.sectionOverflow).toBe(false);
    expect(tabMetrics.tabRows).toBeGreaterThan(1);
    expect(tabMetrics.tablistWidth).toBeGreaterThan(200);
    expect(tabMetrics.panelHeight).toBeLessThan(260);
  });
});
