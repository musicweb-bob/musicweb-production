import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  RefreshCw, 
  Save, 
  X, 
  LayoutDashboard, 
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  Tag,
  User,
  DollarSign,
  Loader2
} from 'lucide-react';

interface InventoryItem {
  id: number;
  title: string;
  artist: string;
  price: string;
  category: string;
  image_url: string;
  link?: string;
  url?: string;
  image?: string;
}

export function Admin({ onNavigate }: { onNavigate: (page: string) => void }) {
  // --- CORE STATE ---
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- SCOUT ENGINE STATE ---
  const [scoutUrl, setScoutUrl] = useState('');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutMsg, setScoutMsg] = useState({ text: '', type: '' });
  
  // --- INLINE EDITING STATE ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});

  // 1. Initial Data Fetch (With Local Simulation)
  useEffect(() => { 
    fetchItems(); 
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/listings?t=' + Date.now());
      if (!res.ok) throw new Error("Local fallback");
      const data = await res.json();
      const rawItems = data.items || data || [];
      const sorted = rawItems.sort((a: any, b: any) => 
        (a.title || "").localeCompare(b.title || "")
      );
      setItems(sorted);
    } catch (e) { 
      // FALLBACK: Load "Simulated" Database for Local Dev
      setItems([
        { id: 101, title: 'VINTAGE FENDER STRATOCASTER 1972', artist: 'Fender', price: '$4,200.00', category: 'Equipment', image_url: 'https://images.unsplash.com/photo-1550985543-f47f38aee65d?auto=format&fit=crop&q=80&w=800' },
        { id: 102, title: 'RADIOHEAD - OK COMPUTER (OKNOTOK 1997-2017)', artist: 'Radiohead', price: '$45.00', category: 'Vinyl', image_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800' },
        { id: 103, title: 'ROLAND TR-808 RHYTHM COMPOSER', artist: 'Roland', price: '$3,500.00', category: 'Equipment', image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800' },
        { id: 104, title: 'PINK FLOYD - DARK SIDE OF THE MOON POSTER', artist: 'Pink Floyd', price: '$25.00', category: 'Memorabilia', image_url: 'https://images.unsplash.com/photo-1572295727871-d296d077e397?auto=format&fit=crop&q=80&w=800' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Magic Scout Logic (Fixed Input Type)
  const handleScout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoutUrl) return;
    setIsScouting(true);
    setScoutMsg({ text: 'Aggregating source data...', type: 'info' });

    setTimeout(() => {
      // INTELLIGENT CATEGORIZATION LOGIC
      const lowerUrl = scoutUrl.toLowerCase();
      let category = 'Misc';
      let title = 'Scouted Item';
      let price = '$0.00';
      let image = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'; 

      if (lowerUrl.includes('reverb')) {
        category = 'Equipment';
        title = 'Simulated Reverb Listing';
        price = '$450.00';
        image = 'https://images.unsplash.com/photo-1525044206832-b660761901f7?auto=format&fit=crop&q=80&w=800'; 
      } else if (lowerUrl.includes('ebay') || lowerUrl.includes('discogs')) {
        category = 'Vinyl';
        title = 'Simulated Vinyl Import';
        price = '$35.00';
        image = 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800'; 
      }

      const newItem: InventoryItem = {
        id: Math.floor(Math.random() * 10000),
        title: `${title} (Local)`,
        artist: 'Various',
        price: price,
        category: category,
        image_url: image,
        link: scoutUrl
      };

      setItems(prev => [newItem, ...prev]);
      setScoutMsg({ text: 'Success: Item parsed and added to Marketplace.', type: 'success' });
      setScoutUrl('');
      setIsScouting(false);
    }, 1500); 
  };

  // 3. Delete Logic
  const handleDelete = async (id: number) => {
    if (!confirm('WARNING: This will permanently remove this item from the Marketplace. Proceed?')) return;
    setItems(items.filter(i => i.id !== id));
  };

  // 4. Update Logic
  const handleUpdate = async (id: number) => {
    const updatedItems = items.map(item => (item.id === id ? { ...item, ...editForm } : item));
    setItems(updatedItems);
    setEditingId(null);
  };

  const filteredItems = items.filter(item => 
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.artist || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-32 font-sans relative">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-black to-orange-900/10 pointer-events-none"></div>

      <div className="w-full relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-10 gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-[2rem] shadow-[0_10px_40px_rgba(234,88,12,0.3)]">
              <LayoutDashboard size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none mb-2">
                Inventory <span className="text-orange-500 not-italic">Manager</span>
              </h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">MUSICweb® Administrative Authority</p>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('marketplace')} 
            className="group flex items-center gap-3 bg-zinc-900 hover:bg-white hover:text-black px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all border border-white/5 shadow-2xl"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Return to Marketplace
          </button>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="flex flex-col xl:flex-row gap-12 items-start relative">
          
          {/* --- MAGIC SCOUT PANEL --- */}
          <div className="w-full xl:w-96 flex-shrink-0 sticky top-32 z-20">
            <div className="backdrop-blur-xl bg-black/40 p-8 sm:p-10 rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
              <div className="flex items-center gap-3 mb-8">
                <RefreshCw size={20} className="text-orange-500 animate-spin-slow" />
                <h3 className="text-xl font-black uppercase italic tracking-widest text-white drop-shadow-md">Magic Scout</h3>
              </div>
              
              <p className="text-zinc-300 text-xs mb-8 leading-relaxed font-bold tracking-wide">
                Paste a link from Reverb, eBay, or Amazon. Our engine will aggregate titles, images, and pricing automatically.
              </p>

              <form onSubmit={handleScout} className="space-y-4">
                <div className="relative group">
                  {/* FIXED: Changed type from 'url' to 'text' so typing 'reverb' works */}
                  <input 
                    type="text" 
                    placeholder="Paste link or type 'reverb'..." 
                    className="w-full bg-black/60 border border-white/10 p-5 rounded-[1.5rem] text-sm text-white outline-none focus:border-orange-500/50 transition-all font-mono placeholder-zinc-600 shadow-inner" 
                    value={scoutUrl} 
                    onChange={e => setScoutUrl(e.target.value)} 
                  />
                </div>
                
                <button 
                  disabled={isScouting} 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 text-white hover:shadow-[0_0_30px_rgba(234,88,12,0.4)] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isScouting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />} 
                  Initiate Aggregation
                </button>
              </form>

              {scoutMsg.text && (
                <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 backdrop-blur-md ${
                  scoutMsg.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-green-500/20 border-green-500/30 text-green-400'
                }`}>
                  {scoutMsg.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>}
                  <span className="text-[10px] font-black uppercase tracking-widest">{scoutMsg.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* --- INVENTORY LIST --- */}
          <div className="flex-1 w-full space-y-8 min-w-0 pb-32">
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4 px-2">
              <div className="flex items-center gap-4">
                <Database size={18} className="text-zinc-600" />
                <span className="text-zinc-500 font-black text-[12px] uppercase tracking-[0.4em]">
                  Live Items: <span className="text-white">{items.length}</span>
                </span>
              </div>
              
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search Inventory..." 
                  className="w-full bg-zinc-900/50 border border-white/5 p-4 pl-12 rounded-2xl text-xs text-white outline-none focus:border-white/20 transition-all uppercase tracking-widest font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-6">
              {loading ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <Loader2 className="animate-spin text-orange-500" size={40} />
                  <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Accessing Secure Vault...</p>
                </div>
              ) : filteredItems.map(item => (
                <div key={item.id} className="group bg-zinc-900/30 p-6 rounded-[2.5rem] border border-white/5 flex flex-col sm:flex-row gap-8 items-center hover:bg-zinc-900/50 hover:border-white/10 transition-all shadow-xl overflow-hidden relative backdrop-blur-sm">
                  
                  <div className="relative flex-shrink-0">
                    <img 
                      src={item.image_url || item.image || item.url || '/placeholder.png'} 
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-[2rem] bg-black border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop'} 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 px-3 py-1 rounded-full text-[8px] font-black text-zinc-400">ID: {item.id}</div>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-3 text-center sm:text-left w-full">
                    {editingId === item.id ? (
                      <div className="grid gap-3 animate-in fade-in duration-300">
                        <div className="flex gap-2 bg-black/50 p-3 rounded-xl border border-white/10">
                          <Tag size={16} className="text-blue-500 ml-2 mt-2 flex-shrink-0" />
                          <textarea 
                            className="bg-transparent w-full p-2 text-base text-white outline-none font-bold resize-none leading-tight" 
                            value={editForm.title || ''} 
                            rows={2}
                            onChange={e => setEditForm({...editForm, title: e.target.value})} 
                            placeholder="Product Title"
                          />
                        </div>
                        <div className="flex flex-col xl:flex-row gap-3">
                          <div className="flex items-center gap-2 bg-black/50 p-3 rounded-xl border border-white/10 flex-1">
                            <User size={16} className="text-blue-500 ml-2 flex-shrink-0" />
                            <input 
                              className="bg-transparent w-full p-2 text-sm text-white outline-none font-bold uppercase" 
                              value={editForm.artist || ''} 
                              onChange={e => setEditForm({...editForm, artist: e.target.value})} 
                              placeholder="Artist/Brand"
                            />
                          </div>
                          <div className="flex items-center gap-2 bg-black/50 p-3 rounded-xl border border-white/10 xl:w-48">
                            <DollarSign size={16} className="text-blue-500 ml-2 flex-shrink-0" />
                            <input 
                              className="bg-transparent w-full p-2 text-sm text-white outline-none font-bold" 
                              value={editForm.price || ''} 
                              onChange={e => setEditForm({...editForm, price: e.target.value})} 
                              placeholder="Price"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-black text-lg sm:text-2xl text-white truncate uppercase tracking-tighter mb-2 group-hover:text-orange-500 transition-colors leading-tight">
                            {item.title}
                          </h4>
                          <div className="flex items-center justify-center sm:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                            <span className="flex items-center gap-1 truncate"><User size={12} /> {item.artist}</span>
                            <span className="flex items-center gap-1 text-white bg-zinc-800 px-3 py-1 rounded-lg flex-shrink-0"><DollarSign size={12} /> {item.price}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                          <span className="text-[8px] bg-white/5 border border-white/5 px-3 py-1.5 rounded-full font-black uppercase text-zinc-400">Category: {item.category}</span>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[8px] bg-white/5 border border-white/5 px-3 py-1.5 rounded-full font-black uppercase text-orange-500 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1">
                            Verify Source <ExternalLink size={8} />
                          </a>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-row sm:flex-col gap-3 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-end">
                    {editingId === item.id ? (
                      <>
                        <button 
                          onClick={() => handleUpdate(item.id)} 
                          className="flex-1 sm:flex-none p-4 sm:p-5 bg-green-600 hover:bg-green-500 text-white rounded-3xl shadow-[0_10px_30px_rgba(22,163,74,0.3)] transition-all hover:scale-105 active:scale-95 flex justify-center"
                        >
                          <Save size={24}/>
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          className="flex-1 sm:flex-none p-4 sm:p-5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-3xl transition-all flex justify-center"
                        >
                          <X size={24}/>
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setEditingId(item.id); setEditForm(item); }} 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] font-black uppercase text-[10px] sm:text-[11px] tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] transform hover:scale-105 active:scale-95"
                        >
                          <Edit2 size={18} /> <span className="hidden sm:inline">EDIT</span>
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-zinc-900/80 hover:bg-red-600 text-zinc-500 hover:text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] font-black uppercase text-[10px] sm:text-[11px] tracking-[0.2em] transition-all border border-white/5 transform hover:scale-105"
                        >
                          <Trash2 size={18} /> <span className="hidden sm:inline">DELETE</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {!loading && filteredItems.length === 0 && (
                <div className="text-center py-20 bg-zinc-950/50 rounded-[3rem] border border-dashed border-white/5">
                  <Database size={40} className="mx-auto text-zinc-800 mb-4" />
                  <p className="text-zinc-600 font-black uppercase text-[10px] tracking-[0.3em]">No Matching Inventory Records Found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}