import React from 'react';
import { Server, Monitor, Database, Globe, Shield, Cpu, ArrowRight, Package, Layers, Code } from 'lucide-react';

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
        <h2 className="text-3xl font-bold text-white">System Blueprint</h2>
        <p className="text-slate-400 mt-2">Architectural design for the FTI Digital Signage System (7 Units)</p>
      </div>

      {/* XAMPP Deployment Guide */}
      <Section title="1. Deployment on XAMPP & WordPress">
        <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl mb-8">
          <div className="flex items-start gap-4">
            <Package className="text-blue-400 shrink-0" size={32} />
            <div>
              <h4 className="text-lg font-bold text-white mb-2">How to deploy this App on your XAMPP Server</h4>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                Since you have XAMPP and WordPress, the best approach is a "Headless" architecture. 
                The Frontend (this React App) sits in your <code>htdocs</code> folder, while WordPress acts as the Database and API.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <div className="bg-slate-950 p-4 rounded border border-slate-800">
                    <h5 className="text-blue-400 font-mono text-xs mb-2 uppercase">Folder Structure (C:\xampp\htdocs)</h5>
                    <pre className="text-xs text-slate-300 font-mono overflow-x-auto">
{`htdocs/
├── wordpress/        <-- Your existing WP
│   └── wp-admin/
├── fti-signage/      <-- THIS REACT APP
│   ├── index.html
│   ├── assets/
│   │   ├── index.js
│   │   └── index.css`}
                    </pre>
                 </div>
                 
                 <div className="bg-slate-950 p-4 rounded border border-slate-800">
                    <h5 className="text-green-400 font-mono text-xs mb-2 uppercase">Integration Logic</h5>
                    <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
                        <li><strong>Build:</strong> Run <code>npm run build</code> in your development folder. Copy the output to <code>htdocs/fti-signage</code>.</li>
                        <li><strong>Backend:</strong> Use WordPress REST API. Create a Custom Post Type "Signage".</li>
                        <li><strong>Access:</strong> Access admin via <code>localhost/fti-signage/</code>.</li>
                    </ul>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* WordPress Backend Code */}
      <Section title="2. Backend Setup (WordPress Code)">
        <div className="mb-4">
            <p className="text-slate-300 text-sm mb-2">
                Add this code to your WordPress Theme's <code>functions.php</code> or create a custom plugin.
                It creates the API endpoints required for the Signage App.
            </p>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-slate-800 px-3 py-1 text-xs text-white rounded-bl">php</div>
            <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto">
{`<?php
/**
 * FTI Digital Signage - Custom Post Types & API
 */

function create_signage_post_types() {
    // 1. Register Signage Unit
    register_post_type('signage_unit', array(
        'labels' => array('name' => 'Signage Units', 'singular_name' => 'Signage Unit'),
        'public' => true,
        'show_in_rest' => true, // Enable REST API
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-video-alt3'
    ));

    // 2. Register Content Media
    register_post_type('signage_content', array(
        'labels' => array('name' => 'Signage Content', 'singular_name' => 'Content'),
        'public' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'menu_icon' => 'dashicons-images-alt2'
    ));
}
add_action('init', 'create_signage_post_types');

// 3. Add Custom REST API Endpoint for "Get Playlist by Signage ID"
add_action('rest_api_init', function () {
    register_rest_route('fti-signage/v1', '/playlist/(?P<id>\\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_signage_playlist',
        'permission_callback' => '__return_true', // Warning: Secure this in production
    ));
});

function get_signage_playlist($data) {
    // Logic to fetch content assigned to this ID
    // This is a simplified example
    $posts = get_posts(array(
        'post_type' => 'signage_content',
        'numberposts' => 5
    ));
    
    $playlist = [];
    foreach($posts as $p) {
        $playlist[] = array(
            'id' => $p->ID,
            'title' => $p->post_title,
            'url' => get_the_post_thumbnail_url($p->ID, 'full'),
            'type' => 'IMAGE',
            'duration' => get_post_meta($p->ID, 'duration_sec', true) ?: 10
        );
    }
    
    return $playlist;
}
?>`}
            </pre>
        </div>
      </Section>

      <Section title="3. Database Schema Design (WordPress Mapping)">
        <p className="text-sm text-slate-400 mb-4">
            Since you are using WordPress, standard tables are replaced by WP Post Types and Meta Fields.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3 text-yellow-400">
              <Database size={18} />
              <span className="font-mono font-bold">Post Type: 'signage_unit'</span>
            </div>
            <div className="font-mono text-xs space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-purple-400">post_title</span> <span>Hostname (FTI-SIG-01)</span></div>
              <div className="flex justify-between"><span className="text-blue-400">meta_key</span> <span>mac_address</span></div>
              <div className="flex justify-between"><span className="text-blue-400">meta_key</span> <span>location</span></div>
              <div className="flex justify-between"><span className="text-blue-400">meta_key</span> <span>status</span></div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3 text-yellow-400">
              <Database size={18} />
              <span className="font-mono font-bold">Post Type: 'signage_content'</span>
            </div>
            <div className="font-mono text-xs space-y-1 text-slate-300">
              <div className="flex justify-between"><span className="text-purple-400">post_title</span> <span>Content Title</span></div>
              <div className="flex justify-between"><span className="text-purple-400">post_content</span> <span>Description</span></div>
              <div className="flex justify-between"><span className="text-blue-400">meta_key</span> <span>file_url</span></div>
              <div className="flex justify-between"><span className="text-blue-400">meta_key</span> <span>duration_sec</span></div>
              <div className="flex justify-between"><span className="text-blue-400">meta_key</span> <span>media_type</span></div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ArchitectureBlueprint;