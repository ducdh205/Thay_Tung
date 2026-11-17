/// <reference types="vitest" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { content } from './src/content';
import { findPlaceholders } from './src/engine/placeholders';

/** Loud build-time reminder while on-screen copy still has "[...]" placeholders (e.g. the signature). */
function placeholderWarning(): Plugin {
  return {
    name: 'placeholder-warning',
    apply: 'build',
    closeBundle() {
      const left = findPlaceholders(content);
      if (left.length === 0) return;
      const bar = '!'.repeat(64);
      console.warn(`\n${bar}\n  CHÚ Ý: src/content.ts vẫn còn chữ mẫu cần sửa:\n${left.map((p) => `    - ${p}`).join('\n')}\n${bar}\n`);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile(), placeholderWarning()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
});
