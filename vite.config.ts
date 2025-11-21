import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // PENTING: base: './' memastikan aset (js/css) dimuat secara relatif.
  // Ini wajib agar aplikasi berjalan di sub-folder XAMPP (misal: localhost/fti-signage/)
  base: './', 
  server: {
    port: 3000,
  }
});