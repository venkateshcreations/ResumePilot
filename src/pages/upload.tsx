import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { UploadZone } from '@/components/ui/UploadZone';
import { AnalysisPanel } from '@/components/resume/AnalysisPanel';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { analyzeResume } from '@/services/ai/analyzeResume';
import { storage } from '@/utils/storage';
import { downloadAsPDF } from '@/utils/downloadPDF';
import { ResumeAnalysis, ResumeData } from '@/types';
import {
  Zap, Loader2, Key, Eye, EyeOff, Download, Wand2,
  AlertCircle, FileText, RotateCcw, ChevronDown, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UploadPage() {
  const [resumeText, setResumeText] = useState('');
  const [filename, setFilename] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showJobDesc, setShowJobDesc] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'preview'>('analysis');

  const demoResume: ResumeData = {
    id: 'demo',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    website: '',
    summary: resumeText.slice(0, 400) || 'Experienced software engineer with 5+ years building scalable web applications.',
    experience: [],
    education: [],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  useEffect(() => {
    const savedKey = storage.getApiKey();
    if (savedKey) setApiKey(savedKey);
    const savedAnalysis = storage.getAnalysis();
    if (savedAnalysis) setAnalysis(savedAnalysis);
    const savedText = storage.getUploadedText();
    if (savedText) setResumeText(savedText);
  }, []);

  const handleTextExtracted = (text: string, name: string) => {
    setResumeText(text);
    setFilename(name);
    setAnalysis(null);
    storage.saveUploadedText(text);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error('Please upload a resume first');
      return;
    }
    setIsAnalyzing(true);
    const toastId = toast.loading('Analyzing your resume…');

    try {
      const result = await analyzeResume(resumeText, jobDescription, apiKey || undefined);
      setAnalysis(result);
      storage.saveAnalysis(result);
      toast.success('Analysis complete!', { id: toastId });
      setActiveTab('analysis');
    } catch (err) {
      toast.error('Analysis failed. Please try again.', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveApiKey = () => {
    storage.saveApiKey(apiKey);
    toast.success('API key saved');
    setShowApiSettings(false);
  };

  const handleDownload = async () => {
    const toastId = toast.loading('Generating PDF…');
    try {
      await downloadAsPDF('resume-preview', `${filename.replace(/\.\w+$/, '') || 'resume'}.pdf`);
      toast.success('PDF downloaded!', { id: toastId });
    } catch {
      toast.error('Download failed. Try again.', { id: toastId });
    }
  };

  const handleReset = () => {
    setResumeText('');
    setFilename('');
    setAnalysis(null);
    storage.saveUploadedText('');
    storage.saveAnalysis(null as any);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-1">
                Resume Analyzer
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">
                Upload your resume for an instant AI-powered analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowApiSettings(!showApiSettings)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
              >
                <Settings size={13} />
                API Settings
              </button>
              {(resumeText || analysis) && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg glass border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent-rose)] transition-all"
                >
                  <RotateCcw size={13} />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* API Settings Panel */}
          {showApiSettings && (
            <div className="mt-4 glass rounded-2xl p-5 border border-[var(--border-subtle)]">
              <h3 className="font-medium text-[var(--text-primary)] text-sm mb-3 flex items-center gap-2">
                <Key size={14} className="text-[var(--accent-amber)]" />
                Anthropic API Key (optional)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Add your Anthropic API key for more powerful AI analysis. Without it, a smart demo analysis is used.
                Your key is stored locally only.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors pr-10"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  >
                    {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <button
                  onClick={handleSaveApiKey}
                  className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Upload + Controls */}
          <div className="lg:col-span-2 space-y-5">
            <UploadZone onTextExtracted={handleTextExtracted} isLoading={isAnalyzing} />

            {/* Job Description (optional) */}
            <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
              <button
                onClick={() => setShowJobDesc(!showJobDesc)}
                className="w-full flex items-center justify-between text-sm font-medium text-[var(--text-primary)]"
              >
                <span className="flex items-center gap-2">
                  <FileText size={15} className="text-[var(--accent-secondary)]" />
                  Job Description (optional)
                </span>
                <ChevronDown
                  size={15}
                  className={`text-[var(--text-muted)] transition-transform ${showJobDesc ? 'rotate-180' : ''}`}
                />
              </button>
              {showJobDesc && (
                <div className="mt-3">
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    rows={5}
                    placeholder="Paste the job description here for targeted keyword analysis…"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
                  />
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!resumeText || isAnalyzing}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                !resumeText
                  ? 'opacity-40 cursor-not-allowed glass border border-[var(--border-subtle)] text-[var(--text-muted)]'
                  : 'text-white hover:scale-[1.02] hover:shadow-xl'
              }`}
              style={resumeText ? {
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                boxShadow: '0 8px 32px rgba(14, 165, 233, 0.25)',
              } : {}}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Zap size={18} fill={resumeText ? 'white' : 'currentColor'} />
                  Analyze with AI
                </>
              )}
            </button>

            {/* Quick info */}
            {!apiKey && (
              <div className="flex items-start gap-2.5 glass rounded-xl p-3.5 border border-[var(--accent-amber)]/20">
                <AlertCircle size={14} className="text-[var(--accent-amber)] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--text-secondary)]">
                  Running in demo mode. Add your{' '}
                  <button
                    onClick={() => setShowApiSettings(true)}
                    className="text-[var(--accent-amber)] hover:underline"
                  >
                    Anthropic API key
                  </button>{' '}
                  for full AI-powered analysis.
                </p>
              </div>
            )}

            {/* Go to Builder CTA */}
            <div className="glass rounded-2xl p-4 border border-[var(--border-subtle)] text-center">
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Don&apos;t have a resume yet?
              </p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent-primary)] hover:underline"
              >
                <Wand2 size={13} />
                Build from scratch with AI
              </Link>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3">
            {!analysis && !resumeText && (
              <div className="h-full flex items-center justify-center min-h-[500px]">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl glass border border-[var(--border-subtle)] flex items-center justify-center mx-auto">
                    <Zap size={32} className="text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-[var(--text-primary)] text-lg">
                      Upload your resume to begin
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Your AI analysis will appear here
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(analysis || resumeText) && (
              <div>
                {/* Tab switcher */}
                <div className="flex gap-1 glass rounded-xl p-1 border border-[var(--border-subtle)] mb-5 w-fit">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'analysis'
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    AI Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'preview'
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                {activeTab === 'analysis' && analysis && (
                  <AnalysisPanel analysis={analysis} />
                )}

                {activeTab === 'analysis' && !analysis && resumeText && (
                  <div className="glass rounded-2xl p-10 border border-[var(--border-subtle)] text-center">
                    <Zap size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
                    <p className="text-[var(--text-secondary)] text-sm">
                      Click &quot;Analyze with AI&quot; to generate your report
                    </p>
                  </div>
                )}

                {activeTab === 'preview' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[var(--text-secondary)]">Resume Preview</p>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity"
                      >
                        <Download size={13} />
                        Download PDF
                      </button>
                    </div>
                    <div className="scale-[0.85] origin-top">
                      <ResumePreview data={demoResume} template="modern" id="resume-preview" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
