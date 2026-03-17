import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-powered resume analyzer and builder. Get instant ATS scores, keyword analysis, and AI-generated improvements. 100% private, runs in your browser." />
        <meta name="keywords" content="resume analyzer, ATS score, resume builder, AI resume, job application" />
        <meta property="og:title" content="ResumePilot AI — Supercharge Your Resume" />
        <meta property="og:description" content="AI-powered resume analysis, scoring, and optimization. 100% client-side." />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
        <title>ResumePilot AI</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
