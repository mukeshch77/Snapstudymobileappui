import { Play, Plus } from 'lucide-react';
import { Screen } from '../App';
import BottomNav from './BottomNav';
import { mockPlaylists } from '../data/mockData';

interface PlaylistsScreenProps {
  onNavigate: (screen: Screen) => void;
  savedReels: number[];
}

export default function PlaylistsScreen({ onNavigate, savedReels }: PlaylistsScreenProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-gray-900">Your Learning Playlists</h1>
          <button className="w-10 h-10 bg-[#3C7EFF] rounded-full flex items-center justify-center">
            <Plus className="text-white" size={20} />
          </button>
        </div>
        <p className="text-gray-500">
          {savedReels.length} reels saved • {mockPlaylists.length} playlists
        </p>
      </div>

      {/* Playlists List */}
      <div className="flex-1 overflow-y-auto pb-20 px-6 pt-6">
        <div className="space-y-4">
          {mockPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Playlist Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                    <Play className="text-white fill-white ml-1" size={28} />
                  </div>
                  <p className="text-white text-sm">{playlist.reelsCount} videos</p>
                </div>

                {/* Progress Badge */}
                {playlist.progress > 0 && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="text-white text-sm">{playlist.progress}% complete</span>
                  </div>
                )}
              </div>

              {/* Playlist Info */}
              <div className="p-4">
                <h3 className="text-gray-900 mb-2">{playlist.title}</h3>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3C7EFF] rounded-full transition-all duration-300"
                      style={{ width: `${playlist.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-3 bg-[#3C7EFF] text-white rounded-xl flex items-center justify-center gap-2">
                    <Play size={16} fill="white" />
                    <span>Continue Learning</span>
                  </button>
                  <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State for Saved Reels */}
          {savedReels.length === 0 && (
            <div className="mt-8 text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="text-gray-400" size={32} />
              </div>
              <h3 className="text-gray-900 mb-2">No saved reels yet</h3>
              <p className="text-gray-500 mb-6">
                Start saving reels to build your learning playlists
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="px-6 py-3 bg-[#3C7EFF] text-white rounded-xl"
              >
                Explore Reels
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="playlists" onNavigate={onNavigate} />
    </div>
  );
}
