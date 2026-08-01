import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';
import {
  DESIGN_SYSTEM,
  ROUTES,
  SOURCES,
  VIEWPORTS,
} from './visual-audit.config.mjs';

const ANIMATION_PAUSE_CSS = `
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
    caret-color: transparent !important;
  }
`;

const DEFAULT_TIMEOUT_MS = 120_000;
const LOCAL_URL = SOURCES.local.baseUrl;
const LOCAL_SERVER_PORT = new URL(LOCAL_URL).port || '4201';
const ROUTE_SCREENSHOT_TIMEOUT_MS = 20_000;
const COMPONENT_SCREENSHOT_TIMEOUT_MS = 10_000;

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const routes = selectValues(ROUTES, options.routes, 'id');
  const sourceEntries = selectEntries(SOURCES, options.sources);
  const viewportEntries = selectEntries(VIEWPORTS, options.viewports);
  const stamp = options.date ?? new Date().toISOString().slice(0, 10);
  const outputRoot = path.join(process.cwd(), 'output', 'visual-audit', stamp);
  const manifest = [];

  let localServer = null;

  if (sourceEntries.some(([sourceId]) => sourceId === 'local')) {
    localServer = await ensureLocalServer();
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  try {
    for (const [sourceId, source] of sourceEntries) {
      for (const route of routes) {
        if (!route.sources.includes(sourceId)) {
          continue;
        }

        for (const [viewportId, viewport] of viewportEntries) {
          const context = await browser.newContext({
            viewport: {
              width: viewport.width,
              height: viewport.height,
            },
            isMobile: viewport.isMobile ?? false,
            hasTouch: viewport.hasTouch ?? false,
            deviceScaleFactor: 1,
            colorScheme: 'dark',
            serviceWorkers: 'block',
          });

          const page = await context.newPage();
          const routeOutputDir = path.join(
            outputRoot,
            sourceId,
            route.id,
            viewportId,
          );

          await mkdir(routeOutputDir, { recursive: true });

          const url = new URL(route.path, source.baseUrl).toString();
          await page.goto(url, { waitUntil: 'domcontentloaded' });
          await page.addStyleTag({ content: ANIMATION_PAUSE_CSS });
          await waitForRouteReady(page, route, sourceId);
          await page.waitForTimeout(250);
          await page.evaluate(() => window.scrollTo(0, 0));

          await captureRouteScreens({
            page,
            route,
            sourceId,
            viewportId,
            routeOutputDir,
            url,
            manifest,
          });

          for (const component of route.components) {
            await captureComponent({
              component,
              page,
              route,
              sourceId,
              viewportId,
              routeOutputDir,
              url,
              manifest,
            });
          }

          await context.close();
        }
      }
    }
  } finally {
    await browser.close();

    if (localServer) {
      localServer.kill('SIGTERM');
    }
  }

  const manifestPath = path.join(outputRoot, 'manifest.json');
  await mkdir(outputRoot, { recursive: true });
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        designSystem: DESIGN_SYSTEM,
        entries: manifest,
      },
      null,
      2,
    ),
    'utf8',
  );

  process.stdout.write(
    `Visual audit manifest written to ${path.relative(process.cwd(), manifestPath)}\n`,
  );
}

async function waitForRouteReady(page, route, sourceId) {
  const selector = route.readySelectors?.[sourceId];

  if (!selector) {
    await page.waitForTimeout(1_000);
    return;
  }

  try {
    await page.waitForSelector(selector, {
      state: 'visible',
      timeout: 10_000,
    });
  } catch {
    await page.waitForTimeout(1_000);
  }
}

