import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { site, items, contact } from '../src/data/site.ts';

// Seam: the built page. Run `astro build` first (npm test does).
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

/** HTML of the element with this id, up to the next item. */
const itemHtml = (id) => html.split(`id="${id}"`)[1]?.split('class="item"')[0] ?? '';
/** Text as Astro escapes it in the HTML. */
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll("'", '&#39;').replaceAll('"', '&quot;');

test('ships exactly one inline script and no external scripts', () => {
  const scripts = html.match(/<script[^>]*>/gi) ?? [];
  assert.equal(scripts.length, 1);
  assert.doesNotMatch(scripts[0], /\ssrc=/);
});

test('has no external stylesheet and inlines CSS', () => {
  assert.doesNotMatch(html, /<link[^>]+rel="?stylesheet/i);
  assert.match(html, /<style/i);
});

test('every item renders a summary and a detail block', () => {
  assert.match(html, /<main/);
  for (const item of items) {
    const h = itemHtml(item.id);
    assert.match(h, /class="summary/, item.id);
    assert.match(h, /class="detail/, item.id);
    assert.ok(h.includes(esc(item.title)), item.id);
    assert.ok(h.includes(esc(item.summary)), item.id);
    for (const p of item.detail ?? []) assert.ok(h.includes(esc(p)), item.id);
  }
});

test('hero is first and nav links to each labelled item', () => {
  assert.equal(items[0].id, 'hero');
  assert.match(html, /<h1[^>]*>[^<]*Nguyễn Hải Quân/);
  for (const item of items.filter((i) => i.nav)) {
    assert.match(html, new RegExp(`<a[^>]+href="#${item.id}"`), item.id);
  }
});

test('has a swap button', () => {
  assert.match(html, /<button[^>]+class="swap"[^>]+aria-label="[^"]+"/);
});

test('renders contact links', () => {
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

test('has title, description and Open Graph metadata', () => {
  assert.match(html, new RegExp(`<title>${site.title}</title>`));
  assert.match(html, /<meta name="description" content="[^"]+"/);
  for (const p of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
    assert.match(html, new RegExp(`<meta property="${p}" content="[^"]+"`), p);
  }
});
