import React, { useState, useEffect } from 'react';
import { Play, Search, Music, Headphones, Trash2, Lock, User, Key, Eye, EyeOff, X } from 'lucide-react';

export function Streaming({ onNavigate }: { onNavigate?: (page: string) => void }) {
  // FORM STATE
  const [submitEmail, setSubmitEmail] = useState('');
  const [musicLink, setMusicLink] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DB STATE
  const [communityTracks, setCommunityTracks] = useState<any[]>([]);
  
  // ADMIN STATE
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // APPLE MUSIC STATE
  const [liveTracks, setLiveTracks] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  // SAFELIST
  const ALLOWED_PLATFORMS = ['soundcloud.com', 'apple.com', 'spotify.com', 'youtube.com', 'youtu.be', 'bandcamp.com'];

  // FETCH DATA ON LOAD
  useEffect(() => {
    fetchLiveMusic();
    fetchCommunityTracks();
  }, []);

  const fetchCommunityTracks = async () => {
    try {
      const res = await fetch('/api/streams');
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

  // HANDLE FORM SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check Safelist
    const isAllowed = ALLOWED_PLATFORMS.some(domain => musicLink.toLowerCase().includes(domain));
    if (!isAllowed) {
      setSubmitStatus('Please use a valid link from SoundCloud, Apple Music, Spotify, YouTube, or Bandcamp.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Saving to Database...');
    
    try {
      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: musicLink, email: submitEmail })
      });

      if (res.ok) {
        setSubmitStatus('Track Live on MusicWeb!');
        setMusicLink('');
        setSubmitEmail('');
        fetchCommunityTracks(); // Refresh the feed instantly
      } else {
        setSubmitStatus('Error saving track. Try again.');
      }
    } catch (err) {
      setSubmitStatus('Connection error.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 4000);
    }
  };

  // HANDLE ADMIN DELETE
  const removeTrack = async (id: number) => {
    try {
      await fetch('/api/streams', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchCommunityTracks(); // Refresh after delete
    } catch (err) {
      console.error("Failed to delete track");
    }
  };

  // HANDLE ADMIN LOGIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setIsAdminOpen(false);
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  // DYNAMIC PLAYER RENDERER
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
      return <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="150" className="w-full rounded-xl overflow-hidden bg-transparent" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src={embedUrl}></iframe>;
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedUrl = url;
      if (url.includes('watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
      if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
      return <iframe width="100%" height="200" src={embedUrl} title="YouTube player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="rounded-xl"></iframe>;
    }
    // Fallback for Bandcamp / non-embeddable specific links
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
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000" 
          className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" 
          alt="Pro Music Studio"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-[#0a0c14]"></div>
      </div>

      <div className="relative z-10 w-full">
        
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
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-32 self-start z-20">
            <div className="bg-zinc-900/70 rounded-[2.5rem] p-1 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="bg-black/50 rounded-[2.3rem] p-8 border border-white/5 space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-black text-white mb-2 leading-none">SHARE YOUR SOUND.</h2>
                  <p className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest mt-2">
                    Apple, Spotify, SC, YT, Bandcamp
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
                    placeholder="Paste music link here..." 
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white text-xs resize-none outline-none font-mono placeholder-zinc-500 focus:border-purple-500 transition-all break-all"
                    value={musicLink} 
                    onChange={(e) => setMusicLink(e.target.value)} 
                  />
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl font-black text-[10px] uppercase bg-white text-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all tracking-[0.2em] shadow-lg disabled:opacity-50">
                    {isSubmitting ? 'PROCESSING...' : 'DROP TRACK'}
                  </button>
                  {submitStatus && (
                    <p className={`text-center text-[10px] font-bold mt-2 ${submitStatus.includes('valid') || submitStatus.includes('Error') ? 'text-red-400' : 'text-purple-400 animate-pulse'}`}>
                      {submitStatus}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 w-full space-y-16 overflow-hidden">
            
            {/* COMMUNITY DROPS (DATABASE DRIVEN) */}
            <section>
              <div className="flex items-center justify-between mb-8 pl-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-3">
                  <Headphones className="text-orange-500" size={28} />
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white">Community Drops</h2>
                </div>
                {isAuthenticated && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest animate-pulse">
                    Admin Mode Active
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {communityTracks.length === 0 ? (
                  <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest pl-4">No tracks dropped yet. Be the first.</div>
                ) : (
                  communityTracks.map((track) => (
                    <div key={track.id} className="w-full bg-black/40 p-2 rounded-2xl border border-white/10 backdrop-blur-md relative group">
                      
                      {/* ADMIN DELETE BUTTON */}
                      {isAuthenticated && (
                        <button 
                          onClick={() => removeTrack(track.id)}
                          className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                          title="Delete Track"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      {/* DYNAMIC PLAYER */}
                      {renderPlayer(track.url)}
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* LIVE APPLE MUSIC API FEED */}
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

            {/* --- ADMIN LOGIN MODAL OVERLAY --- */}
            {isAdminOpen && !isAuthenticated && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                <div className="max-w-md w-full bg-[#111] border border-white/10 p-10 rounded-3xl text-center animate-in fade-in zoom-in shadow-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col items-start">
                      <Lock size={24} className="text-gray-400 mb-2" />
                      <h2 className="text-2xl font-bold text-white">Authorized Access</h2>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">Restricted Area</p>
                    </div>
                    <button onClick={() => { setIsAdminOpen(false); setLoginError(''); }} className="text-gray-500 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>

                  {loginError && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded mb-6 text-center">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative text-left">
                      <User className="absolute left-4 top-4 text-gray-500" size={18} />
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-3.5 pl-12 text-sm text-white outline-none focus:border-white/30 transition-colors"
                        placeholder="Username"
                      />
                    </div>
                    
                    <div className="relative text-left">
                      <Key className="absolute left-4 top-4 text-gray-500" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-3.5 pl-12 pr-12 text-sm text-white outline-none focus:border-white/30 transition-colors"
                        placeholder="Password"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors mt-4">
                      Authenticate
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* --- FOOTER LINK --- */}
            {!isAuthenticated && (
              <div className="mt-16 text-center border-t border-white/5 pt-8">
                <button 
                  onClick={() => setIsAdminOpen(true)}
                  className="text-[10px] font-bold text-gray-700 uppercase tracking-widest hover:text-pink-500 transition-colors"
                >
                  Authorized Staff Login
                </button>
              </div>
            )}
            {isAuthenticated && (
               <div className="mt-16 text-center border-t border-white/5 pt-8">
                 <button 
                   onClick={() => setIsAuthenticated(false)}
                   className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                 >
                   Log Out Admin
                 </button>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
