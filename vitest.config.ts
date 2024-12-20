import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    reporters: ['default'],
    outputFile: {
      json: './json-report.json'
    },
    include: ['**/*.test.ts', '**/*.test.tsx'],
    setupFiles: [resolve(__dirname, 'vitest.setup.ts')],
    globals: true,
    passWithNoTests: true
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
