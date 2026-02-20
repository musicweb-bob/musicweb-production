import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans pt-24 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-[#0a0c14] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h1 className="flex items-baseline justify-center leading-none">
            <span className="text-4xl md:text-6xl font-black tracking-tighter">CONTACT</span>
            <span className="text-4xl md:text-6xl font-black tracking-tighter text-gray-600 mx-5">{'>>'}</span>
            <span className="text-4xl md:text-6xl font-black italic tracking-tighter">MUSIC</span>
            <span className="text-2xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 ml-1">
              web
            </span>
            <sup className="text-sm md:text-lg text-white opacity-60 -ml-0.5 relative -top-2 md:-top-4">®</sup>
          </h1>
        </div>

        {/* --- MAIN SPLIT LAYOUT --- */}
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
                <a href="mailto:service@musicweb.com" className="text-2xl text-white hover:text-pink-400 transition-colors font-medium">
                  service@musicweb.com
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
      </div>
    </div>
  );
}
