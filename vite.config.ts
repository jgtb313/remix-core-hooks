import { resolve } from 'node:path'
import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

const deps = [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)]

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }) as PluginOption,
    dts({
      insertTypesEntry: true
    }) as PluginOption
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'remix-core-hooks',
      formats: ['es', 'umd'],
      fileName: (format) => `remix-core-hooks.${format}.js`
    },
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      external: deps,
      output: {
        exports: 'named',
        globals: {
          ...deps.reduce(
            (globals, dep) => ({
              ...globals,
              [dep]: dep
            }),
            {}
          ),
          'react-dom': 'ReactDom'
        }
      }
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
