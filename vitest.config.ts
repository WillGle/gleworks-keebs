import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

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
      reportsDirectory: process.env.GLEWORKS_RUN_DIR ? `${process.env.GLEWORKS_RUN_DIR}/coverage` : 'coverage',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
})
