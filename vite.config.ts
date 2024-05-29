import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/__/auth/': {
				target: 'https://piventory.firebaseapp.com',
				changeOrigin: true,
			},
		},
	},
});