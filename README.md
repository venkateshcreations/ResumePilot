# ✈️ ResumePilot AI

> AI-powered resume analyzer and builder — 100% client-side, privacy-first.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/resumepilot-ai)

---

## 🚀 Features

| Feature | Description |
|---|---|
| **Upload & Parse** | PDF, DOCX, TXT — browser-side parsing, no server |
| **AI Analysis** | ATS score, keyword gaps, structural feedback |
| **Resume Builder** | Form-based builder with live preview |
| **AI Enhancement** | Rewrite sections with Anthropic Claude |
| **3 Templates** | Modern, Minimal, Executive |
| **PDF Download** | One-click export via html2canvas + jsPDF |
| **Dashboard** | See scores, checklist, keyword gaps at a glance |
| **Dark/Light Mode** | Full theme toggle with persistence |
| **Privacy First** | Zero server storage — everything stays local |

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Animation**: Framer Motion ready
- **AI Layer**: Anthropic Claude API (optional) + smart demo fallback
- **File Parsing**: pdfjs-dist + mammoth.js
- **PDF Export**: html2canvas + jsPDF
- **Storage**: localStorage / IndexedDB

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open http://localhost:3000
```

---

## 🔑 AI Configuration (Optional)

ResumePilot AI works out-of-the-box with a smart demo analysis mode.

For full AI-powered analysis using Claude:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Open the app → click **API Settings** on the Analyze page
3. Enter your `sk-ant-...` key — it's saved locally only, never sent to any server

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm run build
# then push to GitHub and connect to Vercel
```

### Netlify

```bash
npm run build
# Set publish directory to: out
```

### GitHub Pages

```bash
npm run export
# Deploy the /out folder
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/         # Navbar, Layout
│   ├── ui/             # ScoreRing, UploadZone
│   └── resume/         # ResumePreview, AnalysisPanel, BuilderForm
├── pages/              # index, upload, builder, dashboard, preview
├── services/ai/        # Anthropic API integration
├── types/              # TypeScript interfaces
├── utils/
│   ├── parser/         # PDF/DOCX file parser
│   ├── storage.ts      # localStorage wrapper
│   └── downloadPDF.ts  # PDF export utility
└── styles/
    └── globals.css     # Tailwind + CSS variables
```

---

## 🎨 Design System

- **Font**: Syne (display) + DM Sans (body) + JetBrains Mono
- **Theme**: Dark-first with full light mode
- **Style**: Glassmorphism + gradient accents + CSS grid background
- **Colors**: Sky blue primary, violet secondary, amber accent

---

## 🔒 Privacy

- **No backend** — static export only
- **No analytics** — your data never leaves your device
- **LocalStorage only** — resume data stays in your browser
- **API keys stored locally** — never transmitted anywhere

---

## 📄 License

MIT — free to use, modify, and deploy.

---

Built with ❤️ using Next.js and Claude AI
