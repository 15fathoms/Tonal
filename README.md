# Tonal

**Tonal** is a smart color palette generator inspired by Tailwind CSS — fully customizable, format-agnostic, and powered by OKLCH. Generate complete color scales in multiple formats (CSS, SCSS, JS, etc.) via CLI or programmatically.

---

## Installation

```bash
npm install tonal-kit
```

For CLI usage globally:

```bash
npm install -g tonal-kit
```

---

## Configuration

Tonal expects a `tonal.config.js` file at the root of your project:

```js
import { defineConfig } from 'tonal-kit';

export default defineConfig({
  colors: {
    red: '#ef4444',
    blue: '#3b82f6',
    neutral: '#737373',
    // Add as many colors as you want
  }
});
```

Each color is defined using a single HEX value. Tonal will generate the full scale from `50` to `950`.

---

## CLI Usage

### `generate`
Generate a palette file in the format of your choice:

```bash
tonal generate
```

**Options:**

| Flag              | Description                                | Default       |
|-------------------|--------------------------------------------|---------------|
| `--ext`, `-e`     | Output file extension                      | `css`         |
| `--format`, `-f`  | Color model (`hex`, `oklch`, `rgb`, `hsl`) | `hex`         |
| `--file`          | Output filename (without extension)        | `colors`      |
| `--out-dir`, `-o` | Output directory                           | `./tonal`     |
| `--preview`, `-p` | Also generate and open a visual preview    | `tonal/preview.html` |

**Example:**
```bash
tonal generate -e scss -f oklch --preview
```
Generates `./tonal/colors.scss` and opens the preview in browser.

---

### `preview`
Only generate a preview HTML file to visualize the palette:

```bash
tonal preview
```

**Options:**

| Flag              | Description                                | Default               |
|-------------------|--------------------------------------------|-----------------------|
| `--format`, `-f`  | Color model to preview                     | `oklch`               |
| `--file`          | Output HTML file                           | `tonal-preview.html`  |
| `--open`, `-o`    | Open the preview in browser                | `false`               |

---

## Programmatic Usage

Use Tonal in a frontend or Node.js context:

```js
import { generatePalette, exportPalette } from 'tonal';

const palette = generatePalette('blue', '#3b82f6', 'oklch');
const css = exportPalette({ blue: palette }, 'css');

console.log(css); // → Full :root CSS block
```

Useful for live previews or copy-paste snippets.

---

## Output Formats

### CSS
```css
:root {
  --blue-50: #eff6ff;
  --blue-100: #dbeafe;
  --blue-500: #3b82f6;
  --blue-950: #0c1b34;
}
```

### SCSS / Sass / Bulma
```scss
$blue-50: #eff6ff;
$blue-500: #3b82f6;
```

### Less
```less
@blue-50: #eff6ff;
@blue-500: #3b82f6;
```

### Stylus
```stylus
blue-50 = #eff6ff
blue-500 = #3b82f6
```

### JS
```js
export const blue = {
  50: '#eff6ff',
  100: '#dbeafe',
  500: '#3b82f6',
  950: '#0c1b34'
};
```

---

## How it works

Tonal uses perceptual OKLCH space and curve-based rules to:

- Create color scales from a single value
- Handle neutral tones gracefully
- Automatically shift hue/chroma across the tonal range

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### Install dependencies
```bash
npm install
```

### Run tests
```bash
npm test
```

### Tests coverage
All new features must include unit tests. The current test suite covers:

#### For `generatePalette()`
- Generates exactly 11 stops (50 → 950)
- Handles low contrast and dark input colors
- Throws an error on invalid input (e.g., `'r'`)
- Returns correct output formats (hex, oklch, rgb, hsl)

#### For `exportPalette()`
- Matches expected syntax per format using regex
- Generates one and only one `:root {}` block in CSS
- Ensures no duplicate variable names

#### For `generatePreviewHTML()`
- Ensures color names and values are present
- Correct color format is used in style blocks
- Verifies output file is correctly written

#### For the CLI
- Simulates options like `--out-dir`, `--file`, `--preview`
- Ensures `--file` naming is respected
- Optionally mocks `open()` to ensure it is triggered when expected

Feel free to add more formats or improve existing ones.
If you have a specific format in mind, let us know!
We can add it to the list of supported formats.

---

## License

MIT