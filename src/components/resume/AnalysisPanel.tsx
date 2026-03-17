import React, { useState } from 'react';
import { ResumeAnalysis } from '@/types';
import { ScoreRing, SmallScoreBar } from '@/components/ui/ScoreRing';
import {
  CheckCircle2, AlertTriangle, Lightbulb, Tag, TrendingUp,
  ChevronDown, ChevronUp, Target, Sparkles
} from 'lucide-react';

interface AnalysisPanelProps {
  analysis: ResumeAnalysis;
  onActionItemToggle?: (id: string) => void;
}

const priorityColors = {
  high: 'var(--accent-rose)',
  medium: 'var(--accent-amber)',
  low: 'var(--accent-emerald)',
};

const priorityBg = {
  high: 'bg-[var(--accent-rose)]/10 border-[var(--accent-rose)]/20',
  medium: 'bg-[var(--accent-amber)]/10 border-[var(--accent-amber)]/20',
  low: 'bg-[var(--accent-emerald)]/10 border-[var(--accent-emerald)]/20',
};

const categoryIcons: Record<string, React.ReactNode> = {
  content: <Lightbulb size={14} />,
  structure: <TrendingUp size={14} />,
  keywords: <Tag size={14} />,
  formatting: <Target size={14} />,
  ats: <Sparkles size={14} />,
};

export function AnalysisPanel({ analysis, onActionItemToggle }: AnalysisPanelProps) {
  const [expandedSuggestions, setExpandedSuggestions] = useState(false);
  const [actionItems, setActionItems] = useState(analysis.actionItems);

  const toggleAction = (id: string) => {
    setActionItems(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
    onActionItemToggle?.(id);
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="glass rounded-2xl p-6 border border-[var(--border-subtle)]">
        <h3 className="font-display font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-[var(--accent-primary)]" />
          Resume Score
        </h3>
        <div className="flex flex-col items-center mb-6">
          <ScoreRing score={analysis.score} size={140} strokeWidth={10} label="Overall Score" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SmallScoreBar label="ATS Compatibility" score={analysis.atsScore} />
          <SmallScoreBar label="Keywords" score={analysis.keywordsScore} />
          <SmallScoreBar label="Structure" score={analysis.structureScore} />
          <SmallScoreBar label="Content Quality" score={analysis.contentScore} />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 gap-4">
        <div className="glass rounded-2xl p-5 border border-[var(--accent-emerald)]/20">
          <h4 className="font-medium text-[var(--accent-emerald)] flex items-center gap-2 mb-3 text-sm">
            <CheckCircle2 size={15} /> Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--accent-emerald)] mt-0.5 flex-shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5 border border-[var(--accent-rose)]/20">
          <h4 className="font-medium text-[var(--accent-rose)] flex items-center gap-2 mb-3 text-sm">
            <AlertTriangle size={15} /> Areas to Improve
          </h4>
          <ul className="space-y-2">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--accent-rose)] mt-0.5 flex-shrink-0">!</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2 text-sm">
            <Lightbulb size={16} className="text-[var(--accent-amber)]" />
            AI Suggestions
          </h4>
          <span className="pill bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]">
            {analysis.suggestions.length}
          </span>
        </div>
        <div className="space-y-3">
          {(expandedSuggestions ? analysis.suggestions : analysis.suggestions.slice(0, 3)).map((s, i) => (
            <div
              key={i}
              className={`rounded-xl p-3.5 border ${priorityBg[s.priority]}`}
            >
              <div className="flex items-start gap-2.5">
                <span style={{ color: priorityColors[s.priority] }} className="mt-0.5 flex-shrink-0">
                  {categoryIcons[s.category]}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{s.title}</p>
                    <span
                      className="pill text-[10px] py-0.5 px-2"
                      style={{
                        background: `${priorityColors[s.priority]}20`,
                        color: priorityColors[s.priority],
                      }}
                    >
                      {s.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{s.description}</p>
                </div>
              </div>
            </div>
          ))}
          {analysis.suggestions.length > 3 && (
            <button
              onClick={() => setExpandedSuggestions(!expandedSuggestions)}
              className="w-full text-xs text-[var(--accent-primary)] hover:underline flex items-center justify-center gap-1 py-1"
            >
              {expandedSuggestions ? (
                <><ChevronUp size={13} /> Show less</>
              ) : (
                <><ChevronDown size={13} /> Show {analysis.suggestions.length - 3} more</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
        <h4 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4 text-sm">
          <Tag size={16} className="text-[var(--accent-violet)]" />
          Keyword Analysis
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">✓ Found in your resume</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.detectedKeywords.map((kw) => (
                <span key={kw} className="pill bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] border border-[var(--accent-emerald)]/20 text-[11px]">
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">✗ Missing keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.missingKeywords.map((kw) => (
                <span key={kw} className="pill bg-[var(--accent-rose)]/10 text-[var(--accent-rose)] border border-[var(--accent-rose)]/20 text-[11px]">
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
        <h4 className="font-display font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-4 text-sm">
          <Target size={16} className="text-[var(--accent-primary)]" />
          Action Checklist
        </h4>
        <div className="space-y-2">
          {actionItems.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[var(--border-subtle)] cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleAction(item.id)}
                className="mt-0.5 accent-[#0ea5e9]"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm ${item.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}
                >
                  {item.text}
                </span>
              </div>
              <span
                className="pill text-[10px] py-0.5 flex-shrink-0"
                style={{
                  background: `${priorityColors[item.priority]}15`,
                  color: priorityColors[item.priority],
                }}
              >
                {item.priority}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>{actionItems.filter(i => i.completed).length}/{actionItems.length} completed</span>
            <span>{Math.round((actionItems.filter(i => i.completed).length / actionItems.length) * 100)}%</span>
          </div>
          <div className="mt-1.5 h-1 rounded-full overflow-hidden bg-[var(--border-subtle)]">
            <div
              className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-500"
              style={{ width: `${(actionItems.filter(i => i.completed).length / actionItems.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
