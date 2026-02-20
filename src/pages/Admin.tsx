import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  X, 
  LayoutDashboard, 
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  User,
  DollarSign,
  Loader2,
  Lock,
  Key,
  Eye,
  EyeOff,
  BarChart2,
  Headphones,
  Settings,
  LogOut,
  Server,
  Music
} from 'lucide-react';

interface InventoryItem {
  id: number;
  title: string;
  artist: string;
  price: string;
  category: string;
  image_url: string;
  link?: string;
}

export function Admin({ onNavigate }: { onNavigate: (page: string) => void }) {
  // --- 1. AUTH & SESSION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('mw_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- 2. NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<'stats' | 'marketplace' | 'streaming' | 'settings'>('stats');

  // --- 3. MARKETPLACE & SCOUT STATE ---
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoutUrl, setScoutUrl] = useState('');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutMsg, setScoutMsg] = useState({ text: '', type: '' });

  // --- 4. STREAMING STATE ---
  const [communityTracks, setCommunityTracks] = useState<any[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(false);

  // --- 5. STATS & SECURITY STATE ---
  const [stats, setStats] = useState({ total: 0 });
  const [newPassword, setNewPassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  // --- 6. DATA FETCHING EFFECTS ---
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'stats') fetchStats();
      if (activeTab === 'marketplace') fetchItems();
      if (activeTab === 'streaming') fetchCommunityTracks();
    }
  }, [isAuthenticated, activeTab]);

  // --- 7. CORE LOGIC HANDLERS ---

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats({ total: parseInt(data.total || '0') });
    } catch (e) {
      console.error("Live stats fetch failed");
    }
  };

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
        sessionStorage.setItem('mw_admin_auth', 'true');
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

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await fetch('/api/listings?t=' + Date.now());
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setItems([]); 
    } finally {
      setLoadingItems(false);
    }
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
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const fetchCommunityTracks = async () => {
    setLoadingStreams(true);
    try {
      const res = await fetch('/api/stream');
      const data = await res.json();
      if (data.streams) setCommunityTracks(data.streams);
    } catch (err) {
      console.error("Failed to fetch tracks");
    } finally {
      setLoadingStreams(false);
    }
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
    } catch (err) {
      console.error("Failed to delete track");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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
      }
    } catch (err) {
      setUpdateMsg('Error updating password');
    }
  };

  // --- 8. RENDER: LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0c14] flex flex-col items-center justify-center p-6 relative">
        <button onClick={() => onNavigate('home')} className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors z-20">
          <ArrowLeft size={16} /> Return to Site
        </button>

        <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 rounded-3xl text-center shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
          <Lock size={32} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-8">Command Center</h2>

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
            {loginError && <p className="text-red-500 text-xs font-bold mt-4 uppercase tracking-widest animate-pulse">{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  // --- 9. RENDER: MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#0a0c14] text-white pt-24 px-6 pb-20 font-sans relative">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-2">
          <div className="mb-8 pl-4">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Admin</h2>
            <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">Live Database Connected</p>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><BarChart2 size={16} /> Traffic & Stats</button>
            <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'marketplace' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Database size={16} /> Marketplace</button>
            <button onClick={() => setActiveTab('streaming')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'streaming' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Headphones size={16} /> Streaming</button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}><Settings size={16} /> Security</button>
          </nav>

          <div className="pt-8 mt-8 border-t border-white/10">
            <button onClick={() => { setIsAuthenticated(false); sessionStorage.removeItem('mw_admin_auth'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase text-red-500 hover:bg-red-500/10 transition-all"><LogOut size={16} /> Terminate Session</button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 bg-[#111] border border-white/10 rounded-[2.5rem] p-8 md:p-10 min-w-0">
          
          {/* TAB 1: STATS */}
          {activeTab === 'stats' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-8">
                <Server className="text-blue-500" size={24} />
                <h3 className="text-2xl font-black uppercase italic tracking-widest">Network Traffic</h3>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/50 p-10 rounded-3xl text-center shadow-2xl">
                <p className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-2">Total Global Hits (Database Record)</p>
                <p className="text-7xl font-black text-white tracking-tight">{stats.total.toLocaleString()}</p>
                <button 
                  onClick={() => { localStorage.setItem('mw_identity_owner', 'true'); window.location.reload(); }}
                  className="mt-10 text-[10px] text-zinc-500 hover:text-white uppercase font-bold tracking-[0.2em] border border-white/10 px-6 py-2 rounded-full transition-all"
                >
                  Exclude This Device from Traffic Stats
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="animate-in fade-in duration-500 flex flex-col xl:flex-row gap-10">
              <div className="w-full xl:w-80 flex-shrink-0">
                <div className="bg-black p-8 rounded-3xl border border-white/10 sticky top-32">
                  <h3 className="text-lg font-black uppercase italic tracking-widest mb-6">Magic Scout</h3>
                  <form onSubmit={handleScout} className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Paste item link..." 
                      required
                      className="w-full bg-[#1a1d2e] border border-white/10 p-4 rounded-xl text-xs text-white outline-none focus:border-orange-500 transition-all font-mono" 
                      value={scoutUrl} 
                      onChange={e => setScoutUrl(e.target.value)} 
                    />
                    <button disabled={isScouting} className="w-full bg-orange-600 hover:bg-orange-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all">
                      {isScouting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Force Aggregation
                    </button>
                  </form>
                  {scoutMsg.text && <p className="mt-4 text-[10px] font-bold uppercase text-center text-orange-500">{scoutMsg.text}</p>}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-4">
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
                ) : items.filter(i => (i.title||'').toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-black p-4 rounded-2xl border border-white/10 flex items-center gap-6 group hover:border-white/20 transition-all">
                    <img src={item.image_url || '/placeholder.png'} className="w-16 h-16 object-cover rounded-xl" alt="" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                      <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-tight">{item.artist} | {item.price}</div>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)} 
                      className="bg-red-900/40 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={18}/>
                    </button>
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
              ) : communityTracks.map((track) => (
                <div key={track.id} className="bg-black p-4 rounded-2xl border border-white/10 flex items-center gap-6 mb-4 hover:border-white/20 transition-all">
                  <div className="flex-1 truncate text-xs font-mono text-gray-500">{track.url}</div>
                  <div className="text-[10px] text-zinc-600 uppercase font-bold">{track.email}</div>
                  <button onClick={() => removeTrack(track.id)} className="bg-red-900/40 text-red-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Delete</button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (activeTab === 'settings' && (
            <div className="animate-in fade-in duration-500 max-w-lg">
              <h3 className="text-2xl font-black uppercase italic mb-8">Security</h3>
              <div className="bg-black border border-white/10 p-8 rounded-3xl shadow-2xl">
                <p className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-widest">Update Master Administrator Password</p>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <input 
                    type="password" 
                    required 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-purple-500 transition-all" 
                  />
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all">Save New Password</button>
                </form>
                {updateMsg && <p className="mt-4 text-green-500 text-center font-bold text-xs uppercase animate-bounce">{updateMsg}</p>}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
