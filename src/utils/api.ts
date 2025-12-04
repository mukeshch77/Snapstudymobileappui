import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29d1cc3a`;

// Get access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Set access token in localStorage
export const setAccessToken = (token: string) => {
  localStorage.setItem('access_token', token);
};

// Remove access token from localStorage
export const removeAccessToken = () => {
  localStorage.removeItem('access_token');
};

// API request helper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Use token if available, otherwise use anon key
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// AUTH APIs
// ============================================

export const authAPI = {
  signup: async (email: string, password: string, name: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.access_token) {
      setAccessToken(data.access_token);
    }
    
    return data;
  },

  logout: () => {
    removeAccessToken();
  },

  getMe: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (updates: any) => {
    return apiRequest('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};

// ============================================
// REELS APIs
// ============================================

export const reelsAPI = {
  getAll: async (page = 1, limit = 20) => {
    return apiRequest(`/reels?page=${page}&limit=${limit}`);
  },

  getById: async (id: string) => {
    return apiRequest(`/reels/${id}`);
  },

  create: async (reel: any) => {
    return apiRequest('/reels', {
      method: 'POST',
      body: JSON.stringify(reel),
    });
  },

  update: async (id: string, updates: any) => {
    return apiRequest(`/reels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/reels/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id: string) => {
    return apiRequest(`/reels/${id}/like`, {
      method: 'POST',
    });
  },
};

// ============================================
// PLAYLISTS APIs
// ============================================

export const playlistsAPI = {
  getAll: async () => {
    return apiRequest('/playlists');
  },

  getById: async (id: string) => {
    return apiRequest(`/playlists/${id}`);
  },

  create: async (title: string) => {
    return apiRequest('/playlists', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  addReel: async (playlistId: string, reelId: string) => {
    return apiRequest(`/playlists/${playlistId}/add`, {
      method: 'POST',
      body: JSON.stringify({ reel_id: reelId }),
    });
  },

  removeReel: async (playlistId: string, reelId: string) => {
    return apiRequest(`/playlists/${playlistId}/remove/${reelId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// MICRO-COURSES APIs
// ============================================

export const coursesAPI = {
  getAll: async () => {
    return apiRequest('/microcourses');
  },

  getById: async (id: string) => {
    return apiRequest(`/microcourses/${id}`);
  },

  create: async (course: any) => {
    return apiRequest('/microcourses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  },

  addReel: async (courseId: string, reelId: string, position?: number) => {
    return apiRequest(`/microcourses/${courseId}/add-reel`, {
      method: 'POST',
      body: JSON.stringify({ reel_id: reelId, position }),
    });
  },

  getProgress: async (courseId: string) => {
    return apiRequest(`/microcourses/${courseId}/progress`);
  },

  updateProgress: async (courseId: string, lessonId: string, completed: boolean) => {
    return apiRequest(`/microcourses/${courseId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId, completed }),
    });
  },
};

// ============================================
// FOLLOW APIs
// ============================================

export const followAPI = {
  follow: async (creatorId: string) => {
    return apiRequest(`/follow/${creatorId}`, {
      method: 'POST',
    });
  },

  unfollow: async (creatorId: string) => {
    return apiRequest(`/follow/${creatorId}`, {
      method: 'DELETE',
    });
  },

  getCreator: async (id: string) => {
    return apiRequest(`/creator/${id}`);
  },

  getCreatorReels: async (id: string) => {
    return apiRequest(`/creator/${id}/reels`);
  },
};

// ============================================
// SEARCH APIs
// ============================================

export const searchAPI = {
  search: async (query: string) => {
    return apiRequest(`/search?q=${encodeURIComponent(query)}`);
  },

  searchByTag: async (tag: string) => {
    return apiRequest(`/search/tags?q=${encodeURIComponent(tag)}`);
  },
};

// ============================================
// STORAGE APIs
// ============================================

export const storageAPI = {
  getUploadUrl: async (filename: string, contentType: string) => {
    return apiRequest('/storage/upload-url', {
      method: 'POST',
      body: JSON.stringify({ filename, contentType }),
    });
  },
};
