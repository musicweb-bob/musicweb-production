import { useState } from 'react';
import { Globe, ShieldCheck, Tag, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';

export function LinkSubmitForm() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // ---------------------------------------------------------
  // 🛍️ INVENTORY SAFE LIST
  // ---------------------------------------------------------
  const ALLOWED_DOMAINS = [
    'reverb.com',
    'ebay.com',
    'sweetwater.com',
    'discogs.com',
    'amazon.com',
    'amzn.to',
    'craigslist.org',
    'depop.com'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // 1. VALIDATE THE URL (Client Side)
    const isValidDomain = ALLOWED_DOMAINS.some(domain => url.toLowerCase().includes(domain));

    if (!isValidDomain) {
      setStatus('error');
      setMessage('Marketplace Check: Please only submit links from Reverb, eBay, Amazon, Discogs, Sweetwater, or Depop.');
      return;
    }

    try {
      // 2. SEND TO DATABASE (Server Side)
      const response = await fetch('/api/submit_listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, email }),
      });

      if (response.ok) {
        setSubmittedEmail(email); // Save email for the success message
        setStatus('success');
        setUrl('');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Connection error. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-16">
      
      {/* SELLER VALUE PROP BOX */}
      <div className="mb-8 p-8 bg-[#131625] rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <Tag className="text-orange-500 fill-orange-500 w-6 h-6" />
            List Your Inventory
          </h3>
          <p className="text-gray-400 text-sm font-medium mb-6 ml-9">
            Vinyl • CDs • Cassettes • Gear • Posters • T-Shirts • Books • Memorabilia
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 relative z-10">
          <div className="bg-[#1a1d2e] p-5 rounded-xl border border-white/5">
            <div className="font-bold text-orange-500 mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" /> Targeted Buyers
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Don't list for tourists. Get your items in front of serious collectors and musicians.</p>
          </div>
          <div className="bg-[#1a1d2e] p-5 rounded-xl border border-white/5">
            <div className="font-bold text-blue-500 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Trusted Platform
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Buyers trust the MUSICweb name, increasing your click-through rate.</p>
          </div>
          <div className="bg-[#1a1d2e] p-5 rounded-xl border border-white/5">
            <div className="font-bold text-green-500 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Global Reach
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Link your Reverb, Amazon, eBay, or Discogs listing here to boost visibility.</p>
          </div>
        </div>
      </div>

      {/* THE INPUT FORM */}
      <div className="bg-[#131625] p-8 rounded-2xl border border-white/5">
        <h4 className="text-xl font-bold text-white mb-6">Submit Item for Sale</h4>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Paste Item Link <span className="text-gray-500 text-xs">(Amazon, Reverb, eBay, Discogs, etc)</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://..."
                className="w-full p-4 bg-[#1a1d2e] border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-white placeholder-gray-600 outline-none"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Seller Email <span className="text-gray-500 font-normal text-xs ml-1">(For approval updates)</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full p-4 bg-[#1a1d2e] border border-white/10 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-white placeholder-gray-600 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Messages */}
          {status === 'error' && (
            <div className="p-4 bg-red-500/10 text-red-200 text-sm rounded-xl border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="p-6 bg-green-500/10 text-green-200 rounded-xl border border-green-500/20 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-10 h-10 mb-3 text-green-400" />
              <h4 className="font-bold text-lg mb-1">Success! Item Queued.</h4>
              <p className="text-sm text-green-300/70">We sent a confirmation to <strong>{submittedEmail}</strong>.</p>
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/20
              ${status === 'success' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500'}
              ${status === 'loading' ? 'opacity-75 cursor-wait' : ''}
            `}
          >
            {status === 'loading' ? (
              <> <Loader2 className="w-5 h-5 animate-spin" /> Verifying Item... </>
            ) : status === 'success' ? (
              'Submitted'
            ) : (
              'Submit Inventory Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
