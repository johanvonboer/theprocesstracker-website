# Website Baseplate (Webpack + Node.js)

A lightweight starter for building websites with Webpack and npm.

## Requirements

- Node.js 18+
- npm 9+

## Scripts

- `npm start`: runs Webpack Dev Server on port 3000
- `npm run build`: builds production files into `dist/`

## Project Structure

- `src/index.js`: app entry point
- `src/styles.css`: starter styles
- `src/template.html`: HTML template for HtmlWebpackPlugin
- `webpack.common.js`: shared config
- `webpack.dev.js`: development config
- `webpack.prod.js`: production config

## Quick Start

```bash
npm install
npm start
```

Production build:

```bash
npm run build
```
