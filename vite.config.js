import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  css: {
    postcss: {
      plugins: [
        require('postcss-nested'),
        require('autoprefixer')
      ]
    }
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, 'src/components'),
      "@assets": path.resolve(__dirname, 'src/assets'),

    }
  }
});
