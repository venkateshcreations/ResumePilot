import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ResumeData } from '@/types';
import { storage } from '@/utils/storage';
import { downloadAsPDF } from '@/utils/downloadPDF';
import { Download, Palette, ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const templates = [
  { id: 'modern', name: 'Modern', accent: '#0ea5e9' },
  { id: 'minimal', name: 'Minimal', accent: '#1a1a1a' },
  { id: 'executive', name: 'Executive', accent: '#0f172a' },
];

export default function PreviewPage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState('modern');

  useEffect(() => {
    const saved = storage.getResume();
    setResume(saved);
    const t = storage.getTemplate();
    if (t) setTemplate(t);
  }, []);

  const handleDownload = async () => {
    const toastId = toast.loading('Generating PDF…');
    try {
      await downloadAsPDF('preview-resume', `${resume?.name?.replace(/\s+/g, '_') || 'resume'}.pdf`);
      toast.success('PDF downloaded!', { id: toastId });
    } catch {
      toast.error('Download failed.', { id: toastId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!resume) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-3">
            No resume to preview
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">
            Build a resume first, then come back to preview and download it.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium"
            style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
          >
            Go to Builder
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Toolbar */}
        <div className="no-print flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/builder"
              className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Builder
            </Link>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Template selector */}
            <div className="flex items-center gap-2">
              <Palette size={13} className="text-[var(--text-muted)]" />
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTemplate(t.id);
                    storage.saveTemplate(t.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    template === t.id
                      ? 'text-white'
                      : 'glass border border-[var(--border-subtle)] text-[var(--text-secondary)]'
                  }`}
                  style={template === t.id ? { background: t.accent } : {}}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
              <Printer size={13} />
              Print
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="shadow-2xl rounded-xl overflow-hidden">
          <ResumePreview data={resume} template={template} id="preview-resume" />
        </div>
      </div>
    </Layout>
  );
}
