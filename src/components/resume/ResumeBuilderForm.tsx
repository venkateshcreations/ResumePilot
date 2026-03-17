import React, { useState } from 'react';
import { ResumeData, WorkExperience, Education, Project, Certification } from '@/types';
import { Plus, Trash2, ChevronDown, ChevronUp, Wand2, Loader2 } from 'lucide-react';
import { improveSection } from '@/services/ai/analyzeResume';
import toast from 'react-hot-toast';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const defaultResume: ResumeData = {
  id: generateId(),
  name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

interface ResumeBuilderFormProps {
  initialData?: ResumeData;
  onChange: (data: ResumeData) => void;
  apiKey?: string;
}

export function ResumeBuilderForm({ initialData, onChange, apiKey }: ResumeBuilderFormProps) {
  const [data, setData] = useState<ResumeData>(initialData || defaultResume);
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [improvingSection, setImprovingSection] = useState<string | null>(null);

  const update = (updates: Partial<ResumeData>) => {
    const next = { ...data, ...updates, updatedAt: Date.now() };
    setData(next);
    onChange(next);
  };

  const addExperience = () => {
    const exp: WorkExperience = {
      id: generateId(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      description: '',
      achievements: [],
    };
    update({ experience: [...data.experience, exp] });
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    update({
      experience: data.experience.map(e => e.id === id ? { ...e, ...updates } : e),
    });
  };

  const removeExperience = (id: string) => {
    update({ experience: data.experience.filter(e => e.id !== id) });
  };

  const addEducation = () => {
    const edu: Education = {
      id: generateId(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    update({ education: [...data.education, edu] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    update({
      education: data.education.map(e => e.id === id ? { ...e, ...updates } : e),
    });
  };

  const removeEducation = (id: string) => {
    update({ education: data.education.filter(e => e.id !== id) });
  };

  const addProject = () => {
    const proj: Project = {
      id: generateId(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: '',
    };
    update({ projects: [...(data.projects || []), proj] });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    update({
      projects: (data.projects || []).map(p => p.id === id ? { ...p, ...updates } : p),
    });
  };

  const removeProject = (id: string) => {
    update({ projects: (data.projects || []).filter(p => p.id !== id) });
  };

  const handleSkillsInput = (value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(Boolean);
    update({ skills });
  };

  const improveSummary = async () => {
    if (!data.summary) {
      toast.error('Please write a summary first');
      return;
    }
    setImprovingSection('summary');
    try {
      const improved = await improveSection('Professional Summary', data.summary, apiKey);
      update({ summary: improved });
      toast.success('Summary improved!');
    } catch (e) {
      toast.error('Could not improve summary');
    } finally {
      setImprovingSection(null);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: `Experience (${data.experience.length})` },
    { id: 'education', label: `Education (${data.education.length})` },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: `Projects (${data.projects?.length || 0})` },
  ];

  return (
    <div className="space-y-4">
      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSection === s.id
                ? 'bg-[var(--accent-primary)] text-white'
                : 'glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      {activeSection === 'personal' && (
        <FormSection title="Personal Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Full Name *" value={data.name} onChange={v => update({ name: v })} placeholder="John Smith" />
            <FormField label="Email *" value={data.email} onChange={v => update({ email: v })} placeholder="john@example.com" type="email" />
            <FormField label="Phone" value={data.phone} onChange={v => update({ phone: v })} placeholder="+1 (555) 000-0000" />
            <FormField label="Location" value={data.location} onChange={v => update({ location: v })} placeholder="San Francisco, CA" />
            <FormField label="LinkedIn URL" value={data.linkedin || ''} onChange={v => update({ linkedin: v })} placeholder="linkedin.com/in/johnsmith" />
            <FormField label="GitHub" value={data.github || ''} onChange={v => update({ github: v })} placeholder="github.com/johnsmith" />
            <FormField label="Website" value={data.website || ''} onChange={v => update({ website: v })} placeholder="johnsmith.com" className="sm:col-span-2" />
          </div>
        </FormSection>
      )}

      {/* Summary */}
      {activeSection === 'summary' && (
        <FormSection title="Professional Summary">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[var(--text-secondary)]">Summary</label>
              <button
                onClick={improveSummary}
                disabled={!!improvingSection}
                className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline disabled:opacity-50"
              >
                {improvingSection === 'summary' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Wand2 size={12} />
                )}
                AI Improve
              </button>
            </div>
            <textarea
              value={data.summary}
              onChange={e => update({ summary: e.target.value })}
              rows={5}
              placeholder="Results-driven professional with X years of experience in..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
            />
            <p className="text-xs text-[var(--text-muted)]">
              {data.summary.length} characters · Aim for 3-4 sentences
            </p>
          </div>
        </FormSection>
      )}

      {/* Experience */}
      {activeSection === 'experience' && (
        <FormSection title="Work Experience">
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={i}
                onUpdate={(updates) => updateExperience(exp.id, updates)}
                onRemove={() => removeExperience(exp.id)}
              />
            ))}
            <button
              onClick={addExperience}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
            >
              <Plus size={16} /> Add Experience
            </button>
          </div>
        </FormSection>
      )}

      {/* Education */}
      {activeSection === 'education' && (
        <FormSection title="Education">
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <EducationCard
                key={edu.id}
                edu={edu}
                index={i}
                onUpdate={(updates) => updateEducation(edu.id, updates)}
                onRemove={() => removeEducation(edu.id)}
              />
            ))}
            <button
              onClick={addEducation}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        </FormSection>
      )}

      {/* Skills */}
      {activeSection === 'skills' && (
        <FormSection title="Skills">
          <div className="space-y-2">
            <label className="text-xs text-[var(--text-secondary)]">
              Skills (comma-separated)
            </label>
            <textarea
              value={data.skills.join(', ')}
              onChange={e => handleSkillsInput(e.target.value)}
              rows={4}
              placeholder="JavaScript, React, Node.js, Python, SQL, Git..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
            />
            {data.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="pill bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </FormSection>
      )}

      {/* Projects */}
      {activeSection === 'projects' && (
        <FormSection title="Projects">
          <div className="space-y-4">
            {(data.projects || []).map((proj, i) => (
              <ProjectCard
                key={proj.id}
                proj={proj}
                index={i}
                onUpdate={(updates) => updateProject(proj.id, updates)}
                onRemove={() => removeProject(proj.id)}
              />
            ))}
            <button
              onClick={addProject}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        </FormSection>
      )}
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
      <h3 className="font-display font-semibold text-[var(--text-primary)] text-sm mb-4">{title}</h3>
      {children}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

function FormField({ label, value, onChange, placeholder, type = 'text', className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs text-[var(--text-secondary)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
      />
    </div>
  );
}

function ExperienceCard({
  exp,
  index,
  onUpdate,
  onRemove,
}: {
  exp: WorkExperience;
  index: number;
  onUpdate: (updates: Partial<WorkExperience>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--border-subtle)] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {exp.position || `Experience ${index + 1}`}
          </p>
          {exp.company && <p className="text-xs text-[var(--text-muted)]">{exp.company}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={15} className="text-[var(--text-muted)]" /> : <ChevronDown size={15} className="text-[var(--text-muted)]" />}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--border-subtle)] pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Job Title *" value={exp.position} onChange={v => onUpdate({ position: v })} placeholder="Software Engineer" />
            <FormField label="Company *" value={exp.company} onChange={v => onUpdate({ company: v })} placeholder="Acme Corp" />
            <FormField label="Start Date" value={exp.startDate} onChange={v => onUpdate({ startDate: v })} placeholder="Jan 2022" />
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--text-secondary)]">End Date</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={exp.current ? 'Present' : exp.endDate}
                  onChange={e => onUpdate({ endDate: e.target.value })}
                  disabled={exp.current}
                  placeholder="Dec 2023"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors disabled:opacity-50"
                />
                <label className="flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={e => onUpdate({ current: e.target.checked })}
                    className="accent-[#0ea5e9]"
                  />
                  Currently working here
                </label>
              </div>
            </div>
            <FormField label="Location" value={exp.location} onChange={v => onUpdate({ location: v })} placeholder="Remote" className="sm:col-span-2" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-secondary)]">Description</label>
            <textarea
              value={exp.description}
              onChange={e => onUpdate({ description: e.target.value })}
              rows={3}
              placeholder="Briefly describe your role and responsibilities..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-secondary)]">Key Achievements (one per line)</label>
            <textarea
              value={exp.achievements.join('\n')}
              onChange={e => onUpdate({ achievements: e.target.value.split('\n').filter(Boolean) })}
              rows={3}
              placeholder="• Increased revenue by 30%&#10;• Led team of 5 engineers&#10;• Reduced latency by 40%"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EducationCard({
  edu,
  index,
  onUpdate,
  onRemove,
}: {
  edu: Education;
  index: number;
  onUpdate: (updates: Partial<Education>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--border-subtle)] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {edu.degree ? `${edu.degree} in ${edu.field}` : `Education ${index + 1}`}
          </p>
          {edu.institution && <p className="text-xs text-[var(--text-muted)]">{edu.institution}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={15} className="text-[var(--text-muted)]" /> : <ChevronDown size={15} className="text-[var(--text-muted)]" />}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--border-subtle)] pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Institution *" value={edu.institution} onChange={v => onUpdate({ institution: v })} placeholder="MIT" className="sm:col-span-2" />
            <FormField label="Degree" value={edu.degree} onChange={v => onUpdate({ degree: v })} placeholder="Bachelor of Science" />
            <FormField label="Field of Study" value={edu.field} onChange={v => onUpdate({ field: v })} placeholder="Computer Science" />
            <FormField label="Start Date" value={edu.startDate} onChange={v => onUpdate({ startDate: v })} placeholder="Sep 2018" />
            <FormField label="End Date" value={edu.endDate} onChange={v => onUpdate({ endDate: v })} placeholder="May 2022" />
            <FormField label="GPA" value={edu.gpa || ''} onChange={v => onUpdate({ gpa: v })} placeholder="3.8/4.0" />
            <FormField label="Honors" value={edu.honors || ''} onChange={v => onUpdate({ honors: v })} placeholder="Cum Laude" />
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  proj,
  index,
  onUpdate,
  onRemove,
}: {
  proj: Project;
  index: number;
  onUpdate: (updates: Partial<Project>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--border-subtle)] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="text-sm font-medium text-[var(--text-primary)]">{proj.name || `Project ${index + 1}`}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onRemove(); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-rose)] hover:bg-[var(--accent-rose)]/10 transition-all"
          >
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronUp size={15} className="text-[var(--text-muted)]" /> : <ChevronDown size={15} className="text-[var(--text-muted)]" />}
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[var(--border-subtle)] pt-3">
          <FormField label="Project Name *" value={proj.name} onChange={v => onUpdate({ name: v })} placeholder="Portfolio Website" />
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--text-secondary)]">Description</label>
            <textarea
              value={proj.description}
              onChange={e => onUpdate({ description: e.target.value })}
              rows={2}
              placeholder="What does this project do?"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
            />
          </div>
          <FormField
            label="Technologies (comma-separated)"
            value={proj.technologies.join(', ')}
            onChange={v => onUpdate({ technologies: v.split(',').map(s => s.trim()).filter(Boolean) })}
            placeholder="React, Node.js, PostgreSQL"
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Live URL" value={proj.url || ''} onChange={v => onUpdate({ url: v })} placeholder="https://..." />
            <FormField label="GitHub URL" value={proj.github || ''} onChange={v => onUpdate({ github: v })} placeholder="github.com/..." />
          </div>
        </div>
      )}
    </div>
  );
}
