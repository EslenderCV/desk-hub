import { motion } from 'framer-motion';
import type { Language } from '../data/content';
import { Magnetic } from './Magnetic';

interface LanguageToggleProps {
  language: Language;
  onChange: (lang: Language) => void;
  ariaLabel: string;
  enLabel: string;
  esLabel: string;
}

export function LanguageToggle({
  language,
  onChange,
  ariaLabel,
  enLabel,
  esLabel,
}: LanguageToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
      className="fixed top-[28px] right-6 sm:right-10 lg:top-[44px] lg:right-[64px] z-50"
    >
      <Magnetic strength={0.2}>
        <div
          role="group"
          aria-label={ariaLabel}
          className="inline-flex items-center gap-[12px] rounded-[30px] border border-[#222228] bg-[#050507]/85 backdrop-blur-md px-[18px] py-[11px] font-mono text-[12px] leading-none"
        >
          <button
            type="button"
            onClick={() => onChange('en')}
            aria-pressed={language === 'en'}
            className={`transition-colors duration-200 focus:outline-none focus-visible:underline ${
              language === 'en' ? 'text-[#F4F4F6]' : 'text-[#8A8A93] hover:text-[#F4F4F6]'
            }`}
          >
            {enLabel}
          </button>

          <span className="text-[#8A8A93] select-none" aria-hidden="true">
            /
          </span>

          <button
            type="button"
            onClick={() => onChange('es')}
            aria-pressed={language === 'es'}
            className={`transition-colors duration-200 focus:outline-none focus-visible:underline ${
              language === 'es' ? 'text-[#F4F4F6]' : 'text-[#8A8A93] hover:text-[#F4F4F6]'
            }`}
          >
            {esLabel}
          </button>
        </div>
      </Magnetic>
    </motion.div>
  );
}
