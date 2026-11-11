import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// `vite build --mode artifact` makes a self-contained preview copy with relative
// paths and #/hash routes, so it can be hosted anywhere for a quick look.
export default defineConfig(({ mode }) => ({
  base: mode === 'artifact' ? './' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
  ssr: {
    noExternal: ['gsap', '@gsap/react', 'lenis', 'motion', 'wouter'],
  },
}));
