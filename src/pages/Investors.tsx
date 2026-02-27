import React from 'react';
import { Shield, Globe, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface InvestorsProps {
  onNavigate: (page: string) => void;
}

export function Investors({ onNavigate }: InvestorsProps) {
  return (
    <div className="min-h-screen bg-[#1a1d2e] text-white font-sans pt-16 pb-20 px-6">
      
      {/* STANDARDIZED USPTO DUAL BRANDED HERO HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-10 flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 drop-shadow-2xl">
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
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        
        {/* "OPEN FOR ACQUISITION" BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Open for Acquisition
        </div>
        
        {/* MAIN TITLE - Resized to be less aggressive */}
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase">
          Intellectual <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Property</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          A rare opportunity to acquire the complete <strong className="text-white" style={{ fontStyle: 'italic' }}>MUSIC</strong><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 font-bold">web</span><sup className="text-xs text-gray-400">®</sup> and <strong className="text-white" style={{ fontStyle: 'italic' }}>MUSIK</strong><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 font-bold">web</span><sup className="text-xs text-gray-400">®</sup> brand ecosystem.
        </p>
      </div>

      {/* --- ASSET GRIDS --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* TRADEMARKS BOX - WITH 1996 FIRST USE & REAL SERIALS */}
        <div className="bg-[#111] p-10 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={120} />
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold uppercase tracking-tighter">Registered Trademarks</h2>
          </div>

          <div className="space-y-6 relative z-10">
            {/* MUSICWEB - SERIAL #75117439 */}
            <div className="bg-[#1a1d2e] p-6 rounded-xl border border-white/5">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Serial #75117439</div>
              <div className="text-3xl font-black mb-2 flex items-baseline">
                <span style={{ fontStyle: 'italic' }}>MUSIC</span>
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">web</span>
                <span>®</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white font-bold">Class 042:</strong> Computerized on-line retail services in the field of recorded music and music information. (Registered 1998, first use 1996)
              </p>
            </div>

            {/* MUSIKWEB - SERIAL #75135939 */}
            <div className="bg-[#1a1d2e] p-6 rounded-xl border border-white/5">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Serial #75135939</div>
              <div className="text-3xl font-black mb-2 flex items-baseline">
                <span style={{ fontStyle: 'italic' }}>MUSIK</span>
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">web</span>
                <span>®</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white font-bold">Class 042:</strong> Defensive registration covering alternative spelling variations for on-line retail services. (Registered 1998, first use 1996)
              </p>
            </div>
          </div>
        </div>

        {/* DOMAINS BOX */}
        <div className="bg-[#111] p-10 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={120} />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Globe className="text-blue-400" size={24} />
            <h2 className="text-2xl font-bold uppercase tracking-tighter">Domain Portfolio</h2>
          </div>

          <p className="text-gray-400 mb-8 font-medium">Own the entire namespace. Includes all major extensions.</p>

          <div className="grid grid-cols-2 gap-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-400" />
              <span className="font-bold text-lg">musicweb.com</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-blue-400" />
              <span className="font-bold text-lg">musikweb.com</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs font-mono ml-6 tracking-wide">.net</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs font-mono ml-6 tracking-wide">.net</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs font-mono ml-6 tracking-wide">.org</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs font-mono ml-6 tracking-wide">.org</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs font-mono ml-6 tracking-wide">.info</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-xs font-mono ml-6 tracking-wide">+ Social Handles</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER CTA --- */}
      <div className="max-w-4xl mx-auto bg-gradient-to-b from-blue-900/20 to-blue-900/5 border border-blue-500/30 rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Serious Inquiries Only</h2>
        
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
          This portfolio offers immediate brand authority across the <strong className="text-white">digital streaming, Web3, and physical retail markets</strong>. 
          All assets are held by a single owner and transferable immediately.
        </p>

        <button 
          onClick={() => onNavigate('contact')}
          className="bg-white text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-blue-900/20 transform hover:scale-105"
        >
          Contact Broker Desk
        </button>
      </div>

    </div>
  );
}
