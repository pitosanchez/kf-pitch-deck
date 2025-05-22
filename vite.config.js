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
    publicDir: 'public'
}); 