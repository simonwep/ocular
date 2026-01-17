import { BrowserContext, BrowserContextOptions, chromium, Page } from '@playwright/test';
import { writeFile, rm, mkdir } from 'fs/promises';
import { cpus } from 'os';
import { resolve } from 'path';

type Config = {
  name: string;
  contextOptions?: BrowserContextOptions;
  beforePageSetup?: (context: BrowserContext) => Promise<void> | void;
  beforeScreenshot?: (page: Page) => Promise<void> | void;
  beforePageLoad?: (page: Page) => Promise<void> | void;
};

const concurrency = Math.max(1, Math.floor(cpus().length / 2));
const screenSize = { width: 1660, height: 1070 };
const screenshots = resolve(process.cwd(), 'scripts', 'screenshots');
const url = 'http://localhost:3000/#demo';

const config: Config[] = [
  {
    name: 'Dashboard'
  },
  {
    name: 'Dashboard Yearly Overview',
    beforeScreenshot: (page) => page.getByTestId('view-summary').click()
  },
  {
    name: 'All-time Overview',
    beforeScreenshot: (page) => page.getByTestId('view-all-time').click()
  },
  {
    name: 'Demo expenses',
    beforeScreenshot: async (page) => {
      await page.getByTestId('navigation-expenses').click();
      await page.getByTestId('group-0-collapse').click();
      await page.getByTestId('group-1-collapse').click();
      await page.getByTestId('group-2-collapse').click();
      await page.getByTestId('group-3-collapse').click();
      await page.getByTestId('group-5-collapse').click();
      await page.getByTestId('group-4-budget-0-0').focus();
    }
  }
];

await rm(screenshots, { recursive: true }).catch(() => {});
await mkdir(screenshots, { recursive: true });

const browser = await chromium.launch();
let idx = 0;

const worker = async () => {
  for (;;) {
    const index = idx++;
    if (index >= config.length) return;

    const options = config[index];
    const context = await browser.newContext({
      screen: screenSize,
      colorScheme: 'dark',
      reducedMotion: 'reduce',
      storageState: {
        cookies: [],
        origins: [
          {
            origin: url,
            localStorage: [
              {
                name: 'status-bar/demo-version-dismissed',
                value: 'true'
              }
            ]
          }
        ]
      },
      ...options.contextOptions
    });

    await options.beforePageSetup?.(context);
    const page = await context.newPage();
    await page.setViewportSize(screenSize);
    await page.clock.setFixedTime('2024-03-15');

    // Setup page
    await options.beforePageLoad?.(page);
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({
      content: `html, body, #app { background: transparent !important; }`
    });

    // Take screenshot
    await options.beforeScreenshot?.(page);
    await page.waitForTimeout(250); // Wait for page changes
    const path = resolve(screenshots, `${options.name}.png`);
    const buffer = await page.screenshot({ fullPage: true, omitBackground: true });
    await writeFile(path, buffer);
    await page.close();

    // eslint-disable-next-line no-console
    console.log(`Captured screenshot: ${path}`);
  }
};

await Promise.all(Array.from({ length: concurrency }, worker));
await browser.close();
