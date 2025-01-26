import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  logLevel: 'debug',
  plugins: [
    vue(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./frontend', import.meta.url)),
    },
  },

server: {
  proxy: {
    '/api': {
      target: 'http://localhost:9000',
      changeOrigin: true,
      // Añadir configuración de timeout
      timeout: 5000,
      // Añadir logs de proxy
      configure: (proxy, options) => {
        proxy.on('error', (err, req, res) => {
          console.log('Proxy error:', err);
        });
      }
    }
  }
}
});




