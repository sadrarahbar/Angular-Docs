import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Angular Docs",
  description: "A local documentation browser for Angular markdown content.",
};

const themeScript = `
(() => {
  try {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : 'dark';
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const params = new URLSearchParams(location.search);
    const urlLanguage = params.get('lang');
    const savedLanguage = localStorage.getItem('language');
    const language = urlLanguage === 'fa' || urlLanguage === 'en'
      ? urlLanguage
      : (savedLanguage === 'fa' || savedLanguage === 'en' ? savedLanguage : 'en');
    localStorage.setItem('language', language);

    if (!urlLanguage && language === 'fa') {
      params.set('lang', 'fa');
      const query = params.toString();
      location.replace(location.pathname + (query ? '?' + query : '') + location.hash);
    }
  } catch {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
