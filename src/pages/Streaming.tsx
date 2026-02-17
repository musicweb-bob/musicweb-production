import React, { useState } from 'react';
import { Play, Trash2, ChevronRight, ChevronLeft, Music, Search } from 'lucide-react';

export function Streaming({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [isAdmin] = useState(false);
  const [submitEmail, setSubmitEmail] = useState('');
  const [musicLink, setMusicLink] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trending = [
    { id: 1, title: "Neon Nights", artist: "Synthwave Pro", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400" },
    { id: 2, title: "Deep Focus", artist: "Lofi Girl", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=400" },
    { id: 3, title: "Urban Soul", artist: "The Collective", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400" },
    { id: 4, title: "Bass Drop", artist: "EDM Titan", img: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=400" },
    { id: 5, title: "Acoustic Sessions", artist: "Indie Folk", img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=400" },
    { id: 6, title: "Jazz Club", artist: "Blue Note", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=400" },
    { id: 7, title: "Electric Sky", artist: "Neon Genesis", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('Processing...');
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('Track Shared Successfully!');
      setMusicLink('');
    }, 2000);
  };

  return (
    // FIXED: Removed 'overflow-x-hidden' from ROOT so sticky works.
    <div className="min-h-screen text-white pt-28 pb-12 px-6 w-full font-sans relative">
      
      {/* --- VISION-1 RESTORED: PRO STUDIO MIXING BOARD --- */}
      <div className="fixed inset-0 z-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" 
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" 
          alt="Pro Music Studio"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"></div>
      </div>

      <div className="relative z-10">
        
        {/* BRANDING HEADER */}
        <div className="w-full text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter flex justify-center items-center gap-4 leading-none drop-shadow-2xl">
            <div className="flex items-baseline">
              <span className="italic text-white">MUSIC</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">web</span>
              <sup className="text-xl md:text-3xl text-zinc-400 ml-1">&reg;</sup>
            </div>
            <span className="text-3xl md:text-5xl font-light text-zinc-300 italic">Digital</span>
          </h1>
          <p className="text-orange-500 italic font-black uppercase tracking-[0.3em] text-sm md:text-xl mt-4 drop-shadow-lg">
            UNCOVER THE RARE. SHARE THE RAW.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto mb-20 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search for artists, tracks, or podcasts..." 
            className="w-full bg-black/60 border border-white/10 rounded-full py-5 pl-16 pr-8 text-white text-sm md:text-base outline-none focus:border-orange-500 transition-all backdrop-blur-md"
          />
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-10 items-start">
          
          {/* SIDEBAR: SHARE YOUR SOUND - STICKY FIXED */}
          {/* 'sticky' and 'top-32' now work because the parent overflow is cleared */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-32 ml-2 self-start">
            <div className="bg-zinc-900/70 rounded-[2.5rem] p-1 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="bg-black/50 rounded-[2.3rem] p-8 border border-white/5 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white mb-2 leading-none">SHARE YOUR SOUND.</h2>
                  <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest mt-2">
                    Upload & Get Discovered
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="email" 
                    placeholder="Your Email..." 
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-center text-white text-xs font-bold outline-none focus:border-purple-500 transition-all placeholder-zinc-500"
                    value={submitEmail}
                    onChange={(e) => setSubmitEmail(e.target.value)}
                  />
                  <textarea 
                    rows={4} 
                    placeholder="Paste Spotify, Apple Music, or SoundCloud links..." 
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white text-xs resize-none outline-none font-mono placeholder-zinc-500 focus:border-purple-500 transition-all"
                    value={musicLink} 
                    onChange={(e) => setMusicLink(e.target.value)} 
                  />
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-black text-[10px] uppercase bg-white text-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all tracking-[0.2em] shadow-lg">
                    {isSubmitting ? 'Sending...' : 'DROP TRACK'}
                  </button>
                  {submitStatus && <p className="text-center text-[10px] text-purple-400 font-bold animate-pulse mt-2">{submitStatus}</p>}
                </form>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          {/* overflow-hidden HERE prevents the white void without breaking sticky sidebar */}
          <div className="flex-1 w-full space-y-20 pr-4 lg:pr-10 overflow-hidden">
            
            <section>
              <div className="flex items-center justify-between mb-8 pl-4 border-l-4 border-orange-500">
                <h2 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Hear What's Trending</h2>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition border border-white/10"><ChevronLeft size={18}/></button>
                  <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition border border-white/10"><ChevronRight size={18}/></button>
                </div>
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x">
                {trending.map((item) => (
                  <div key={item.id} className="min-w-[200px] snap-center group relative aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl transition-transform hover:scale-105 border border-white/20">
                    <img src={item.img} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="font-black text-xs uppercase truncate text-white">{item.title}</p>
                      <p className="text-orange-500 text-[8px] font-black uppercase tracking-widest">{item.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-black uppercase italic border-l-4 border-pink-500 pl-4 mb-10 tracking-tighter">New Releases</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trending.slice(0, 8).map((item) => (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="relative aspect-square w-full rounded-[1.5rem] overflow-hidden mb-3 border border-white/20 shadow-xl">
                      <img src={item.img} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play fill="white" size={32} />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-white group-hover:text-pink-500 transition-colors truncate">{item.title}</h3>
                    <p className="text-zinc-400 text-[8px] font-black uppercase tracking-widest mt-1">{item.artist}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
