import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { content, type Language } from './data/content';
import { useLenis } from './hooks/useLenis';
import { LanguageToggle } from './components/LanguageToggle';
import { Hero } from './components/Hero';
import { Statement } from './components/Statement';
import { LiveShowcase } from './components/LiveShowcase';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'eslender-lang';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    // Ignore storage errors in restricted environments
  }
  return 'en';
}

export function App() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useLenis(false);

  const siteContent = content[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = siteContent.meta.title;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage errors in restricted environments
    }
  }, [language, siteContent.meta.title]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh bg-[#0A0A0E] text-[#F4F4F6]">
        <LanguageToggle
          language={language}
          onChange={setLanguage}
          ariaLabel={siteContent.languageToggle.ariaLabel}
          enLabel={siteContent.languageToggle.enLabel}
          esLabel={siteContent.languageToggle.esLabel}
        />

        <main>
          <Hero copy={siteContent.hero} />
          <Statement copy={siteContent.approach} />
          <LiveShowcase copy={siteContent.work} />
        </main>

        <Footer copy={siteContent.contact} />
      </div>
    </MotionConfig>
  );
}

export default App;
