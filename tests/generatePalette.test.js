// test/generatePalette.test.js

import assert from 'assert';
import fs from 'fs';
import { generatePalette } from '../tonal-core.js';
import { exportPalette } from '../exporters.js';
import { generatePreviewHTML } from '../preview.js';

describe('generatePalette', () => {
  it('should generate 11 steps from 50 to 950', () => {
    const palette = generatePalette({ blue: '#3b82f6' }, 'hex').blue;
    assert.strictEqual(Object.keys(palette).length, 11);
    assert.ok(palette['50']);
    assert.ok(palette['950']);
  });

  it('should handle very dark colors', () => {
    const palette = generatePalette({ dark: '#0a0a0a' }, 'hex').dark;
    assert.strictEqual(Object.keys(palette).length, 11);
  });

  it('should handle low contrast colors', () => {
    const palette = generatePalette({ low: '#888888' }, 'hex').low;
    assert.strictEqual(Object.keys(palette).length, 11);
  });

  it('should throw on invalid color input', () => {
    assert.throws(() => generatePalette({ invalid: 'r' }, 'hex'));
  });

  it('should return hex values', () => {
    const palette = generatePalette({ blue: '#3b82f6' }, 'hex').blue;
    assert.ok(palette['500'].startsWith('#'));
  });

  it('should return oklch values', () => {
    const palette = generatePalette({ red: '#ef4444' }, 'oklch').red;
    assert.ok(palette['500'].startsWith('oklch('));
  });

  it('should return rgb values', () => {
    const palette = generatePalette({ red: '#ef4444' }, 'rgb').red;
    assert.ok(palette['500'].startsWith('rgb('));
  });

  it('should return hsl values', () => {
    const palette = generatePalette({ red: '#ef4444' }, 'hsl').red;
    assert.ok(palette['500'].startsWith('hsl('));
  });
});

describe('exportPalette', () => {
  const palette = generatePalette({ red: '#ef4444' }, 'hex').red;

  it('should output valid CSS variables', () => {
    const css = exportPalette({ red: palette }, 'css');
    assert.match(css, /:root {[^}]+--red-500: #[0-9a-f]{6};[^}]+}/);
  });

  it('should output valid SCSS variables', () => {
    const scss = exportPalette({ red: palette }, 'scss');
    assert.match(scss, /\$red-500: #[0-9a-f]{6};/);
  });

  it('should not duplicate CSS variables', () => {
    const css = exportPalette({ red: palette }, 'css');
    const matches = css.match(/--red-500/g);
    assert.strictEqual(matches.length, 1);
  });

  it('should wrap once in :root {} for CSS', () => {
    const css = exportPalette({ red: palette }, 'css');
    const roots = (css.match(/:root {/g) || []).length;
    assert.strictEqual(roots, 1);
  });
});

describe('generatePreviewHTML', () => {
  const out = './test-output.html';
  afterEach(() => fs.existsSync(out) && fs.unlinkSync(out));

  it('should generate HTML with color names', () => {
    const palettes = generatePalette({ blue: '#3b82f6' }, 'oklch');
    generatePreviewHTML(palettes, 'oklch', out);
    const content = fs.readFileSync(out, 'utf-8');
    assert.match(content, /<th class=\"row-label\">blue<\/th>/);
  });

  it('should generate HTML using oklch values', () => {
    const palettes = generatePalette({ blue: '#3b82f6' }, 'oklch');
    generatePreviewHTML(palettes, 'oklch', out);
    const content = fs.readFileSync(out, 'utf-8');
    assert.match(content, /oklch\(/);
  });

  it('should write the file to expected location', () => {
    const palettes = generatePalette({ blue: '#3b82f6' }, 'oklch');
    generatePreviewHTML(palettes, 'oklch', out);
    assert.ok(fs.existsSync(out));
  });
});
