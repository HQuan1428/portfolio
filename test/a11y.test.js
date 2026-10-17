import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

// Seam: the built page. Run `astro build` first (npm test does).
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('axe finds no WCAG 2.x A/AA violations', async () => {
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true });
  const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
  dom.window.eval(axeSource);
  // jsdom has no layout or computed colours, so contrast is checked separately below.
  const { violations } = await dom.window.axe.run(dom.window.document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    rules: { 'color-contrast': { enabled: false } },
  });
  assert.equal(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`).join('\n'), '');
});

/** Value of a CSS custom property from the inlined :root block. */
const token = (name) => {
  const hex = html.match(new RegExp(`--${name}:\\s*#([0-9a-f]{6}|[0-9a-f]{3})\\b`, 'i'))?.[1];
  // The build minifies #ffffff to #fff.
  return hex && `#${hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex}`;
};
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const pairs = [
  // [foreground, background, minimum ratio]
  ['fg', 'bg', 4.5],
  ['muted', 'bg', 4.5],
  ['muted', 'panel', 4.5],
  ['accent-hi', 'bg', 4.5],
  ['on-accent', 'accent', 4.5],
  ['control', 'panel', 3], // non-text UI borders (WCAG 1.4.11)
];

for (const [fg, bg, min] of pairs) {
  test(`contrast ${fg} on ${bg} ≥ ${min}:1`, () => {
    const [f, b] = [token(fg), token(bg)];
    assert.ok(f && b, `tokens --${fg}/--${bg} defined`);
    assert.ok(contrast(f, b) >= min, `${f} on ${b} = ${contrast(f, b).toFixed(2)}`);
  });
}
