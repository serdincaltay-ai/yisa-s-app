import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'e2e'],
    setupFiles: ['__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
