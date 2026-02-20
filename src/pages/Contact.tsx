import React, { useState, useEffect } from 'react';
import { Mail, Lock, Send, ShieldCheck, Server, User, Key, Eye, EyeOff, X } from 'lucide-react';

export function Contact() {
  // --- 1. FORM STATE ---
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
    if (isAuthenticated) {
      setStats({
        total: parseInt(localStorage.getItem('mw_stats_total') || '0'),
        owner: parseInt(localStorage.getItem('mw_stats_owner') || '0')
      });
    }
  }, [isAuthenticated]);

  // --- HANDLERS ---
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('sending');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('identity'),
      email: formData.get('email'),
      message: formData.get('transmission'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      console.error("Transmission error:", err);
      setFormStatus('error');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans pt-24 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-[#0a0c14] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h1 className="flex items-baseline justify-center leading-none">
            {/* CONTACT (Italicized) */}
            <span className="text-4xl md:text-6xl font-black italic tracking-tighter">CONTACT</span>
            
            {/* THE ARROWS (With spacing equivalent to 2 spaces on each side) */}
            <span className="text-4xl md:text-6xl font-black tracking-tighter text-gray-600 mx-5">{'>>'}</span>
            
            {/* MUSIC */}
            <span className="text-4xl md:text-6xl font-black tracking-tighter">MUSIC</span>
            
            {/* web */}
            <span className="text-2xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 ml-1">
              web
            </span>
            
            {/* Trademark */}
            <sup className="text-sm md:text-lg text-white opacity-60 -ml-0.5 relative -top-2 md:-top-4">®</sup>
          </h1>
        </div>

        {/* --- MAIN SPLIT LAYOUT --- */}
        {!isAuthenticated && !isAdminOpen && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
            
            {/* LEFT BOX: INQUIRIES */}
            <div className="bg-black border border-white/10 rounded-3xl p-10 flex flex-col justify-center h-full">
              <h2 className="text-3xl font-black italic text-pink-500 mb-10 tracking-tighter">INQUIRIES</h2>
              
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">General Inquiries</p>
                  <a href="mailto:service@musicweb.com" className="text-2xl text-white hover:text-pink-400 transition-colors font-medium">
                    service@musicweb.com
                  </a>
                </div>
                
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Investor Relations</p>
                  <a href="mailto:investors@musicweb.com" className="text-2xl text-white hover:text-pink-400 transition-colors font-medium">
                    investors@musicweb.com
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT BOX: CONTACT FORM */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10">
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                    <ShieldCheck size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Message Secured</h3>
                  <p className="text-gray-400 mb-8">Your inquiry has been encrypted and routed.</p>
                  <button onClick={() => setFormStatus('idle')} className="text-sm font-bold uppercase text-gray-500 hover:text-white underline">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-6">
                  {formStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-bold p-3 rounded mb-6 text-center">
                      Transmission Failed. Please try again.
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Name</label>
                      <input name="identity" required type="text" placeholder="John Doe" className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-pink-500 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email</label>
                      <input name="email" required type="email" placeholder="john@example.com" className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-pink-500 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Message</label>
                    <textarea name="transmission" required rows={4} placeholder="How can we help?" className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-pink-500 transition-colors" />
                  </div>

                  <button type="submit" disabled={formStatus === 'sending'} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-black italic text-lg py-5 rounded-xl uppercase tracking-wider shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50">
                    {formStatus === 'sending' ? 'ENCRYPTING...' : 'Send Secure Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* --- ADMIN LOGIN MODAL --- */}
        {isAdminOpen && !isAuthenticated && (
          <div className="max-w-md mx-auto bg-[#111] border border-white/10 p-10 rounded-3xl text-center animate-in fade-in zoom-in">
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

              <div className="text-[10px] text-gray-600 text-left pl-2 pb-2">
                *Hint: admin / password
              </div>

              <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">
                Authenticate
              </button>
            </form>
          </div>
        )}

        {/* --- AUTHENTICATED ADMIN DASHBOARD --- */}
        {isAuthenticated && (
          <div className="bg-[#111] border border-green-500/30 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Server size={200} />
            </div>

            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Server className="text-green-500" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-wide">ADMIN CONSOLE</h2>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Secure Connection Established</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAuthenticated(false)} 
                className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all"
              >
                Log Out
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
              <div className="bg-black border border-white/10 p-6 rounded-2xl">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Total Hits (All Traffic)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-mono font-bold text-white">{stats.total.toLocaleString()}</p>
                  <span className="text-xs text-gray-600">clicks</span>
                </div>
              </div>

              <div className="bg-black border border-blue-500/30 p-6 rounded-2xl">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-2">Internal (Your IP)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-mono font-bold text-blue-400">{stats.owner.toLocaleString()}</p>
                  <span className="text-xs text-blue-900/50">excluded</span>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/50 p-8 rounded-2xl text-center relative z-10">
              <p className="text-sm text-green-400 font-bold uppercase tracking-widest mb-2">Net Visitor Count (Real Buyers)</p>
              <p className="text-7xl font-black text-white drop-shadow-lg tracking-tight">
                {(stats.total - stats.owner).toLocaleString()}
              </p>
            </div>

            {!localStorage.getItem('mw_identity_owner') && (
              <div className="mt-8 relative z-10">
                <button 
                  onClick={() => { localStorage.setItem('mw_identity_owner', 'true'); window.location.reload(); }}
                  className="w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 py-4 rounded-xl font-bold uppercase text-xs hover:bg-blue-600/20 transition-all"
                >
                  Tag This Device as Owner
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- FOOTER LINK --- */}
        {!isAuthenticated && !isAdminOpen && (
          <div className="mt-16 text-center border-t border-white/5 pt-8">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-[10px] font-bold text-gray-700 uppercase tracking-widest hover:text-pink-500 transition-colors"
            >
              Authorized Staff Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
