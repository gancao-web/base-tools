import { fileURLToPath } from 'url';
import path from 'path';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@base-web-kits/base-tools-ts': path.resolve(__dirname, 'src/ts/index.ts'),
    },
  },
});
