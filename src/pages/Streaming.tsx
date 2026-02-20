import React, { useState, useEffect } from 'react';
import { Play, Search, Music, Headphones } from 'lucide-react';

export function Streaming({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [submitEmail, setSubmitEmail] = useState('');
  const [musicLink, setMusicLink] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. SOUNDCLOUD EMBED STATE (Stores user submissions)
  const [soundCloudLinks, setSoundCloudLinks] = useState<string[]>(() => {
    const saved = localStorage.getItem('mw_sc_links');
    return saved ? JSON.parse(saved) : [
      "https://soundcloud.com/lofi-beats/tuesday",
      "https://soundcloud.com/monstercat/pegboard-nerds-swamp-thing"
    ];
  });

  // 2. APPLE MUSIC LIVE FEED STATE
  const [liveTracks, setLiveTracks] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // Fetch live tracks on load
  useEffect(() => {
    const fetchLiveMusic = async () => {
      try {
        // Grabbing recent popular tracks using iTunes public API
        const response = await fetch('https://itunes.apple.com/search?term=new+music&entity=song&limit=8');
        const data = await response.json();
        setLiveTracks(data.results);
      } catch (error) {
        console.error("Failed to fetch live music:", error);
      } finally {
        setIsLoadingFeed(false);
      }
    };
    fetchLiveMusic();
  }, []);

  // Handle SoundCloud Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicLink.includes('soundcloud.com')) {
      setSubmitStatus('Please enter a valid SoundCloud link.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Encrypting & Embedding...');
    
    setTimeout(() => {
      const newLinks = [musicLink, ...soundCloudLinks];
      setSoundCloudLinks(newLinks);
      localStorage.setItem('mw_sc_links', JSON.stringify(newLinks)); // Save to local storage for testing
      setIsSubmitting(false);
      setSubmitStatus('Track Live on MusicWeb!');
      setMusicLink('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus(''), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white pt-28 pb-12 px-6 w-full font-sans relative">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" 
          className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" 
          alt="Pro Music Studio"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#0a0c14]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="w-full text-center mb-16">
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

        <div className="w-full flex flex-col lg:flex-row gap-10 items-start">
          
          {/* LEFT SIDEBAR: THE SUBMISSION BOX */}
          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-32 self-start z-20">
            <div className="bg-zinc-900/70 rounded-[2.5rem] p-1 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="bg-black/50 rounded-[2.3rem] p-8 border border-white/5 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white mb-2 leading-none">SHARE YOUR SOUND.</h2>
                  <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest mt-2">
                    Paste a SoundCloud URL
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="email" 
                    required
                    placeholder="Your Email..." 
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-center text-white text-xs font-bold outline-none focus:border-purple-500 transition-all placeholder-zinc-500"
                    value={submitEmail}
                    onChange={(e) => setSubmitEmail(e.target.value)}
                  />
                  <textarea 
                    required
                    rows={4} 
                    placeholder="https://soundcloud.com/..." 
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white text-xs resize-none outline-none font-mono placeholder-zinc-500 focus:border-purple-500 transition-all break-all"
                    value={musicLink} 
                    onChange={(e) => setMusicLink(e.target.value)} 
                  />
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-black text-[10px] uppercase bg-white text-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all tracking-[0.2em] shadow-lg disabled:opacity-50">
                    {isSubmitting ? 'ENCRYPTING...' : 'DROP TRACK'}
                  </button>
                  {submitStatus && (
                    <p className={`text-center text-[10px] font-bold mt-2 ${submitStatus.includes('valid') ? 'text-red-400' : 'text-purple-400 animate-pulse'}`}>
                      {submitStatus}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 w-full space-y-16 overflow-hidden">
            
            {/* SECTION 1: SOUNDCLOUD SUBMISSIONS */}
            <section>
              <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-orange-500">
                <Headphones className="text-orange-500" size={28} />
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Community Drops</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {soundCloudLinks.map((url, index) => (
                  <div key={index} className="w-full bg-black/40 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                    <iframe 
                      width="100%" 
                      height="166" 
                      scrolling="no" 
                      frameBorder="no" 
                      allow="autoplay" 
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                      className="rounded-xl"
                    ></iframe>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 2: LIVE APPLE MUSIC API FEED */}
            <section className="pb-20">
              <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-pink-500">
                <Music className="text-pink-500" size={28} />
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Live Trending Radar</h2>
              </div>

              {isLoadingFeed ? (
                <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest pl-4">Scanning global feeds...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {liveTracks.map((track, index) => (
                    <div key={index} className="bg-[#111] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-pink-500/50 transition-colors group">
                      {/* High-res Album Art Trick (replacing 100x100 with 400x400 in the URL) */}
                      <img 
                        src={track.artworkUrl100.replace('100x100bb', '400x400bb')} 
                        alt="Album Art" 
                        className="w-24 h-24 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-white font-bold truncate text-lg leading-tight mb-1">{track.trackName}</h3>
                        <p className="text-zinc-400 text-xs font-black uppercase tracking-widest truncate mb-3">{track.artistName}</p>
                        <audio controls src={track.previewUrl} className="w-full h-8 opacity-70 group-hover:opacity-100 transition-opacity"></audio>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
