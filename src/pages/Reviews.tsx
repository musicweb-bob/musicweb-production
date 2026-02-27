import { useState, useEffect } from 'react';
import { ArrowUpRight, Loader, Star, RefreshCw } from 'lucide-react';

interface ReviewItem {
  id: string;
  artist: string;
  album: string;
  score: string;
  verdict: string;
  summary: string;
  color: string;
  link: string;
  source: string;
  thumbnail: string;
}

interface ReviewsProps {
  onNavigate?: (page: string) => void;
}

export function Reviews({ onNavigate: _onNavigate }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 1. THE "MASTERPIECE" SAFETY NET (Full Original Content) ---
  const BACKUP_REVIEWS: ReviewItem[] = [
    { 
      id: 'b1', 
      artist: "Radiohead", 
      album: "OK Computer", 
      score: "10.0", 
      verdict: "MASTERPIECE", 
      summary: "The definitive reissue of the album that predicted the 21st century.", 
      color: "from-blue-600 to-sky-900", 
      link: "#", 
      source: "Classic", 
      thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 'b2', 
      artist: "Kendrick Lamar", 
      album: "Mr. Morale", 
      score: "8.9", 
      verdict: "BEST NEW MUSIC", 
      summary: "A dense, thorny, and deeply personal double album.", 
      color: "from-amber-700 to-orange-900", 
      link: "#", 
      source: "Classic", 
      thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 'b3', 
      artist: "Daft Punk", 
      album: "R.A.M.", 
      score: "9.2", 
      verdict: "ESSENTIAL", 
      summary: "A dazzling, meticulously crafted love letter to disco and funk.", 
      color: "from-purple-600 to-indigo-900", 
      link: "#", 
      source: "Classic", 
      thumbnail: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800" 
    }
  ];

  // --- 2. LIVE AGGREGATION ENGINE (Expanded Metadata Parsing) ---
  const fetchReviews = async () => {
    setLoading(true);
    const allReviews: ReviewItem[] = [];
    const FEEDS = [
      { name: 'PITCHFORK', url: 'https://pitchfork.com/feed/feed-album-reviews/rss' },
      { name: 'NME', url: 'https://www.nme.com/reviews/album/feed' }
    ];

    try {
      const promises = FEEDS.map(async (feed) => {
        try {
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
          const data = await res.json();
          if (data.status === 'ok' && data.items) {
            data.items.slice(0, 4).forEach((item: any, index: number) => {
              // Detailed string split logic to separate Artist and Album
              const titleParts = item.title.split(':');
              const artistName = titleParts[0]?.trim() || feed.name;
              const albumName = titleParts[1]?.trim() || item.title;
              
              // Intelligent Image Recovery logic
              let img = item.thumbnail || item.enclosure?.link;
              if (!img) {
                const imgMatch = item.description.match(/src="([^"]+)"/);
                if (imgMatch) img = imgMatch[1];
              }
              
              allReviews.push({
                id: `${feed.name}-${index}-${Math.random()}`,
                artist: artistName,
                album: albumName,
                score: "REV",
                verdict: "LATEST CRITICAL REVIEW",
                summary: item.description.replace(/<[^>]*>?/gm, '').slice(0, 140) + "...",
                color: feed.name === 'PITCHFORK' ? "from-zinc-800 to-zinc-950" : "from-red-950/40 to-black",
                link: item.link,
                source: feed.name,
                thumbnail: img || 'https://images.unsplash.com/photo-1514525253361-b83f859b71c0?auto=format&fit=crop&q=80&w=800'
              });
            });
          }
        } catch (e) { 
          console.warn(`Feed ${feed.name} synchronization failed.`); 
        }
      });

      await Promise.all(promises);
      if (allReviews.length === 0) throw new Error("Connection failed");
      // Randomized sort to ensure feed variety
      setReviews(allReviews.sort(() => Math.random() - 0.5));
    } catch (err) {
      setReviews(BACKUP_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-24 px-8 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* STANDARDIZED USPTO DUAL BRANDED HERO HEADER */}
        <div className="text-center mb-12 flex flex-col items-center border-b border-white/10 pb-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 drop-shadow-2xl">
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

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-zinc-400 uppercase">REVIEWS</h1>
          
          <div className="flex items-center gap-4 mt-6">
            <button 
              onClick={fetchReviews} 
              className="flex items-center gap-2 bg-zinc-900/50 hover:bg-white hover:text-black border border-white/5 px-5 py-2.5 rounded-full transition-all group backdrop-blur-md"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} />
              <span className="text-[10px] font-black uppercase tracking-widest">Update Global Feed</span>
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader className="animate-spin text-orange-500 mb-6" size={56} />
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Syncing International Scores...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {reviews.map((r) => (
              <div key={r.id} className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:-translate-y-2 transition-all relative backdrop-blur-sm hover:border-orange-500/30 shadow-2xl">
                
                {/* Score Badge */}
                <div className="absolute top-6 right-6 z-10 bg-white text-black font-black text-[10px] w-14 h-14 rounded-full flex flex-col items-center justify-center border-2 border-black shadow-2xl">
                  {r.score === 'REV' ? <Star size={18} className="fill-black" /> : r.score}
                </div>

                {/* Hero Image */}
                <div className="h-48 relative overflow-hidden bg-black">
                  <img src={r.thumbnail} alt={r.album} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-5 left-8 px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase">
                    Ref: {r.source}
                  </div>
                </div>

                {/* Meta Content */}
                <div className="p-10">
                  <div className="text-[9px] font-black text-orange-500 tracking-[0.4em] mb-4 uppercase">{r.verdict}</div>
                  <h2 className="text-2xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2 leading-[1.1] tracking-tight uppercase italic">{r.album}</h2>
                  <h3 className="text-xs text-zinc-500 mb-8 font-bold uppercase tracking-[0.2em] border-b border-white/5 pb-4">{r.artist}</h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed border-l-2 border-orange-500/30 pl-6 line-clamp-3 italic">"{r.summary}"</p>
                  
                  {/* Call to Action */}
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between w-full group/link">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover/link:text-white transition-colors">Read Full Analysis</span>
                    <ArrowUpRight size={16} className="text-orange-600 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
