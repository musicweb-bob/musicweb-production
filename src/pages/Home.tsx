import React from 'react';
import { SEO } from '../components/SEO';
import { Play, TrendingUp, Radio } from 'lucide-react';

export const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SEO title="Home" description="Welcome to MUSICweb - Your Global Music Hub." />
      
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-gray-900 mb-4">Your Music. Your World.</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stream the latest hits, discover underground talent, and stay updated with global music news.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
          <Play className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Unlimited Streaming</h3>
          <p className="text-gray-600">Access millions of tracks in high-fidelity audio anytime, anywhere.</p>
        </div>
        <div className="p-8 bg-purple-50 rounded-2xl border border-purple-100">
          <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Trending Charts</h3>
          <p className="text-gray-600">Stay ahead of the curve with our real-time global trending lists.</p>
        </div>
        <div className="p-8 bg-green-50 rounded-2xl border border-green-100">
          <Radio className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">Live Radio</h3>
          <p className="text-gray-600">Tune into curated stations hosted by the world's best DJs.</p>
        </div>
      </div>
    </div>
  );
};