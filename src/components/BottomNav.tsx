import { Home, Search, ListVideo, User } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: 'home' | 'search' | 'playlists' | 'profile';
  onNavigate: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'search' as Screen, icon: Search, label: 'Search' },
    { id: 'playlists' as Screen, icon: ListVideo, label: 'Playlists' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-20">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors"
          >
            <Icon
              size={24}
              className={isActive ? 'text-[#3C7EFF]' : 'text-gray-400'}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={`text-xs ${isActive ? 'text-[#3C7EFF]' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
