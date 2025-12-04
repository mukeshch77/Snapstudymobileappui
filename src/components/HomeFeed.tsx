import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Screen, Reel } from '../App';
import BottomNav from './BottomNav';
import { mockReels } from '../data/mockData';

interface HomeFeedProps {
  onNavigate: (screen: Screen) => void;
  onReelClick: (reel: Reel) => void;
  onSaveReel: (reelId: number) => void;
  onLikeReel: (reelId: string) => void;
  savedReels: number[];
  likedReels: number[];
  reels?: Reel[];
  loading?: boolean;
}

export default function HomeFeed({ 
  onNavigate, 
  onReelClick, 
  onSaveReel, 
  onLikeReel,
  savedReels,
  likedReels,
  reels: apiReels,
  loading 
}: HomeFeedProps) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Use API reels if available, otherwise fallback to mock data
  const reelsToDisplay = (apiReels && apiReels.length > 0) ? apiReels : mockReels;
  
  // Normalize reel data to handle both API and mock formats
  const normalizeReel = (reel: any): Reel => {
    const creatorName = typeof reel.creator === 'string' 
      ? reel.creator 
      : reel.creator?.name || 'Unknown';
    
    const likesCount = Array.isArray(reel.likes) 
      ? reel.likes.length 
      : (typeof reel.likes === 'number' ? reel.likes : 0);

    return {
      id: reel.id,
      title: reel.title,
      creator: creatorName,
      creatorAvatar: typeof reel.creator === 'object' ? reel.creator?.avatar_url : reel.creatorAvatar,
      tags: reel.tags || [],
      likes: likesCount,
      comments: reel.comments || 0,
      description: reel.description || '',
      videoUrl: reel.video_url || reel.videoUrl || '',
      course_id: reel.micro_course_id || reel.courseId,
    };
  };

  const currentReel = normalizeReel(reelsToDisplay[currentReelIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe up - next reel
      if (currentReelIndex < reelsToDisplay.length - 1) {
        setCurrentReelIndex(currentReelIndex + 1);
      }
    }

    if (touchStart - touchEnd < -100) {
      // Swipe down - previous reel
      if (currentReelIndex > 0) {
        setCurrentReelIndex(currentReelIndex - 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-white">Loading reels...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black relative">
      {/* Video Container */}
      <div
        className="w-full h-full cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onReelClick(currentReel)}
      >
        {/* Video Placeholder */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
          {/* Simulated video background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          {/* Play icon */}
          <div className="relative z-10">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="white"
              opacity="0.7"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Swipe indicator */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
            <div className="w-12 h-1 bg-white rounded-full"></div>
            <p className="text-white text-xs">Swipe up for next</p>
          </div>
        </div>

        {/* Creator Info - Bottom Left */}
        <div className="absolute bottom-24 left-4 right-20 z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
            <div>
              <p className="text-white">{currentReel.creator}</p>
              <button className="text-white text-sm opacity-80">+ Follow</button>
            </div>
          </div>
          
          <h3 className="text-white mb-2">{currentReel.title}</h3>
          
          <div className="flex flex-wrap gap-2">
            {currentReel.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons - Right Side */}
        <div className="absolute bottom-24 right-4 flex flex-col gap-6 z-10">
          <button 
            className="flex flex-col items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onLikeReel(currentReel.id);
            }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              likedReels.includes(currentReel.id) 
                ? 'bg-red-500' 
                : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Heart 
                className={likedReels.includes(currentReel.id) ? 'text-white fill-white' : 'text-white'} 
                size={24} 
              />
            </div>
            <span className="text-white text-xs">{currentReel.likes + (likedReels.includes(currentReel.id) ? 1 : 0)}</span>
          </button>

          <button 
            className="flex flex-col items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <MessageCircle className="text-white" size={24} />
            </div>
            <span className="text-white text-xs">{currentReel.comments}</span>
          </button>

          <button 
            className="flex flex-col items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onSaveReel(currentReel.id);
            }}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              savedReels.includes(currentReel.id) 
                ? 'bg-[#3C7EFF]' 
                : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Bookmark 
                className={savedReels.includes(currentReel.id) ? 'text-white fill-white' : 'text-white'} 
                size={24} 
              />
            </div>
            <span className="text-white text-xs">Save</span>
          </button>

          <button 
            className="flex flex-col items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Share2 className="text-white" size={24} />
            </div>
            <span className="text-white text-xs">Share</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="home" onNavigate={onNavigate} />
    </div>
  );
}