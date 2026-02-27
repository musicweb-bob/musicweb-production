import { useState, useEffect } from 'react';
import { ExternalLink, Loader, Clock, RefreshCw, Signal } from 'lucide-react';

interface NewsItem {
  title: string; link: string; pubDate: string; content: string; source: string; thumbnail: string;
}

export function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingBackup, setUsingBackup] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const FEEDS = [
    { name: 'NME', url: 'https://www.nme.com/feed' },
    { name: 'PITCHFORK', url: 'https://pitchfork.com/feed/feed-news/rss' },
    { name: 'STEREOGUM', url: 'https://www.stereogum.com/feed' },
  ];

  const BACKUP_NEWS: NewsItem[] = [
    {
      title: "Radiohead Teases Potential Return to the Studio for 2026",
      link: "#", pubDate: new Date().toISOString(),
      content: "Rumors are swirling after Jonny Greenwood was spotted at the band's Oxford studio facility earlier this week...",
      source: "NME", thumbnail: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const fetchNews = async () => {
    setLoading(true);
    setUsingBackup(false);
    const allNews: NewsItem[] = [];
    let successCount = 0;

    try {
      const promises = FEEDS.map(async (feed) => {
        try {
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
          const data = await res.json();
          if (data.status === 'ok') {
            successCount++;
            data.items.forEach((item: any) => {
              let img = item.thumbnail || item.enclosure?.link;
              if (!img) {
                const imgMatch = item.description.match(/src="([^"]+)"/);
                if (imgMatch) img = imgMatch[1];
              }
              const cleanDesc = item.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + "...";
              allNews.push({ title: item.title, link: item.link, pubDate: item.pubDate, content: cleanDesc, source: feed.name, thumbnail: img || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800' });
            });
          }
        } catch (err) { console.warn(`Feed failed: ${feed.name}`); }
      });
      await Promise.all(promises);
      if (successCount === 0 || allNews.length === 0) throw new Error("No feeds loaded");
      setNews(allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()));
    } catch (err) {
      setNews(BACKUP_NEWS);
      setUsingBackup(true);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchNews(); }, []);

  const filteredNews = filter === 'ALL' ? news : news.filter(n => n.source === filter);

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-12 px-6 font-sans relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-red-900/10 via-black to-blue-900/10 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* STANDARDIZED USPTO DUAL BRANDED HERO HEADER */}
        <div className="text-center mb-12 flex flex-col items-center border-b border-white/10 pb-6">
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 drop-shadow-2xl">
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

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-zinc-400 uppercase">NEWS FEED</h1>
          
          <div className="flex gap-2 overflow-x-auto mt-10 pb-2">
             {['ALL', 'NME', 'PITCHFORK', 'STEREOGUM'].map(src => (
               <button key={src} onClick={() => setFilter(src)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${filter === src ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-800 hover:border-zinc-500 hover:text-white'}`}>{src}</button>
             ))}
             <button onClick={fetchNews} className="px-4 rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-white transition-all"><RefreshCw size={14} className={loading ? 'animate-spin' : ''} /></button>
          </div>
        </div>

        {usingBackup && !loading && (
          <div className="mb-8 flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            <Signal size={12} className="text-orange-500 animate-pulse" />
            <span>Live Sync Interrupted. Viewing Archived Feed.</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40"><Loader className="animate-spin text-orange-500 mb-4" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, index) => (
              <div key={index} className="group flex flex-col bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/20 transition-all hover:-translate-y-1">
                <div className="h-56 relative overflow-hidden bg-black">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'} />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${item.source === 'NME' ? 'bg-red-600' : item.source === 'PITCHFORK' ? 'bg-green-600' : 'bg-blue-600'}`}>{item.source}</span>
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col">
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3"><Clock size={12} /> {new Date(item.pubDate).toLocaleDateString()}</div>
                  <h3 className="text-xl font-black italic text-white leading-tight mb-4 group-hover:text-orange-500 line-clamp-2">{item.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-6 flex-1 italic">{item.content}</p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full py-4 px-6 rounded-xl bg-black border border-white/5 hover:bg-white hover:text-black transition-all">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Read Full Story</span><ExternalLink size={14} />
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
