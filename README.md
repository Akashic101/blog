# blog

An Eleventy blog with Tailwind CSS styling.

## Setup

To install dependencies:

```bash
bun install
```

## Development

1. First, build the Tailwind CSS (run this in a separate terminal or in the background):

```bash
bun run css
```

2. Then, start the Eleventy development server:

```bash
bun run serve
```

The site will be available at `http://localhost:8080`

## Building for Production

1. Build Tailwind CSS:

```bash
bunx tailwindcss -i ./src/css/input.css -o ./src/css/output.css --minify
```

2. Build the site:

```bash
bun run build
```

The built site will be in the `_site` directory.

## Project Structure

- `src/` - Source files
  - `blog/` - Blog posts (Markdown files)
  - `_includes/layouts/` - Nunjucks layout templates
  - `css/` - CSS files (input.css for Tailwind, output.css is generated)
- `_site/` - Generated static site (created by Eleventy)
- `.eleventy.js` - Eleventy configuration
- `tailwind.config.js` - Tailwind CSS configuration
