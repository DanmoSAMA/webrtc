import { defineConfig } from 'vite';
import { compilerOptions } from './tsconfig.json';
import { svgBuilder } from './src/plugins/svgBuilder';
import { BackendHost } from './src/consts';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    svgBuilder('./assets/icons/'),
    mkcert({ source: 'coding' }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: Object.fromEntries(
      Object.entries(compilerOptions.paths).map(([key, value]) => [
        key.replace('*', ''),
        // `/${value[0].replace('*', '')}`,
        new URL('src/', import.meta.url).pathname,
      ]),
    ),
  },
  server: {
    proxy: {
      '/api': {
        target: `${BackendHost}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    https: true,
  },
});
