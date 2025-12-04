import { Settings, Upload, BookMarked, Video } from 'lucide-react';
import { useState } from 'react';
import { Screen } from '../App';
import BottomNav from './BottomNav';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

type ProfileTab = 'courses' | 'saved' | 'uploads';

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('courses');

  const userStats = {
    followers: 1234,
    courses: 8,
    playlists: 12,
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-gray-900">Profile</h1>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Settings className="text-gray-700" size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-4 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl">JD</span>
          </div>

          {/* Name */}
          <h2 className="text-gray-900 mb-1">John Doe</h2>
          <p className="text-gray-500 mb-4">@johndoe</p>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-gray-900">{userStats.followers}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-gray-900">{userStats.courses}</p>
              <p className="text-sm text-gray-500">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-gray-900">{userStats.playlists}</p>
              <p className="text-sm text-gray-500">Playlists</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <button className="flex-1 px-4 py-3 bg-[#3C7EFF] text-white rounded-xl">
              Edit Profile
            </button>
            <button 
              onClick={() => onNavigate('upload')}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 pb-3 text-center transition-colors ${
              activeTab === 'courses'
                ? 'text-[#3C7EFF] border-b-2 border-[#3C7EFF]'
                : 'text-gray-500'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 pb-3 text-center transition-colors ${
              activeTab === 'saved'
                ? 'text-[#3C7EFF] border-b-2 border-[#3C7EFF]'
                : 'text-gray-500'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex-1 pb-3 text-center transition-colors ${
              activeTab === 'uploads'
                ? 'text-[#3C7EFF] border-b-2 border-[#3C7EFF]'
                : 'text-gray-500'
            }`}
          >
            Uploads
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-20 px-6">
        {activeTab === 'courses' && (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-2xl overflow-hidden relative"
              >
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-xl"></div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BookMarked className="text-white" size={16} />
                    <span className="text-white text-xs">8 lessons</span>
                  </div>
                  <p className="text-white text-sm line-clamp-2">
                    Course {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div
                key={item}
                className="aspect-[9/16] bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl overflow-hidden relative"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="text-gray-400" size={32} />
            </div>
            <h3 className="text-gray-900 mb-2">No uploads yet</h3>
            <p className="text-gray-500 mb-6">
              Share your knowledge by creating educational reels
            </p>
            <button
              onClick={() => onNavigate('upload')}
              className="px-6 py-3 bg-[#3C7EFF] text-white rounded-xl"
            >
              Upload Your First Reel
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="profile" onNavigate={onNavigate} />
    </div>
  );
}
