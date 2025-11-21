import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/mockService';
import { MediaContent, ContentType, SignageUnit } from '../types';
import { Wifi, WifiOff, Loader2, X, Clock } from 'lucide-react';

const PlayerClient = () => {
  const { id } = useParams<{ id: string }>(); // Identifier: Hostname or ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState<MediaContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [signageInfo, setSignageInfo] = useState<SignageUnit | undefined>(undefined);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock Tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Polling interval for content updates
  useEffect(() => {
    let intervalId: any;

    const fetchData = async () => {
      try {
        // 1. Identify who we are
        if (!signageInfo) {
            const info = await ApiService.getSignageById(id || '');
            setSignageInfo(info);
        }

        // 2. Get scheduled content
        const items = await ApiService.getSignagePlaylist(signageInfo?.id || id || 'sig-1');
        
        if (items.length > 0) {
             setPlaylist(prev => {
                 // Simple check to see if playlist changed to avoid unnecessary re-renders
                 if (prev.length !== items.length) return items;
                 if (prev[0]?.id !== items[0]?.id) return items;
                 return prev;
             });
             setIsOffline(false);
        }
      } catch (error) {
        console.error("Failed to fetch content", error);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll every 60 seconds for schedule updates
    intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, [id, signageInfo]);

  // Content Rotation Logic
  useEffect(() => {
    if (playlist.length === 0) return;

    const currentItem = playlist[currentIndex];
    const duration = (currentItem?.duration_sec || 10) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, playlist]);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4" size={48} />
        <h2 className="text-2xl font-light uppercase tracking-widest">Initializing System</h2>
        <p className="text-slate-500 mt-2 font-mono">{id}</p>
      </div>
    );
  }

  if (playlist.length === 0) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white p-10 text-center relative">
        <button 
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full hover:bg-slate-700 z-50"
        >
            <X size={24} />
        </button>
        <div className="border-2 border-slate-700 p-10 rounded-lg max-w-md">
             <h1 className="text-3xl font-bold mb-4 text-blue-500">FTI DIGITAL SIGNAGE</h1>
             <p className="text-lg text-slate-400 mb-6">No content scheduled.</p>
             <div className="bg-slate-900 p-4 rounded text-left text-xs font-mono text-slate-500 space-y-2">
                <div>ID: <span className="text-slate-300">{id}</span></div>
                <div>MAC: <span className="text-slate-300">{signageInfo?.mac_address || 'UNKNOWN'}</span></div>
                <div>RES: <span className="text-slate-300">2160x3840 (Portrait)</span></div>
             </div>
        </div>
      </div>
    );
  }

  const currentItem = playlist[currentIndex];

  return (
    <div className="bg-slate-950 h-screen w-screen overflow-hidden flex items-center justify-center">
      
      {/* 
          CONTAINER SIMULATION
          - aspect-[9/16]: Forces Portrait Aspect Ratio
          - h-full: Takes full height of screen
          - max-w-full: Ensures it fits in width
          - If screen is Landscape: It will look like a phone/portrait TV in center
          - If screen is Portrait (Real Device): It will fill the screen perfectly
      */}
      <div 
        className="relative aspect-[9/16] h-full max-h-screen bg-black shadow-2xl overflow-hidden group mx-auto ring-1 ring-slate-800"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >

          {/* --- HEADER OVERLAY (Clock & Logo) --- */}
          <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-black/90 to-transparent z-20 flex items-start justify-between p-6">
             <div className="flex items-center gap-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Logo_UII_%28Universitas_Islam_Indonesia%29.png/180px-Logo_UII_%28Universitas_Islam_Indonesia%29.png" 
                  alt="UII Logo" 
                  className="w-14 h-auto drop-shadow-lg" 
                />
                <div>
                    <h1 className="text-white font-bold text-lg leading-none tracking-tight">FAKULTAS<br/>TEKNOLOGI INDUSTRI</h1>
                    <p className="text-slate-300 text-[10px] uppercase tracking-wider mt-1">Universitas Islam Indonesia</p>
                </div>
             </div>
             <div className="text-right">
                 <div className="text-3xl font-bold text-white tabular-nums leading-none drop-shadow-md">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </div>
                 <div className="text-slate-300 text-xs uppercase font-medium drop-shadow-md">
                    {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
                 </div>
             </div>
          </div>

          {/* --- EXIT BUTTON (Hidden by default) --- */}
          <button 
                onClick={() => navigate('/')}
                className={`absolute top-28 right-6 z-50 p-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-red-600 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                title="Exit Kiosk Mode"
          >
                <X size={20} />
          </button>

          {/* --- MAIN CONTENT AREA --- */}
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            {currentItem.type === ContentType.IMAGE && (
              <img 
                src={currentItem.url} 
                alt={currentItem.title} 
                className="w-full h-full object-cover animate-fade-in"
                key={currentItem.id} 
              />
            )}

            {currentItem.type === ContentType.VIDEO && (
            <video 
                src={currentItem.url} 
                autoPlay 
                muted 
                loop // Video loops until slide duration kicks it out
                className="w-full h-full object-cover"
                key={currentItem.id}
            />
            )}

            {currentItem.type === ContentType.HTML && (
                <iframe 
                    src={currentItem.url} 
                    className="w-full h-full border-0 bg-white"
                    title={currentItem.title}
                />
            )}
          </div>

          {/* --- FOOTER TICKER --- */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-900 z-20 flex items-center overflow-hidden">
              <div className="bg-blue-800 h-full px-6 flex items-center justify-center z-30 shrink-0 shadow-lg">
                  <span className="text-white font-bold uppercase text-sm tracking-wider">INFO TERKINI</span>
              </div>
              <div className="whitespace-nowrap animate-marquee pl-4">
                  <span className="text-white text-lg font-medium mx-4">
                      Selamat Datang Mahasiswa Baru T.A. 2024/2025 di Kampus FTI UII
                  </span>
                  <span className="text-blue-400 mx-4">•</span>
                  <span className="text-white text-lg font-medium mx-4">
                      Jadwal Pengisian KRS dimulai tanggal 20 Agustus
                  </span>
                  <span className="text-blue-400 mx-4">•</span>
                  <span className="text-white text-lg font-medium mx-4">
                      Seminar Nasional Teknologi Industri: "AI for Future" - Daftar Segera!
                  </span>
              </div>
          </div>

          {/* --- DEBUG / INFO OVERLAY (Bottom Right) --- */}
          <div className={`absolute bottom-20 right-6 z-20 flex items-center gap-3 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-right">
                    <div className="text-white font-bold text-sm drop-shadow-md truncate max-w-[200px]">{currentItem.title}</div>
                    <div className="text-slate-300 text-[10px] drop-shadow-md uppercase tracking-widest">
                        {id} • {signageInfo?.location}
                    </div>
                </div>
                {isOffline ? <WifiOff className="text-red-500 drop-shadow" size={20} /> : <Wifi className="text-green-500 drop-shadow" size={20} />}
          </div>
          
          {/* Progress Bar */}
          <div className="absolute bottom-16 left-0 h-1 bg-yellow-400 z-30 transition-all duration-1000 ease-linear" 
            style={{ width: '100%', animation: `progress ${currentItem.duration_sec}s linear` }}>
          </div>
      
      </div>
      
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-marquee {
            display: inline-block;
            animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default PlayerClient;