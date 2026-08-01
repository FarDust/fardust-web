import { expect, type Page } from '@playwright/test';

export type ViewportPreset = {
  readonly name: string;
  readonly width: number;
  readonly height: number;
};

export type RouteGeometryTarget = {
  readonly id: string;
  readonly path: string;
  readonly expectedUrl: RegExp;
  readonly readySelectors: readonly string[];
  readonly componentSelectors: readonly string[];
  readonly clipSelectors: readonly string[];
  readonly overlapGroups: readonly (readonly string[])[];
};

type Box = {
  readonly selector: string;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
};

export const RESPONSIVE_VIEWPORTS: readonly ViewportPreset[] = [
  { name: 'pixel-compact', width: 360, height: 780 },
  { name: 'pixel-10', width: 412, height: 915 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'desktop', width: 1440, height: 1080 },
  { name: '4k', width: 3840, height: 2160 },
  { name: 'curved-ultrawide', width: 5120, height: 1440 },
] as const;

const sharedShellSelectors = [
  'app-navbar .console-navbar',
  'app-footer .console-footer',
];

export const ROUTE_GEOMETRY_TARGETS: readonly RouteGeometryTarget[] = [
  {
    id: 'home',
    path: '/',
    expectedUrl: /\/$/,
    readySelectors: ['.console-layout'],
    componentSelectors: [
      ...sharedShellSelectors,
      '.console-layout',
      '.console-hero',
      '.console-pipelines',
      '.console-registry',
      '.console-sidebar',
    ],
    clipSelectors: [
      '.console-navbar__inner',
      '.console-hero__actions',
      '.console-pipelines__grid',
      '.console-registry__grid',
      '.console-footer__links',
    ],
    overlapGroups: [
      ['.console-hero', '.console-pipelines', '.console-registry'],
      ['.console-layout__main', '.console-layout__sidebar'],
    ],
  },
  {
    id: 'experience',
    path: '/experience',
    expectedUrl: /\/experience$/,
    readySelectors: ['.experience-viewer'],
    componentSelectors: [
      ...sharedShellSelectors,
      '.experience-layout',
      '.experience-viewer',
      '.experience-viewer__toolbar',
      '.experience-viewer__frame',
      '.experience-viewer__signal-panel',
    ],
    clipSelectors: [
      '.experience-viewer__actions',
      '.experience-viewer__chips',
      '.experience-viewer__controls',
      '.experience-viewer__ops',
      '.experience-signal-panel__tabs',
    ],
    overlapGroups: [
      ['.experience-viewer__frame', '.experience-viewer__signal-panel'],
      ['.experience-viewer', 'app-footer .console-footer'],
    ],
  },
  {
    id: 'embedding-space',
    path: '/embedding-space',
    expectedUrl: /\/embedding-space$/,
    readySelectors: ['.embedding-hud', '.embedding-fallback'],
    componentSelectors: [
      '.embedding-container',
      '.embedding-hud',
      '.embedding-fallback',
      '.embedding-fallback-aside',
    ],
    clipSelectors: [
      '.embedding-hud__top',
      '.embedding-hud__bottom',
      '.embedding-fallback__actions',
      '.embedding-fallback-aside__links',
    ],
    overlapGroups: [
      ['.embedding-fallback', '.embedding-fallback-aside'],
      ['.embedding-hud__top', '.embedding-hud__bottom'],
    ],
  },
  {
    id: 'pretext',
    path: '/pretext',
    expectedUrl: /\/pretext$/,
    readySelectors: ['.pretext-layout'],
    componentSelectors: [
      ...sharedShellSelectors,
      '.pretext-layout',
      '.pretext-hero',
      '.pretext-editorial',
      '.pretext-shrinkwrap',
      'app-pretext-validation-section',
    ],
    clipSelectors: [
      '.pretext-hero__actions',
      '.pretext-hero__metrics',
      '.pretext-hero__features',
      '.pretext-shrinkwrap__columns',
      '.pretext-validation__tabs',
    ],
    overlapGroups: [
      [
        '.pretext-hero',
        'app-pretext-editorial-engine',
        'app-pretext-shrinkwrap-showdown',
        'app-pretext-validation-section',
      ],
      ['.pretext-hero__content', '.pretext-hero__log'],
    ],
  },
  {
    id: 'legacy-ball-redirect',
    path: '/ball',
    expectedUrl: /\/embedding-space$/,
    readySelectors: ['.embedding-hud', '.embedding-fallback'],
    componentSelectors: [
      '.embedding-container',
      '.embedding-hud',
      '.embedding-fallback',
    ],
    clipSelectors: [
      '.embedding-hud__top',
      '.embedding-hud__bottom',
      '.embedding-fallback__actions',
    ],
    overlapGroups: [['.embedding-hud__top', '.embedding-hud__bottom']],
  },
  {
    id: 'legacy-projects-redirect',
    path: '/projects',
    expectedUrl: /\/pretext$/,
    readySelectors: ['.pretext-layout'],
    componentSelectors: [
      ...sharedShellSelectors,
      '.pretext-layout',
      '.pretext-hero',
    ],
    clipSelectors: ['.pretext-hero__actions', '.pretext-hero__metrics'],
    overlapGroups: [['.pretext-hero', 'app-pretext-editorial-engine']],
  },
  {
    id: 'not-found',
    path: '/definitely-missing-route',
    expectedUrl: /\/definitely-missing-route$/,
    readySelectors: ['.page-not-found'],
    componentSelectors: [...sharedShellSelectors, '.page-not-found'],
    clipSelectors: ['.page-not-found__title', '.page-not-found__actions'],
    overlapGroups: [['.page-not-found', 'app-footer .console-footer']],
  },
] as const;

export async function mockStableExternalData(page: Page): Promise<void> {
  await page.addInitScript(() => localStorage.clear());
  await page.route('https://api.github.com/users/*', async (route) => {
    await route.fulfill({
      json: {
        login: 'FarDust',
        avatar_url: '/assets/img/fardust.jpeg',
        html_url: 'https://github.com/FarDust',
        name: 'Gabriel Faundez',
      },
    });
  });
}

export async function stabilizeGeometry(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.001ms !important;
      }
    `,
  });
}

export async function waitForRouteReady(
  page: Page,
  target: RouteGeometryTarget,
): Promise<void> {
  const deadline = Date.now() + 10_000;

  while (Date.now() < deadline) {
    for (const selector of target.readySelectors) {
      const isVisible = await page
        .locator(selector)
        .first()
        .isVisible()
        .catch(() => false);

      if (isVisible) {
        return;
      }
    }

    await page.waitForTimeout(100);
  }

  throw new Error(
    `Route ${target.id} did not expose any ready selector: ${target.readySelectors.join(', ')}`,
  );
}

export async function assertMainLandmarkVisible(
  page: Page,
  target: RouteGeometryTarget,
  viewport: ViewportPreset,
): Promise<void> {
  const main = page.locator('main#main-content');
  await expect(
    main,
    `${target.id} main landmark at ${viewport.name}`,
  ).toBeVisible();

  const box = await main.boundingBox();
  expect(
    box,
    `${target.id} main landmark geometry at ${viewport.name}`,
  ).not.toBeNull();
  expect(
    box!.width,
    `${target.id} main landmark width at ${viewport.name}`,
  ).toBeGreaterThan(0);
  expect(
    box!.height,
    `${target.id} main landmark height at ${viewport.name}`,
  ).toBeGreaterThan(0);
}

export async function assertNoHorizontalOverflow(
  page: Page,
  target: RouteGeometryTarget,
  viewport: ViewportPreset,
): Promise<void> {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(root.scrollWidth, body.scrollWidth);
    const clientWidth = window.innerWidth;
    const offenders = Array.from(
      document.querySelectorAll<HTMLElement>('body *'),
    )
      .flatMap((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        const visible =
          rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';

        if (!visible) {
          return [];
        }

        const className = node.className
          ? `.${String(node.className).trim().split(/\s+/).slice(0, 2).join('.')}`
          : '';

        if (rect.right > clientWidth + 2 && rect.left < clientWidth) {
          return [
            `${node.tagName.toLowerCase()}${className} right=${Math.round(rect.right)}`,
          ];
        }

        if (node.scrollWidth - node.clientWidth > 2) {
          const text =
            node.textContent?.trim().replace(/\s+/g, ' ').slice(0, 24) ?? '';
          return [
            `${node.tagName.toLowerCase()}${className} scroll=${node.scrollWidth}/${node.clientWidth} text="${text}"`,
          ];
        }

        return [];
      })
      .slice(0, 5);

    return {
      delta: scrollWidth - clientWidth,
      scrollWidth,
      clientWidth,
      offenders,
    };
  });

  expect(
    overflow.delta,
    `${target.id} horizontal overflow at ${viewport.name}: scrollWidth=${overflow.scrollWidth}, viewport=${overflow.clientWidth}, offenders=${overflow.offenders.join('; ')}`,
  ).toBeLessThanOrEqual(2);
}

export async function assertComponentsStayInViewport(
  page: Page,
  target: RouteGeometryTarget,
  viewport: ViewportPreset,
): Promise<void> {
  for (const selector of target.componentSelectors) {
    const locator = page.locator(selector).first();
    const isVisible = await locator.isVisible().catch(() => false);

    if (!isVisible) {
      continue;
    }

    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();

    expect(
      box,
      `${target.id} ${selector} geometry at ${viewport.name}`,
    ).not.toBeNull();
    expect(
      box!.width,
      `${target.id} ${selector} width at ${viewport.name}`,
    ).toBeGreaterThan(0);
    expect(
      box!.height,
      `${target.id} ${selector} height at ${viewport.name}`,
    ).toBeGreaterThan(0);
    expect(
      box!.x,
      `${target.id} ${selector} left edge at ${viewport.name}`,
    ).toBeGreaterThanOrEqual(-2);
    expect(
      box!.x + box!.width,
      `${target.id} ${selector} right edge at ${viewport.name}`,
    ).toBeLessThanOrEqual(viewport.width + 2);
  }
}

export async function assertNoClipSelectorsOverflow(
  page: Page,
  target: RouteGeometryTarget,
  viewport: ViewportPreset,
): Promise<void> {
  const failures = await page.evaluate((selectors) => {
    const findings: string[] = [];

    for (const selector of selectors) {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      );

      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        const visible =
          rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';

        if (!visible) {
          continue;
        }

        const children = Array.from(node.children).filter(
          (child): child is HTMLElement => child instanceof HTMLElement,
        );

        if (!children.length && node.scrollWidth - node.clientWidth > 2) {
          findings.push(
            `${selector} scroll=${node.scrollWidth} client=${node.clientWidth}`,
          );
          continue;
        }

        for (const child of children) {
          const childRect = child.getBoundingClientRect();
          const childStyle = getComputedStyle(child);
          const childVisible =
            childRect.width > 0 &&
            childRect.height > 0 &&
            childStyle.visibility !== 'hidden' &&
            childStyle.position !== 'absolute' &&
            childStyle.position !== 'fixed';

          if (!childVisible) {
            continue;
          }

          if (
            childRect.left < rect.left - 2 ||
            childRect.right > rect.right + 2
          ) {
            findings.push(
              `${selector} child ${child.tagName.toLowerCase()} spans ${Math.round(childRect.left)}-${Math.round(childRect.right)} outside ${Math.round(rect.left)}-${Math.round(rect.right)}`,
            );
          }
        }
      }
    }

    return findings;
  }, target.clipSelectors);

  expect(failures, `${target.id} clipped geometry at ${viewport.name}`).toEqual(
    [],
  );
}

export async function assertNoConfiguredOverlap(
  page: Page,
  target: RouteGeometryTarget,
  viewport: ViewportPreset,
): Promise<void> {
  for (const group of target.overlapGroups) {
    const boxes = await visibleDocumentBoxes(page, group);
    const overlaps = overlappingPairs(boxes);

    expect(
      overlaps,
      `${target.id} component overlap at ${viewport.name}`,
    ).toEqual([]);
  }
}

async function visibleDocumentBoxes(
  page: Page,
  selectors: readonly string[],
): Promise<readonly Box[]> {
  return page.evaluate((inputSelectors) => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    return inputSelectors.flatMap((selector) => {
      const node = document.querySelector<HTMLElement>(selector);

      if (!node) {
        return [];
      }

      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const visible =
        rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden';

      if (
        !visible ||
        style.position === 'fixed' ||
        style.position === 'absolute'
      ) {
        return [];
      }

      return [
        {
          selector,
          top: rect.top + scrollY,
          right: rect.right + scrollX,
          bottom: rect.bottom + scrollY,
          left: rect.left + scrollX,
          width: rect.width,
          height: rect.height,
        },
      ];
    });
  }, selectors);
}

function overlappingPairs(boxes: readonly Box[]): readonly string[] {
  const overlaps: string[] = [];

  for (let index = 0; index < boxes.length; index += 1) {
    const current = boxes[index];

    if (!current) {
      continue;
    }

    for (const next of boxes.slice(index + 1)) {
      const xOverlap =
        current.left < next.right - 2 && current.right > next.left + 2;
      const yOverlap =
        current.top < next.bottom - 2 && current.bottom > next.top + 2;

      if (xOverlap && yOverlap) {
        overlaps.push(`${current.selector} overlaps ${next.selector}`);
      }
    }
  }

  return overlaps;
}
