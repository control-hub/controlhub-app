import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		watch: {
			usePolling: true,
			interval: 300
		}
	},
	optimizeDeps: {
		exclude: ['monaco-editor']
	}
});
