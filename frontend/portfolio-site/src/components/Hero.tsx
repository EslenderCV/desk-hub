import { useRef, useState, type MouseEvent } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import type { SiteContent } from '../data/content';

interface HeroProps {
  copy: SiteContent['hero'];
}

export function Hero({ copy }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, { stiffness: 75, damping: 24, mass: 0.4 });
  const glowY = useSpring(mouseY, { stiffness: 75, damping: 24, mass: 0.4 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.88], [1, 0.15]);

  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    mouseX.set(dx * 0.18);
    mouseY.set(dy * 0.15);
  };

  const letters = copy.name.split('');

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      aria-label={copy.name}
      className="relative bg-[#050507] min-h-[760px] lg:min-h-[900px] h-dvh flex flex-col justify-between pt-[36px] lg:pt-[44px] pb-[28px] lg:pb-[36px] px-6 sm:px-10 lg:px-[64px] overflow-clip"
    >
      {/* Backlight Glow + Transparent PNG Portrait Layer (z-10) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center overflow-hidden"
      >
        {/* Warm burnt-orange editorial radial backlight */}
        <motion.div
          style={{ x: glowX, y: glowY }}
          animate={{
            opacity: isHovered ? 0.92 : 0.78,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-[2%] w-[520px] h-[520px] sm:w-[680px] sm:h-[680px] lg:w-[820px] lg:h-[760px] will-change-transform"
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 48%, rgba(255, 85, 0, 0.68) 0%, rgba(196, 58, 0, 0.34) 44%, rgba(5, 5, 7, 0) 74%)',
            }}
          />
        </motion.div>

        {/* User's transparent PNG portrait anchored flush to top edge */}
        <motion.div
          style={{ scale: portraitScale, y: portraitY, opacity: portraitOpacity }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.05, ease: [0.19, 1, 0.22, 1] }}
          className="relative top-0 flex items-start justify-center w-full h-full origin-top will-change-transform"
        >
          <img
            src="/portrait.png"
            alt={copy.portraitAlt}
            width={1024}
            height={765}
            {...({ fetchpriority: 'high' } as Record<string, unknown>)}
            className="hero-cutout-mask h-[92dvh] sm:h-[96dvh] lg:h-full max-h-none w-auto max-w-none object-contain object-top origin-top select-none"
          />
        </motion.div>
      </div>

      {/* Top & Bottom Portrait Edge Fades matching Figma 3:11 and 3:10 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[170px] z-20 bg-gradient-to-b from-[#050507] to-[rgba(5,5,7,0)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] z-20 bg-gradient-to-b from-[rgba(5,5,7,0)] via-[rgba(5,5,7,0.65)] via-[70%] to-[#050507]"
      />

      {/* Top Identity Row (Node 3:12) — right space reserved for EN/ES toggle */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-30 flex items-start justify-between pr-28"
      >
        <div className="flex flex-col items-start">
          <p className="font-mono text-[11px] sm:text-[12px] tracking-[0.36px] text-[#F4F4F6] uppercase">
            {copy.roleLocation}
          </p>
        </div>
      </motion.div>

      {/* Bottom Name & Signature Lockup (Node 3:22) */}
      <motion.div
        style={{ y: titleY }}
        className="relative z-30 flex flex-col gap-[24px] lg:gap-[34px] w-full will-change-transform"
      >
        <h1 className="font-display font-normal text-[#F4F4F6] text-[clamp(3.75rem,12.5vw,180px)] leading-[0.9] tracking-[-0.04em] uppercase flex flex-wrap">
          <span className="sr-only">{copy.name}</span>
          {letters.map((char, idx) => (
            <span key={`${idx}-${char}`} className="inline-block overflow-hidden" aria-hidden="true">
              <motion.span
                initial={{ y: '108%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: 0.85,
                  delay: 0.1 + idx * 0.045,
                  ease: [0.19, 1, 0.22, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 font-mono text-[11px] sm:text-[12px] text-[#8A8A93]"
        >
          <div className="leading-[1.35]">
            <p>{copy.sigLeftLine1}</p>
            <p>{copy.sigLeftLine2}</p>
          </div>

          <div className="leading-[1.35] sm:text-center">
            <p>{copy.sigCenterLine1}</p>
            <p>{copy.sigCenterLine2}</p>
          </div>

          <a
            href="#approach"
            className="group inline-flex items-center gap-[15px] text-[#8A8A93] hover:text-[#F4F4F6] transition-colors self-start sm:self-end"
          >
            <span>{copy.scrollCue}</span>
            <motion.img
              src="/assets/figma/scroll-down.svg"
              alt=""
              width={18}
              height={26}
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[18px] h-[26px] shrink-0"
            />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
