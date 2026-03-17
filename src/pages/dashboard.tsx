import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ScoreRing, SmallScoreBar } from '@/components/ui/ScoreRing';
import { ResumeAnalysis, ResumeData } from '@/types';
import { storage } from '@/utils/storage';
import Link from 'next/link';
import {
  Zap, BarChart3, ArrowRight, Edit, FileText,
  AlertTriangle, CheckCircle2, Tag, Target,
  Trash2, TrendingUp, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setResume(storage.getResume());
    setAnalysis(storage.getAnalysis());
    setMounted(true);
  }, []);

  const handleClearData = () => {
    if (confirm('Clear all saved data? This cannot be undone.')) {
      storage.clearAll();
      setResume(null);
      setAnalysis(null);
      toast.success('All data cleared');
    }
  };

  if (!mounted) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-1">
              Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Your resume intelligence hub
            </p>
          </div>
          {(resume || analysis) && (
            <button
              onClick={handleClearData}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-rose)] transition-colors"
            >
              <Trash2 size={13} />
              Clear all data
            </button>
          )}
        </div>

        {!resume && !analysis ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {/* Top row: Score + Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Overall Score Card */}
              <div className="glass rounded-2xl p-6 border border-[var(--border-subtle)] flex flex-col items-center text-center">
                {analysis ? (
                  <>
                    <ScoreRing score={analysis.score} size={100} strokeWidth={8} label="Resume Score" />
                    <p className="text-xs text-[var(--text-muted)] mt-3">Last analyzed</p>
                    <div className="flex gap-2 mt-4 w-full">
                      <Link
                        href="/upload"
                        className="flex-1 text-center text-xs py-2 rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
                      >
                        Re-analyze
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-[var(--border-subtle)] flex items-center justify-center mb-4">
                      <BarChart3 size={28} className="text-[var(--text-muted)]" />
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">No analysis yet</p>
                    <Link
                      href="/upload"
                      className="text-xs py-2 px-4 rounded-lg bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity"
                    >
                      Analyze Now
                    </Link>
                  </>
                )}
              </div>

              {/* Resume info card */}
              <div className="glass rounded-2xl p-6 border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-[var(--accent-secondary)]" />
                  <h3 className="font-medium text-[var(--text-primary)] text-sm">Your Resume</h3>
                </div>
                {resume ? (
                  <div className="space-y-2">
                    <p className="font-display font-semibold text-[var(--text-primary)]">{resume.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{resume.email}</p>
                    {resume.experience.length > 0 && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        {resume.experience.length} positions · {resume.skills.length} skills
                      </p>
                    )}
                    <div className="pt-2">
                      <Link
                        href="/builder"
                        className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline"
                      >
                        <Edit size={12} /> Edit resume
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--text-secondary)]">No resume saved yet</p>
                    <Link
                      href="/builder"
                      className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline"
                    >
                      <Edit size={12} /> Build your resume
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="glass rounded-2xl p-6 border border-[var(--border-subtle)]">
                <h3 className="font-medium text-[var(--text-primary)] text-sm mb-4 flex items-center gap-2">
                  <Zap size={15} className="text-[var(--accent-amber)]" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {[
                    { href: '/upload', label: 'Analyze Resume', icon: <BarChart3 size={14} />, color: 'var(--accent-primary)' },
                    { href: '/builder', label: 'Edit Builder', icon: <Edit size={14} />, color: 'var(--accent-secondary)' },
                    { href: '/upload', label: 'Upload New', icon: <FileText size={14} />, color: 'var(--accent-emerald)' },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--border-subtle)] transition-colors group"
                    >
                      <span style={{ color: action.color }}>{action.icon}</span>
                      <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                        {action.label}
                      </span>
                      <ArrowRight size={13} className="ml-auto text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis breakdown */}
            {analysis && (
              <>
                {/* Score bars */}
                <div className="glass rounded-2xl p-6 border border-[var(--border-subtle)]">
                  <h3 className="font-display font-semibold text-[var(--text-primary)] mb-5 flex items-center gap-2 text-sm">
                    <TrendingUp size={16} className="text-[var(--accent-primary)]" />
                    Score Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SmallScoreBar label="ATS Compatibility" score={analysis.atsScore} />
                    <SmallScoreBar label="Keyword Match" score={analysis.keywordsScore} />
                    <SmallScoreBar label="Structure" score={analysis.structureScore} />
                    <SmallScoreBar label="Content Quality" score={analysis.contentScore} />
                  </div>
                </div>

                {/* Strengths & Issues */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="glass rounded-2xl p-5 border border-[var(--accent-emerald)]/20">
                    <h4 className="font-medium text-[var(--accent-emerald)] text-sm flex items-center gap-2 mb-3">
                      <CheckCircle2 size={14} /> Strengths ({analysis.strengths.length})
                    </h4>
                    <ul className="space-y-2">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <span className="text-[var(--accent-emerald)] flex-shrink-0">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass rounded-2xl p-5 border border-[var(--accent-rose)]/20">
                    <h4 className="font-medium text-[var(--accent-rose)] text-sm flex items-center gap-2 mb-3">
                      <AlertTriangle size={14} /> Issues ({analysis.weaknesses.length})
                    </h4>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <span className="text-[var(--accent-rose)] flex-shrink-0">!</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action checklist */}
                <div className="glass rounded-2xl p-6 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-semibold text-[var(--text-primary)] text-sm flex items-center gap-2">
                      <Target size={16} className="text-[var(--accent-primary)]" />
                      Improvement Checklist
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">
                      {analysis.actionItems.filter(i => i.completed).length}/{analysis.actionItems.length} done
                    </span>
                  </div>
                  <div className="space-y-2">
                    {analysis.actionItems.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-2.5 rounded-xl glass border border-[var(--border-subtle)]"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                          item.completed
                            ? 'bg-[var(--accent-emerald)] border-[var(--accent-emerald)]'
                            : 'border-[var(--border-subtle)]'
                        }`}>
                          {item.completed && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <span className={`text-sm ${item.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>
                          {item.text}
                        </span>
                        <span
                          className="ml-auto pill text-[10px] flex-shrink-0"
                          style={{
                            background: item.priority === 'high' ? 'rgba(244,63,94,0.1)' : item.priority === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                            color: item.priority === 'high' ? 'var(--accent-rose)' : item.priority === 'medium' ? 'var(--accent-amber)' : 'var(--accent-emerald)',
                          }}
                        >
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex justify-between items-center">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--border-subtle)] mr-4">
                      <div
                        className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-500"
                        style={{ width: `${(analysis.actionItems.filter(i => i.completed).length / analysis.actionItems.length) * 100}%` }}
                      />
                    </div>
                    <Link
                      href="/upload"
                      className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                    >
                      Full report <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
                  <h4 className="font-medium text-[var(--text-primary)] text-sm flex items-center gap-2 mb-3">
                    <Tag size={14} className="text-[var(--accent-violet)]" />
                    Keywords to Add
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="pill bg-[var(--accent-rose)]/10 text-[var(--accent-rose)] border border-[var(--accent-rose)]/20 text-xs"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-24 h-24 rounded-3xl glass border border-[var(--border-subtle)] flex items-center justify-center mx-auto mb-6">
        <BarChart3 size={36} className="text-[var(--text-muted)]" />
      </div>
      <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">
        No data yet
      </h2>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
        Upload a resume to analyze it, or start building one from scratch to see your dashboard come to life.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/upload"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm"
          style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
        >
          <Zap size={16} fill="white" />
          Analyze Resume
        </Link>
        <Link
          href="/builder"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium text-sm"
        >
          <Edit size={16} />
          Build Resume
        </Link>
      </div>
    </div>
  );
}
