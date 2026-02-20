import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Added this to listen for route changes
import { 
  ExternalLink, 
  CheckCircle, 
  Settings, 
  Upload, 
  Loader2, 
  Plus, 
  X
} from 'lucide-react';
import Papa from 'papaparse';

interface MarketplaceItem {
  id: number;
  title: string;
  artist: string;
  price: string;
  category: string;
  image_url: string;
  image?: string;
  url?: string;
  link?: string;
  upc?: string;
}

interface MarketplaceProps {
  onNavigate: (page: string) => void;
  initialFilter?: string | null;
}

export function Marketplace({ onNavigate, initialFilter }: MarketplaceProps) {
  const location = useLocation(); // Hook to detect live URL changes from the dropdown
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  
  // --- UNIVERSAL SUBMISSION STATE ---
  const [submitEmail, setSubmitEmail] = useState('');
  const [multiLinks, setMultiLinks] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<'smart' | 'csv'>('smart');

  // --- 1. FILTER LISTENER (ROUTING ENGINE - RESTORED & LIVE) ---
  useEffect(() => {
    // We check BOTH the incoming prop AND the actual live URL path
    const path = location.pathname;
    
    if (initialFilter === 'marketplace-vinyl' || path.includes('marketplace-vinyl')) {
      setActiveFilter('media-section');
    } else if (initialFilter === 'marketplace-gear' || path.includes('marketplace-gear')) {
      setActiveFilter('instruments-gear');
    } else if (initialFilter === 'marketplace-memorabilia' || path.includes('marketplace-memorabilia')) {
      setActiveFilter('memorabilia-section');
    } else if (initialFilter === 'marketplace-books' || path.includes('marketplace-books')) {
      setActiveFilter('books-section');
    } else {
      // Fallback to URL hash or Show All
      const hash = window.location.hash.replace('#', '');
      setActiveFilter(hash || null);
    }
  }, [initialFilter, location.pathname]); // This triggers the SECOND the dropdown is clicked

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch(`/api/listings?t=${Date.now()}`);
      if (!res.ok) throw new Error("Local fallback");
      const data = await res.json();
      let rawItems = Array.isArray(data) ? data : data.items || [];
      
      const sorted = rawItems.sort((a: MarketplaceItem, b: MarketplaceItem) => 
        (a.title || "").localeCompare(b.title || "")
      );
      setItems(sorted);
    } catch (err) {
      // FALLBACK TO YOUR CORE INVENTORY
      setItems([
        {
          id: 30,
          title: 'THE PHILISTINES JR. - "GREENWICH, CT" - TARQUIN TQ-1 - VINYL RECORD',
          artist: 'The Philistines Jr.',
          price: "$29.95",
          category: 'marketplace-vinyl',
          image_url: "https://i.ebayimg.com/images/g/s-kAAOSw~ZJmX~ZJ/s-l1600.jpg",
          link: "https://ebay.com"
        },
        {
          id: 48,
          title: "VINTAGE EKO ELECTRA 12-STRING ACOUSTIC-ELECTRIC GUITAR",
          artist: "Eko Electra",
          price: "$683.37",
          category: "marketplace-gear",
          image_url: "https://images.reverb.com/image/upload/s--W1V6n--/v1614613535/photo.jpg",
          link: "https://reverb.com"
        }
      ]);
    }
  }

  // --- 3. PROCESSING ENGINE (THE BRAIN) ---
  async function processLinks(links: string[]) {
    if (!submitEmail) {
      setSubmitStatus('Error: Seller email is required for listing.');
      return;
    }
    
    setIsSubmitting(true);
    const collectedTitles: string[] = []; 

    for (let i = 0; i < links.length; i++) {
      const currentLink = links[i].trim();
      if (!currentLink) continue;
      
      setSubmitStatus(`Scouting ${i + 1} of ${links.length}...`);
      
      try {
        const res = await fetch('/api/submit_listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: currentLink,
            email: submitEmail,
            isBulk: links.length > 1,
            currentCount: i + 1,
            totalCount: links.length,
            bulkTitles: collectedTitles 
          })
        });
        
        const data = await res.json();
        collectedTitles.push(data.scoutedTitle || "Item Successfully Added");
      } catch (err) {
        collectedTitles.push("Failed to scout link");
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
    
    setIsSubmitting(false);
    setSubmitStatus(`Successfully added ${links.length} items to inventory.`);
    setMultiLinks('');
    
    if (isMobileModalOpen) {
       setTimeout(() => setIsMobileModalOpen(false), 2000); 
    }
    fetchItems();
  }

  const handleSmartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const links = multiLinks.split('\n').filter(l => l.trim().startsWith('http'));
    if (links.length === 0) { 
      setSubmitStatus('Error: No valid URLs found.'); 
      return; 
    }
    processLinks(links);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        const links = rows.map(row => 
          row.Link || row.link || row.URL || row.url
        ).filter(l => l);
        processLinks(links);
      }
    });
  };

  // --- 4. RENDER HELPERS ---
  const renderSubmitForm = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-white mb-1 uppercase italic tracking-tighter">Add Inventory</h2>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest italic">Instant Smart-Link Aggregation</p>
      </div>

      {submitStatus && (
        <div className={`mb-4 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center border ${
          submitStatus.includes('Error') 
            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        }`}>
          {isSubmitting ? <Loader2 size={14} className="mr-2 animate-spin"/> : <CheckCircle size={14} className="mr-2"/>}
          {submitStatus}
        </div>
      )}

      <input 
        type="email" 
        placeholder="Enter Registered Seller Email..." 
        className="w-full bg-zinc-950 border-2 border-white/10 rounded-2xl p-4 text-center text-white text-[10px] font-black uppercase tracking-widest outline-none focus:border-purple-600 transition-all placeholder-zinc-700"
        value={submitEmail}
        onChange={(e) => setSubmitEmail(e.target.value)}
      />

      <div className="flex justify-center space-x-2 mb-2 p-1 bg-black rounded-full border border-white/5">
        <button 
          onClick={() => setUploadMode('smart')} 
          className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex-1 transition-all ${
            uploadMode === 'smart' ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'
          }`}
        >
          Smart Link
        </button>
        <button 
          onClick={() => setUploadMode('csv')} 
          className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex-1 transition-all ${
            uploadMode === 'csv' ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'
          }`}
        >
          CSV Upload
        </button>
      </div>

      {uploadMode === 'smart' ? (
        <form onSubmit={handleSmartSubmit} className="space-y-4">
          <textarea 
            rows={6} 
            placeholder="Paste multiple URLs (one per line)..." 
            className="w-full bg-zinc-950 border-2 border-white/10 rounded-[2rem] p-6 text-white text-xs resize-none outline-none font-mono placeholder-zinc-800 focus:border-purple-600 transition-all shadow-inner"
            value={multiLinks} 
            onChange={(e) => setMultiLinks(e.target.value)} 
          />
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all tracking-[0.2em]"
          >
            {isSubmitting ? 'Aggregating Data...' : 'Process Listings'}
          </button>
        </form>
      ) : (
        <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-12 text-center bg-zinc-950/50 hover:border-purple-600/50 transition-all relative group cursor-pointer shadow-inner">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload className="mx-auto mb-4 text-zinc-700 group-hover:text-purple-500 transition-transform group-hover:-translate-y-1" size={32} />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Select CSV Spreadsheet</p>
        </div>
      )}
    </div>
  );

  const getItemsByCategory = (cat: string) => {
    return items.filter(item => {
      if (!item.link || item.link === "" || (item.title && item.title.includes("Waiting for data"))) return false;
      const category = (item.category || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      
      const isMedia = title.includes('vinyl') || title.includes('record') || title.includes(' lp') || category.includes('vinyl') || category.includes('cd');
      const isGear = title.includes('guitar') || title.includes('string') || title.includes('electric') || title.includes('acoustic') || category.includes('equipment') || category.includes('instrument');

      if (cat === 'Vinyl & Media') return isMedia && !isGear;
      if (cat === 'Instruments & Gear') return isGear && !isMedia;
      if (cat === 'Memorabilia') return category.includes('memorabilia') || title.includes('poster');
      if (cat === 'Books') return category.includes('books') || title.includes('book');
      return false;
    });
  };

  const sections = [
    { title: 'Vinyl, CDs & Cassettes', key: 'Vinyl & Media', id: 'media-section' },
    { title: 'Instruments & Studio Gear', key: 'Instruments & Gear', id: 'instruments-gear' },
    { title: 'Memorabilia & Merch', key: 'Memorabilia', id: 'memorabilia-section' },
    { title: 'Books & Publications', key: 'Books', id: 'books-section' },
  ];

  // --- 5. MAIN RENDER ---
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-8 relative w-full selection:bg-purple-500/30">
      {/* --- HEADER ACTIONS --- */}
      <div className="absolute top-28 right-8 z-50 flex gap-3">
        {activeFilter && (
          <button 
            onClick={() => { onNavigate('marketplace'); setActiveFilter(null); }} 
            className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-orange-500 hover:text-white transition-all transform hover:-translate-y-0.5"
          >
            Show All Items
          </button>
        )}
      </div>

      {/* --- HERO LOGO --- */}
      <div className="w-full text-center mb-16 select-none">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter flex justify-center items-start leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <span className="text-white italic">MUSIC</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">web</span>
          <sup className="text-3xl mt-4 text-white/40 ml-1 relative top-2">&reg;</sup>
        </h1>
        <div className="w-24 h-1.5 bg-gradient-to-r from-orange-600 to-purple-600 mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"></div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-16 items-start max-w-[1800px] mx-auto">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <div className="hidden lg:block w-[340px] flex-shrink-0 sticky top-32">
          <div className="bg-zinc-950/80 rounded-[3rem] p-1 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <div className="bg-black/40 rounded-[2.8rem] p-8 border border-white/5 shadow-inner">
              {renderSubmitForm()}
            </div>
          </div>
        </div>

        {/* --- INVENTORY GRID AREA --- */}
        <div className="flex-1 w-full space-y-24">
          {sections.map((section) => {
            if (activeFilter && activeFilter !== section.id) return null;
            
            const sectionItems = getItemsByCategory(section.key);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section.key} id={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-6">
                  <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">{section.title}</h2>
                  <div className="flex flex-col items-end">
                    <span className="text-zinc-600 font-black text-[9px] uppercase tracking-[0.3em] mb-1">Authenticated Stock</span>
                    <span className="text-white font-black text-[12px] bg-zinc-900 px-4 py-1.5 rounded-full border border-white/5 shadow-lg tabular-nums">
                      {sectionItems.length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                  {sectionItems.map((item) => {
                    const validImage = item.image_url || item.image || item.url || '/placeholder.png';

                    return (
                      <div key={item.id} className="group bg-zinc-900/30 rounded-[2rem] overflow-hidden border border-white/5 transition-all hover:-translate-y-2 hover:bg-zinc-900/60 hover:border-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                        <div className="aspect-square bg-black relative overflow-hidden">
                          <img 
                            src={validImage} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 ease-out" 
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop";
                            }}
                          />
                          {item.price && (
                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl text-white px-3 py-1.5 rounded-xl font-black border border-white/10 text-[10px] uppercase tracking-wider shadow-2xl">
                              {item.price}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                        </div>
                        
                        <div className="p-6 text-center">
                          <div className="mb-5 h-12 flex flex-col justify-center">
                            <h3 className="text-[11px] font-black text-white leading-tight line-clamp-2 mb-1 group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                              {item.title}
                            </h3>
                            <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest italic truncate">
                              {item.artist}
                            </p>
                          </div>
                          <div className="pt-5 border-t border-white/5">
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-full bg-white text-black font-black py-3.5 rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg"
                            >
                              View Item <ExternalLink size={12} className="ml-2"/>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- MOBILE INTERFACE --- */}
      <button 
        onClick={() => setIsMobileModalOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 z-50 bg-gradient-to-br from-orange-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(168,85,247,0.5)] hover:scale-110 active:scale-95 transition-all"
      >
        <Plus size={32} />
      </button>

      {isMobileModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-950 w-full max-w-lg rounded-[3rem] border border-white/10 p-10 relative shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <button 
              onClick={() => setIsMobileModalOpen(false)} 
              className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-white/5 rounded-full p-3 transition-colors"
            >
              <X size={24} />
            </button>
            {renderSubmitForm()}
          </div>
        </div>
      )}
    </div>
  );
}
