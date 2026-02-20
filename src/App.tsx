import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';

// PAGES
import { Home } from './pages/Home';
import { Artists } from './pages/Artists';
import { News } from './pages/News';
import TourSearch from './pages/TourSearch'; 
import { Investors } from './pages/Investors';
import { Admin } from './pages/Admin';
import { Marketplace } from './pages/Marketplace';
import { Streaming } from './pages/Streaming';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Reviews } from './pages/Reviews';

function AppContent() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page === 'home' ? '/' : `/${page}`);

  // --- VISITOR TRACKING ---
  useEffect(() => {
    if (!localStorage.getItem('mw_identity_owner')) {
      fetch('/api/stats', { method: 'POST' }).catch(() => {});
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="artists" element={<Artists onNavigate={handleNavigate} />} />
        <Route path="news" element={<News />} />
        <Route path="concerts" element={<TourSearch />} />
        <Route path="streaming" element={<Streaming onNavigate={handleNavigate} />} />
        
        {/* --- CATEGORY ROUTES (RESTORED & ALIGNED WITH NAVIGATION.TSX) --- */}
        <Route path="marketplace" element={<Marketplace onNavigate={handleNavigate} />} />
        <Route path="marketplace-vinyl" element={<Marketplace onNavigate={handleNavigate} initialFilter="marketplace-vinyl" />} />
        <Route path="marketplace-gear" element={<Marketplace onNavigate={handleNavigate} initialFilter="marketplace-gear" />} />
        <Route path="marketplace-memorabilia" element={<Marketplace onNavigate={handleNavigate} initialFilter="marketplace-memorabilia" />} />
        <Route path="marketplace-books" element={<Marketplace onNavigate={handleNavigate} initialFilter="marketplace-books" />} />
        
        <Route path="investors" element={<Investors onNavigate={handleNavigate} />} />
        <Route path="admin" element={<Admin onNavigate={handleNavigate} />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="reviews" element={<Reviews onNavigate={handleNavigate} />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
