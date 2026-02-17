import { Link, useLocation } from 'react-router-dom';
import { Music } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Investors', path: '/investors' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'News', path: '/news' },
    { name: 'Artists', path: '/artists' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Concerts', path: '/concerts' },
    { name: 'Gear', path: '/gear' },
    { name: 'Streaming / Digital', path: '/streaming' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1a1d2e]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-2 rounded-lg group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300">
            <Music className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">
            MUSIC<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">web</span>
            <sup className="text-xs text-gray-400 align-top ml-0.5">®</sup>
          </span>
        </Link>

        {/* LINKS */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-bold transition-colors duration-300 ${
                isActive(item.path) 
                  ? 'text-pink-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
