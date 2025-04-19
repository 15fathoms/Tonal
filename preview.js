// preview.js
import fs from 'fs';

/** @type {number[]} */
const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * @param {Record<string, Record<number, string>>} palettes
 * @param {'hex' | 'oklch' | 'rgb' | 'hsl'} format
 * @param {string} filename
 */
export function generatePreviewHTML(palettes, format, filename = 'tonal-preview.html') {
  const rows = Object.entries(palettes)
    .map(([name, palette]) => {
      const cells = STOPS.map(shade => {
        const color = palette[shade];
        return `<td><div class="swatch" style="background:${color};"></div></td>`;
      }).join('');
      return `<tr><th class="row-label">${name}</th>${cells}</tr>`;
    })
    .join('\n');

  const header = STOPS.map(s => `<th class="col-label">${s}</th>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Palette Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      background: #111;
      color: #fff;
      font-family: 'Figtree', sans-serif;
      padding: 2rem;
      display: flex;
      justify-content: center;
    }
    table {
      border-collapse: separate;
      border-spacing: 10px;
      max-width: 900px;
      width: auto;
    }
    th.col-label {
      text-align: center;
      font-weight: 500;
      font-size: 0.75rem;
      padding: 0.25rem;
    }
    th.row-label {
      text-align: right;
      padding-right: 1rem;
      font-weight: 600;
      font-size: 0.9rem;
      white-space: nowrap;
    }
    td {
      padding: 0;
    }
    .swatch {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        <th></th>
        ${header}
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;

  fs.writeFileSync(filename, html, 'utf8');
  console.log(`🖼️  Preview saved as ${filename}`);
}
