import { test, expect, type Page } from '@playwright/test';
import { copyFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { content } from '../../src/content';

const DIST = resolve('dist/index.html');
const MUSIC = resolve('dist/music.mp3');
const url = (q: string) => pathToFileURL(DIST).href + q;
const MISSING_MUSIC_LOG = /Failed to load resource: net::ERR_FILE_NOT_FOUND/;

function watch(page: Page) {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('request', (r) => {
    if (!/^(file|data|blob):/.test(r.url())) external.push(r.url());
  });
  return { errors, external };
}

test.describe.configure({ mode: 'serial' });

test('plays start to card offline without music, no app errors, no network', async ({ page }) => {
  if (existsSync(MUSIC)) rmSync(MUSIC);
  const w = watch(page);
  await page.goto(url('?speed=40'));
  await page.click('[data-start]');
  await expect(page.getByText(content.card.signature)).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-replay]')).toBeVisible({ timeout: 15_000 });
  // The only allowed log is the browser's own note that the optional music file is absent.
  expect(w.errors.filter((e) => !MISSING_MUSIC_LOG.test(e))).toEqual([]);
  expect(w.external).toEqual([]);
});

test('plays the last scene with music.mp3 next to index.html without any console error', async ({ page }) => {
  copyFileSync(resolve('tests/e2e/fixtures/silence.mp3'), MUSIC);
  try {
    const w = watch(page);
    await page.goto(url('?scene=7'));
    await page.click('[data-start]');
    await expect(page.getByText(content.card.signature)).toBeVisible({ timeout: 30_000 });
    expect(w.errors).toEqual([]);
    expect(w.external).toEqual([]);
  } finally {
    rmSync(MUSIC);
  }
});

test('fits the stage to a 1366×768 laptop screen', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto(url(''));
  const width = await page.locator('[data-stage]').evaluate((el) => el.getBoundingClientRect().width);
  expect(Math.abs(width - 1365.3)).toBeLessThan(2);
});

test('replay starts the film again from the beginning', async ({ page }) => {
  await page.goto(url('?scene=7&speed=40'));
  await page.click('[data-start]');
  await page.locator('[data-replay]').click({ timeout: 30_000 });
  await expect(page.locator('[data-replay]')).toHaveCount(0);
  await expect(page.locator('[data-start]')).toHaveCount(0);
});
