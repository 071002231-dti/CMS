import { SignageUnit, SignageStatus, MediaContent, ContentType, Playlist, ScheduleAssignment } from '../types';

// --- Mock Database ---

const LOCATION_NAMES = [
  "Lobi Barat",
  "Lobi Timur",
  "Lantai 1",
  "Lantai 2",
  "Lantai 3",
  "Lantai 4",
  "Lab Selatan"
];

const MOCK_SIGNAGES: SignageUnit[] = Array.from({ length: 7 }).map((_, i) => ({
  id: `sig-${i + 1}`,
  hostname: `FTI-SIGNAGE-0${i + 1}`,
  mac_address: `00:1A:2B:3C:4D:0${i + 1}`,
  location: LOCATION_NAMES[i],
  resolution: '2160x3840',
  status: i === 4 ? SignageStatus.OFFLINE : SignageStatus.ONLINE,
  last_heartbeat: new Date().toISOString(),
  current_playlist_id: 'pl-1'
}));

const MOCK_CONTENT: MediaContent[] = [
  {
    id: 'c-1',
    title: 'Faculty Welcome 2024',
    type: ContentType.IMAGE,
    url: 'https://picsum.photos/1080/1920?random=1',
    duration_sec: 10,
    created_at: '2023-10-01T10:00:00Z',
    created_by: 'admin'
  },
  {
    id: 'c-2',
    title: 'Lab Safety Guidelines',
    type: ContentType.IMAGE,
    url: 'https://picsum.photos/1080/1920?random=2',
    duration_sec: 15,
    created_at: '2023-10-02T09:30:00Z',
    created_by: 'safety_officer'
  },
  {
    id: 'c-3',
    title: 'Guest Lecture Teaser',
    type: ContentType.VIDEO,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video
    duration_sec: 30,
    created_at: '2023-10-05T14:20:00Z',
    created_by: 'editor'
  },
  {
    id: 'c-4',
    title: 'Exam Schedule Feed',
    type: ContentType.HTML,
    url: 'https://example.com/schedule-widget', 
    duration_sec: 20,
    created_at: '2023-10-10T08:00:00Z',
    created_by: 'system'
  }
];

const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-1',
    name: 'Default Daily Loop',
    items: [
      { content_id: 'c-1', order: 1 },
      { content_id: 'c-2', order: 2 },
      { content_id: 'c-3', order: 3 }
    ]
  }
];

const MOCK_SCHEDULES: ScheduleAssignment[] = [
  {
    id: 'sch-1',
    signage_id: 'sig-1',
    playlist_id: 'pl-1',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days
    priority: 1
  }
];

// --- API Service Simulation ---
// Implements the requested endpoints:
// GET /api/content?signage_id=...
// POST /api/content
// POST /api/assign
// GET /api/signage/status
// POST /api/auth/login

export const ApiService = {
  // POST /api/auth/login
  login: async (username: string, password: string): Promise<{ token: string, user: any } | null> => {
      return new Promise(resolve => {
          if(username === 'admin' && password === 'password') {
              resolve({ token: 'mock-jwt-token-123', user: { name: 'Admin', role: 'admin' }});
          } else {
              resolve(null);
          }
      });
  },

  // GET /api/signage/status (Combined with getSignages for now)
  getSignages: async (): Promise<SignageUnit[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_SIGNAGES]), 500));
  },

  getSignageById: async (idOrHostname: string): Promise<SignageUnit | undefined> => {
    return new Promise(resolve => {
        const unit = MOCK_SIGNAGES.find(s => s.id === idOrHostname || s.hostname === idOrHostname);
        setTimeout(() => resolve(unit), 300);
    });
  },

  // GET /api/content (General library)
  getContent: async (): Promise<MediaContent[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_CONTENT]), 500));
  },

  // POST /api/content
  uploadContent: async (file: File): Promise<MediaContent> => {
    return new Promise(resolve => {
        // Create a fake local URL for preview purposes
        const objectUrl = URL.createObjectURL(file);
        
        const newContent: MediaContent = {
            id: `c-${Date.now()}`,
            title: file.name,
            type: file.type.startsWith('video') ? ContentType.VIDEO : ContentType.IMAGE,
            url: objectUrl,
            duration_sec: 10, // Default duration
            created_at: new Date().toISOString(),
            created_by: 'admin_local'
        };
        
        MOCK_CONTENT.unshift(newContent); // Add to beginning of list
        setTimeout(() => resolve(newContent), 800); // Simulate network delay
    });
  },

  getPlaylists: async (): Promise<Playlist[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_PLAYLISTS]), 500));
  },

  // POST /api/assign (Simulated via Schedule creation)
  createSchedule: async (schedule: ScheduleAssignment): Promise<void> => {
    MOCK_SCHEDULES.push(schedule);
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  deleteSchedule: async (id: string): Promise<void> => {
    const idx = MOCK_SCHEDULES.findIndex(s => s.id === id);
    if (idx > -1) MOCK_SCHEDULES.splice(idx, 1);
    return new Promise(resolve => setTimeout(resolve, 500));
  },

  // GET /api/content?signage_id=X
  // Logic: Get Schedule -> Get Playlist -> Get Content Items
  getSignagePlaylist: async (signageId: string): Promise<MediaContent[]> => {
    // 1. Find active schedule
    const schedule = MOCK_SCHEDULES.find(s => s.signage_id === signageId);
    
    // Fallback to default playlist if no specific schedule found
    const playlistId = schedule ? schedule.playlist_id : 'pl-1'; 
    const playlist = MOCK_PLAYLISTS.find(p => p.id === playlistId);
    
    if (!playlist) return [];

    // Map items to full content objects
    const contentList = playlist.items
        .sort((a, b) => a.order - b.order)
        .map(item => MOCK_CONTENT.find(c => c.id === item.content_id))
        .filter((c): c is MediaContent => !!c); // Remove undefined

    return new Promise(resolve => setTimeout(() => resolve(contentList), 600));
  }
};