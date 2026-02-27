import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // --- TRANSMISSION LOGIC (100% PRESERVED) ---
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

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans pt-16 pb-20 px-6 relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-[#0a0c14] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        
        {/* STANDARDIZED USPTO DUAL BRANDED HERO HEADER */}
        <div className="text-center mb-12 flex flex-col items-center">
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 drop-shadow-2xl">
             {/* MUSICweb Logo Component */}
             <div className="flex items-center select-none leading-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIC</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-[1.8rem] font-bold text-zinc-400 relative -ml-1 top-[-15px] md:top-[-22px]">®</sup>
             </div>
             
             {/* Unified Visual Divider */}
             <span className="hidden md:block text-zinc-700 text-6xl font-light pb-4">|</span>
             
             {/* MUSIKweb Logo Component */}
             <div className="flex items-center select-none leading-none">
               <span className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">MUSIK</span>
               <span className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
               <sup className="text-xl md:text-[1.8rem] font-bold text-zinc-400 relative -ml-1 top-[-15px] md:top-[-22px]">®</sup>
             </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic text-zinc-500 uppercase leading-none">
            CONTACT US
          </h1>
        </div>

        {/* --- MAIN SPLIT LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
          
          {/* LEFT BOX: INQUIRIES */}
          <div className="bg-black border border-white/10 rounded-3xl p-10 flex flex-col justify-center h-full shadow-2xl">
            <h2 className="text-3xl font-black italic text-pink-500 mb-10 tracking-tighter">INQUIRIES</h2>
            
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">General Inquiries</p>
                <a href="mailto:service@musicweb.com" className="text-2xl text-white hover:text-pink-400 transition-colors font-medium tabular-nums">
                  service@musicweb.com
                </a>
              </div>
              
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Investor Relations</p>
                <a href="mailto:service@musicweb.com" className="text-2xl text-white hover:text-pink-400 transition-colors font-medium tabular-nums">
                  service@musicweb.com
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT BOX: CONTACT FORM (SECURE TRANSMISSION) */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                  <ShieldCheck size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Message Secured</h3>
                <p className="text-gray-400 mb-8">Your inquiry has been encrypted and routed.</p>
                <button onClick={() => setFormStatus('idle')} className="text-sm font-bold uppercase text-gray-500 hover:text-white underline tracking-widest">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-6 animate-in fade-in duration-500">
                {formStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-black p-4 rounded-xl mb-6 text-center uppercase tracking-widest">
                    Transmission Failed. Please check connectivity.
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Name</label>
                    <input name="identity" required type="text" placeholder="John Doe" className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-pink-500 transition-all font-medium placeholder-zinc-700 shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email</label>
                    <input name="email" required type="email" placeholder="john@example.com" className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-pink-500 transition-all font-medium placeholder-zinc-700 shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Message</label>
                  <textarea name="transmission" required rows={4} placeholder="How can we help?" className="w-full bg-[#1a1d2e] border border-white/10 rounded-xl p-4 text-white outline-none focus:border-pink-500 transition-all font-medium placeholder-zinc-700 shadow-inner resize-none" />
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'sending'} 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-black italic text-lg py-5 rounded-xl uppercase tracking-widest shadow-lg shadow-purple-900/40 transition-all disabled:opacity-50"
                >
                  {formStatus === 'sending' ? 'ENCRYPTING...' : 'Send Secure Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
