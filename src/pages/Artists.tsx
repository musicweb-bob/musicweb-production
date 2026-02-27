import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, Loader, ExternalLink, Music, ArrowRight } from 'lucide-react';

// --- WIKIPEDIA API TYPES ---
interface WikiData {
  title: string;
  extract: string;
  thumbnail?: { source: string };
}

interface SearchResult {
  title: string;
  snippet: string;
}

export function Artists({ onNavigate: _onNavigate }: { onNavigate?: (page: string) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]); 
  const [currentData, setCurrentData] = useState<WikiData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- WEEKLY SPOTLIGHT ---
  const spotlightArtists = [
    { name: "Taylor Swift", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800" },
    { name: "The Weeknd", img: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800" },
    { name: "Metallica", img: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&q=80&w=800" },
    { name: "Dua Lipa", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800" },
  ];

  // --- FALLBACK: FETCH MULTIPLE RESULTS ---
  const fetchSearchList = async (query: string) => {
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`);
      const data = await res.json();
      
      if (data.query && data.query.search && data.query.search.length > 0) {
        setSearchResults(data.query.search);
      } else {
        setError("No artists found. Please try a different name.");
      }
    } catch (err) {
      setError("Could not retrieve search results. Please try again.");
    }
  };

  // --- ENGINE: FETCH FULL WIKIPEDIA CONTENT ---
  const fetchWiki = async (query: string, addToHistory = true) => {
    if (!query) return;
    setLoading(true);
    setError('');
    setSearchResults([]); // Clear any previous dropdown lists
    
    try {
      const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      
      // If not an exact match, try to get a list of options
      if (!summaryRes.ok) {
        await fetchSearchList(query);
        setLoading(false);
        return;
      }
      
      const summaryData = await summaryRes.json();

      // If Wikipedia throws a disambiguation warning, get a list of options
      if (summaryData.type === 'disambiguation') {
        await fetchSearchList(query);
        setLoading(false);
        return;
      }

      const contentRes = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(summaryData.title)}&format=json&prop=text&origin=*&mobileformat=1`);
      const contentData = await contentRes.json();
      
      if (!contentData.parse || !contentData.parse.text) {
        throw new Error("Could not load full article.");
      }

      const fullHtml = contentData.parse.text['*'];

      setCurrentData({
        title: summaryData.title,
        extract: fullHtml,
        thumbnail: summaryData.thumbnail
      });

      if (addToHistory) {
        setHistory(prev => [...prev, query]);
      }
    } catch (err) {
      setError("Could not retrieve data. Try a specific name.");
    } finally {
      setLoading(false);
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = contentRef.current;
    if (!div) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        const title = anchor.getAttribute('title');
        
        if (href && href.startsWith('/wiki/')) {
           const nextQuery = title || href.split('/').pop()?.replace(/_/g, ' ');
           if (nextQuery) {
             setSearchQuery(nextQuery);
             fetchWiki(nextQuery);
           }
        }
      }
    };

    div.addEventListener('click', handleClick);
    return () => div.removeEventListener('click', handleClick);
  }, [currentData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHistory([]);
    setCurrentData(null);
    fetchWiki(searchQuery);
  };

  const handleBack = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop();
    const previous = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setSearchQuery(previous);
    fetchWiki(previous, false);
  };

  const closeBox = () => {
    setCurrentData(null);
    setHistory([]);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-12 px-6 w-full font-sans relative overflow-x-hidden">
      
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* STANDARDIZED USPTO DUAL BRANDED HERO HEADER */}
        <div className="text-center mb-12 flex flex-col items-center">
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 drop-shadow-2xl">
             {/* MUSICweb Component */}
             <div className="flex items-center select-none leading-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIC</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-[1.8rem] font-bold text-zinc-400 relative -ml-1 top-[-15px] md:top-[-22px]">®</sup>
             </div>
             
             {/* Unified Divider Bar */}
             <span className="hidden md:block text-zinc-700 text-6xl font-light pb-4">|</span>
             
             {/* MUSIKweb Component */}
             <div className="flex items-center select-none leading-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIK</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-[1.8rem] font-bold text-zinc-400 relative -ml-1 top-[-15px] md:top-[-22px]">®</sup>
             </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex justify-center items-center gap-3 leading-none drop-shadow-2xl">
            <span className="italic text-zinc-400">ARTIST</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">explorer</span>
          </h1>
          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.4em] mt-4">
            Powered by Wikipedia Intelligence
          </p>
        </div>

        {/* --- SPOTLIGHT (Preserved Original Feature) --- */}
        {!currentData && searchResults.length === 0 && (
          <div className="mb-20">
            <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-8 border-l-4 border-blue-500 pl-4">
              Trending This Week
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {spotlightArtists.map((artist) => (
                <button 
                  key={artist.name}
                  onClick={() => {
                    setSearchQuery(artist.name);
                    fetchWiki(artist.name);
                  }}
                  className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all hover:-translate-y-2 shadow-2xl"
                >
                  <img src={artist.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={artist.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-4 left-4 text-left">
                    <p className="text-white font-black text-xl italic tracking-tighter">{artist.name}</p>
                    <p className="text-blue-400 text-[9px] font-bold uppercase tracking-widest mt-1">Read Bio</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- SEARCH (Preserved Original Logic) --- */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-500 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Search Global Database (e.g. 'Pink Floyd')..." 
              className="w-full bg-zinc-900/80 border-2 border-white/30 p-6 pl-16 rounded-[2rem] text-lg text-white outline-none focus:border-blue-500 transition-all font-black placeholder-zinc-400 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all">
              <ArrowRight size={20} />
            </button>
          </form>
        </div>

        {/* --- MULTIPLE RESULTS DROPDOWN LIST --- */}
        {searchResults.length > 0 && !currentData && !loading && (
          <div className="max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-4 border-l-4 border-orange-500 pl-4">
              Multiple Results Found. Did you mean:
            </h3>
            <div className="flex flex-col gap-3">
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(result.title);
                    fetchWiki(result.title);
                  }}
                  className="text-left bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 hover:border-blue-500/50 p-5 rounded-2xl transition-all group flex items-center justify-between shadow-lg"
                >
                  <div className="pr-4">
                    <p className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{result.title}</p>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: result.snippet + '...' }}></p>
                  </div>
                  <ArrowRight size={20} className="text-zinc-600 group-hover:text-blue-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- LOADING & ERROR STATES --- */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-blue-500" size={48} />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-10 bg-red-500/10 border border-red-500/20 rounded-3xl max-w-2xl mx-auto">
            <p className="text-red-400 font-bold uppercase tracking-widest text-xs">{error}</p>
          </div>
        )}

        {/* --- FULL ARTICLE VIEWER --- */}
        {currentData && !loading && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-500 pb-20">
            <div className="bg-zinc-900/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="relative h-64 md:h-80 w-full">
                {currentData.thumbnail ? (
                  <img src={currentData.thumbnail.source} className="w-full h-full object-cover opacity-60" alt={currentData.title} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center">
                     <Music size={64} className="text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                   {history.length > 1 && (
                     <button onClick={handleBack} className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 border border-white/10">
                       <ArrowLeft size={14} /> Back
                     </button>
                   )}
                   <button onClick={closeBox} className="ml-auto bg-black/50 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-600 transition-all border border-white/10">
                     <X size={20} />
                   </button>
                </div>
                <div className="absolute bottom-8 left-8 md:left-12">
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white drop-shadow-lg mb-2">
                    {currentData.title}
                  </h2>
                  <div className="flex gap-3">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      Full Article
                    </span>
                    <a 
                      href={`https://en.wikipedia.org/wiki/${currentData.title.replace(/ /g, '_')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white/10 text-zinc-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-1"
                    >
                      Source <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 overflow-x-hidden">
                <style>{`
                  .wiki-content table { background: transparent !important; color: white !important; border-color: #333 !important; width: 100% !important; display: block; overflow-x: auto; }
                  .wiki-content th { background: #111 !important; color: #aaa !important; border: 1px solid #333 !important; }
                  .wiki-content td { border: 1px solid #333 !important; }
                  .wiki-content a { color: #60a5fa !important; text-decoration: none; }
                  .wiki-content a:hover { text-decoration: underline; }
                  .mw-editsection, .reflist, .navbox, .hatnote { display: none !important; }
                  .infobox { background: #111 !important; border: 1px solid #333 !important; color: white !important; float: right; margin-left: 20px; margin-bottom: 20px; max-width: 300px; }
                `}</style>
                <div ref={contentRef} className="wiki-content prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300" dangerouslySetInnerHTML={{ __html: currentData.extract }} />
              </div>
              <div className="bg-black/50 p-6 text-center border-t border-white/5">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Content sourced via Wikipedia API. Data cleared upon close.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
