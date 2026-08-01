import { expect, test } from '@playwright/test';
import {
  RESPONSIVE_VIEWPORTS,
  ROUTE_GEOMETRY_TARGETS,
  assertComponentsStayInViewport,
  assertMainLandmarkVisible,
  assertNoClipSelectorsOverflow,
  assertNoConfiguredOverlap,
  assertNoHorizontalOverflow,
  mockStableExternalData,
  stabilizeGeometry,
  waitForRouteReady,
} from './helpers/responsive-geometry';

test.describe('Responsive geometry matrix', () => {
  test.beforeEach(async ({ page }) => {
    await mockStableExternalData(page);
  });

  for (const viewport of RESPONSIVE_VIEWPORTS) {
    test.describe(viewport.name, () => {
      for (const target of ROUTE_GEOMETRY_TARGETS) {
        test(`${target.id} has stable geometry at ${viewport.width}x${viewport.height}`, async ({
          page,
        }) => {
          test.setTimeout(60_000);

          await page.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });
          await page.goto(target.path, { waitUntil: 'domcontentloaded' });
          await stabilizeGeometry(page);
          await waitForRouteReady(page, target);

          await expect(page).toHaveURL(target.expectedUrl);
          await assertMainLandmarkVisible(page, target, viewport);
          await assertNoHorizontalOverflow(page, target, viewport);
          await assertComponentsStayInViewport(page, target, viewport);
          await assertNoClipSelectorsOverflow(page, target, viewport);
          await assertNoConfiguredOverlap(page, target, viewport);
        });
      }
    });
  }
});
