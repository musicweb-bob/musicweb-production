import { Music } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0d0f1a] border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Music className="w-8 h-8 text-[#FF6B35] mr-3" strokeWidth={1.5} />
            <h3 className="text-2xl sm:text-3xl font-bold">
              <span className="text-white">MUSIC</span>
              <span className="text-[#FF6B35]">web</span>
              <span className="text-white text-lg align-super">®</span>
            </h3>
          </div>
          <p className="text-gray-400 text-base sm:text-lg mb-6">Connecting music lovers since 1995</p>

          <div className="space-y-2 text-sm sm:text-base text-gray-400 mb-6">
            <p><span className="text-white font-semibold">MUSICweb®</span> and <span className="text-white font-semibold">MUSIKweb®</span> are federally registered trademarks</p>
            <p>musicweb.com and musikweb.com both registered in 1995</p>
            <p>Founded by Bob Ellenbogen | Campus Records (1982-2000s)</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm sm:text-base">
            <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">Marketplace</a>
            <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">Music News</a>
            <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">About</a>
          </div>

          <div className="text-gray-500 text-sm space-y-1">
            <p>© 2025 MUSICweb®. All rights reserved.</p>
            <p>Updated November 20, 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
