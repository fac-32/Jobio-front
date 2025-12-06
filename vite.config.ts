import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000/',
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.ts',
    },
});
