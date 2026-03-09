import react from '@vitejs/plugin-react';
import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
    },
    dts: true,
    format: ['esm', 'cjs'],
    exports: true,
    deps: {
      alwaysBundle: ['@base-ui/**'],
      onlyAllowBundle: ['@base-ui/**'],
    },
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
  },
]);
