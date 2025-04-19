#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { generatePalette } from './tonal-core.js';
import { exportPalette } from './exporters.js';
import { generatePreviewHTML } from './preview.js';
import open from 'open';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const program = new Command();

const configPath = path.resolve(process.cwd(), 'tonal.config.js');
let config;
try {
  const module = await import(pathToFileURL(configPath).href);
  config = module.default;
} catch (err) {
  console.error('tonal.config.js not found or invalid.');
  process.exit(1);
}

const extMap = {
  scss: 'scss',
  css: 'css',
  less: 'less',
  stylus: 'styl',
  bulma: 'sass',
  js: 'js'
};

program
  .command('generate')
  .description('Generate all palettes from tonal.config.js')
  .option('-e, --ext <ext>', 'Output file extension', 'css')
  .option('-f, --format <fmt>', 'Color format (hex, oklch, rgb, hsl)', 'hex')
  .option('-o, --out-dir <dir>', 'Output directory', './tonal')
  .option('--file <name>', 'Output filename (without extension)', 'colors')
  .option('-p, --preview', 'Generate and open an HTML preview')
  .action(async ({ ext = 'css', format = 'oklch', outDir = './tonal', file = 'colors', preview: previewFlag }) => {
    const extMap = {
      scss: 'scss',
      css: 'css',
      less: 'less',
      stylus: 'styl',
      bulma: 'sass',
      js: 'js'
    };

    const colorFormats = ['hex', 'oklch', 'rgb', 'hsl'];

    if (!extMap[ext]) {
      console.error(`Unknown file extension: "${ext}". Supported: ${Object.keys(extMap).join(', ')}`);
      process.exit(1);
    }

    if (!colorFormats.includes(format)) {
      console.error(`Unknown color format: "${format}". Supported: ${colorFormats.join(', ')}`);
      process.exit(1);
    }

    const extName = extMap[ext];
    const fullPath = path.join(outDir, `${file}.${extName}`);
    fs.mkdirSync(outDir, { recursive: true });

    const allPalettes = generatePalette(config.colors, format);
    const output = exportPalette(allPalettes, ext);

    fs.writeFileSync(fullPath, output);
    console.log(`All palettes exported as .${extName} → ${fullPath}`);

    if (previewFlag) {
      const previewPath = path.join(outDir, 'preview.html');
      generatePreviewHTML(allPalettes, format, previewPath);
      await open(previewPath);
    }
  });



// Commande : preview
program
  .command('preview')
  .description('Generate an HTML preview of all palettes')
  .option('-f, --format <fmt>', 'Display format', 'oklch')
  .option('--file <path>', 'HTML output file', 'tonal-preview.html')
  .option('-o, --open', 'Open the file in browser')
  .action(async ({ format, file, open: openFlag }) => {
    const allPalettes = generatePalette(config.colors, format);
    generatePreviewHTML(allPalettes, format, file);
    if (openFlag) {
      await open(file);
    }
  });

program.parse();