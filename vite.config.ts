import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React libraries
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],

            // UI & Animation libraries
            'vendor-ui': ['framer-motion', 'lucide-react'],

            // Contexts (lazy load)
            'contexts': [
              './context/SystemContext',
              './context/BusinessContext',
              './context/ContentContext',
              './context/UIContext'
            ],

            // Dashboard modules (separate chunks)
            'dashboard-crm': ['./components/dashboard/modules/crm-intelligence/CRM'],
            'dashboard-finance': ['./components/dashboard/modules/financial-intelligence/FinancialHub'],
            'dashboard-content': ['./components/dashboard/content/WritingWorkspace'],
            'dashboard-marketing': ['./components/dashboard/modules/marketing-growth/MarketingGrowth'],

            // AI & Heavy libraries
            // AI & Heavy libraries
            'markdown': ['react-markdown', 'remark-gfm']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
