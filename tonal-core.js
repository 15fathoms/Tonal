// tonal-core.js
import Color from 'colorjs.io';

/** @type {number[]} */
export const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * @param {number} chroma
 * @returns {boolean}
 */
function isNeutral(chroma) {
  return chroma < 0.01;
}

/**
 * @param {number} h
 * @param {number} distance
 * @returns {number}
 */
function getHueShift(h, distance) {
  const curve = Math.pow(Math.abs(distance), 1.1);
  let shift = 0;

  if (h >= 0 && h < 60) shift = -curve * 6;
  else if (h >= 60 && h < 120) shift = -curve * 10;
  else if (h >= 120 && h < 180) shift = -curve * 6;
  else if (h >= 180 && h < 240) shift = -curve * 4;
  else if (h >= 240 && h < 300) shift = +curve * 4;
  else if (h >= 300 && h < 330) shift = +curve * 6;

  return shift * Math.sign(distance);
}

/**
 * @param {Color} baseColor
 * @returns {{ lightness: Record<number, number>, chroma: Record<number, number>, hue: Record<number, number> }}
 */
function generateDynamicRatios(baseColor) {
  const [l, c, h] = baseColor.oklch;
  const neutral = isNeutral(c);

  const chroma = {};
  const hue = {};
  const lightness = {};

  for (let i = 0; i < STOPS.length; i++) {
    const stop = STOPS[i];
    const distance = (stop - 500) / 450;
    const ease = 1 - Math.abs(distance);

    lightness[stop] = Math.max(0, Math.min(1, l + Math.sign(-distance) * Math.pow(Math.abs(distance), 0.85) * 0.4));
    chroma[stop] = neutral ? 0 : c * (0.4 + 0.6 * ease);

    const hueShift = getHueShift(h, distance);
    hue[stop] = neutral ? 0 : (h + hueShift);
  }

  return { lightness, chroma, hue };
}

/**
 * @param {Color} color
 * @param {string} format
 * @returns {string}
 */
function generateColorValue(color, format) {
  switch (format) {
    case 'rgb': {
      const [r, g, b] = color.to('srgb').coords.map(n => Math.round(n * 255));
      return `rgb(${r}, ${g}, ${b})`;
    }
    case 'hsl':
      return color.to('hsl').toString({ format: 'css' });
    case 'oklch': {
      const [l, c, h] = color.oklch;
      return `oklch(${(l * 100).toFixed(2)}% ${c.toFixed(4)} ${isFinite(h) ? h.toFixed(2) : 0})`;
    }
    case 'hex':
    default:
      return color.to('srgb').toString({ format: 'hex' });
  }
}

/**
 * Génère toutes les palettes d'un coup
 * @param {Record<string, string | Record<number, string>>} colors 
 * @param {'hex' | 'oklch' | 'rgb' | 'hsl'} format 
 * @returns {Record<string, Record<number, string>>}
 */
export function generatePalette(colors, format = 'hex') {
  const result = {};
  let baseColor;

  for (const [name, def] of Object.entries(colors)) {
    const baseHex = typeof def === 'string' ? def : def[500];
    try {
      baseColor = new Color(baseHex);
    } catch (err) {
      throw new Error(`Invalid color "${baseHex}" for "${name}": ${err.message}`);
    }
    const dynamicRatios = generateDynamicRatios(baseColor);

    result[name] = {};

    for (const stop of STOPS) {
      let color;
      if (stop === 500) {
        color = baseColor;
      } else {
        const l = dynamicRatios.lightness[stop];
        const c = dynamicRatios.chroma[stop];
        const h = dynamicRatios.hue[stop];
        color = new Color('oklch', [l, c, h]);
      }
      result[name][stop] = generateColorValue(color, format);
    }
  }

  return result;
}