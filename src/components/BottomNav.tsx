import { NavLink } from 'react-router-dom';
import { Home, ListVideo, Search, Heart, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/playlists', icon: ListVideo, label: 'Playlists' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
    { to: '/channel', icon: Info, label: 'Channel' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111111]/90 backdrop-blur-md border-t border-white/10 pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive ? 'text-[#F9C80E]' : 'text-gray-400 hover:text-gray-200'
              )
            }
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
