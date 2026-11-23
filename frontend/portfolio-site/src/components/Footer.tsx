import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Github, Linkedin } from 'lucide-react';
import type { SiteContent } from '../data/content';
import { Magnetic } from './Magnetic';

interface FooterProps {
  copy: SiteContent['contact'];
}

export function Footer({ copy }: FooterProps) {
  const [copied, setCopied] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(copy.email);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = copy.email;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <footer className="bg-[#050507] px-6 sm:px-10 lg:px-[64px] pt-[68px] pb-[32px] flex flex-col gap-[40px] lg:gap-[46px]">
      {/* Top Contact Intro Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 font-mono text-[12px]">
        <span className="text-[#FF5500]">{copy.sectionLabel}</span>

        <div className="leading-[1.35] text-[#8A8A93]">
          <p>{copy.introLine1}</p>
          <p>{copy.introLine2}</p>
        </div>
      </div>

      {/* Massive LET'S BUILD CTA + 116x116 Hover Arrow (Nodes 3:1102 / 3:1106) */}
      <Magnetic strength={0.08} className="w-full">
        <a
          href={`mailto:${copy.email}`}
          onClick={(e) => {
            e.preventDefault();
            handleCopyEmail();
          }}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
          className="group flex items-center justify-between gap-6 w-full py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
        >
          <span
            className={`font-display text-[clamp(3.25rem,10.7vw,154px)] leading-[0.9] tracking-[-0.04em] transition-colors duration-300 ${
              ctaHovered ? 'text-[#FF5500]' : 'text-[#F4F4F6]'
            }`}
          >
            {copy.ctaText}
          </span>

          <span className="relative shrink-0 w-[56px] h-[56px] sm:w-[84px] sm:h-[84px] lg:w-[116px] lg:h-[116px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
            <img
              src={
                ctaHovered
                  ? '/assets/figma/contact-arrow-hover.svg'
                  : '/assets/figma/contact-arrow.svg'
              }
              alt=""
              width={116}
              height={116}
              className="w-full h-full"
            />
          </span>
        </a>
      </Magnetic>

      {/* Direct Contact Email Copy Pill + Location */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <button
          type="button"
          onClick={handleCopyEmail}
          aria-live="polite"
          className="inline-flex items-center gap-[22px] self-start rounded-[40px] border border-[#222228] bg-[#141418] px-[20px] py-[15px] text-[16px] sm:text-[18px] text-[#F4F4F6] hover:border-[#FF5500] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-[#A3E635]"
              >
                {copy.copiedLabel}
              </motion.span>
            ) : (
              <motion.span
                key="email"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {copy.email}
              </motion.span>
            )}
          </AnimatePresence>

          {copied ? (
            <Check className="w-[17px] h-[18px] text-[#A3E635] shrink-0" />
          ) : (
            <img
              src="/assets/figma/copy-email.svg"
              alt=""
              width={17}
              height={18}
              className="w-[17px] h-[18px] shrink-0"
            />
          )}
        </button>

        <div className="font-mono text-[12px] leading-[1.35] text-[#8A8A93]">
          <p>{copy.locationLine1}</p>
          <p>{copy.locationLine2}</p>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="h-px w-full bg-[#222228]" aria-hidden="true" />

      {/* Bottom Social Links & Copyright */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-[20px] sm:gap-[30px] text-[14px]">
          {copy.socials.map((social, idx) => (
            <div key={social.id} className="contents">
              {idx > 0 && (
                <span className="text-[#8A8A93] select-none" aria-hidden="true">
                  ·
                </span>
              )}
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-[#F4F4F6] hover:text-[#FF5500] transition-colors"
              >
                {social.id === 'github' ? (
                  <Github className="w-4 h-4 stroke-[1.75] text-[#8A8A93] group-hover:text-[#FF5500] transition-colors" aria-hidden="true" />
                ) : (
                  <Linkedin className="w-4 h-4 stroke-[1.75] text-[#8A8A93] group-hover:text-[#FF5500] transition-colors" aria-hidden="true" />
                )}
                <span>{social.label}</span>
              </a>
            </div>
          ))}

          <span className="text-[#8A8A93] select-none" aria-hidden="true">
            ·
          </span>
          <span className="text-[#FF5500]">{copy.domainText}</span>
        </div>

        <p className="font-mono text-[12px] text-[#8A8A93]">{copy.copyright}</p>
      </div>
    </footer>
  );
}
