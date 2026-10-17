import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { profile, experience, skills, projects, education, contact, techStack } from '../src/data/site.ts';

// Seam: the built page. Run `astro build` first (npm test does).
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

/** Text as Astro escapes it in the HTML. */
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll("'", '&#39;').replaceAll('"', '&quot;');
const has = (s, msg) => assert.ok(html.includes(esc(s)), msg ?? s);

test('ships at most one inline script and no external scripts', () => {
  const scripts = html.match(/<script[^>]*>/gi) ?? [];
  assert.ok(scripts.length <= 1);
  for (const s of scripts) assert.doesNotMatch(s, /\ssrc=/);
});

test('has no external stylesheet and inlines CSS', () => {
  assert.doesNotMatch(html, /<link[^>]+rel="?stylesheet/i);
  assert.match(html, /<style/i);
});

test('self-hosts woff2 fonts', () => {
  assert.match(html, /@font-face/);
  assert.match(html, /font-family:\s*["']?Raleway/);
  assert.match(html, /font-family:\s*["']?IBM Plex Mono/);
  assert.match(html, /url\(["']?\/portfolio\/[^)]+\.woff2/);
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/);
});

const sections = ['home', 'experience', 'skills', 'education', 'contact'];

test('renders landmarks, sections and nav links', () => {
  for (const tag of ['<header', '<nav', '<main', '<footer']) assert.ok(html.includes(tag), tag);
  for (const id of sections) {
    assert.match(html, new RegExp(`<section[^>]+id="${id}"`), id);
    assert.match(html, new RegExp(`<a[^>]+href="#${id}"`), id);
  }
});

test('recent work is shown only when there are projects', () => {
  const shown = /<section[^>]+id="work"/.test(html);
  assert.equal(shown, projects.length > 0);
  assert.equal(/href="#work"/.test(html), projects.length > 0);
  for (const p of projects) has(p.title);
});

test('renders content from site data', () => {
  has(profile.name);
  has(profile.intro);
  for (const t of techStack) has(t);
  has(experience.org);
  for (const c of experience.cases) has(c.title);
  for (const g of skills) has(g.title);
  has(education.school);
  for (const href of Object.values(contact)) assert.ok(html.includes(href), href);
});

test('hero CTA links to contact', () => {
  assert.match(html, /<a[^>]+class="[^"]*cta[^"]*"[^>]+href="#contact"|<a[^>]+href="#contact"[^>]+class="[^"]*cta/);
});

test('menu button for mobile nav', () => {
  assert.match(html, /<button[^>]+aria-controls="nav-links"[^>]+aria-expanded="false"/);
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
  assert.match(html, new RegExp(`<title>${profile.title}</title>`));
  assert.match(html, /<meta name="description" content="[^"]+"/);
  for (const p of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
    assert.match(html, new RegExp(`<meta property="${p}" content="[^"]+"`), p);
  }
});
