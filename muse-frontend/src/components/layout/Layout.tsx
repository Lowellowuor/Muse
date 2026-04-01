import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {/* Subtle grid pattern - white */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      {/* Subtle ambient glows - white/gray */}
      <div className="fixed top-1/4 -left-48 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse" />
      <div className="fixed bottom-1/4 -right-48 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="relative z-10 pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}