/**
 * @param {Record<string, Record<number, string>>} allPalettes
 * @param {'scss' | 'css' | 'less' | 'stylus' | 'bulma' | 'js'} format
 * @returns {string}
 */
export function exportPalette(allPalettes, format) {
  switch (format) {
    case 'scss':
      return Object.entries(allPalettes)
        .map(([name, palette]) =>
          Object.entries(palette).map(([k, v]) => `$${name}-${k}: ${v};`).join('\n')
        )
        .join('\n\n');

    case 'css':
      return `:root {\n${Object.entries(allPalettes)
        .flatMap(([name, palette]) =>
          Object.entries(palette).map(([k, v]) => `  --${name}-${k}: ${v};`)
        )
        .join('\n')}\n}`;

    case 'less':
      return Object.entries(allPalettes)
        .map(([name, palette]) =>
          Object.entries(palette).map(([k, v]) => `@${name}-${k}: ${v};`).join('\n')
        )
        .join('\n\n');

    case 'stylus':
      return Object.entries(allPalettes)
        .map(([name, palette]) =>
          Object.entries(palette).map(([k, v]) => `${name}-${k} = ${v}`).join('\n')
        )
        .join('\n\n');

    case 'bulma':
      return Object.entries(allPalettes)
        .map(([name, palette]) =>
          Object.entries(palette).map(([k, v]) => `$${name}-${k}: ${v} !default;`).join('\n')
        )
        .join('\n\n');

    case 'js':
      return Object.entries(allPalettes)
        .map(([name, palette]) => `export const ${name} = ${JSON.stringify(palette, null, 2)};`)
        .join('\n\n');

    default:
      return '';
  }
}
