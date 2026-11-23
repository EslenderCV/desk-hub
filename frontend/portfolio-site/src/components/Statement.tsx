import { motion } from 'framer-motion';
import type { SiteContent } from '../data/content';

interface StatementProps {
  copy: SiteContent['approach'];
}

export function Statement({ copy }: StatementProps) {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="px-6 sm:px-10 lg:px-[64px] pt-[84px] lg:pt-[116px] pb-[72px] lg:pb-[96px] flex flex-col gap-[56px] lg:gap-[70px]"
    >
      {/* Approach Introduction (Node 3:31) */}
      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[56px] w-full">
        <div className="lg:w-[232px] shrink-0">
          <p className="font-mono text-[12px] text-[#FF5500] uppercase">{copy.sectionLabel}</p>
        </div>

        <div className="flex-1 flex flex-col gap-[24px] lg:gap-[28px] min-w-0">
          <motion.h2
            id="approach-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
            className="font-syne font-extrabold text-[clamp(2.35rem,4.5vw,64px)] leading-none tracking-[-0.04em] text-[#F4F4F6]"
          >
            {copy.headingLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
            className="text-[17px] md:text-[20px] leading-[1.55] text-[#8A8A93] max-w-[850px]"
          >
            {copy.bio}
          </motion.p>
        </div>
      </div>

      {/* Technology Strip (Node 3:37) */}
      <div className="flex flex-col gap-[30px] w-full">
        <div className="h-px w-full bg-[#222228]" aria-hidden="true" />

        <div className="flex flex-col md:flex-row items-stretch md:items-start gap-8 md:gap-[32px] w-full">
          {copy.disciplines.map((item, idx) => (
            <div key={item.number} className="contents">
              {idx > 0 && (
                <div
                  className="hidden md:block h-[108px] w-px bg-[#222228] shrink-0"
                  aria-hidden="true"
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.08,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="flex-1 flex flex-col gap-[16px] md:gap-[20px] min-w-0"
              >
                <div className="flex items-center gap-[16px] font-mono text-[12px]">
                  <span className="text-[#FF5500]">{item.number}</span>
                  <span className="text-[#F4F4F6]">{item.title}</span>
                </div>

                <div className="text-[16px] md:text-[18px] leading-[1.65] text-[#8A8A93]">
                  <p>{item.lines[0]}</p>
                  <p>{item.lines[1]}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-[#222228]" aria-hidden="true" />
      </div>
    </section>
  );
}
