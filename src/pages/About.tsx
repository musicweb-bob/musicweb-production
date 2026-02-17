export function About() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6 pb-20 relative overflow-hidden font-sans">
      
      {/* BRANDED BACKGROUND EFFECTS */}
      <div className="fixed inset-0 bg-gradient-to-b from-zinc-900 via-black to-black pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* HEADER: LOGO WITH FIXED TRADEMARK SPACING */}
        <div className="text-center mb-20 flex flex-col items-center border-b border-white/5 pb-12">
          <div className="flex items-center gap-1 mb-6 scale-110">
            <span className="text-6xl md:text-7xl font-black italic text-white tracking-tighter">MUSIC</span>
            <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 tracking-tighter">web</span>
            <sup className="text-lg font-bold text-zinc-500 relative top-[-20px]">&reg;</sup>
          </div>
          
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-zinc-900/50 border border-white/10 rounded-full backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <p className="text-zinc-400 text-[10px] font-black tracking-[0.3em] uppercase">Est. 1984 • Global HQ</p>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid gap-8">
          
          {/* HISTORY CARD */}
          <section className="group bg-zinc-900/30 p-10 md:p-14 rounded-[3rem] border border-white/5 hover:border-white/10 transition-all backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-9xl font-black italic text-white tracking-tighter">84</span>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-8 italic flex items-center gap-4">
              <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
              THE ORIGIN STORY
            </h2>
            
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed font-medium max-w-2xl">
              <p>
                With over <span className="text-white font-bold">40 years of authority</span>, MUSICweb® stands as one of the most enduring names in the industry. Our roots go back to the mid-1980s, beginning with the legacy of <span className="text-orange-500 font-bold">Campus Records</span> and evolving through the digital revolution to become a premier destination for enthusiasts.
              </p>
              <p>
                Originally established as a hub for physical media, the brand has transitioned from brick-and-mortar beginnings to a sophisticated digital technology stack, encompassing a premium domain portfolio including <span className="text-white font-mono text-base border-b border-white/20">musicweb.com</span> and <span className="text-white font-mono text-base border-b border-white/20">musikweb.com</span>.
              </p>
            </div>
          </section>

          {/* MISSION CARD */}
          <div className="grid md:grid-cols-5 gap-8">
            <section className="md:col-span-3 bg-gradient-to-br from-zinc-900/60 to-black p-10 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-50"></div>
              <h2 className="text-2xl font-black text-white mb-6 italic uppercase tracking-tight relative z-10">The Ecosystem</h2>
              <p className="text-zinc-400 leading-relaxed font-medium relative z-10">
                Today, MUSICweb® is more than just a site; it's a curated intelligence engine. We provide artist insights, real-time news aggregation, and a high-end gear marketplace, serving a global community of collectors and creators.
              </p>
            </section>

            <section className="md:col-span-2 bg-black p-10 md:p-12 rounded-[3rem] border border-zinc-800 flex flex-col justify-center items-center text-center">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Powered By</div>
              <div className="text-3xl font-black italic text-white tracking-tighter">
                REACT <span className="text-zinc-600">/</span> NEXT
              </div>
              <div className="mt-2 text-xs font-mono text-orange-500">v.3.0.0 (Stable)</div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}