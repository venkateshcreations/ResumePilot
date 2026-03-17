import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Sun, Moon, Zap, Menu, X } from 'lucide-react';
import { storage } from '@/utils/storage';

interface NavbarProps {
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/upload', label: 'Analyze' },
  { href: '/builder', label: 'Builder' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Navbar({ theme, onThemeToggle }: NavbarProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-[var(--border-subtle)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div className="absolute inset-0 w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] blur-sm opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-[var(--text-primary)]">
              Resume<span className="gradient-text-blue">Pilot</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onThemeToggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              href="/upload"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Zap size={14} fill="white" />
              Analyze Resume
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass rounded-xl mb-4 p-2 border border-[var(--border-subtle)]">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
