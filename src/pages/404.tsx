import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { Zap, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="font-display font-black text-[120px] leading-none gradient-text mb-4 select-none">
            404
          </div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">
            Page not found
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            This page doesn't exist or was moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-medium hover:border-[var(--accent-primary)]/30 transition-all"
            >
              <ArrowLeft size={15} />
              Back to Home
            </Link>
            <Link
              href="/upload"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
            >
              <Zap size={15} fill="white" />
              Analyze Resume
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
