import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { storage } from '@/utils/storage';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = storage.getTheme();
    setTheme(savedTheme);
    document.documentElement.classList.toggle('light', savedTheme === 'light');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    storage.saveTheme(next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen noise ${theme}`} style={{ background: 'var(--bg-primary)' }}>
      <Navbar theme={theme} onThemeToggle={toggleTheme} />
      <main className="pt-16">
        {children}
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}
