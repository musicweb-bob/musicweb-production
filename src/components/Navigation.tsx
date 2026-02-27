import { useState } from 'react';
import { Menu, X, ChevronDown, Lock } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isMobileMarketplaceOpen, setIsMobileMarketplaceOpen] = useState(false);

  const navGroupLeft = [
    { id: 'home', label: 'Home' },
    { id: 'streaming', label: 'Streaming-Digital' }, 
  ];

  const navGroupRight = [
    { id: 'concerts', label: 'Concerts' },
    { id: 'artists', label: 'Artists' },
    { id: 'news', label: 'News' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
    { id: 'about', label: 'About' },
    { id: 'investors', label: 'Investors' }
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileOpen(false);
    setIsMarketplaceOpen(false);
    setIsMobileMarketplaceOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-xl border-b border-zinc-800 flex flex-col" onMouseLeave={() => setIsMarketplaceOpen(false)}>
      
      {/* --- GLOBAL BRANDING BAR FOR USPTO --- */}
      <div className="w-full bg-[#0a0c14] border-b border-white/10 py-1.5 text-center flex justify-center items-center gap-4 z-50">
        <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
          Global Platforms:
        </span>
        <span className="text-[10.5px] text-zinc-300 font-black tracking-widest">
          MUSICweb&reg;
        </span>
        <span className="text-[10px] text-zinc-700">|</span>
        <span className="text-[10.5px] text-zinc-300 font-black tracking-widest">
          MUSIKweb&reg;
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 h-20 w-full flex justify-between items-center">
        
        {/* LOGO */}
        <div onClick={() => handleNavigate('home')} className="flex items-center gap-1 cursor-pointer select-none">
          <span className="text-2xl font-black italic text-white">MUSIC</span>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">web</span>
          <sup className="text-[10px] font-bold text-zinc-400 relative top-0">&reg;</sup>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center gap-8">
          {navGroupLeft.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white ${
                currentPage === item.id ? 'text-orange-500' : 'text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* DESKTOP MARKETPLACE DROPDOWN */}
          <div className="relative" onMouseEnter={() => setIsMarketplaceOpen(true)}>
            <button className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white ${currentPage.includes('marketplace') ? 'text-orange-500' : 'text-zinc-300'}`}>
              Marketplace <ChevronDown size={12} />
            </button>
            
            {isMarketplaceOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#1a1d2e] border border-zinc-700 rounded-xl shadow-2xl overflow-hidden flex flex-col py-2 z-50">
                <button onClick={() => handleNavigate('marketplace')} className="text-left px-6 py-3 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Shop All</button>
                <button onClick={() => handleNavigate('marketplace#vinyl')} className="text-left px-6 py-3 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Vinyl & CDs</button>
                <button onClick={() => handleNavigate('marketplace#gear')} className="text-left px-6 py-3 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Instruments & Gear</button>
                <button onClick={() => handleNavigate('marketplace#memorabilia')} className="text-left px-6 py-3 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Memorabilia</button>
                <button onClick={() => handleNavigate('marketplace#books')} className="text-left px-6 py-3 text-[11px] font-bold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">Books</button>
              </div>
            )}
          </div>

          {navGroupRight.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white ${
                currentPage === item.id ? 'text-orange-500' : 'text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button onClick={() => handleNavigate('admin')} className={`p-2 rounded-lg border transition-all ml-4 ${currentPage === 'admin' ? 'border-red-500 text-red-500' : 'border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white'}`}>
            <Lock size={14} />
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button className="lg:hidden text-white p-2" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE NAVIGATION MENU --- */}
      {isMobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-zinc-800 flex flex-col items-center py-8 gap-6 h-[calc(100vh-100px)] overflow-y-auto">
          {navGroupLeft.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`text-sm font-black uppercase tracking-[0.2em] transition-all ${
                currentPage === item.id ? 'text-orange-500' : 'text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* MOBILE MARKETPLACE ACCORDION */}
          <div className="flex flex-col items-center w-full">
            <button 
              onClick={() => setIsMobileMarketplaceOpen(!isMobileMarketplaceOpen)}
              className={`flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] transition-all mb-2 ${currentPage.includes('marketplace') ? 'text-orange-500' : 'text-zinc-300'}`}
            >
              Marketplace <ChevronDown size={16} className={`transition-transform ${isMobileMarketplaceOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isMobileMarketplaceOpen && (
              <div className="flex flex-col items-center gap-5 w-full bg-white/5 py-6 my-2 border-y border-white/5">
                <button onClick={() => handleNavigate('marketplace')} className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Shop All</button>
                <button onClick={() => handleNavigate('marketplace#vinyl')} className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Vinyl & CDs</button>
                <button onClick={() => handleNavigate('marketplace#gear')} className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Instruments & Gear</button>
                <button onClick={() => handleNavigate('marketplace#memorabilia')} className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Memorabilia</button>
                <button onClick={() => handleNavigate('marketplace#books')} className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Books</button>
              </div>
            )}
          </div>

          {navGroupRight.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`text-sm font-black uppercase tracking-[0.2em] transition-all ${
                currentPage === item.id ? 'text-orange-500' : 'text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button onClick={() => handleNavigate('admin')} className={`mt-4 p-4 rounded-xl border transition-all ${currentPage === 'admin' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-zinc-800 text-zinc-500'}`}>
            <Lock size={20} />
          </button>
        </div>
      )}
    </nav>
  );
}
