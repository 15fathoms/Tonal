// index.js

/**
 * @typedef {Object} TonalUserConfig
 * @property {Record<string, string | Record<number, string>>} colors
 */

/**
 * @param {TonalUserConfig} config
 * @returns {TonalUserConfig}
 */
export function defineConfig(config) {
    return config;
  }
  
  export { generatePalette, STOPS } from './tonal-core.js';
  export { exportPalette } from './exporters.js';
  export { generatePreviewHTML } from './preview.js';