async function captureRouteScreens({
  page,
  route,
  sourceId,
  viewportId,
  routeOutputDir,
  url,
  manifest,
}) {
  const viewportPath = path.join(routeOutputDir, 'route-viewport.png');
  const fullPagePath = path.join(routeOutputDir, 'route-fullpage.png');

  try {
    await page.screenshot({
      path: viewportPath,
      scale: 'css',
      timeout: ROUTE_SCREENSHOT_TIMEOUT_MS,
    });
    appendManifestEntry({
      manifest,
      route,
      componentId: 'route',
      componentLabel: `${route.label} viewport`,
      sourceId,
      viewportId,
      state: 'viewport',
      status: 'captured',
      selector: 'viewport',
      artifactPath: viewportPath,
      url,
      designReferences: route.designReferences ?? [],
    });
  } catch (error) {
    appendManifestEntry({
      manifest,
      route,
      componentId: 'route',
      componentLabel: `${route.label} viewport`,
      sourceId,
      viewportId,
      state: 'viewport',
      status: 'capture-failed',
      selector: 'viewport',
      artifactPath: null,
      url,
      notes: error instanceof Error ? error.message : String(error),
      severity: 'critical',
      designReferences: route.designReferences ?? [],
    });
  }

  try {
    await page.screenshot({
      path: fullPagePath,
      fullPage: true,
      scale: 'css',
      timeout: ROUTE_SCREENSHOT_TIMEOUT_MS,
    });
    appendManifestEntry({
      manifest,
      route,
      componentId: 'route',
      componentLabel: `${route.label} full page`,
      sourceId,
      viewportId,
      state: 'fullpage',
      status: 'captured',
      selector: 'document',
      artifactPath: fullPagePath,
      url,
      designReferences: route.designReferences ?? [],
    });
  } catch (error) {
    appendManifestEntry({
      manifest,
      route,
      componentId: 'route',
      componentLabel: `${route.label} full page`,
      sourceId,
      viewportId,
      state: 'fullpage',
      status: 'capture-failed',
      selector: 'document',
      artifactPath: null,
      url,
      notes: error instanceof Error ? error.message : String(error),
      severity: 'major',
      designReferences: route.designReferences ?? [],
    });
  }
}

async function captureComponent({
  component,
  page,
  route,
  sourceId,
  viewportId,
  routeOutputDir,
  url,
  manifest,
}) {
  if (component.hiddenOnViewports?.includes(viewportId)) {
    appendManifestEntry({
      manifest,
      route,
      componentId: component.id,
      componentLabel: component.label,
      sourceId,
      viewportId,
      state: 'default',
      status: 'hidden-by-design',
      selector: component.selectors[sourceId] ?? null,
      artifactPath: null,
      url,
      notes: `Component is intentionally hidden on ${viewportId}.`,
      designReferences:
        component.designReferences ?? route.designReferences ?? [],
    });
    return;
  }

  const selector = component.selectors[sourceId];

  if (!selector) {
    appendManifestEntry({
      manifest,
      route,
      componentId: component.id,
      componentLabel: component.label,
      sourceId,
      viewportId,
      state: 'default',
      status: 'missing-selector',
      selector: null,
      artifactPath: null,
      url,
      notes: `No selector registered for source "${sourceId}".`,
      designReferences:
        component.designReferences ?? route.designReferences ?? [],
    });
    return;
  }

  const locator = page.locator(selector).first();
  const count = await locator.count();

  if (count === 0) {
    appendManifestEntry({
      manifest,
      route,
      componentId: component.id,
      componentLabel: component.label,
      sourceId,
      viewportId,
      state: 'default',
      status: 'selector-not-found',
      selector,
      artifactPath: null,
      url,
      notes: `Selector "${selector}" did not resolve on the page.`,
      designReferences:
        component.designReferences ?? route.designReferences ?? [],
    });
    return;
  }

  try {
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);

    const screenshotPath = path.join(
      routeOutputDir,
      `${component.id}-default.png`,
    );

    await locator.screenshot({
      path: screenshotPath,
      scale: 'css',
      timeout: COMPONENT_SCREENSHOT_TIMEOUT_MS,
    });

    appendManifestEntry({
      manifest,
      route,
      componentId: component.id,
      componentLabel: component.label,
      sourceId,
      viewportId,
      state: 'default',
      status: 'captured',
      selector,
      artifactPath: screenshotPath,
      url,
      designReferences:
        component.designReferences ?? route.designReferences ?? [],
    });
  } catch (error) {
    appendManifestEntry({
      manifest,
      route,
      componentId: component.id,
      componentLabel: component.label,
      sourceId,
      viewportId,
      state: 'default',
      status: 'capture-failed',
      selector,
      artifactPath: null,
      url,
      notes: error instanceof Error ? error.message : String(error),
      severity: 'critical',
      designReferences:
        component.designReferences ?? route.designReferences ?? [],
    });
  }
}

