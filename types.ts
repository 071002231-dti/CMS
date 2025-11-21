// Database Schema Representation

export enum SignageStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR'
}

export enum ContentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  HTML = 'HTML',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export interface SignageUnit {
  id: string;           // UUID in real DB
  hostname: string;     // e.g., FTI-SIGNAGE-01
  mac_address: string;
  location: string;
  resolution: string;   // "2160x3840" (4K Portrait)
  status: SignageStatus;
  last_heartbeat: string; // ISO Date
  current_playlist_id?: string;
}

export interface MediaContent {
  id: string;
  title: string;
  type: ContentType;
  url: string;          // File path or URL
  duration_sec: number; // For images/html
  thumbnail?: string;
  created_at: string;
  created_by: string;
}

export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
}

export interface PlaylistItem {
  content_id: string;
  order: number;
}

export interface ScheduleAssignment {
  id: string;
  signage_id: string;
  playlist_id: string;
  start_time: string; // ISO Date
  end_time: string;   // ISO Date
  priority: number;   // 1 = Normal, 10 = Emergency Override
}

// For UI State
export interface SystemStats {
  totalUnits: number;
  onlineUnits: number;
  storageUsed: string;
  uptimePercentage: number;
}