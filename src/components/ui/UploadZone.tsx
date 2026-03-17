import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { parseFile } from '@/utils/parser/fileParser';

interface UploadZoneProps {
  onTextExtracted: (text: string, filename: string) => void;
  isLoading?: boolean;
}

export function UploadZone({ onTextExtracted, isLoading }: UploadZoneProps) {
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStatus('parsing');
    setError('');
    setFilename(file.name);

    try {
      const text = await parseFile(file);
      if (!text.trim()) throw new Error('No text found in file.');
      setStatus('success');
      onTextExtracted(text, file.name);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-12 text-center group
        ${isDragActive
          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5 glow-blue scale-[1.01]'
          : status === 'success'
          ? 'border-[var(--accent-emerald)] bg-[var(--accent-emerald)]/5'
          : status === 'error'
          ? 'border-[var(--accent-rose)] bg-[var(--accent-rose)]/5'
          : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-primary)]/3'
        }
      `}
    >
      <input {...getInputProps()} />

      {/* Background grid */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30">
        <div className="absolute inset-0 grid-bg" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isDragActive
            ? 'bg-[var(--accent-primary)]/20 scale-110'
            : status === 'success'
            ? 'bg-[var(--accent-emerald)]/20'
            : status === 'error'
            ? 'bg-[var(--accent-rose)]/20'
            : 'bg-[var(--border-subtle)] group-hover:bg-[var(--accent-primary)]/10'
        }`}>
          {status === 'parsing' || isLoading ? (
            <Loader2 size={28} className="text-[var(--accent-primary)] animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 size={28} className="text-[var(--accent-emerald)]" />
          ) : status === 'error' ? (
            <AlertCircle size={28} className="text-[var(--accent-rose)]" />
          ) : isDragActive ? (
            <Upload size={28} className="text-[var(--accent-primary)] animate-bounce" />
          ) : (
            <FileText size={28} className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
          )}
        </div>

        {/* Text */}
        <div className="space-y-1">
          {status === 'parsing' ? (
            <>
              <p className="font-display font-semibold text-[var(--text-primary)]">Parsing your resume…</p>
              <p className="text-sm text-[var(--text-secondary)]">{filename}</p>
            </>
          ) : status === 'success' ? (
            <>
              <p className="font-display font-semibold text-[var(--accent-emerald)]">Resume loaded!</p>
              <p className="text-sm text-[var(--text-secondary)]">{filename}</p>
              <p className="text-xs text-[var(--text-muted)]">Drop another file to replace</p>
            </>
          ) : status === 'error' ? (
            <>
              <p className="font-display font-semibold text-[var(--accent-rose)]">Upload failed</p>
              <p className="text-sm text-[var(--text-secondary)]">{error}</p>
              <p className="text-xs text-[var(--text-muted)]">Try again with a different file</p>
            </>
          ) : isDragActive ? (
            <>
              <p className="font-display font-semibold text-[var(--accent-primary)]">Drop it here!</p>
              <p className="text-sm text-[var(--text-secondary)]">Release to upload</p>
            </>
          ) : (
            <>
              <p className="font-display font-semibold text-[var(--text-primary)]">
                Drop your resume here
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                or <span className="text-[var(--accent-primary)] hover:underline">click to browse</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-2">PDF, DOCX, or TXT · Max 10MB</p>
            </>
          )}
        </div>

        {/* Format badges */}
        {status === 'idle' && !isDragActive && (
          <div className="flex items-center gap-2 mt-2">
            {['PDF', 'DOCX', 'TXT'].map((fmt) => (
              <span key={fmt} className="pill bg-[var(--border-subtle)] text-[var(--text-secondary)]">
                {fmt}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