function appendManifestEntry({
  manifest,
  route,
  componentId,
  componentLabel,
  sourceId,
  viewportId,
  state,
  status,
  selector,
  artifactPath,
  url,
  notes = null,
  severity = null,
  designReferences = [],
}) {
  manifest.push({
    route: route.id,
    routeLabel: route.label,
    component: componentId,
    componentLabel,
    viewport: viewportId,
    state,
    source: sourceId,
    status,
    selector,
    artifactPath: artifactPath
      ? path.relative(process.cwd(), artifactPath)
      : null,
    url,
    severity,
    notes,
    designReferences,
  });
}

function parseOptions(argv) {
  const options = {};

  for (const argument of argv) {
    if (!argument.startsWith('--')) {
      continue;
    }

    const [rawKey, rawValue] = argument.slice(2).split('=');
    const key = rawKey.trim();
    const value = rawValue?.trim();

    if (!value) {
      options[key] = true;
      continue;
    }

    options[key] = value;
  }

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  return {
    routes: options.routes?.split(',').filter(Boolean) ?? [],
    sources: options.sources?.split(',').filter(Boolean) ?? [],
    viewports: options.viewports?.split(',').filter(Boolean) ?? [],
    date: options.date,
  };
}

function printHelp() {
  process.stdout.write(`Usage: npm run audit:visual -- [options]

Options:
  --routes=home,experience
  --sources=local,production-reference
  --viewports=desktop,tablet,mobile
  --date=YYYY-MM-DD
  --help
`);
}

function selectValues(items, requestedIds, key) {
  if (!requestedIds.length) {
    return items;
  }

  const selected = items.filter((item) => requestedIds.includes(item[key]));
  assertSelection(
    selected.length > 0,
    requestedIds,
    items.map((item) => item[key]),
  );
  return selected;
}

function selectEntries(record, requestedIds) {
  const entries = Object.entries(record);

  if (!requestedIds.length) {
    return entries;
  }

  const selected = entries.filter(([id]) => requestedIds.includes(id));
  assertSelection(
    selected.length > 0,
    requestedIds,
    entries.map(([id]) => id),
  );
  return selected;
}

function assertSelection(valid, requestedIds, availableIds) {
  if (valid) {
    return;
  }

  throw new Error(
    `Unknown selection "${requestedIds.join(', ')}". Available values: ${availableIds.join(', ')}`,
  );
}

async function ensureLocalServer() {
  if (await isReachable(LOCAL_URL)) {
    return null;
  }

  const server = spawn(
    'npm',
    ['start', '--', '--host', '127.0.0.1', '--port', LOCAL_SERVER_PORT],
    {
      cwd: process.cwd(),
      stdio: 'ignore',
    },
  );

  const started = await waitForReachable(LOCAL_URL, DEFAULT_TIMEOUT_MS);

  if (!started) {
    server.kill('SIGTERM');
    throw new Error(`Timed out waiting for ${LOCAL_URL}`);
  }

  return server;
}

async function waitForReachable(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isReachable(url)) {
      return true;
    }

    await delay(1_000);
  }

  return false;
}

async function isReachable(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

await main();
