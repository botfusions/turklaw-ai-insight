
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false // Reduce overlay noise in development
    }
  },
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Reduce bundle size
      jsxImportSource: '@emotion/react'
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for production
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-slot', '@radix-ui/react-toast'],
          supabase: ['@supabase/supabase-js'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
    // Optimize build performance
    target: 'esnext',
    cssCodeSplit: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react'
    ],
    // Force optimization of problematic packages
    force: mode === 'development'
  },
  esbuild: {
    // Optimize for both development and production
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'empty-import-meta': 'silent'
    },
    target: 'esnext',
    format: 'esm'
  },
  // Add error handling for development
  define: {
    __DEV__: mode === 'development'
  }
}));
