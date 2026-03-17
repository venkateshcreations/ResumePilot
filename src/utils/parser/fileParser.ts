export async function parseFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return parsePDF(file);
  } else if (extension === 'docx' || extension === 'doc') {
    return parseDOCX(file);
  } else if (extension === 'txt') {
    return parseTXT(file);
  }

  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
}

async function parsePDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('PDF parse error:', error);
    throw new Error('Failed to parse PDF. Please try a different file.');
  }
}

async function parseDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error('DOCX parse error:', error);
    // Fallback: try reading as text
    return parseTXT(file);
  }
}

async function parseTXT(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function extractResumeStructure(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Simple heuristics for structure detection
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]/);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);

  return {
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0] || '',
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : '',
    rawText: text,
    lineCount: lines.length,
    wordCount: text.split(/\s+/).length,
  };
}
