import React, { useState } from 'react';
import { Ticket, MapPin, Search, Loader2, Music, Signal, ExternalLink, AlertCircle } from 'lucide-react';
import { fetchGlobalTours, StandardEvent } from '../services/tourService';

export default function TourSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<StandardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- SEARCH HANDLER ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setEvents([]);
    
    // Uses the global Tour Database Sync
    try {
      const results = await fetchGlobalTours(searchQuery);
      setEvents(results);
    } catch (error) {
      console.error("Tour database search failed:", error);
    }
    setLoading(false);
  };

  // --- DATE FORMATTING UTILITY ---
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: d.getDate()
    };
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-20 px-6 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        
        {/* STANDARDIZED USPTO DUAL BRANDED HERO HEADER */}
        <div className="text-center mb-12 flex flex-col items-center border-b border-white/5 pb-10">
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-4 drop-shadow-2xl">
             {/* MUSICweb */}
             <div className="flex items-center select-none leading-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIC</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-[1.8rem] font-bold text-zinc-400 relative -ml-1 top-[-15px] md:top-[-22px]">®</sup>
             </div>
             
             {/* Divider */}
             <span className="hidden md:block text-zinc-700 text-6xl font-light pb-4">|</span>
             
             {/* MUSIKweb */}
             <div className="flex items-center select-none leading-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIK</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-[1.8rem] font-bold text-zinc-400 relative -ml-1 top-[-15px] md:top-[-22px]">®</sup>
             </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-zinc-500 uppercase">TOUR EXPLORER</h1>
        </div>

        {/* SEARCH CONSOLE */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <form onSubmit={handleSearch} className="group relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
            
            <input 
              type="text" 
              placeholder="SEARCH ANY ARTIST..." 
              autoComplete="off"
              className="relative z-10 w-full bg-zinc-900/50 border-2 border-white/10 p-6 pl-10 rounded-[2rem] text-xl font-black italic text-white placeholder-zinc-700 outline-none focus:border-blue-500/50 focus:bg-black transition-all uppercase tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <button 
              type="submit" 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-4 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl z-20"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
            </button>
          </form>
          
          <div className="mt-4 flex justify-center items-center gap-2 text-blue-500/60 text-[9px] font-black uppercase tracking-[0.3em]">
            <Signal size={12} className="animate-pulse" /> Live Global Sync Active
          </div>
        </div>

        {/* RESULTS FEED */}
        {loading ? (
          <div className="flex flex-col items-center py-32 gap-6">
            <Loader2 className="animate-spin text-blue-500" size={64} />
            <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs">Scanning Global Databases...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {events.map((show) => {
              const { month, day } = formatDate(show.date);
              return (
                <div key={show.id} className="group bg-zinc-900/30 border border-white/5 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 hover:bg-zinc-900/50 hover:border-white/20 transition-all backdrop-blur-sm shadow-lg">
                  <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 group-hover:border-blue-500/50 transition-colors">
                    <span className="text-[10px] font-black text-blue-500 uppercase">{month}</span>
                    <span className="text-3xl font-black">{day}</span>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <h3 className="text-2xl font-black italic tracking-tighter mb-2 truncate group-hover:text-blue-400 transition-colors">{show.venue}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      <MapPin size={14} className="text-blue-500" /> {show.location}
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    {show.ticketUrl ? (
                      <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto flex items-center justify-center gap-3 bg-white hover:bg-blue-600 hover:text-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl">
                        <Ticket size={18} /> Get Tickets <ExternalLink size={12} />
                      </a>
                    ) : (
                      <div className="px-10 py-5 rounded-2xl border border-zinc-800 text-zinc-600 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                        <AlertCircle size={14} /> Sold Out
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : hasSearched && (
          <div className="text-center py-32 bg-zinc-900/20 rounded-[3rem] border border-dashed border-white/5 shadow-inner">
            <Music size={48} className="mx-auto text-zinc-800 mb-6" />
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">No current tour dates found for this artist.</p>
          </div>
        )}
      </div>
    </div>
  );
}
