import { expect, test } from '@playwright/test';

test.describe('Home console', () => {
  test('shows the GitHub avatar in the hero badge', async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.route('https://api.github.com/users/*', async (route) => {
      await route.fulfill({
        json: {
          login: 'FarDust',
          avatar_url: '/assets/img/fardust.jpeg',
          url: 'https://api.github.com/users/FarDust',
          html_url: 'https://github.com/FarDust',
          name: 'Gabriel Faundez',
        },
      });
    });

    await page.goto('/');

    const portrait = page.locator('.console-profile-badge__image').first();

    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute(
      'src',
      /\/assets\/img\/fardust\.jpeg$/,
    );
  });

  test('stacks primary actions cleanly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const fetchCvAction = page.getByRole('link', { name: /FETCH_CV\.PDF/ });
    const openGithubAction = page.getByRole('link', { name: 'OPEN_GITHUB' });

    await expect(fetchCvAction).toBeVisible();
    await expect(openGithubAction).toBeVisible();

    const fetchBox = await fetchCvAction.boundingBox();
    const githubBox = await openGithubAction.boundingBox();

    expect(fetchBox).not.toBeNull();
    expect(githubBox).not.toBeNull();

    expect(fetchBox!.width).toBeGreaterThan(250);
    expect(githubBox!.width).toBeGreaterThan(250);
    expect(githubBox!.y).toBeGreaterThan(fetchBox!.y + fetchBox!.height - 1);

    const buttonsOverflow = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('.console-hero__action'),
      ).some((node) => node.scrollWidth > node.clientWidth + 1),
    );

    expect(buttonsOverflow).toBe(false);
  });

  test('uses polished section labels instead of internal token names', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page
        .locator('.console-pipelines__title')
        .getByText('Core capabilities', { exact: true }),
    ).toBeVisible();
    await expect(
      page
        .locator('.console-registry__title')
        .getByText('Selected work', { exact: true }),
    ).toBeVisible();
    await expect(
      page
        .locator('.console-sidebar__card-header')
        .getByText('Profile details', { exact: true }),
    ).toBeVisible();
    await expect(
      page
        .locator('.console-sidebar__card-header')
        .getByText('Experience log', { exact: true }),
    ).toBeVisible();

    await expect(
      page.getByText('CORE_CAPABILITIES', { exact: true }),
    ).toHaveCount(0);
    await expect(page.getByText('SELECTED_WORK', { exact: true })).toHaveCount(
      0,
    );
    await expect(
      page.getByText('PROFILE_DETAILS', { exact: true }),
    ).toHaveCount(0);
    await expect(page.getByText('EXPERIENCE_LOG', { exact: true })).toHaveCount(
      0,
    );
  });

  test('stacks footer links cleanly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const footerLinks = page.locator('.console-footer__links a');
    await footerLinks.last().scrollIntoViewIfNeeded();

    await expect(footerLinks).toHaveCount(4);

    const boxes = await footerLinks.evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, y: rect.y };
      }),
    );

    expect(boxes.every((box) => box.width > 250)).toBe(true);
    expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y);
    expect(boxes[2]!.y).toBeGreaterThan(boxes[1]!.y);
    expect(boxes[3]!.y).toBeGreaterThan(boxes[2]!.y);

    const overflow = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('.console-footer__links a'),
      ).some((node) => node.scrollWidth > node.clientWidth + 1),
    );

    expect(overflow).toBe(false);
  });

  test('opens the mobile navigation without clipping labels', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.getByRole('button', { name: 'Toggle navigation' }).click();

    const mobileMenu = page.locator('.console-navbar__mobile');
    const mobileLinks = mobileMenu.locator('.mobile-nav-link');

    await expect(mobileMenu).toBeVisible();
    await expect(
      mobileMenu.getByText('Profile active', { exact: true }),
    ).toBeVisible();
    await expect(mobileLinks).toHaveCount(4);

    const boxes = await mobileLinks.evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, y: rect.y };
      }),
    );

    expect(boxes.every((box) => box.width > 250)).toBe(true);
    expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y);
    expect(boxes[2]!.y).toBeGreaterThan(boxes[1]!.y);
    expect(boxes[3]!.y).toBeGreaterThan(boxes[2]!.y);

    const overflow = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll<HTMLElement>('.mobile-nav-link'),
      ).some((node) => node.scrollWidth > node.clientWidth + 1),
    );

    expect(overflow).toBe(false);
  });

  test('keeps registry placeholder and activity log compact on mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const metrics = await page.evaluate(() => {
      const placeholder = document.querySelector<HTMLElement>(
        '.console-registry__placeholder',
      );
      const logs = document.querySelector<HTMLElement>(
        '.console-sidebar__logs',
      );

      return {
        placeholderHeight: placeholder?.getBoundingClientRect().height ?? 0,
        logsHeight: logs?.getBoundingClientRect().height ?? 0,
      };
    });

    expect(metrics.placeholderHeight).toBeLessThan(170);
    expect(metrics.logsHeight).toBeLessThan(190);
  });
});
