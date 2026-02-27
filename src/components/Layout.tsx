import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // This tells the Navigation component which tab to highlight orange
  const currentPage = location.pathname.split('/')[1] || 'home';

  const handleNavigate = (page: string) => {
    // Logic for the Marketplace sub-filters (Vinyl, Gear, etc.)
    if (page.startsWith('marketplace-')) {
      const filter = page.split('-')[1];
      navigate('/marketplace', { state: { filter: `${filter}-section` } });
    } else {
      navigate(page === 'home' ? '/' : `/${page}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
