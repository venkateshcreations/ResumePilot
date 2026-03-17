import { ResumeAnalysis, ResumeData, AnalysisSuggestion } from '@/types';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string,
  apiKey?: string
): Promise<ResumeAnalysis> {
  const prompt = buildAnalysisPrompt(resumeText, jobDescription);

  try {
    if (apiKey) {
      return await callAnthropicAPI(prompt, apiKey);
    }
    // Fallback to mock analysis for demo
    return generateMockAnalysis(resumeText);
  } catch (error) {
    console.error('AI analysis error:', error);
    return generateMockAnalysis(resumeText);
  }
}

export async function generateResume(
  resumeData: ResumeData,
  apiKey?: string
): Promise<ResumeData> {
  const prompt = buildGenerationPrompt(resumeData);

  try {
    if (apiKey) {
      const improved = await callAnthropicAPIForGeneration(prompt, apiKey);
      return improved;
    }
    return enhanceResumeLocally(resumeData);
  } catch (error) {
    console.error('Resume generation error:', error);
    return enhanceResumeLocally(resumeData);
  }
}

export async function improveSection(
  section: string,
  content: string,
  apiKey?: string
): Promise<string> {
  if (!apiKey) return content;

  const prompt = `You are an expert resume writer. Improve this ${section} section to be more impactful, ATS-friendly, and professional. Use strong action verbs and quantify achievements where possible.

Current content:
${content}

Return only the improved content, no explanations.`;

  try {
    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    return data.content?.[0]?.text || content;
  } catch {
    return content;
  }
}

async function callAnthropicAPI(prompt: string, apiKey: string): Promise<ResumeAnalysis> {
  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return generateMockAnalysis('');
}

async function callAnthropicAPIForGeneration(prompt: string, apiKey: string): Promise<ResumeData> {
  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // fallback
  }

  return {} as ResumeData;
}

function buildAnalysisPrompt(resumeText: string, jobDescription?: string): string {
  return `You are an expert ATS resume analyzer and career coach. Analyze this resume and return a JSON object with the following structure.

Resume Text:
${resumeText}

${jobDescription ? `Job Description:\n${jobDescription}` : ''}

Return ONLY a JSON object matching this exact structure:
{
  "score": <overall score 0-100>,
  "atsScore": <ATS compatibility score 0-100>,
  "keywordsScore": <keywords score 0-100>,
  "structureScore": <structure score 0-100>,
  "contentScore": <content quality score 0-100>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "suggestions": [
    {
      "category": "content",
      "priority": "high",
      "title": "Title",
      "description": "Detailed suggestion"
    }
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "detectedKeywords": ["found1", "found2"],
  "actionItems": [
    { "id": "1", "text": "Action item", "completed": false, "priority": "high" }
  ]
}`;
}

function buildGenerationPrompt(resumeData: ResumeData): string {
  return `You are an expert resume writer. Enhance this resume data to make it more impactful, ATS-friendly, and professional. Return improved JSON in the same structure.

Current Resume:
${JSON.stringify(resumeData, null, 2)}

Improve: summary, experience descriptions, skills list, and achievement bullets. Use strong action verbs, quantify results where possible, and optimize for ATS. Return ONLY the JSON.`;
}

function generateMockAnalysis(text: string): ResumeAnalysis {
  const wordCount = text.split(/\s+/).length;
  const hasQuantifiedAchievements = /\d+%|\$\d+|\d+ years|\d+ projects/i.test(text);
  const hasActionVerbs = /led|managed|developed|created|implemented|designed|optimized/i.test(text);

  const baseScore = Math.min(45 + (wordCount / 10) + (hasQuantifiedAchievements ? 15 : 0) + (hasActionVerbs ? 10 : 0), 85);

  return {
    score: Math.round(baseScore),
    atsScore: Math.round(baseScore - 5 + Math.random() * 10),
    keywordsScore: Math.round(baseScore - 8 + Math.random() * 15),
    structureScore: Math.round(baseScore + 5 + Math.random() * 8),
    contentScore: Math.round(baseScore - 3 + Math.random() * 10),
    strengths: [
      'Clear professional structure detected',
      'Contact information is well-formatted',
      'Work history is chronologically organized',
      hasActionVerbs ? 'Strong action verbs present' : 'Education section is complete',
    ],
    weaknesses: [
      'Quantified achievements could be stronger',
      'Summary section needs more impact',
      'Missing some industry-specific keywords',
    ],
    suggestions: [
      {
        category: 'content',
        priority: 'high',
        title: 'Quantify Your Achievements',
        description: 'Add specific numbers, percentages, and metrics to demonstrate the impact of your work. E.g., "Increased sales by 35%" instead of "Improved sales".',
      },
      {
        category: 'keywords',
        priority: 'high',
        title: 'Add Industry Keywords',
        description: 'Include more role-specific keywords from job descriptions in your target industry to improve ATS pass rates.',
      },
      {
        category: 'structure',
        priority: 'medium',
        title: 'Strengthen Your Summary',
        description: 'Your professional summary should be a powerful 3-4 sentence pitch highlighting your top skills, years of experience, and unique value proposition.',
      },
      {
        category: 'ats',
        priority: 'medium',
        title: 'Use Standard Section Headers',
        description: 'Ensure section headers like "Work Experience", "Education", and "Skills" are clearly labeled so ATS systems can parse them correctly.',
      },
      {
        category: 'formatting',
        priority: 'low',
        title: 'Consistent Date Formatting',
        description: 'Use a consistent date format throughout (e.g., "Jan 2022 – Present") to maintain professionalism.',
      },
    ] as AnalysisSuggestion[],
    missingKeywords: [
      'leadership', 'agile', 'cross-functional', 'stakeholder management',
      'data-driven', 'scalable', 'ROI', 'KPI',
    ],
    detectedKeywords: [
      'development', 'team', 'management', 'project',
      'experience', 'skills', 'communication',
    ],
    actionItems: [
      { id: '1', text: 'Add metrics to at least 3 bullet points', completed: false, priority: 'high' },
      { id: '2', text: 'Rewrite professional summary', completed: false, priority: 'high' },
      { id: '3', text: 'Add 5+ relevant industry keywords', completed: false, priority: 'high' },
      { id: '4', text: 'Ensure consistent formatting throughout', completed: false, priority: 'medium' },
      { id: '5', text: 'Add LinkedIn URL to contact section', completed: false, priority: 'medium' },
      { id: '6', text: 'Remove personal photo if included', completed: false, priority: 'low' },
    ],
  };
}

function enhanceResumeLocally(data: ResumeData): ResumeData {
  const enhancedSummary = data.summary
    ? `Results-driven ${data.experience[0]?.position || 'professional'} with proven expertise in delivering high-impact solutions. ${data.summary}`
    : data.summary;

  return {
    ...data,
    summary: enhancedSummary,
    experience: data.experience.map(exp => ({
      ...exp,
      description: exp.description,
    })),
  };
}
