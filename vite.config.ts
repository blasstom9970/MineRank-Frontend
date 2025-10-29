import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    // VITE_ 접두사 환경변수만 로드
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    
    // 환경변수 디버깅
    console.log('Mode:', mode);
    console.log('Command:', command);
    console.log('Environment variables:', env);

    return {
      plugins: [react()],
      server: {
        port: 5173
      },
      define: {
        // 전역 환경변수 정의
        'process.env': JSON.stringify({
          NODE_ENV: mode,
          VITE_MAIN_API_URL: env.VITE_MAIN_API_URL,
          VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY,
        })
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});