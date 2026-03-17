import React from 'react';
import { ResumeData } from '@/types';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  id?: string;
}

export function ResumePreview({ data, template = 'modern', id = 'resume-preview' }: ResumePreviewProps) {
  if (template === 'minimal') return <MinimalTemplate data={data} id={id} />;
  if (template === 'executive') return <ExecutiveTemplate data={data} id={id} />;
  return <ModernTemplate data={data} id={id} />;
}

function ModernTemplate({ data, id }: { data: ResumeData; id: string }) {
  return (
    <div
      id={id}
      className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl"
      style={{ fontFamily: 'Georgia, serif', minHeight: '1050px' }}
    >
      {/* Header */}
      <div className="px-10 pt-10 pb-6 border-b-[3px] border-[#0ea5e9]">
        <h1 className="text-3xl font-bold text-gray-900 mb-1.5" style={{ fontFamily: 'sans-serif' }}>
          {data.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail size={13} /> {data.email}
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone size={13} /> {data.phone}
            </span>
          )}
          {data.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {data.location}
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin size={13} /> {data.linkedin}
            </span>
          )}
          {data.github && (
            <span className="flex items-center gap-1">
              <Github size={13} /> {data.github}
            </span>
          )}
          {data.website && (
            <span className="flex items-center gap-1">
              <Globe size={13} /> {data.website}
            </span>
          )}
        </div>
      </div>

      <div className="px-10 py-6 space-y-5">
        {/* Summary */}
        {data.summary && (
          <section>
            <SectionHeader label="Professional Summary" />
            <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section>
            <SectionHeader label="Work Experience" />
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                        {exp.position}
                      </h3>
                      <p className="text-sm text-gray-500 italic">
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm leading-relaxed text-gray-600 mt-1.5">{exp.description}</p>
                  )}
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-1.5 space-y-1">
                      {exp.achievements.map((a, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-[#0ea5e9] mt-0.5">▸</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section>
            <SectionHeader label="Education" />
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-sm text-gray-500 italic">
                      {edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills?.length > 0 && (
          <section>
            <SectionHeader label="Skills" />
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <section>
            <SectionHeader label="Projects" />
            <div className="space-y-3">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-sm text-gray-900" style={{ fontFamily: 'sans-serif' }}>
                      {proj.name}
                    </h3>
                    {proj.technologies.length > 0 && (
                      <span className="text-xs text-gray-400">({proj.technologies.join(', ')})</span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <section>
            <SectionHeader label="Certifications" />
            <div className="space-y-1.5">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-800">{cert.name}</span>
                    <span className="text-sm text-gray-500"> · {cert.issuer}</span>
                  </div>
                  <span className="text-xs text-gray-400">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-[#0ea5e9] mb-2.5" style={{ fontFamily: 'sans-serif' }}>
      {label}
    </h2>
  );
}

function MinimalTemplate({ data, id }: { data: ResumeData; id: string }) {
  return (
    <div
      id={id}
      className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl p-12"
      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', minHeight: '1050px' }}
    >
      <div className="mb-8">
        <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">{data.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {[data.email, data.phone, data.location].filter(Boolean).join('  ·  ')}
        </div>
      </div>
      {data.summary && (
        <p className="text-sm leading-relaxed text-gray-600 border-l-2 border-gray-900 pl-4 mb-8">{data.summary}</p>
      )}
      {data.experience?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-4">Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between">
                <strong className="text-base">{exp.position}</strong>
                <span className="text-xs text-gray-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p className="text-sm text-gray-500 mb-1.5">{exp.company}</p>
              {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {data.skills?.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900 mb-3">Skills</h2>
          <p className="text-sm text-gray-600">{data.skills.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function ExecutiveTemplate({ data, id }: { data: ResumeData; id: string }) {
  return (
    <div
      id={id}
      className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-2xl"
      style={{ fontFamily: 'Georgia, serif', minHeight: '1050px' }}
    >
      <div className="bg-gray-900 text-white px-10 py-8">
        <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'sans-serif' }}>{data.name || 'Your Name'}</h1>
        {data.experience?.[0]?.position && (
          <p className="text-gray-400 text-sm mb-3">{data.experience[0].position}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          {[data.email, data.phone, data.location].filter(Boolean).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
      <div className="px-10 py-6 space-y-5">
        {data.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>Executive Summary</h2>
            <p className="text-sm leading-relaxed text-gray-600">{data.summary}</p>
          </section>
        )}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3" style={{ fontFamily: 'sans-serif' }}>Career History</h2>
            {data.experience.map(exp => (
              <div key={exp.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-base" style={{ fontFamily: 'sans-serif' }}>{exp.position}</h3>
                  <span className="text-xs text-gray-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-sm text-gray-500 italic mb-1">{exp.company}</p>
                {exp.description && <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </section>
        )}
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2" style={{ fontFamily: 'sans-serif' }}>Core Competencies</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded bg-gray-100 text-gray-700">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
