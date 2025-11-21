import React from 'react';
import { Server, Database, Package, CheckCircle, AlertTriangle, FileText, Terminal, Monitor, Globe } from 'lucide-react';

const Section = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <section className="mb-12">
    <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">{title}</h3>
    {children}
  </section>
);

const ArchitectureBlueprint = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Deployment Guide</h2>
        <p className="text-slate-400 mt-2">Panduan Rinci Deploy ke Server XAMPP (Windows)</p>
      </div>

      {/* Step 1: Preparation */}
      <Section title="Langkah 1: Persiapan Build (Di Laptop Development)">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-4">
             <div className="bg-blue-900/30 p-3 rounded-lg text-blue-400">
                <Terminal size={24} />
             </div>
             <div>
                <h4 className="text-lg font-bold text-white">1. Konfigurasi 'vite.config.ts'</h4>
                <p className="text-slate-300 text-sm mt-1">
                   Pastikan file <code>vite.config.ts</code> memiliki properti <code>base: './'</code>. 
                   Ini wajib agar aplikasi tidak "Blank White Screen" saat ditaruh di sub-folder htdocs.
                </p>
             </div>
          </div>

          <div className="flex items-start gap-4 border-t border-slate-800 pt-4">
             <div className="bg-purple-900/30 p-3 rounded-lg text-purple-400">
                <Package size={24} />
             </div>
             <div>
                <h4 className="text-lg font-bold text-white">2. Jalankan Perintah Build</h4>
                <p className="text-slate-300 text-sm mt-1">
                   Buka terminal/command prompt di folder proyek ini, lalu ketik:
                </p>
                <div className="mt-2 bg-black rounded p-3 font-mono text-green-400 text-sm">
                    npm run build
                </div>
                <p className="text-slate-400 text-xs mt-2">
                    Setelah selesai, akan muncul folder baru bernama <strong>dist</strong>.
                </p>
             </div>
          </div>
        </div>
      </Section>

      {/* Step 2: Server Setup */}
      <Section title="Langkah 2: Copy ke Server (Mini PC / Server Utama)">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <Server className="text-green-400" />
                <h4 className="font-bold text-white">Struktur Folder XAMPP</h4>
             </div>
             
             <p className="text-sm text-slate-300">
                Copy <strong>isi</strong> dari folder <code>dist</code> (hasil langkah 1) ke dalam folder baru di <code>htdocs</code>.
             </p>

             <div className="bg-slate-950 p-4 rounded border border-slate-700 font-mono text-xs text-slate-300">
                C:\xampp\htdocs\<br/>
                ├── wordpress/          <span className="text-slate-500">(Instalasi WP Anda)</span><br/>
                └── <span className="text-yellow-400">fti-signage/</span>        <span className="text-slate-500">(Buat folder ini)</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;├── assets/         <span className="text-slate-500">(Dari folder dist)</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;├── index.html      <span className="text-slate-500">(File utama)</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;└── vite.svg
             </div>

             <div className="bg-yellow-900/20 border border-yellow-500/20 p-4 rounded flex items-start gap-3">
                <AlertTriangle className="text-yellow-500 shrink-0" />
                <div>
                    <h5 className="text-yellow-500 font-bold text-sm">PENTING: WordPress API</h5>
                    <p className="text-slate-400 text-xs mt-1">
                        Aplikasi ini (Frontend) perlu bicara dengan WordPress (Backend). 
                        Pastikan Anda sudah menambahkan kode PHP di bawah ini ke <code>functions.php</code> tema WordPress Anda.
                    </p>
                </div>
             </div>
        </div>
      </Section>

      {/* Step 3: Backend Code */}
      <Section title="Langkah 3: Integrasi Backend (WordPress functions.php)">
        <div className="relative group">
            <div className="absolute top-2 right-2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-50 group-hover:opacity-100 transition-opacity">
                Copy PHP Code
            </div>
            <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-green-300 overflow-x-auto">
{`<?php
// Tambahkan ini di akhir file: wp-content/themes/nama-tema/functions.php

// 1. Registrasi Tipe Post "Signage" & "Content"
add_action('init', function() {
    register_post_type('signage_unit', array(
        'labels' => array('name' => 'Signage Units'),
        'public' => true,
        'show_in_rest' => true, // Wajib true agar bisa diakses React
        'supports' => array('title', 'custom-fields')
    ));
    
    register_post_type('signage_content', array(
        'labels' => array('name' => 'Signage Content'),
        'public' => true,
        'show_in_rest' => true, 
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields')
    ));
});

// 2. (Opsional) API Endpoint Khusus untuk Playlist
add_action('rest_api_init', function () {
    register_rest_route('fti-signage/v1', '/playlist/(?P<id>\\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_custom_playlist',
    ));
});

function get_custom_playlist($data) {
    // Logika custom untuk mengambil konten
    return array(
        array(
            'id' => 'wp-1',
            'type' => 'IMAGE',
            'url' => 'http://localhost/wordpress/wp-content/uploads/2024/01/welcome.jpg',
            'duration_sec' => 10
        )
    );
}
?>`}
            </pre>
        </div>
      </Section>

      {/* Step 4: Client Setup */}
      <Section title="Langkah 4: Setup di Mini PC (Client)">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="font-bold text-white flex items-center gap-2 mb-3">
                    <Monitor size={18} className="text-blue-400" /> Windows Settings
                </h4>
                <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                    <li>Masuk ke <strong>Display Settings</strong>.</li>
                    <li>Set Orientation ke <strong>Portrait</strong>.</li>
                    <li>Set Resolution ke <strong>2160 x 3840</strong> (4K).</li>
                    <li>Scale & Layout: Set ke 100% atau 150% (sesuaikan agar UI tidak terlalu kecil).</li>
                </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <h4 className="font-bold text-white flex items-center gap-2 mb-3">
                    <Globe size={18} className="text-blue-400" /> Browser Kiosk Mode
                </h4>
                <p className="text-sm text-slate-300 mb-2">
                    Buat shortcut Chrome/Edge di desktop Mini PC dengan Target:
                </p>
                <div className="bg-black p-2 rounded text-xs font-mono text-green-400 break-all">
                    "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk "http://localhost/fti-signage/#/player/FTI-SIGNAGE-01" --user-data-dir="c:/temp/signage01"
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    Ganti <code>localhost</code> dengan IP Server jika Mini PC mengakses via jaringan WiFi.
                </p>
            </div>
         </div>
      </Section>

    </div>
  );
};

export default ArchitectureBlueprint;