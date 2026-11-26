import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Lock, MousePointerClick } from 'lucide-react';
import type { ProjectConfig, SiteContent } from '../data/content';

interface LiveShowcaseProps {
  copy: SiteContent['work'];
}

type PreviewMode = 'desktop' | 'mobile' | 'system';

function LiveIframeApp({
  mobile,
  liveUrl,
  title,
  accentColor,
}: {
  mobile?: boolean;
  liveUrl: string;
  title: string;
  accentColor: string;
}) {
  const [isInteractive, setIsInteractive] = useState(false);

  if (mobile) {
    return (
      <div className="bg-[#0D0D11] flex h-[510px] items-center justify-center p-4 w-full">
        <div className="relative bg-[#101014] border-[5px] border-[#3E3E45] flex h-[466px] items-start overflow-hidden rounded-[20px] w-[336px] shadow-2xl">
          <iframe
            src={liveUrl}
            title={`${title} Mobile Live Preview`}
            loading="lazy"
            className={`w-full h-full border-0 bg-[#101014] ${
              isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          />

          {!isInteractive ? (
            <button
              type="button"
              onClick={() => setIsInteractive(true)}
              className="group absolute inset-0 z-10 flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-[#050507]/80 via-transparent to-transparent cursor-pointer focus:outline-none"
            >
              <span
                style={{ backgroundColor: accentColor }}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] font-medium text-[#050507] shadow-lg transition-transform duration-200 group-hover:scale-105"
              >
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>CLICK TO INTERACT</span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsInteractive(false)}
              style={{ color: accentColor }}
              className="absolute top-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#050507]/90 border border-[#222228] px-3 py-1 font-mono text-[10px] hover:border-current transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>LOCK</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-[#101014] h-[510px] w-full overflow-hidden">
      <iframe
        src={liveUrl}
        title={title}
        loading="lazy"
        className={`w-full h-full border-0 bg-[#101014] ${
          isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      />

      {!isInteractive ? (
        <button
          type="button"
          onClick={() => setIsInteractive(true)}
          className="group absolute inset-0 z-10 flex flex-col items-center justify-end pb-7 bg-gradient-to-t from-[#050507]/75 via-transparent to-transparent cursor-pointer focus:outline-none"
        >
          <span
            style={{ backgroundColor: accentColor }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] font-medium text-[#050507] shadow-xl transition-transform duration-200 group-hover:scale-105"
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>CLICK TO INTERACT WITH LIVE SITE</span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsInteractive(false)}
          style={{ color: accentColor }}
          className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#050507]/90 border border-[#222228] px-3.5 py-1.5 font-mono text-[10px] hover:border-current transition-colors shadow-lg"
        >
          <Lock className="w-3 h-3" />
          <span>LOCK SCROLL</span>
        </button>
      )}
    </div>
  );
}

function ProjectPreviewCard({
  project,
  copy,
}: {
  project: ProjectConfig;
  copy: SiteContent['work'];
}) {
  const [mode, setMode] = useState<PreviewMode>('desktop');

  const isLive = mode === 'desktop' || mode === 'mobile';
  const isSystem = mode === 'system';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
      className="px-6 sm:px-10 lg:px-[64px] pb-[72px] lg:pb-[94px] flex flex-col gap-[26px] lg:gap-[30px]"
    >
      <div className="h-px w-full bg-[#222228]" aria-hidden="true" />

      {/* Project Identity Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex flex-col gap-[14px] lg:gap-[16px]">
          <p
            style={{ color: project.accentColor }}
            className="font-mono text-[12px] uppercase"
          >
            {project.kicker}
          </p>

          <div className="flex items-center gap-[18px] sm:gap-[22px]">
            <h3 className="font-display text-[clamp(2.75rem,4.6vw,66px)] leading-none tracking-[-0.04em] text-[#F4F4F6]">
              {project.title}
            </h3>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.title} — ${copy.openLiveLabel}`}
              className="shrink-0 transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5"
            >
              <img
                src={project.externalIcon}
                alt=""
                width={36}
                height={36}
                className="w-[30px] h-[30px] sm:w-[36px] sm:h-[36px]"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] lg:w-[520px]">
          <p className="font-medium text-[18px] sm:text-[20px] leading-[1.3] text-[#F4F4F6]">
            {project.headline}
          </p>
          <p className="text-[15px] sm:text-[16px] leading-[1.45] text-[#8A8A93]">
            {project.subline}
          </p>
        </div>
      </div>

      {/* Interactive Preview Stage */}
      <div className="bg-[#141418] border border-[#222228] rounded-[8px] overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="min-h-[62px] bg-[#141418] px-4 sm:px-[24px] py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Preview Tabs */}
          <div className="flex items-center gap-4 sm:gap-[26px] font-mono text-[11px] sm:text-[12px]">
            <button
              type="button"
              onClick={() => setMode(mode === 'mobile' ? 'mobile' : 'desktop')}
              className={`transition-colors ${
                isLive ? 'text-[#F4F4F6]' : 'text-[#8A8A93] hover:text-[#F4F4F6]'
              }`}
            >
              {copy.liveTabLabel}
            </button>

            <span className="text-[#45454C]" aria-hidden="true">
              |
            </span>

            <button
              type="button"
              onClick={() => setMode('system')}
              style={isSystem ? { color: project.accentColor } : undefined}
              className={`transition-colors ${
                isSystem ? '' : 'text-[#8A8A93] hover:text-[#F4F4F6]'
              }`}
            >
              {copy.systemTabLabel}
            </button>
          </div>

          {/* Viewport Toggle */}
          <div className="flex items-center gap-[20px] text-[12px]">
            <button
              type="button"
              onClick={() => setMode('desktop')}
              className={`transition-colors ${
                mode === 'desktop'
                  ? 'text-[#F4F4F6]'
                  : 'text-[#8A8A93] hover:text-[#F4F4F6]'
              }`}
            >
              {copy.desktopLabel}
            </button>
            <button
              type="button"
              onClick={() => setMode('mobile')}
              className={`transition-colors ${
                mode === 'mobile'
                  ? 'text-[#F4F4F6]'
                  : 'text-[#8A8A93] hover:text-[#F4F4F6]'
              }`}
            >
              {copy.mobileLabel}
            </button>
          </div>

          {/* Open Live & GitHub Actions */}
          <div className="flex items-center gap-5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#8A8A93] hover:text-[#F4F4F6] transition-colors"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GITHUB</span>
              </a>
            )}

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-[10px] font-mono text-[11px] text-[#F4F4F6] hover:opacity-80 transition-opacity"
            >
              <span>{copy.openLiveLabel}</span>
              <img
                src="/assets/figma/external-link-sm.svg"
                alt=""
                width={14}
                height={14}
                className="w-[14px] h-[14px]"
              />
            </a>
          </div>
        </div>

        <div className="h-px w-full bg-[#222228]" aria-hidden="true" />

        {/* View Content */}
        <AnimatePresence mode="wait">
          {mode !== 'system' ? (
            <motion.div
              key={`${project.id}-${mode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <LiveIframeApp
                mobile={mode === 'mobile'}
                liveUrl={project.liveUrl}
                title={`${project.title} — ${project.headline}`}
                accentColor={project.accentColor}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`${project.id}-system`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease: [0.19, 1, 0.22, 1] }}
              className="bg-[#101014] min-h-[474px] p-6 sm:p-10 lg:p-[48px] flex flex-col justify-between gap-[34px]"
            >
              {/* Architecture Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono">
                <span style={{ color: project.accentColor }} className="text-[12px]">
                  {copy.systemOverviewLabel}
                </span>
                <span className="text-[11px] text-[#8A8A93]">{copy.systemSubtitle}</span>
              </div>

              {/* Client -> API -> Database Flow */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-[24px]">
                {project.systemNodes.map((node, idx) => (
                  <div key={node.indexLabel} className="contents">
                    {idx > 0 && (
                      <div className="flex flex-col items-center lg:items-start gap-[9px] shrink-0">
                        <span className="font-mono text-[9px] text-[#8A8A93]">
                          {idx === 1 ? copy.httpsLabel : copy.queryLabel}
                        </span>
                        <img
                          src="/assets/figma/data-flow-arrow.svg"
                          alt=""
                          width={78}
                          height={12}
                          className="w-[78px] h-[12px] rotate-90 lg:rotate-0 my-2 lg:my-0"
                        />
                      </div>
                    )}

                    <div className="flex-1 border border-[#303037] p-[26px] flex flex-col gap-[18px] min-w-0">
                      <span style={{ color: project.accentColor }} className="font-mono text-[12px]">
                        {node.indexLabel}
                      </span>
                      <p className="font-medium text-[20px] sm:text-[22px] text-[#F4F4F6] leading-normal">
                        {node.title}
                      </p>
                      <span className="font-mono text-[10px] text-[#8A8A93]">{node.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px w-full bg-[#222228]" aria-hidden="true" />

              <div className="flex flex-wrap gap-[10px]">
                {project.systemPills.map((pill) => (
                  <span
                    key={pill}
                    className="border border-[#222228] rounded-[30px] px-[12px] py-[7px] font-mono text-[11px] text-[#8A8A93]"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <p className="text-[16px] sm:text-[18px] text-[#8A8A93] leading-normal">
                {project.systemSummary}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Metadata Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px] sm:text-[12px] text-[#8A8A93]">
        <div className="flex flex-wrap items-center gap-x-[24px] gap-y-2">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <span>{project.buildLabel}</span>
      </div>
    </motion.article>
  );
}

export function LiveShowcase({ copy }: LiveShowcaseProps) {
  return (
    <section aria-labelledby="selected-work-heading">
      {/* Selected Work Header (Node 3:4) */}
      <div className="px-6 sm:px-10 lg:px-[64px] pt-[28px] pb-[48px] lg:pb-[66px] flex flex-col gap-[22px] lg:gap-[26px]">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[12px]">
          <span className="text-[#FF5500]">{copy.sectionLabel}</span>
          <span className="text-[#8A8A93]">{copy.sectionMeta}</span>
        </div>

        <motion.h2
          id="selected-work-heading"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.75, ease: [0.19, 1, 0.22, 1] }}
          className="font-display text-[clamp(3rem,8.3vw,120px)] leading-[0.9] tracking-[-0.04em] text-[#F4F4F6] uppercase"
        >
          {copy.headline}
        </motion.h2>
      </div>

      {/* 3 Full-Width Project Sections */}
      <div>
        {copy.projects.map((project) => (
          <ProjectPreviewCard key={project.id} project={project} copy={copy} />
        ))}
      </div>
    </section>
  );
}
