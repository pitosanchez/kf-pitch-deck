import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
    },
    css: {
        postcss: './postcss.config.js'
    },
    publicDir: 'public',
    base: process.env.NODE_ENV === 'production' ? '/kf-pitch-deck/' : '/'
}); 