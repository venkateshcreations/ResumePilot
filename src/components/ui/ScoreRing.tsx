import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
  showNumber?: boolean;
  animate?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#10b981'; // emerald
  if (score >= 60) return '#f59e0b'; // amber
  return '#f43f5e'; // rose
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Needs Work';
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  color,
  showNumber = true,
  animate = true,
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringColor = color || getScoreColor(score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(score * eased);
      setDisplayScore(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score, animate]);

  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          />
          {/* Glow filter */}
          <defs>
            <filter id={`glow-${score}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth / 2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter={`url(#glow-${score})`}
            opacity={0.5}
            style={{ transition: 'stroke-dashoffset 0.1s ease' }}
          />
        </svg>
        {showNumber && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-display font-bold leading-none"
              style={{ fontSize: size * 0.25, color: ringColor }}
            >
              {displayScore}
            </span>
            <span
              className="font-body leading-none mt-0.5"
              style={{ fontSize: size * 0.1, color: 'var(--text-secondary)' }}
            >
              /100
            </span>
          </div>
        )}
      </div>
      {label && (
        <div className="text-center">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{label}</p>
          {!color && (
            <p className="text-xs font-semibold mt-0.5" style={{ color: ringColor }}>
              {getScoreLabel(score)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function SmallScoreBar({ label, score, color }: { label: string; score: number; color?: string }) {
  const [width, setWidth] = useState(0);
  const barColor = color || getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className="text-sm font-semibold font-mono" style={{ color: barColor }}>
          {score}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: barColor }}
        />
      </div>
    </div>
  );
}
