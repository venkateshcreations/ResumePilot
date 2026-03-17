import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ResumeBuilderForm } from '@/components/resume/ResumeBuilderForm';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ResumeData } from '@/types';
import { storage } from '@/utils/storage';
import { downloadAsPDF } from '@/utils/downloadPDF';
import { generateResume } from '@/services/ai/analyzeResume';
import {
  Download, Wand2, Loader2, Eye, Edit, Palette,
  CheckCircle2, Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const templates = [
  { id: 'modern', name: 'Modern', accent: '#0ea5e9', desc: 'Clean & ATS-friendly' },
  { id: 'minimal', name: 'Minimal', accent: '#1a1a1a', desc: 'Understated elegance' },
  { id: 'executive', name: 'Executive', accent: '#0f172a', desc: 'Bold & authoritative' },
];

export default function BuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const saved = storage.getResume();
    if (saved) setResumeData(saved);
    const key = storage.getApiKey();
    if (key) setApiKey(key);
    const template = storage.getTemplate();
    if (template) setActiveTemplate(template);
  }, []);

  const handleChange = (data: ResumeData) => {
    setResumeData(data);
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!resumeData) return;
    storage.saveResume(resumeData);
    setIsSaved(true);
    toast.success('Resume saved locally');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAIEnhance = async () => {
    if (!resumeData) {
      toast.error('Please fill in your resume details first');
      return;
    }
    setIsGenerating(true);
    const toastId = toast.loading('AI is enhancing your resume…');
    try {
      const enhanced = await generateResume(resumeData, apiKey || undefined);
      if (enhanced && enhanced.name) {
        setResumeData({ ...resumeData, ...enhanced });
        toast.success('Resume enhanced by AI!', { id: toastId });
      } else {
        toast.error('Enhancement failed. Try adding an API key.', { id: toastId });
      }
    } catch {
      toast.error('Enhancement failed.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const toastId = toast.loading('Generating PDF…');
    try {
      await downloadAsPDF('builder-preview', `${resumeData?.name?.replace(/\s+/g, '_') || 'resume'}.pdf`);
      toast.success('PDF downloaded!', { id: toastId });
    } catch {
      toast.error('Download failed.', { id: toastId });
    }
  };

  const handleTemplateChange = (id: string) => {
    setActiveTemplate(id);
    storage.saveTemplate(id);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-1">
              Resume Builder
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Build your resume from scratch with AI assistance
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* View toggle */}
            <div className="flex gap-1 glass rounded-xl p-1 border border-[var(--border-subtle)]">
              <button
                onClick={() => setActiveView('edit')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeView === 'edit'
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Edit size={13} /> Edit
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeView === 'preview'
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Eye size={13} /> Preview
              </button>
            </div>

            {/* AI Enhance */}
            <button
              onClick={handleAIEnhance}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-[var(--accent-secondary)]/30 text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/10 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              AI Enhance
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isSaved
                  ? 'bg-[var(--accent-emerald)]/10 border border-[var(--accent-emerald)]/30 text-[var(--accent-emerald)]'
                  : 'glass border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isSaved ? <CheckCircle2 size={14} /> : <Save size={14} />}
              {isSaved ? 'Saved!' : 'Save'}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              }}
            >
              <Download size={14} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Palette size={13} />
            Template:
          </div>
          <div className="flex gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateChange(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTemplate === t.id
                    ? 'text-white'
                    : 'glass border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={activeTemplate === t.id ? { background: t.accent } : {}}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.accent }} />
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <div className={activeView === 'preview' ? 'hidden lg:block' : ''}>
            <ResumeBuilderForm
              initialData={resumeData || undefined}
              onChange={handleChange}
              apiKey={apiKey}
            />
          </div>

          {/* Live Preview */}
          <div className={activeView === 'edit' ? 'hidden lg:block' : ''}>
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-[var(--text-secondary)]">Live Preview</p>
                <span className="pill bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)] text-[11px]">
                  Auto-updating
                </span>
              </div>
              <div className="overflow-auto max-h-[80vh] rounded-xl">
                <div className="scale-[0.7] origin-top-left" style={{ width: '142.857%' }}>
                  {resumeData ? (
                    <ResumePreview
                      data={resumeData}
                      template={activeTemplate}
                      id="builder-preview"
                    />
                  ) : (
                    <div className="bg-white rounded-xl p-16 text-center" style={{ minHeight: '1050px' }}>
                      <div className="text-gray-300 text-6xl mb-4">📄</div>
                      <p className="text-gray-400 text-sm">
                        Fill in your details to see a live preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
