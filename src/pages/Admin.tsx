import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, RefreshCw, Save, X, LayoutDashboard, ArrowLeft,
  Search, CheckCircle2, AlertCircle, Database, ExternalLink, Tag, User, 
  DollarSign, Loader2, Lock, Key, Eye, EyeOff, BarChart2, Headphones, Settings, LogOut, Server, Music
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
  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<'stats' | 'marketplace' | 'streaming' | 'settings'>('stats');

  // --- MARKETPLACE STATE ---
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoutUrl, setScoutUrl] = useState('');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutMsg, setScoutMsg] = useState({ text: '', type: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});

  // --- STREAMING STATE ---
  const [communityTracks, setCommunityTracks] = useState<any[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(false);

  // --- STATS STATE ---
  const [stats, setStats] = useState({ total: 0, owner: 0 });

  // --- SETTINGS STATE ---
  const [newPassword, setNewPassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  // 1. DATA FETCHING EFFETCS
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'stats') {
        setStats({
          total: parseInt(localStorage.getItem('mw_stats_total') || '0'),
          owner: parseInt(localStorage.getItem('mw_stats_owner') || '0')
        });
      }
      if (activeTab === 'marketplace') fetchItems();
      if (activeTab === 'streaming') fetchCommunityTracks();
    }
  }, [isAuthenticated, activeTab]);

  // --- AUTH LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setLoginError('Invalid Administrator Password');
      }
    } catch (err) {
      setLoginError('Database connection error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 5) {
      setUpdateMsg('Password must be at least 5 characters');
      return;
    }
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', newPassword })
      });
      if (res.ok) {
        setUpdateMsg('Password successfully updated!');
        setNewPassword('');
        setTimeout(() => setUpdateMsg(''), 3000);
      } else {
        setUpdateMsg('Error updating password');
      }
    } catch (err) {
      setUpdateMsg('Connection error');
    }
  };

  // --- MARKETPLACE LOGIC ---
  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await fetch('/api/listings?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) { console.error("Error fetching items"); } 
    finally { setLoadingItems(false); }
  };

  const handleScout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoutUrl) return;
    setIsScouting(true);
    setScoutMsg({ text: 'Aggregating source data...', type: 'info' });
    
    try {
      const res = await fetch('/api/submit_listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scoutUrl, email: 'admin@musicweb.com' }),
      });
      if (res.ok) {
        setScoutMsg({ text: 'Success: Item added to Marketplace.', type: 'success' });
        setScoutUrl('');
        fetchItems();
      } else {
        setScoutMsg({ text: 'Error tracking item.', type: 'error' });
      }
    } catch (err) {
      setScoutMsg({ text: 'Connection failed.', type: 'error' });
    } finally {
      setIsScouting(false);
      setTimeout(() => setScoutMsg({ text: '', type: '' }), 4000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('WARNING: Permanently delete this item?')) return;
    try {
      await fetch('/api/delete_listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchItems();
    } catch (err) { console.error("Delete failed"); }
  };

  const handleUpdate = async (id: number) => {
    // Basic local state update to remove from edit mode (full DB edit requires its own API)
    const updatedItems = items.map(item => (item.id === id ? { ...item, ...editForm } : item));
    setItems(updatedItems);
    setEditingId(null);
  };

  // --- STREAMING LOGIC ---
  const fetchCommunityTracks = async () => {
    setLoadingStreams(true);
    try {
      const res = await fetch('/api/stream');
      const data = await res.json();
      if (data.streams) setCommunityTracks(data.streams);
    } catch (err) { console.error("Failed to fetch tracks"); }
    finally { setLoadingStreams(false); }
  };

  const removeTrack = async (id: number) => {
    if (!confirm('Permanently delete this track?')) return;
    try {
      await fetch('/api/stream', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchCommunityTracks();
    } catch (err) { console.error("Failed to delete track"); }
  };

  const filteredItems = items.filter(item => 
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.artist || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ========================================================================
  // RENDER: SECURE LOGIN SCREEN
  // ========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0c14] flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-[#0a0c14] pointer-events-none"></div>
        <button onClick={() => onNavigate('home')} className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors z-20">
          <ArrowLeft size={16} /> Return to Site
        </button>

        <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 rounded-3xl text-center shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-red-500/10 p-4 rounded-full mb-4">
              <Lock size={32} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Command Center</h2>
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-2">Level 4 Restricted Access</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded-xl mb-6 text-center animate-pulse">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative text-left">
              <Key className="absolute left-4 top-4 text-gray-500" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 pl-12 pr-12 text-sm text-white outline-none focus:border-red-500 transition-colors"
                placeholder="Enter Master Password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={isLoggingIn} className="w-full bg-white hover:bg-red-600 hover:text-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2">
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ========================================================================
  // RENDER: AUTHENTICATED COMMAND CENTER
  // ========================================================================
  return (
    <div className="min-h-screen bg-[#0a0c14] text-white pt-24 px-6 pb-20 font-sans relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-[#0a0c14] to-orange-900/10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* --- SIDEBAR NAVIGATION --- */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <div className="mb-8 pl-4">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Admin</h2>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">Secure Session Active</p>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <BarChart2 size={16} /> Traffic & Stats
            </button>
            <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'marketplace' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Database size={16} /> Marketplace
            </button>
            <button onClick={() => setActiveTab('streaming')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'streaming' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Headphones size={16} /> Streaming
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Settings size={16} /> Security
            </button>
          </nav>

          <div className="pt-8 mt-8 border-t border-white/10">
            <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all">
              <LogOut size={16} /> Terminate Session
            </button>
          </div>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 bg-[#111] border border-white/10 rounded-[2.5rem] p-8 md:p-10 min-w-0">
          
          {/* TAB 1: STATS */}
          {activeTab === 'stats' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-8">
                <Server className="text-blue-500" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest">Network Traffic</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-black border border-white/10 p-8 rounded-3xl">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Total Hits (All Traffic)</p>
                  <p className="text-5xl font-mono font-bold text-white">{stats.total.toLocaleString()}</p>
                </div>
                <div className="bg-black border border-blue-500/30 p-8 rounded-3xl">
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Internal (Your IP excluded)</p>
                  <p className="text-5xl font-mono font-bold text-blue-400">{stats.owner.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-900/40 to-black border border-green-500/50 p-10 rounded-3xl text-center">
                <p className="text-sm text-green-400 font-bold uppercase tracking-widest mb-2">Net Visitor Count (Real Traffic)</p>
                <p className="text-7xl font-black text-white tracking-tight">{(stats.total - stats.owner).toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* TAB 2: MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="animate-in fade-in duration-500 flex flex-col xl:flex-row gap-10">
              <div className="w-full xl:w-80 flex-shrink-0">
                <div className="bg-black p-8 rounded-3xl border border-white/10 sticky top-32">
                  <div className="flex items-center gap-3 mb-6">
                    <RefreshCw size={20} className="text-orange-500" />
                    <h3 className="text-lg font-black uppercase italic tracking-widest">Magic Scout</h3>
                  </div>
                  <form onSubmit={handleScout} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Paste item link..." 
                      required
                      className="w-full bg-[#1a1d2e] border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-orange-500 transition-all font-mono" 
                      value={scoutUrl} 
                      onChange={e => setScoutUrl(e.target.value)} 
                    />
                    <button disabled={isScouting} className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                      {isScouting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Force Aggregation
                    </button>
                  </form>
                  {scoutMsg.text && (
                    <div className={`mt-4 p-3 rounded-lg border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${scoutMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
                      {scoutMsg.type === 'error' ? <AlertCircle size={14}/> : <CheckCircle2 size={14}/>} {scoutMsg.text}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-6">
                <div className="relative w-full mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Inventory..." 
                    className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl text-xs text-white outline-none focus:border-white/30 uppercase tracking-widest font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {loadingItems ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
                ) : filteredItems.map(item => (
                  <div key={item.id} className="bg-black p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-6 items-center">
                    <img src={item.image_url || item.image || item.url || '/placeholder.png'} className="w-20 h-20 object-cover rounded-xl" alt="Item" />
                    <div className="flex-1 w-full">
                      {editingId === item.id ? (
                        <div className="space-y-2">
                          <input className="w-full bg-[#1a1d2e] p-2 rounded text-sm text-white" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                          <div className="flex gap-2">
                            <input className="w-1/2 bg-[#1a1d2e] p-2 rounded text-xs text-white" value={editForm.artist || ''} onChange={e => setEditForm({...editForm, artist: e.target.value})} />
                            <input className="w-1/2 bg-[#1a1d2e] p-2 rounded text-xs text-white" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                          <div className="text-xs text-gray-400 font-mono mt-1">{item.artist} | {item.price}</div>
                        </>
                      )}
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      {editingId === item.id ? (
                        <>
                          <button onClick={() => handleUpdate(item.id)} className="flex-1 bg-green-600 p-3 rounded-xl flex justify-center"><Save size={16}/></button>
                          <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-800 p-3 rounded-xl flex justify-center"><X size={16}/></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(item.id); setEditForm(item); }} className="flex-1 bg-blue-600 hover:bg-blue-500 p-3 rounded-xl flex justify-center"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(item.id)} className="flex-1 bg-zinc-900 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 p-3 rounded-xl flex justify-center"><Trash2 size={16}/></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STREAMING */}
          {activeTab === 'streaming' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-8">
                <Music className="text-pink-500" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest">Community Tracks</h3>
              </div>

              {loadingStreams ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-pink-500" size={32} /></div>
              ) : communityTracks.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-xs font-bold uppercase tracking-widest">No tracks in database</div>
              ) : (
                <div className="grid gap-6">
                  {communityTracks.map((track) => (
                    <div key={track.id} className="bg-black p-4 rounded-2xl border border-white/10 flex flex-col xl:flex-row items-center gap-6">
                      <div className="flex-1 w-full break-all text-xs font-mono text-gray-400">{track.url}</div>
                      <div className="text-xs font-bold text-gray-600 bg-zinc-900 px-3 py-1 rounded-full">{track.email}</div>
                      <button onClick={() => removeTrack(track.id)} className="bg-red-900/40 hover:bg-red-600 text-red-500 hover:text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-500 max-w-lg">
              <div className="flex items-center gap-3 mb-8">
                <Lock className="text-purple-500" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest">Security Settings</h3>
              </div>

              <div className="bg-black border border-white/10 p-8 rounded-3xl">
                <h4 className="font-bold text-white mb-2">Update Master Password</h4>
                <p className="text-xs text-gray-500 mb-6">This password protects the entire Command Center. Do not lose it.</p>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <input 
                    type="password" 
                    required
                    placeholder="Enter new password..." 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-purple-500 transition-colors"
                  />
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-colors">
                    Save New Password
                  </button>
                </form>

                {updateMsg && (
                  <div className={`mt-4 p-4 rounded-xl text-xs font-bold text-center ${updateMsg.includes('Success') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {updateMsg}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
