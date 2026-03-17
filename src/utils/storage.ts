import { ResumeData, ResumeAnalysis, AppState } from '@/types';

const KEYS = {
  RESUME: 'resumepilot_resume',
  ANALYSIS: 'resumepilot_analysis',
  API_KEY: 'resumepilot_api_key',
  THEME: 'resumepilot_theme',
  TEMPLATE: 'resumepilot_template',
  UPLOADED_TEXT: 'resumepilot_text',
};

export const storage = {
  // Resume
  saveResume: (data: ResumeData) => {
    try {
      localStorage.setItem(KEYS.RESUME, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  getResume: (): ResumeData | null => {
    try {
      const data = localStorage.getItem(KEYS.RESUME);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // Analysis
  saveAnalysis: (data: ResumeAnalysis) => {
    try {
      localStorage.setItem(KEYS.ANALYSIS, JSON.stringify(data));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  getAnalysis: (): ResumeAnalysis | null => {
    try {
      const data = localStorage.getItem(KEYS.ANALYSIS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  // API Key
  saveApiKey: (key: string) => {
    try {
      localStorage.setItem(KEYS.API_KEY, key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  getApiKey: (): string => {
    try {
      return localStorage.getItem(KEYS.API_KEY) || '';
    } catch {
      return '';
    }
  },

  // Theme
  saveTheme: (theme: 'dark' | 'light') => {
    try {
      localStorage.setItem(KEYS.THEME, theme);
    } catch (e) {}
  },
  getTheme: (): 'dark' | 'light' => {
    try {
      return (localStorage.getItem(KEYS.THEME) as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  },

  // Template
  saveTemplate: (template: string) => {
    try {
      localStorage.setItem(KEYS.TEMPLATE, template);
    } catch (e) {}
  },
  getTemplate: (): string => {
    try {
      return localStorage.getItem(KEYS.TEMPLATE) || 'modern';
    } catch {
      return 'modern';
    }
  },

  // Uploaded text
  saveUploadedText: (text: string) => {
    try {
      localStorage.setItem(KEYS.UPLOADED_TEXT, text);
    } catch (e) {}
  },
  getUploadedText: (): string => {
    try {
      return localStorage.getItem(KEYS.UPLOADED_TEXT) || '';
    } catch {
      return '';
    }
  },

  // Clear all
  clearAll: () => {
    Object.values(KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    });
  },
};
