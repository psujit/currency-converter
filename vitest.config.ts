/// <reference types="vitest" />
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// https://vitest.dev/config/
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      css: true,
      include: ['./src/**/*.test.{ts,tsx}'],
      exclude: [
        ...configDefaults.exclude,
        '**/node_modules/**',
        '**/dist/**',
        '**/.{idea,git,cache,output,temp}/**',
      ],
      coverage: {
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.{idea,git,cache,output,temp}/**',
          './src/*.ts',
          './src/*.tsx',
          '**/*.config.ts',
          '**/*.cjs',
        ],
      },
    },
  }),
)
