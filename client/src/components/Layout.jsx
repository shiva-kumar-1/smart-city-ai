import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, CarFront, TrafficCone, Fuel, PhoneCall, Info,
  Menu, X, Construction, LogOut, User, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Traffic', href: '/traffic', icon: TrafficCone },
  { name: 'Parking', href: '/parking', icon: CarFront },
  { name: 'Road Damage', href: '/road-damage', icon: Construction },
  { name: 'Fuel Stations', href: '/fuelstations', icon: Fuel },
  { name: 'Emergency', href: '/emergency', icon: PhoneCall },
  { name: 'About', href: '/about', icon: Info },
];

function NavLinks({ onClose }) {
  const [location] = useLocation();
  return (
    <nav className="flex flex-col gap-1 p-4 flex-1">
      {navItems.map(({ name, href, icon: Icon }) => {
        const active = location === href;
        return (
          <Link key={href} href={href} onClick={onClose}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium
              ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-100'}`}>
              <Icon size={18} />
              <span>{name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

function UserBadge({ onClose }) {
  const { user, logout, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const handleLogout = () => { logout(); navigate('/auth'); onClose(); };

  return (
    <div className="p-4 border-t border-slate-700">
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-700/40">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          {isAdmin ? <Shield size={14} className="text-white" /> : <User size={14} className="text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 truncate">{isAdmin ? 'Admin' : 'Citizen'}</p>
        </div>
        <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="font-bold text-xl text-blue-400">SmartCity</span>
        </div>
      </div>
      <NavLinks onClose={close} />
      <UserBadge onClose={close} />
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={close} />
          <aside className="relative z-50 w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <LayoutDashboard size={16} className="text-white" />
                </div>
                <span className="font-bold text-xl text-blue-400">SmartCity</span>
              </div>
              <button onClick={close} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <NavLinks onClose={close} />
            <UserBadge onClose={close} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 flex items-center justify-between px-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <LayoutDashboard size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl text-blue-400">SmartCity</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white p-1">
            <Menu size={22} />
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
