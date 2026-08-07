import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { draftPreviewPlugin } from './server/draftPreviewPlugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    let allowedHost = 'localhost';
    if (env.BLOG_PREVIEW_HOST) {
      try {
        allowedHost = new URL(env.BLOG_PREVIEW_HOST).hostname;
      } catch {
        // The preview middleware returns a configuration error on its private path.
      }
    }
    return {
      server: {
        port: 3000,
        // Tailscale Serve terminates HTTPS and proxies to this loopback listener.
        host: '127.0.0.1',
        allowedHosts: [allowedHost],
      },
      plugins: [draftPreviewPlugin(env), react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
