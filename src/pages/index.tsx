import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import {
  Zap, Upload, BarChart3, FileDown, ArrowRight, Sparkles,
  CheckCircle2, Shield, Cpu, ChevronRight, Star
} from 'lucide-react';

const features = [
  {
    icon: <Upload size={22} />,
    title: 'Smart Upload',
    desc: 'Drop your PDF or DOCX. Our parser extracts and structures your data instantly.',
    color: 'var(--accent-primary)',
  },
  {
    icon: <Cpu size={22} />,
    title: 'AI Analysis',
    desc: 'Deep analysis of ATS compatibility, keywords, structure, and content quality.',
    color: 'var(--accent-secondary)',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Score & Insights',
    desc: 'Get a detailed resume score with actionable improvement suggestions.',
    color: 'var(--accent-amber)',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'AI Generator',
    desc: 'Rewrite your resume with professional language and ATS-optimized keywords.',
    color: 'var(--accent-emerald)',
  },
  {
    icon: <FileDown size={22} />,
    title: 'Export & Download',
    desc: 'Preview your polished resume and download as PDF or DOCX instantly.',
    color: 'var(--accent-rose)',
  },
  {
    icon: <Shield size={22} />,
    title: 'Privacy First',
    desc: 'Everything runs in your browser. No data ever leaves your device.',
    color: 'var(--accent-primary)',
  },
];

const stats = [
  { value: '98%', label: 'ATS Pass Rate' },
  { value: '3×', label: 'More Interviews' },
  { value: '< 60s', label: 'Analysis Time' },
  { value: '0', label: 'Data Stored' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    text: 'My score went from 42 to 87 in one session. Landed 3 interviews the next week.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager',
    text: 'The keyword analysis was eye-opening. I had no idea how many ATS filters I was failing.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'Data Scientist',
    text: 'Clean, private, and genuinely useful. The AI suggestions are specific and actionable.',
    rating: 5,
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [animateHero, setAnimateHero] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setAnimateHero(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--accent-primary)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-15"
          style={{ background: 'var(--accent-secondary)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10"
          style={{ background: 'var(--accent-amber)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 pill glass border border-[var(--border-subtle)] text-[var(--text-secondary)] mb-8 transition-all duration-700 ${
              animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles size={13} className="text-[var(--accent-amber)]" />
            AI-Powered Resume Intelligence
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-emerald)] animate-pulse" />
          </div>

          {/* Headline */}
          <h1
            className={`font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6 transition-all duration-700 delay-100 ${
              animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Your Resume,{' '}
            <span className="relative">
              <span className="gradient-text">Supercharged</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 9 Q75 2 150 7 Q225 12 298 5" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />by AI
          </h1>

          {/* Sub */}
          <p
            className={`text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${
              animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Upload your resume, get an instant AI analysis with ATS score,
            keyword gaps, and personalized improvements. Build your perfect
            resume in minutes — 100% private, runs in your browser.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${
              animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              href="/upload"
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-medium text-base text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
              }}
            >
              <Zap size={18} fill="white" />
              Analyze My Resume
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/builder"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-medium text-base glass border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 hover:glow-blue transition-all duration-300"
            >
              Build from Scratch
              <ChevronRight size={16} className="text-[var(--text-muted)]" />
            </Link>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 delay-500 ${
              animateHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-2xl p-4 border border-[var(--border-subtle)] text-center">
                <p className="font-display font-bold text-2xl gradient-text-blue">{stat.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse-slow">
          <p className="text-xs text-[var(--text-muted)] tracking-widest uppercase">Scroll</p>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--text-muted)] to-transparent" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="pill bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 mb-4 inline-flex">
              Features
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)] mb-4">
              Everything you need to{' '}
              <span className="gradient-text">land the job</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
              A complete AI toolkit that transforms your resume from overlooked to outstanding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}18`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-[var(--text-primary)] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-[var(--text-primary)] mb-4">
              Three steps to your{' '}
              <span className="gradient-text">dream job</span>
            </h2>
          </div>
          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Upload your resume',
                desc: 'PDF, DOCX, or TXT — our parser handles everything. Your file never leaves your device.',
                color: 'var(--accent-primary)',
              },
              {
                step: '02',
                title: 'Get your AI analysis',
                desc: 'Instant score, keyword gaps, ATS compatibility check, and detailed improvement suggestions.',
                color: 'var(--accent-secondary)',
              },
              {
                step: '03',
                title: 'Download your improved resume',
                desc: 'Apply suggestions, regenerate with AI, choose a template, and export as PDF or DOCX.',
                color: 'var(--accent-amber)',
              },
            ].map((step, i) => (
              <div
                key={step.step}
                className="flex items-start gap-6 glass rounded-2xl p-6 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/20 transition-all"
              >
                <div
                  className="text-3xl font-display font-black flex-shrink-0 leading-none"
                  style={{ color: step.color, opacity: 0.5 }}
                >
                  {step.step}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="ml-auto flex-shrink-0 text-[var(--text-muted)]">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-[var(--text-primary)] mb-3">
              What users are saying
            </h2>
            <p className="text-[var(--text-secondary)]">Real results from real job seekers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6 border border-[var(--border-subtle)]">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--accent-amber)" className="text-[var(--accent-amber)]" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div className="border-t border-[var(--border-subtle)] pt-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-12 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(245,158,11,0.1) 100%)',
              border: '1px solid rgba(14,165,233,0.2)',
            }}
          >
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                <Zap size={28} className="text-white" fill="white" />
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)] mb-4">
                Ready to get more interviews?
              </h2>
              <p className="text-[var(--text-secondary)] mb-8 text-lg">
                Start for free. No account required. Privacy guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/upload"
                  className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    boxShadow: '0 8px 32px rgba(14, 165, 233, 0.3)',
                  }}
                >
                  <Zap size={18} fill="white" />
                  Analyze Resume Free
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/builder"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-semibold glass border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-primary)]/40 transition-all"
                >
                  Build New Resume
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-[var(--text-muted)]">
                {['No signup required', 'Completely private', 'Free forever'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-[var(--accent-emerald)]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-sm text-[var(--text-primary)]">
              ResumePilot AI
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Built with ❤️ · 100% client-side · Your data stays yours
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <Link href="/upload" className="hover:text-[var(--text-primary)] transition-colors">Analyze</Link>
            <Link href="/builder" className="hover:text-[var(--text-primary)] transition-colors">Builder</Link>
            <Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
