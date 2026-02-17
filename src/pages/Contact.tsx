import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Server, User, Key, Eye, EyeOff, X } from 'lucide-react';

export function Contact() {
  // --- 1. FORM STATE ---
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // --- 2. ADMIN LOGIN STATE ---
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // --- 3. STATS STATE ---
  const [stats, setStats] = useState({ total: 0, owner: 0 });

  useEffect(() => {
    const isAuth = localStorage.getItem('mw_admin_auth') === 'true';
    if (isAuth) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setStats({
        total: parseInt(localStorage.getItem('mw_stats_total') || '0'),
        owner: parseInt(localStorage.getItem('mw_stats_owner') || '0')
      });
    }
  }, [isAuthenticated]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('mw_admin_auth', 'true');
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mw_admin_auth');
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900 to-black pointer-events-none"></div>
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        {!isAuthenticated && !isAdminOpen && (
          <div className="text-center mb-16 flex flex-col items-center border-b border-white/5 pb-10">
             <div className="flex items-center gap-1 mb-4 scale-90 md:scale-100">
                <span className="text-5xl md:text-6xl font-black italic text-white tracking-tighter">MUSIC</span>
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
                <sup className="text-xs md:text-sm font-bold text-zinc-400 relative top-[-15px]">&reg;</sup>
              </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-zinc-500 uppercase">CONTACT US</h1>
          </div>
        )}

        {/* --- MAIN SPLIT LAYOUT --- */}
        {!isAuthenticated && !isAdminOpen ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            {/* LEFT BOX: INQUIRIES */}
            <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-12 flex flex-col justify-center h-full relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] pointer-events-none"></div>
              
              <h2 className="text-3xl font-black italic text-white mb-12 tracking-tighter flex items-center gap-3">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                DIRECT LINES
              </h2>
              
              <div className="space-y-12 relative z-10">
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">General Support</p>
                  <a href="mailto:service@musicweb.com" className="text-2xl md:text-4xl font-black text-white hover:text-orange-500 transition-colors block tracking-tight">
                    service@musicweb.com
                  </a>
                </div>
                
                <div className="pt-10 border-t border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-3">Partnerships</p>
                  <a href="mailto:service@musicweb.com" className="text-2xl md:text-4xl font-black text-white hover:text-purple-500 transition-colors block tracking-tight">
                    partners@musicweb.com
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT BOX: CONTACT FORM */}
            <div className="bg-black border border-zinc-800 rounded-[3rem] p-10 md:p-12 shadow-2xl relative">
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                    <ShieldCheck size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2 italic tracking-tighter uppercase">Message Encrypted</h3>
                  <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-xs font-bold uppercase tracking-widest">Sent to Support Team</p>
                  <button onClick={() => setFormStatus('idle')} className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/20 hover:border-white transition-all pb-1">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Identity</label>
                      <input required type="text" placeholder="NAME" className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white text-xs font-bold placeholder-zinc-700 outline-none focus:border-orange-500/50 focus:bg-black transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Return Address</label>
                      <input required type="email" placeholder="EMAIL" className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white text-xs font-bold placeholder-zinc-700 outline-none focus:border-orange-500/50 focus:bg-black transition-all" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-1">Transmission</label>
                    <textarea required rows={4} placeholder="ENTER MESSAGE..." className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl p-4 text-white text-xs font-bold placeholder-zinc-700 outline-none focus:border-orange-500/50 focus:bg-black transition-all resize-none" />
                  </div>

                  <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-black italic text-xs py-5 rounded-2xl uppercase tracking-[0.2em] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg">
                    Send Secure Message
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : null}

        {/* --- ADMIN LOGIN MODAL --- */}
        {isAdminOpen && !isAuthenticated && (
          <div className="max-w-md mx-auto bg-[#0a0a0a] border border-zinc-800 p-10 rounded-[3rem] text-center animate-in fade-in zoom-in duration-300 shadow-2xl relative">
             <button onClick={() => { setIsAdminOpen(false); setLoginError(''); }} className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                <X size={20} />
              </button>

            <div className="mb-8">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <Lock size={24} className="text-zinc-400" />
              </div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter">AUTHORIZED ACCESS</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Staff Credentials Required</p>
            </div>

            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl mb-6">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={16} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 pl-12 text-xs text-white font-bold outline-none focus:border-zinc-600 transition-colors uppercase tracking-widest placeholder-zinc-700"
                  placeholder="Username"
                />
              </div>
              
              <div className="relative group">
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 pl-12 pr-12 text-xs text-white font-bold outline-none focus:border-zinc-600 transition-colors uppercase tracking-widest placeholder-zinc-700"
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-left pl-2 pb-2">
                *Hint: admin / password
              </div>

              <button type="submit" className="w-full bg-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-zinc-200 transition-colors shadow-lg text-xs">
                Authenticate
              </button>
            </form>
          </div>
        )}

        {/* --- AUTHENTICATED ADMIN DASHBOARD --- */}
        {isAuthenticated && (
          <div className="bg-[#0a0a0a] border border-zinc-800 p-8 md:p-12 rounded-[3rem] animate-in fade-in slide-in-from-bottom-8 duration-500 relative overflow-hidden shadow-2xl max-w-5xl mx-auto">
            
            <div className="absolute -top-20 -right-20 opacity-[0.03] pointer-events-none">
              <Server size={400} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8 relative z-10 gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                  <Server className="text-green-500" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white italic tracking-tighter">ADMIN CONSOLE</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Secure Connection Active</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleLogout} 
                className="bg-zinc-900 text-zinc-400 hover:bg-red-500/10 hover:text-red-500 border border-zinc-800 hover:border-red-500/30 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Terminate Session
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
              <div className="bg-black border border-zinc-800 p-8 rounded-[2rem] hover:border-zinc-700 transition-colors">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-4">Total Traffic (Raw Hits)</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-mono font-bold text-white">{stats.total.toLocaleString()}</p>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">Clicks</span>
                </div>
              </div>

              <div className="bg-black border border-blue-900/30 p-8 rounded-[2rem] hover:border-blue-800/50 transition-colors">
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-4">Internal Traffic (Your IP)</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-mono font-bold text-blue-500">{stats.owner.toLocaleString()}</p>
                  <span className="text-[10px] font-bold text-blue-900/60 uppercase">Excluded</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 p-10 rounded-[2.5rem] text-center relative z-10 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
              <p className="text-xs text-green-400 font-black uppercase tracking-[0.3em] mb-4">Net Visitor Count (Unique)</p>
              <p className="text-8xl font-black text-white drop-shadow-2xl tracking-tighter">
                {(stats.total - stats.owner).toLocaleString()}
              </p>
            </div>

            {!localStorage.getItem('mw_identity_owner') && (
              <div className="mt-8 relative z-10">
                <button 
                  onClick={() => { localStorage.setItem('mw_identity_owner', 'true'); window.location.reload(); }}
                  className="w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600/20 transition-all"
                >
                  Tag This Device as Owner (Exclude from Stats)
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- FOOTER LINK --- */}
        {!isAuthenticated && !isAdminOpen && (
          <div className="mt-24 text-center border-t border-white/5 pt-12">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] hover:text-white transition-colors px-6 py-3 rounded-full hover:bg-white/5"
            >
              Authorized Staff Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}