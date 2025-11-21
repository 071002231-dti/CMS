import React from 'react';
import { Server, Package, CheckCircle, Terminal, Monitor, Network, Code, Book } from 'lucide-react';

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
        <p className="text-slate-400 mt-2">Manual Book lengkap: Instalasi, Konfigurasi Server, dan Deployment Signage.</p>
      </div>

      {/* Navigation Index */}
      <div className="bg-slate-900/50 p-4 rounded-lg mb-10 border border-slate-800">
        <h4 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Book size={16}/> Daftar Isi
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a href="#1.-arsitektur-sistem" className="text-blue-400 hover:underline">1. Arsitektur Sistem</a>
            <a href="#2.-persiapan-lingkungan-(development)" className="text-blue-400 hover:underline">2. Persiapan Lingkungan (Development)</a>
            <a href="#3.-setup-backend-(wordpress)" className="text-blue-400 hover:underline">3. Setup Backend (WordPress)</a>
            <a href="#4.-build-&-deploy-(xampp)" className="text-blue-400 hover:underline">4. Build & Deploy (XAMPP)</a>
            <a href="#5.-setup-client-(mini-pc)" className="text-blue-400 hover:underline">5. Setup Client (Mini PC)</a>
            <a href="#6.-spesifikasi-api" className="text-blue-400 hover:underline">6. Spesifikasi API & Kode Native</a>
        </div>
      </div>

      {/* BAB 1: ARSITEKTUR */}
      <Section title="1. Arsitektur Sistem">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <p className="text-slate-300 mb-4">
                Sistem FTI Digital Signage menggunakan arsitektur <strong>Headless CMS</strong>, memisahkan manajemen konten (Backend) dengan tampilan layar (Frontend).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                    <Server className="mx-auto mb-3 text-blue-500" size={32} />
                    <h4 className="font-bold text-white">Server (Backend)</h4>
                    <p className="text-xs text-slate-400 mt-1">WordPress + XAMPP</p>
                    <p className="text-xs text-slate-500 mt-1">Berfungsi sebagai database, manajemen user, dan penyedia REST API.</p>
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
                    <p className="text-xs text-slate-500 mt-1">Aplikasi layar yang berjalan di Mini PC dalam mode Kiosk.</p>
                </div>
            </div>
        </div>
      </Section>

      {/* BAB 2: PRE-REQUISITES */}
      <Section title="2. Persiapan Lingkungan (Development)">
        <div className="space-y-4">
            <p className="text-slate-400 text-sm">Untuk mengembangkan atau memodifikasi kode sumber sistem ini, PC Developer wajib menginstall:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm ml-4">
                <li><strong>Node.js</strong> (Versi 18+). Unduh di <code className="bg-slate-800 px-1 rounded">nodejs.org</code>.</li>
                <li><strong>Visual Studio Code</strong> (Editor Kode).</li>
                <li><strong>XAMPP</strong> (Untuk simulasi server production lokal).</li>
            </ul>
            
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 mt-4">
                <h5 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Terminal size={16}/> Perintah Instalasi Project</h5>
                <pre className="bg-black p-3 rounded text-green-400 font-mono text-xs">
{`# 1. Masuk ke folder project
cd fti-signage-cms

# 2. Install dependensi
npm install

# 3. Menjalankan mode development (Live Preview)
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
                    <h4 className="text-lg font-bold text-white">Script Integrasi API WordPress</h4>
                    <p className="text-slate-300 text-sm mt-1 mb-4">
                       WordPress standar tidak memiliki fitur Signage. Anda <strong>WAJIB</strong> menambahkan kode PHP di bawah ini ke dalam file <code>functions.php</code> pada tema WordPress yang aktif (misal: TwentyTwentyFour).
                    </p>
                    
                    <div className="relative group">
                        <div className="absolute top-0 right-0 bg-slate-800 text-xs px-2 py-1 rounded-bl text-slate-400">wp-content/themes/[tema-aktif]/functions.php</div>
                        <pre className="bg-slate-950 p-4 rounded-lg text-xs font-mono text-blue-300 overflow-x-auto border border-slate-800 select-all">
{`<?php
/* --- COPY PASTE KODE INI KE functions.php --- */

add_action('init', function() {
    // 1. Tipe Post: Unit Signage (Menyimpan Data Layar)
    register_post_type('signage_unit', array(
        'labels' => array('name' => 'Signage Units'),
        'public' => true,
        'show_in_rest' => true, // PENTING: Agar bisa diakses via API
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-video-alt3'
    ));
    
    // 2. Tipe Post: Materi Konten (Gambar/Video)
    register_post_type('signage_content', array(
        'labels' => array('name' => 'Materi Signage'),
        'public' => true,
        'show_in_rest' => true, 
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon' => 'dashicons-media-document'
    ));
});

// 3. Izinkan CORS (Agar React bisa request ke Server)
add_action( 'init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
});
?>`}
                        </pre>
                        <p className="text-xs text-slate-500 italic mt-2">* Kode ini akan membuat menu "Signage Units" dan "Materi Signage" di Dashboard WordPress Anda.</p>
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
                    <h5 className="text-amber-200 font-bold text-sm">Penting: Konfigurasi Path</h5>
                    <p className="text-amber-100/70 text-xs mt-1">
                        Aplikasi ini sudah dikonfigurasi dengan <code>base: './'</code> di <code>vite.config.ts</code>. Ini wajib agar aplikasi tidak <em>blank</em> saat diletakkan di dalam folder `htdocs`.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase">Langkah 1: Compile</span>
                    <h4 className="font-bold text-white text-lg mb-2">Build Production</h4>
                    <p className="text-sm text-slate-400 mb-3">Perintah ini mengubah kode React menjadi file HTML, CSS, dan JS yang siap pakai.</p>
                    <pre className="bg-black p-2 rounded text-green-400 font-mono text-xs">npm run build</pre>
                    <p className="text-xs text-slate-500 mt-2">File hasil jadi akan muncul di folder bernama <code>dist/</code>.</p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase">Langkah 2: Upload</span>
                    <h4 className="font-bold text-white text-lg mb-2">Pindah ke Server</h4>
                    <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2">
                        <li>Buka folder instalasi XAMPP, masuk ke folder <code>htdocs</code>.</li>
                        <li>Buat folder baru, misal: <code>fti-signage</code>.</li>
                        <li>Buka folder <code>dist</code> hasil langkah 1.</li>
                        <li><strong>Copy semua isi</strong> folder <code>dist</code> ke dalam <code>htdocs/fti-signage</code>.</li>
                        <li>Akses di browser: <code>localhost/fti-signage</code>.</li>
                    </ol>
                </div>
            </div>
        </div>
      </Section>

      {/* BAB 5: CLIENT SETUP */}
      <Section title="5. Setup Client (Mini PC)">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h4 className="font-bold text-white mb-4">Instruksi Kerja Setting Mini PC (Windows 11)</h4>
            <ol className="space-y-4 text-sm text-slate-300">
                <li className="flex gap-3">
                    <span className="bg-slate-800 h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">1</span>
                    <div>
                        <strong>Pastikan Koneksi:</strong> Mini PC harus satu jaringan dengan Server (Wi-Fi/LAN Kampus).
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="bg-slate-800 h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">2</span>
                    <div>
                        <strong>Buat Shortcut Kiosk:</strong>
                        <p className="mt-1 mb-1">Klik kanan Desktop &gt; New Shortcut. Paste target berikut (sesuaikan IP Server):</p>
                        <code className="bg-slate-950 px-2 py-2 rounded text-blue-300 text-xs block mb-1 font-mono break-all">
                            "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --incognito "http://192.168.X.X/fti-signage/#/player/FTI-LOBI-BARAT"
                        </code>
                        <p className="italic text-slate-500 text-xs">*Ganti FTI-LOBI-BARAT sesuai identitas lokasi layar (Lihat Menu Signage Units).</p>
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="bg-slate-800 h-6 w-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">3</span>
                    <div>
                        <strong>Auto Start:</strong> Tekan <code>Win + R</code>, ketik <code>shell:startup</code>. Pindahkan shortcut tadi ke folder yang terbuka. Restart PC untuk tes.
                    </div>
                </li>
            </ol>
        </div>
      </Section>

      {/* BAB 6: API SPECIFICATION */}
      <Section title="6. Spesifikasi API">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* API Endpoints */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                    <Network size={18} className="text-blue-400" /> Endpoint Server
                </h4>
                <p className="text-xs text-slate-400 mb-3">Daftar endpoint standar yang digunakan oleh Client App.</p>
                <ul className="space-y-3 text-sm font-mono text-slate-300">
                    <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-green-400 font-bold">POST</span>
                        <span>/api/content</span>
                    </li>
                    <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-blue-400 font-bold">GET</span>
                        <span>/api/content?signage_id=X</span>
                    </li>
                     <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-green-400 font-bold">POST</span>
                        <span>/api/assign</span>
                    </li>
                     <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-blue-400 font-bold">GET</span>
                        <span>/api/signage/status</span>
                    </li>
                     <li className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-purple-400 font-bold">POST</span>
                        <span>/api/auth/login</span>
                    </li>
                </ul>
            </div>
            
            {/* Native Client Code */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                 <h4 className="font-bold text-white flex items-center gap-2 mb-4">
                    <Package size={18} className="text-purple-400" /> Native Client (Node.js)
                </h4>
                <p className="text-xs text-slate-400 mb-2">Gunakan kode ini jika ingin membuat aplikasi Player berbasis Electron/.exe:</p>
                <pre className="bg-slate-950 p-3 rounded text-[10px] text-slate-300 font-mono overflow-auto h-64 border border-slate-800">
{`const axios = require('axios');
const signageId = "FTI-LOBI-BARAT"; // Sesuaikan ID

async function fetchContent() {
  try {
    const response = await axios.get(
      \`https://server/api/content?signage_id=\${signageId}\`
    );
    const content = response.data;

    // Render konten sesuai tipe
    if (content.type === "image") {
      document.body.innerHTML = 
        \`<img src="\${content.file_path}" style="width:100%;height:100%;" />\`;
    } else if (content.type === "video") {
      document.body.innerHTML = 
        \`<video src="\${content.file_path}" autoplay loop muted />\`;
    }
  } catch (err) {
    console.error("Gagal mengambil konten:", err);
    // Fallback: baca dari cache lokal
  }
}

// Refresh setiap 60 detik
setInterval(fetchContent, 60000);
fetchContent();`}
                </pre>
            </div>
        </div>
      </Section>

    </div>
  );
};

export default ArchitectureBlueprint;