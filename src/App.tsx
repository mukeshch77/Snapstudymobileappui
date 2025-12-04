import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import HomeFeed from './components/HomeFeed';
import ReelDetail from './components/ReelDetail';
import SearchScreen from './components/SearchScreen';
import PlaylistsScreen from './components/PlaylistsScreen';
import MicroCourseScreen from './components/MicroCourseScreen';
import CreatorUploadScreen from './components/CreatorUploadScreen';
import ProfileScreen from './components/ProfileScreen';
import { reelsAPI, getAccessToken } from './utils/api';

export type Screen = 
  | 'splash' 
  | 'login' 
  | 'home' 
  | 'reel-detail' 
  | 'search' 
  | 'playlists' 
  | 'micro-course' 
  | 'upload' 
  | 'profile';

export interface Reel {
  id: string;
  videoUrl?: string;
  video_url?: string;
  title: string;
  creator: string | any;
  creator_id?: string;
  creatorAvatar?: string;
  tags: string[];
  likes: number;
  comments: number;
  description: string;
  courseId?: number;
  course_id?: string;
  micro_course_id?: string;
  thumbnail_url?: string;
  duration?: number;
}

export interface Course {
  id: string;
  title: string;
  creator: string | any;
  creator_id?: string;
  thumbnail: string;
  description: string;
  lessons: Lesson[];
  totalDuration?: string;
  total_duration?: string;
  enrolled: number;
  tags?: string[];
  cover_image?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  reelId?: number;
  reel_id?: string;
  reel?: any;
  position?: number;
}

export interface Playlist {
  id: number;
  title: string;
  thumbnail: string;
  reelsCount: number;
  progress: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [savedReels, setSavedReels] = useState<number[]>([]);
  const [likedReels, setLikedReels] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  // Load reels when authenticated
  useEffect(() => {
    if (currentScreen === 'home' && reels.length === 0) {
      loadReels();
    }
  }, [currentScreen]);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await reelsAPI.getAll(1, 20);
      console.log('Loaded reels:', response);
      setReels(response.data || []);
    } catch (error) {
      console.error('Failed to load reels:', error);
      // Keep using mock data if API fails
    } finally {
      setLoading(false);
    }
  };

  // Auto-navigate from splash to login after 1.5s
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleNavigation = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleReelClick = (reel: Reel) => {
    setSelectedReel(reel);
    setCurrentScreen('reel-detail');
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setCurrentScreen('micro-course');
  };

  const handleSaveReel = (reelId: number) => {
    setSavedReels(prev => 
      prev.includes(reelId) 
        ? prev.filter(id => id !== reelId)
        : [...prev, reelId]
    );
  };

  const handleLikeReel = async (reelId: string) => {
    try {
      await reelsAPI.like(reelId);
      // Reload reels to get updated like count
      if (currentScreen === 'home') {
        loadReels();
      }
    } catch (error) {
      console.error('Failed to like reel:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Mobile Frame Container */}
      <div className="relative w-[390px] h-[844px] bg-white shadow-2xl rounded-[40px] overflow-hidden">
        {currentScreen === 'splash' && (
          <SplashScreen />
        )}
        
        {currentScreen === 'login' && (
          <LoginScreen onNavigate={handleNavigation} onLogin={handleLogin} />
        )}
        
        {currentScreen === 'home' && (
          <HomeFeed 
            onNavigate={handleNavigation}
            onReelClick={handleReelClick}
            onSaveReel={handleSaveReel}
            onLikeReel={handleLikeReel}
            savedReels={savedReels}
            likedReels={likedReels}
            reels={reels}
            loading={loading}
          />
        )}
        
        {currentScreen === 'reel-detail' && selectedReel && (
          <ReelDetail 
            reel={selectedReel}
            onNavigate={handleNavigation}
            onBack={() => setCurrentScreen('home')}
            onSaveReel={handleSaveReel}
            isSaved={savedReels.includes(selectedReel.id)}
          />
        )}
        
        {currentScreen === 'search' && (
          <SearchScreen 
            onNavigate={handleNavigation}
            onCourseClick={handleCourseClick}
          />
        )}
        
        {currentScreen === 'playlists' && (
          <PlaylistsScreen 
            onNavigate={handleNavigation}
            savedReels={savedReels}
          />
        )}
        
        {currentScreen === 'micro-course' && selectedCourse && (
          <MicroCourseScreen 
            course={selectedCourse}
            onBack={() => setCurrentScreen('search')}
            onReelClick={handleReelClick}
          />
        )}
        
        {currentScreen === 'upload' && (
          <CreatorUploadScreen 
            onNavigate={handleNavigation}
          />
        )}
        
        {currentScreen === 'profile' && (
          <ProfileScreen 
            onNavigate={handleNavigation}
          />
        )}
      </div>
    </div>
  );
}