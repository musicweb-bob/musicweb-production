import React, { useState, useEffect } from 'react';
import { Search, Music, Headphones, Loader2 } from 'lucide-react';

export function Streaming({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [submitEmail, setSubmitEmail] = useState('');
  const [musicLink, setMusicLink] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [communityTracks, setCommunityTracks] = useState<any[]>([]);
  const [liveTracks, setLiveTracks] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  const ALLOWED_PLATFORMS = ['soundcloud.com', 'apple.com', 'spotify.com', 'youtube.com', 'youtu.be', 'bandcamp.com'];

  useEffect(() => {
    fetchLiveMusic();
    fetchCommunityTracks();
  }, []);

  const fetchCommunityTracks = async () => {
    try {
      const res = await fetch('/api/stream');
      const data = await res.json();
      if (data.streams) setCommunityTracks(data.streams);
    } catch (err) {
      console.error("Failed to fetch community tracks");
    }
  };

  const fetchLiveMusic = async () => {
    try {
      const response = await fetch('https://itunes.apple.com/search?term=billboard+hits&entity=song&limit=8');
      const data = await response.json();
      setLiveTracks(data.results);
    } catch (error) {
      console.error("Failed to fetch live music");
    } finally {
      setIsLoadingFeed(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isAllowed = ALLOWED_PLATFORMS.some(domain => musicLink.toLowerCase().includes(domain));
    if (!isAllowed) {
      setSubmitStatus('Please use a valid link from SoundCloud, Apple Music, Spotify, YouTube, or Bandcamp.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Saving Track...');
    
    try {
      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: musicLink, email: submitEmail })
      });

      if (res.ok) {
        setSubmitStatus('Track Live on MusicWeb!');
        setMusicLink('');
        setSubmitEmail('');
        fetchCommunityTracks();
      } else {
        setSubmitStatus('Error saving track.');
      }
    } catch (err) {
      setSubmitStatus('Connection error.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 4000);
    }
  };

  const renderPlayer = (url: string) => {
    if (url.includes('soundcloud.com')) {
      return <iframe width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false`} className="rounded-xl"></iframe>;
    }
    if (url.includes('spotify.com')) {
      const embedUrl = url.replace('/track/', '/embed/track/').replace('/album/', '/embed/album/');
      return <iframe src={embedUrl} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" className="rounded-xl"></iframe>;
    }
    if (url.includes('apple.com')) {
      const embedUrl = url.replace('music.apple.com', 'embed.music.apple.com');
      return <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="150" className="w-full rounded-xl overflow-hidden bg-transparent" src={embedUrl}></iframe>;
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url;
      if (url.includes('watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
      if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
      return <iframe width="100%" height="200" src={embedUrl} frameBorder="0" allowFullScreen className="rounded-xl"></iframe>;
    }
    return (
      <div className="bg-[#1a1d2e] p-6 rounded-xl border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="text-orange-500" />
          <span className="text-white font-bold truncate max-w-xs text-sm">{url}</span>
        </div>
        <a href={url} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-orange-500 hover:text-white transition-colors">Listen</a>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white pt-28 pb-12 px-6 w-full font-sans relative">
      <div className="fixed inset-0 z-0 bg-black">
        <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" className="w-full h-full object-cover opacity-30 grayscale" alt="Pro Music Studio" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#0a0c14]"></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="w-full text-center mb-16">
          
          {/* USPTO DUAL BRANDED HERO TITLE - LINE 1 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-2">
             
             {/* MUSICweb */}
             <div className="flex items-center select-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIC</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-3xl font-bold text-zinc-400 relative -ml-1 top-[-12px] md:top-[-18px]">&reg;</sup>
             </div>
             
             {/* Divider */}
             <span className="hidden md:block text-zinc-700 text-5xl md:text-6xl font-light pb-2">|</span>
             
             {/* MUSIKweb */}
             <div className="flex items-center select-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIK</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-3xl font-bold text-zinc-400 relative -ml-1 top-[-12px] md:top-[-18px]">&reg;</sup>
             </div>
          </div>

          {/* LINE 2: Digital */}
          <div className="flex justify-center mb-6">
             <span className="text-4xl md:text-6xl font-light text-zinc-300 italic">Digital</span>
          </div>
          
          {/* LINE 3: Tagline */}
          <p className="text-orange-500 italic font-black uppercase tracking-[0.3em] text-sm md:text-xl mt-4">UNCOVER THE RARE. SHARE THE RAW.</p>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-10 items-start">
          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-32 self-start z-20">
            <div className="bg-zinc-900/70 rounded-[2.5rem] p-1 border border-white/10 backdrop-blur-xl">
              <div className="bg-black/50 rounded-[2.3rem] p-8 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white mb-2 leading-none uppercase">Share Your Sound.</h2>
                  <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest mt-2">Verified Music Links Only</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="email" required placeholder="Your Email..." className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-center text-white text-xs font-bold outline-none focus:border-purple-500 transition-all" value={submitEmail} onChange={(e) => setSubmitEmail(e.target.value)} />
                  <textarea required rows={4} placeholder="Paste music link here..." className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white text-xs resize-none outline-none font-mono focus:border-purple-500" value={musicLink} onChange={(e) => setMusicLink(e.target.value)} />
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-black text-[10px] uppercase bg-white text-black hover:bg-purple-600 hover:text-white transition-all tracking-[0.2em] shadow-lg disabled:opacity-50">
                    {isSubmitting ? 'PROCESSING...' : 'DROP TRACK'}
                  </button>
                  {submitStatus && <p className={`text-center text-[10px] font-bold mt-2 ${submitStatus.includes('valid') ? 'text-red-400' : 'text-purple-400 animate-pulse'}`}>{submitStatus}</p>}
                </form>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-16">
            <section>
              <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-orange-500">
                <Headphones className="text-orange-500" size={28} />
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Community Drops</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {communityTracks.length === 0 ? <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest pl-4">No tracks dropped yet.</p> : communityTracks.map((track) => (<div key={track.id} className="w-full bg-black/40 p-2 rounded-2xl border border-white/10 backdrop-blur-md">{renderPlayer(track.url)}</div>))}
              </div>
            </section>
            <section className="pb-20">
              <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-pink-500">
                <Music className="text-pink-500" size={28} />
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Live Trending Radar</h2>
              </div>
              {isLoadingFeed ? <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest pl-4">Scanning global feeds...</p> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{liveTracks.map((track, index) => (<div key={index} className="bg-[#111] border border-white/5 rounded-2xl p-4 flex gap-4 hover:border-pink-500/50 transition-colors group"><img src={track.artworkUrl100.replace('100x100bb', '400x400bb')} alt="Album Art" className="w-24 h-24 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform" /><div className="flex-1 min-w-0 flex flex-col justify-center"><h3 className="text-white font-bold truncate text-lg leading-tight mb-1">{track.trackName}</h3><p className="text-zinc-400 text-xs font-black uppercase tracking-widest truncate mb-3">{track.artistName}</p><audio controls src={track.previewUrl} className="w-full h-8 opacity-70 group-hover:opacity-100 transition-opacity"></audio></div></div>))}</div>}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
