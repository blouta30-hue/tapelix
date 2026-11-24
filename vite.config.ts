import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-tapelix-static-assets',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      // Copy classic script.js used by index.html
      const scriptSrc = path.resolve(__dirname, 'script.js');
      if (fs.existsSync(scriptSrc)) {
        fs.copyFileSync(scriptSrc, path.resolve(distDir, 'script.js'));
      }

      // Copy images/ directory if not already copied from public/images
      const imagesSrc = path.resolve(__dirname, 'images');
      const imagesDest = path.resolve(distDir, 'images');
      if (fs.existsSync(imagesSrc)) {
        fs.cpSync(imagesSrc, imagesDest, {recursive: true, force: false});
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyStaticAssetsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          order: path.resolve(__dirname, 'order.html'),
          nfcCards: path.resolve(__dirname, 'nfc-cards.html'),
          nfcTableStands: path.resolve(__dirname, 'nfc-table-stands.html'),
          digitalMenu: path.resolve(__dirname, 'digital-menu.html'),
          digitalCards: path.resolve(__dirname, 'digital-cards.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
