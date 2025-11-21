import React from 'react';
import { Server, Database, Package, CheckCircle, Terminal, Monitor, Network, BookOpen, Code } from 'lucide-react';

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <section className="mb-12 scroll-mt-20" id={title.toLowerCase().replace(/\s/g, '-')}>
    <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">{title}</h3>
    {children}
  </section>
);

const ArchitectureBlueprint = () => {
  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-white">Dokumentasi & Panduan Sistem</h2>
        <p className="text-slate-400 mt-2">Instruksi kerja lengkap dari instalasi, konfigurasi server, hingga deployment signage.</p>
      </div>

      {/* Navigation Index */}
      <div className="bg-slate-900/50 p-4 rounded-lg mb-10 border border-slate-800">
        <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Daftar Isi</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a href="#1.-arsitektur-sistem" className="text-blue-400 hover:underline">1. Arsitektur Sistem</a>
            <a href="#2.-persiapan-lingkungan-(development)" className="text-blue-400 hover:underline">2. Persiapan Lingkungan (Development)</a>
            <a href="#3.-setup-backend-(wordpress)" className="text-blue-400 hover:underline">3. Setup Backend (WordPress)</a>
            <a href="#4.-build-&-deploy-(xampp)" className="text-blue-400 hover:underline">4. Build & Deploy (XAMPP)</a>
            <a href="#5.-setup-client-(mini-pc)" className="text-blue-400 hover:underline">5. Setup Client (Mini PC)</a>
            <a href="#6.-spesifikasi-api" className="text-blue-400 hover:underline">6. Spesifikasi API</a>
        </div>
      </div>

      {/* BAB 1: ARSITEKTUR */}
      <Section title="1. Arsitektur Sistem">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-slate-300 mb-4">
                Sistem Digital Signage FTI UII menggunakan arsitektur <strong>Headless CMS</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <Server className="mx-auto mb-3 text-blue-500" size={32} />
                    <h4 className="font-bold text-white">Server (Backend)</h4>
                    <p className="text-xs text-slate-400 mt-1">WordPress + XAMPP</p>
                    <p className="text-xs text-slate-500 mt-1">Menyimpan data, user, konten, dan menyediakan REST API.</p>
                </div>
                <div className="flex items-center justify-center">
                    <div className="h-0.5 w-full bg-slate-700 relative">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-2 text-xs text-slate-500">JSON API</span>
                    </div>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <Monitor className="mx-auto mb-3 text-green-500" size={32} />
                    <h4 className="font-bold text-white">Client (Frontend)</h4>
                    <p className="text-xs text-slate-400 mt-1">React JS (SPA)</p>
                    <p className="text-xs text-slate-500 mt-1">Menampilkan konten di Mini PC & Dashboard Admin.</p>
                </div>
            </div>
        </div>
      </Section>

      {/* BAB 2: PRE-REQUISITES */}
      <Section title="2. Persiapan Lingkungan (Development)">
        <div className="space-y-4">
            <p className="text-slate-400 text-sm">Sebelum melakukan perubahan kode, pastikan PC Developer terinstall:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm ml-4">
                <li><strong>Node.js</strong> (Versi 18 atau terbaru). Download di <code className="bg-slate-800 px-1 rounded">nodejs.org</code>.</li>
                <li><strong>Visual Studio Code</strong> (Text Editor).</li>
                <li><strong>XAMPP</strong> (Untuk simulasi server lokal).</li>
            </ul>
            
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mt-4">
                <h5 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Terminal size={16}/> Perintah Instalasi Awal</h5>
                <pre className="bg-black p-3 rounded text-green-400 font-mono text-xs">
{`# 1. Buka Terminal di folder project
cd fti-signage-cms

# 2. Install semua library yang dibutuhkan
npm install

# 3. Jalankan mode development (untuk coding)
npm run dev`}
                </pre>
            </div>
        </div>
      </Section>

      {/* BAB 3: WORDPRESS BACKEND */}
      <Section title="3. Setup Backend (WordPress)">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-start gap-4">
                 <div className="bg-blue-900/30 p-3 rounded-lg text-blue-400 shrink-0">
                    <Code size={24} />
                 </div>
                 <div>
                    <h4 className="text-lg font-bold text-white">Aktivasi API di WordPress</h4>
                    <p className="text-slate-300 text-sm mt-1 mb-4">
                       Secara default, WordPress tidak memiliki tipe data 'Signage'. Anda perlu menambahkan kode berikut ke dalam file <code>functions.php</code> di tema yang aktif.
                    </p>
                    
                    <div className="relative">
                        <div className="absolute top-0 right-0 bg-slate-800 text-xs px-2 py-1 rounded-bl text-slate-400">wp-content/themes/your-theme/functions.php</div>
                        <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-blue-300 overflow-x-auto border border-slate-800">
{`<?php
/* --- TAMBAHKAN KODE INI DI BAGIAN BAWAH FILE --- */

add_action('init', function() {
    // 1. Register Post Type: Unit Signage
    register_post_type('signage_unit', array(
        'labels' => array('name' => 'Signage Units'),
        'public' => true,
        'show_in_rest' => true, // WAJIB TRUE: Agar bisa diakses React App
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-video-alt3'
    ));
    
    // 2. Register Post Type: Konten
    register_post_type('signage_content', array(
        'labels' => array('name' => 'Materi Signage'),
        'public' => true,
        'show_in_rest' => true, 
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon' => 'dashicons-media-document'
    ));
});

// 3. Izinkan CORS (Agar React bisa akses dari domain/port berbeda jika perlu)
add_action( 'init', function() {
    header("Access-Control-Allow-Origin: *");
});
?>`}
                        </pre>
                    </div>
                 </div>
            </div>
        </div>
      </Section>

      {/* BAB 4: DEPLOYMENT XAMPP */}
      <Section title="4. Build & Deploy (XAMPP)">
        <div className="space-y-6">
            <div className="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg flex gap-3">
                <CheckCircle className="text-amber-500 shrink-0" size={20} />
                <div>
                    <h5 className="text-amber-200 font-bold text-sm">Konfigurasi Kunci: Base Path</h5>
                    <p className="text-amber-100/70 text-xs mt-1">
                        Agar aplikasi tidak <strong>Blank (Layar Putih)</strong> saat diletakkan di sub-folder XAMPP, pastikan file <code>vite.config.ts</code> berisi <code>base: './'</code>. Aplikasi ini sudah dikonfigurasi demikian secara default.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase">Langkah 1</span>
                    <h4 className="font-bold text-white text-lg mb-2">Build Project</h4>
                    <p className="text-sm text-slate-400 mb-3">Ubah kode React menjadi file HTML/JS statis.</p>
                    <pre className="bg-black p-2 rounded text-green-400 font-mono text-xs">npm run build</pre>
                    <p className="text-xs text-slate-500 mt-2">Hasilnya akan muncul di folder <code>dist/</code>.</p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase">Langkah 2</span>
                    <h4 className="font-bold text-white text-lg mb-2">Copy ke htdocs</h4>
                    <p className="text-sm text-slate-400 mb-3">Pindahkan isi folder <code>dist</code> ke server.</p>
                    <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
                        <li>Buka folder <code>C:\xampp\htdocs\</code></li>
                        <li>Buat folder baru: <code>fti-signage</code></li>
                        <li>Copy semua file dari folder <code>dist</code> ke dalamnya.</li>
                        <li>Akses di browser: <code>localhost/fti-signage</code></li>
                    </ol>
                </div>
            </div>
        </div>
      </Section>

      {/* BAB 5: CLIENT SETUP */}
      <Section title="5. Setup Client (Mini PC)">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h4 className="font-bold text-white mb-4">Instruksi Setting Mini PC (Windows 11)</h4>
            <ol className="space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                    <span className="bg-slate-800 h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold">1</span>
                    <div>
                        <strong>Koneksi Jaringan:</strong> Pastikan Mini PC terhubung ke Wi-Fi FTI yang sama dengan Server.
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="bg-slate-800 h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold">2</span>
                    <div>
                        <strong>Browser Kiosk Mode:</strong> Gunakan Chrome/Edge. Buat shortcut di desktop dengan target:<br/>
                        <code className="bg-slate-950 px-2 py-1 rounded text-blue-300 text-xs block mt-1 select-all">
                            "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --incognito "http://[IP_SERVER]/fti-signage/#/player/FTI-SIGNAGE-01"
                        </code>
                        <span className="text-xs text-slate-500 italic">Ganti FTI-SIGNAGE-01 sesuai ID masing-masing lokasi.</span>
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="bg-slate-800 h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold">3</span>
                    <div>
                        <strong>Startup Otomatis:</strong> Tekan <code>Win + R</code>, ketik <code>shell:startup</code>. Masukkan shortcut tadi ke folder startup agar otomatis jalan saat PC nyala.
                    </div>
                </li>
            </ol>
        </div>
      </Section>

      {/* BAB 6: API SPECIFICATION */}
      <Section title="6. Spesifikasi API">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                    <Network size={18} className="text-blue-400" /> Manajemen Konten
                </h4>
                <ul className="space-y-3 text-sm font-mono text-slate-300">
                    <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-green-400">POST /api/content</span>
                        <span className="text-slate-500 text-xs">Upload konten baru</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-blue-400">GET /api/content?signage_id=3</span>
                        <span className="text-slate-500 text-xs">Ambil konten spesifik</span>
                    </li>
                </ul>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                 <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                    <Package size={18} className="text-purple-400" /> Native Client Code
                </h4>
                <p className="text-xs text-slate-400 mb-2">Contoh logika Player (Node.js) jika tidak menggunakan browser:</p>
                <pre className="bg-slate-950 p-2 rounded text-[10px] text-slate-300 font-mono overflow-hidden">
{`const axios = require('axios');
async function fetchContent() {
  // 1. Ambil Data
  const res = await axios.get('/api/content?id=SIG-01');
  
  // 2. Simpan Cache (Offline Support)
  fs.writeFileSync('cache.json', JSON.stringify(res.data));
  
  // 3. Tampilkan
  render(res.data);
}`}
                </pre>
            </div>
        </div>
      </Section>

    </div>
  );
};

export default ArchitectureBlueprint;