// Resume Types
export interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications?: Certification[];
  projects?: Project[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

// Analysis Types
export interface ResumeAnalysis {
  score: number;
  atsScore: number;
  keywordsScore: number;
  structureScore: number;
  contentScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: AnalysisSuggestion[];
  missingKeywords: string[];
  detectedKeywords: string[];
  actionItems: ActionItem[];
}

export interface AnalysisSuggestion {
  category: 'content' | 'structure' | 'keywords' | 'formatting' | 'ats';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

// App State
export interface AppState {
  theme: 'dark' | 'light';
  apiKey: string;
  currentResume: ResumeData | null;
  analysis: ResumeAnalysis | null;
  uploadedText: string;
  isAnalyzing: boolean;
  isGenerating: boolean;
  activeTemplate: string;
}

// Template Types
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  accent: string;
}
