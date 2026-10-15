import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Seam: the built page. Run `astro build` first (npm test does).
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('ships zero JavaScript', () => {
  assert.doesNotMatch(html, /<script/i);
});

test('has no external stylesheet and inlines CSS', () => {
  assert.doesNotMatch(html, /<link[^>]+rel="?stylesheet/i);
  assert.match(html, /<style/i);
});

test('follows OS light/dark theme', () => {
  assert.match(html, /color-scheme:\s*light dark/);
  assert.match(html, /light-dark\(/);
});

test('renders all sections with landmarks', () => {
  assert.match(html, /<header/);
  assert.match(html, /<nav/);
  assert.match(html, /<main/);
  for (const id of ['hero', 'about', 'experience', 'projects', 'contact']) {
    assert.match(html, new RegExp(`<section[^>]+id="${id}"`), id);
  }
});

test('nav links to each section', () => {
  for (const id of ['about', 'experience', 'projects', 'contact']) {
    assert.match(html, new RegExp(`<a[^>]+href="#${id}"`), id);
  }
});

test('renders content from site data', async () => {
  const { site, projects, contact } = await import('../src/data/site.ts');
  assert.ok(html.includes(site.name));
  assert.ok(html.includes(site.tagline));
  for (const p of projects) assert.ok(html.includes(p.title), p.title);
  for (const href of Object.values(contact)) assert.ok(html.includes(href), href);
});

test('images are webp, lazy (except avatar), with alt', () => {
  const imgs = html.match(/<img[^>]*>/g) ?? [];
  assert.ok(imgs.length > 0);
  for (const img of imgs) {
    assert.match(img, /src="[^"]+\.webp"/, img);
    assert.match(img, /alt="[^"]+"/, img);
    if (!/class="[^"]*avatar/.test(img)) assert.match(img, /loading="lazy"/, img);
  }
});

test('has title, description and Open Graph metadata', async () => {
  const { site } = await import('../src/data/site.ts');
  assert.match(html, new RegExp(`<title>${site.title}</title>`));
  assert.match(html, /<meta name="description" content="[^"]+"/);
  for (const p of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
    assert.match(html, new RegExp(`<meta property="${p}" content="[^"]+"`), p);
  }
});
