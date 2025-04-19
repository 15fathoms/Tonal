declare module 'tonal-kit' {
    // Allowed output color formats
    export type ColorFormat = 'hex' | 'oklch' | 'rgb' | 'hsl';

    // A single color palette with tone stops
    export type SinglePalette = {
        [stop in 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950]: string;
    };

    // Full color palettes collection
    export type FullPalette = Record<string, SinglePalette>;

    /**
     * Generate full tonal palettes from base colors
     * @param colors Object of base colors (e.g. { red: '#d33333' })
     * @param format Output color format (defaults to 'hex')
     * @returns A full palette object per color
     */
    export function generatePalette(
        colors: Record<string, string | Partial<SinglePalette>>,
        format?: ColorFormat
    ): FullPalette;

    /**
     * Export the palette in a specific file format
     * @param palette Output from generatePalette
     * @param ext Output file format ('css', 'scss', 'less', 'stylus', 'js', 'bulma')
     * @returns A string with formatted variables or tokens
     */
    export function exportPalette(
        palette: FullPalette,
        ext: 'css' | 'scss' | 'less' | 'stylus' | 'js' | 'bulma'
    ): string;

    /**
     * Generate an HTML preview file for visualizing palettes
     * @param palette Output from generatePalette
     * @param format Format to display (defaults to 'hex')
     * @param filename Output filename (defaults to 'tonal-preview.html')
     */
    export function generatePreviewHTML(
        palette: FullPalette,
        format?: ColorFormat,
        filename?: string
    ): void;

    /**
     * Define a Tonal configuration (used in tonal.config.js)
     * @param config Object with a `colors` key
     */
    export function defineConfig<T extends { colors: Record<string, string> }>(
        config: T
    ): T;
}
