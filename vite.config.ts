import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // Important for Electron to find assets
  build: {
    outDir: 'dist', // Define the output directory
    emptyOutDir: true, // Clean the output directory on each build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html')
      },
      // output: {
      //   // Electron specific settings
      //   format: 'cjs',
      //   entryFileNames: 'assets/[name].cjs',
      //   chunkFileNames: 'assets/[name].cjs',
      //   assetFileNames: 'assets/[name].[ext]'
      // }
    }
  }
});
