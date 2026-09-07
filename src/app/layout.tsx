import type { Metadata } from 'next';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ResearchFlow — Multi-Agent Research & Report Generator',
  description:
    'Multi-Agent AI Research & Report Generator - Collaborative planning, multi-agent parallel web research, real-time synthesis, and automated claim verification.',
  openGraph: {
    title: 'ResearchFlow — Multi-Agent Research & Report Generator',
    description:
      'Multi-Agent AI Research & Report Generator - Collaborative planning, multi-agent parallel web research, real-time synthesis, and automated claim verification.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#F2FAFF] text-[#0F2027] antialiased selection:bg-[#1B61EB]/20 selection:text-[#0F2027]">
        {children}
      </body>
    </html>
  );
}
