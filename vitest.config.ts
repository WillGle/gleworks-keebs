import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const runDir = process.env.GLEWORKS_RUN_DIR || path.resolve('logs', `${new Date().toISOString().replace(/[:.]/g, '-')}-direct-vitest-${process.pid}`)

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/test/**/*.test.{ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      reportOnFailure: true,
      reportsDirectory: path.join(runDir, 'coverage'),
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
})
