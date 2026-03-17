import { ResumeData } from '@/types';

export async function downloadAsPDF(elementId: string, filename: string = 'resume.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('PDF download error:', error);
    throw error;
  }
}

export function generateResumeHTML(data: ResumeData, template: string = 'modern'): string {
  const templates: Record<string, string> = {
    modern: generateModernTemplate(data),
    minimal: generateMinimalTemplate(data),
    executive: generateExecutiveTemplate(data),
  };

  return templates[template] || templates.modern;
}

function generateModernTemplate(data: ResumeData): string {
  return `
    <div class="resume-modern" style="font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1e293b;">
      <header style="border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 24px;">
        <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 4px; color: #0f172a;">${data.name}</h1>
        <p style="font-size: 14px; color: #475569; margin: 0;">
          ${[data.email, data.phone, data.location].filter(Boolean).join(' • ')}
          ${data.linkedin ? ` • ${data.linkedin}` : ''}
        </p>
      </header>
      
      ${data.summary ? `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0ea5e9; margin: 0 0 8px;">Summary</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">${data.summary}</p>
        </section>
      ` : ''}
      
      ${data.experience.length > 0 ? `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0ea5e9; margin: 0 0 12px;">Experience</h2>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3 style="font-size: 16px; font-weight: 600; margin: 0; color: #0f172a;">${exp.position}</h3>
                <span style="font-size: 12px; color: #64748b;">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p style="font-size: 14px; color: #475569; margin: 2px 0 6px; font-style: italic;">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</p>
              ${exp.description ? `<p style="font-size: 13px; line-height: 1.5; color: #334155; margin: 0 0 4px;">${exp.description}</p>` : ''}
              ${exp.achievements.length > 0 ? `
                <ul style="margin: 4px 0 0 16px; padding: 0;">
                  ${exp.achievements.map(a => `<li style="font-size: 13px; line-height: 1.5; color: #334155; margin-bottom: 2px;">${a}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${data.education.length > 0 ? `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0ea5e9; margin: 0 0 12px;">Education</h2>
          ${data.education.map(edu => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <h3 style="font-size: 15px; font-weight: 600; margin: 0; color: #0f172a;">${edu.degree} in ${edu.field}</h3>
                <span style="font-size: 12px; color: #64748b;">${edu.startDate} – ${edu.endDate}</span>
              </div>
              <p style="font-size: 13px; color: #475569; margin: 2px 0 0; font-style: italic;">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</p>
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${data.skills.length > 0 ? `
        <section>
          <h2 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0ea5e9; margin: 0 0 8px;">Skills</h2>
          <p style="font-size: 13px; color: #334155; line-height: 1.6;">${data.skills.join(' • ')}</p>
        </section>
      ` : ''}
    </div>
  `;
}

function generateMinimalTemplate(data: ResumeData): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 48px; color: #1a1a1a;">
      <header style="margin-bottom: 32px;">
        <h1 style="font-size: 32px; font-weight: 300; letter-spacing: -0.5px; margin: 0 0 8px;">${data.name}</h1>
        <p style="font-size: 13px; color: #666; letter-spacing: 0.02em;">
          ${[data.email, data.phone, data.location].filter(Boolean).join('  |  ')}
        </p>
      </header>
      ${data.summary ? `<p style="font-size: 14px; line-height: 1.7; color: #444; margin-bottom: 32px; border-left: 2px solid #000; padding-left: 16px;">${data.summary}</p>` : ''}
      ${data.experience.length > 0 ? `
        <section style="margin-bottom: 28px;">
          <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 16px; color: #000;">Experience</h2>
          ${data.experience.map(exp => `
            <div style="margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="font-size: 15px;">${exp.position}</strong>
                <span style="font-size: 12px; color: #888;">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <p style="font-size: 13px; color: #666; margin: 2px 0 6px;">${exp.company}</p>
              ${exp.description ? `<p style="font-size: 13px; color: #333; line-height: 1.6;">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
      ${data.skills.length > 0 ? `
        <section>
          <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin: 0 0 12px;">Skills</h2>
          <p style="font-size: 13px; color: #333;">${data.skills.join(', ')}</p>
        </section>
      ` : ''}
    </div>
  `;
}

function generateExecutiveTemplate(data: ResumeData): string {
  return generateModernTemplate(data); // Use modern as fallback
}
