import React, { useEffect, useState, useRef } from 'react';
import { ApiService } from '../services/mockService';
import { MediaContent, ContentType } from '../types';
import { Image, Film, FileCode, Plus, Trash2, ExternalLink, Smartphone, Loader2, Upload } from 'lucide-react';

const ContentManager = () => {
  const [contents, setContents] = useState<MediaContent[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ApiService.getContent().then(setContents);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        // Validate file type (simple check)
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            alert("Only Image and Video files are supported in this demo.");
            setIsUploading(false);
            return;
        }

        const newContent = await ApiService.uploadContent(file);
        setContents(prev => [newContent, ...prev]);
    } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload file.");
    } finally {
        setIsUploading(false);
        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getIcon = (type: ContentType) => {
    switch(type) {
      case ContentType.VIDEO: return <Film size={20} className="text-red-400"/>;
      case ContentType.HTML: return <FileCode size={20} className="text-orange-400"/>;
      default: return <Image size={20} className="text-blue-400"/>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">Content Library</h2>
            <p className="text-slate-400 text-sm">Manage 4K Portrait content (2160 x 3840 px)</p>
        </div>
        
        {/* Hidden File Input */}
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,video/*" 
            onChange={handleFileChange}
        />

        <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
        >
          {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {isUploading ? 'Uploading...' : 'Upload Media'}
        </button>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg mb-8 flex items-start gap-3">
         <Smartphone className="text-blue-400 shrink-0 mt-0.5" size={20} />
         <div>
            <h4 className="text-sm font-bold text-blue-200">Resolution Guideline</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Ensure all uploaded content is strictly <strong>Portrait Oriented (9:16)</strong>. 
                Recommended resolution: <strong>2160 x 3840 pixels</strong>. 
                Landscape content will be cropped or letterboxed.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {contents.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-slate-600 hover:shadow-xl transition-all flex flex-col animate-fade-in">
            {/* Preview Area - Portrait 9:16 */}
            <div className="aspect-[9/16] bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-800">
              {item.type === ContentType.IMAGE ? (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : item.type === ContentType.VIDEO ? (
                <video src={item.url} className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="bg-slate-800 w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                    {getIcon(item.type)}
                    <span className="text-[10px] uppercase tracking-widest font-medium">{item.type}</span>
                </div>
              )}
              
              {/* Overlay Icons for Video/HTML */}
              {item.type === ContentType.VIDEO && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Film size={32} className="text-white/50" />
                </div>
              )}

              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-mono border border-white/10">
                {item.duration_sec}s
              </div>
            </div>

            {/* Details */}
            <div className="p-3 flex flex-col flex-1 justify-between">
              <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium text-slate-200 text-sm truncate leading-tight" title={item.title}>{item.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500">By {item.created_by}</p>
              </div>
              
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-800/50">
                 <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1 font-medium">
                    <ExternalLink size={10} /> Preview
                 </a>
                 <button className="text-slate-600 hover:text-red-400 transition-colors p-1 rounded hover:bg-slate-800">
                    <Trash2 size={14} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ContentManager;