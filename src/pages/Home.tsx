import React from 'react';
import { ShoppingBag, Music, Globe, Zap, CheckCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* HERO SECTION - Reduced padding from pt-16 to pt-4 to pull content up by exactly ~0.5 inch (48px) */}
      <section className="relative w-full flex flex-col items-center justify-center pt-4 pb-0 px-6 border-b border-transparent">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Concert Crowd"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* LOGO: Reduced size by ~25% (down to 5.5rem on desktop, 5xl on mobile) */}
          <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter mb-6 leading-none drop-shadow-2xl">
            <span className="italic">MUSIC</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">web</span>
            <sup className="text-2xl md:text-[2rem] ml-1">&reg;</sup>
          </h1>
          <p className="text-lg md:text-xl font-black uppercase tracking-[0.5em] text-zinc-400 mb-10">
            The Universal Hub for Sound & Gear
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 flex items-center gap-3 shadow-2xl"
            >
              <ShoppingBag size={20} /> Shop Marketplace
            </button>
            <button 
              className="bg-zinc-900 border border-zinc-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:border-purple-500 hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-2xl"
            >
              <Music size={20} /> Stream Digital
            </button>
          </div>
        </div>
      </section>

      {/* THE MUSICweb® SEO ADVANTAGE - Reduced margin from mt-10 to mt-2 to pull the lower section up as well */}
      <section className="px-6 relative z-10 mt-2 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative border border-zinc-800 bg-black rounded-[3rem] p-12 md:p-20 overflow-hidden shadow-2xl">
            
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600"></div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black leading-tight text-white">
                  THE <span className="italic">MUSIC</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">web</span>
                  <sup className="text-2xl">&reg;</sup> <br/> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">ADVANTAGE</span>
                </h2>
                
                <div className="space-y-6 text-zinc-400 font-medium text-lg leading-relaxed">
                  <p>
                    In a digital landscape crowded with noise, your domain is your destiny. Search engines prioritize the word <span className="text-white font-bold">MUSIC</span>, and 
                    <span className="ml-1 italic font-black text-white">MUSIC</span>
                    <span className="italic font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">web&reg;</span> is the exact match they’re looking for.
                  </p>
                  <p>
                    By sharing your sounds and listing your gear here, you aren't just uploading data—you’re plugging into a high-authority hub designed to drive millions of visitors directly to your door.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Globe size={14} className="text-orange-500" /> SEO Optimized
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-purple-500" /> Instant Indexing
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-[2.5rem] relative">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 border-b border-zinc-800 pb-4">
                  Why Search Engines Love Us
                </h3>
                <ul className="space-y-6">
                  {[
                    { text: "\"MUSIC\" is the #1 most-searched keyword in global entertainment.", color: "text-orange-500" },
                    { text: "Clean, fast architecture that Google rewards with top-tier rankings.", color: "text-pink-500" },
                    { text: "Smart-Link aggregation turns your posts into viral entry points.", color: "text-purple-500" }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start group">
                      <CheckCircle className={`${item.color} shrink-0 group-hover:scale-110 transition-transform`} size={24} />
                      <p className="text-sm font-bold leading-snug text-zinc-300 group-hover:text-white transition-colors">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 border-t border-zinc-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Monthly Visitors", value: "1.2M+", color: "text-white" },
            { label: "Inventory Items", value: "450K+", color: "text-orange-500" },
            { label: "Artist Drops", value: "85K+", color: "text-pink-500" },
            { label: "Music Focused", value: "100%", color: "text-purple-500" },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className={`text-4xl md:text-5xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
