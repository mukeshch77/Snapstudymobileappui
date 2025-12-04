import { ArrowLeft, Heart, Bookmark, Share2 } from 'lucide-react';
import { Reel, Screen } from '../App';
import Button from './Button';

interface ReelDetailProps {
  reel: Reel;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  onSaveReel: (reelId: any) => void;
  isSaved: boolean;
}

export default function ReelDetail({ reel, onNavigate, onBack, onSaveReel, isSaved }: ReelDetailProps) {
  return (
    <div className="w-full h-full bg-black relative flex flex-col">
      {/* Video Container */}
      <div className="flex-1 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Simulated video background */}
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

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-4 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center z-20"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
      </div>

      {/* Slide-up Info Panel */}
      <div className="bg-white rounded-t-3xl px-6 py-6 max-h-[50%] overflow-y-auto">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-gray-900">{reel.creator}</p>
            <p className="text-sm text-gray-500">Educational Creator</p>
          </div>
          <button className="px-4 py-2 bg-[#3C7EFF] text-white rounded-xl text-sm">
            Follow
          </button>
        </div>

        {/* Title */}
        <h2 className="text-gray-900 mb-3">{reel.title}</h2>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          {reel.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {reel.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-xl">
            <Heart size={20} className="text-gray-700" />
            <span className="text-gray-700">{reel.likes}</span>
          </button>
          <button 
            onClick={() => onSaveReel(reel.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl ${
              isSaved ? 'bg-[#3C7EFF] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Bookmark size={20} className={isSaved ? 'fill-white' : ''} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl">
            <Share2 size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Course Button */}
        {reel.courseId && (
          <div className="space-y-3">
            <Button 
              variant="primary" 
              fullWidth
              onClick={() => onNavigate('playlists')}
            >
              Add to Playlist
            </Button>
            <Button 
              variant="secondary" 
              fullWidth
              onClick={() => onNavigate('micro-course')}
            >
              Start Micro-Course
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}