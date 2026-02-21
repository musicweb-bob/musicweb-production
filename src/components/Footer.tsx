import { Music } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0c14] border-t border-zinc-800 py-16 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* --- BRAND & HERITAGE --- */}
        <div className="md:col-span-5 space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1 select-none">
            <span className="text-3xl font-black italic text-white">MUSIC</span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">web</span>
            <sup className="text-sm font-bold text-zinc-400 relative top-[-8px]">&reg;</sup>
          </div>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
            A legacy of music distribution originating as Campus Records in 1982, evolving into the MUSICweb&reg; global network in 1995.
          </p>
        </div>

        {/* --- PLATFORM LINKS --- */}
        <div className="md:col-span-3 text-center md:text-left">
          <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Platform</h4>
          <ul className="space-y-4">
            <li><a href="/marketplace" className="text-zinc-500 hover:text-orange-500 text-[11px] font-bold uppercase tracking-widest transition-colors">Marketplace</a></li>
            <li><a href="/streaming" className="text-zinc-500 hover:text-pink-500 text-[11px] font-bold uppercase tracking-widest transition-colors">Streaming</a></li>
            <li><a href="/news" className="text-zinc-500 hover:text-purple-500 text-[11px] font-bold uppercase tracking-widest transition-colors">Music News</a></li>
            <li><a href="/artists" className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Artists</a></li>
          </ul>
        </div>

        {/* --- CORPORATE LINKS --- */}
        <div className="md:col-span-4 text-center md:text-left">
          <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Corporate</h4>
          <ul className="space-y-4">
            <li><a href="/about" className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">About Us</a></li>
            <li><a href="/investors" className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Investor Relations</a></li>
            <li><a href="#" className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-zinc-500 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">Terms of Service</a></li>
          </ul>
        </div>

      </div>

      {/* --- COPYRIGHT BAR --- */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            &copy; {currentYear} MUSICweb&reg;. All rights reserved.
          </p>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            MUSICweb&reg; and MUSIKweb&reg; are federally registered trademarks.
          </p>
        </div>
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          musicweb.com &amp; musikweb.com globally registered 1995.
        </p>
      </div>
    </footer>
  );
}
