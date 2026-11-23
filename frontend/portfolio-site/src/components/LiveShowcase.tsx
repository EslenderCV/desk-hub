import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Lock, MousePointerClick } from 'lucide-react';
import type { ProjectConfig, SiteContent } from '../data/content';

interface LiveShowcaseProps {
  copy: SiteContent['work'];
}

type PreviewMode = 'desktop' | 'mobile' | 'system';

const FORMA_INVOICES = [
  { client: 'Northstar Studio', date: 'Nov 24, 2026', status: 'Sent', amount: '$4,800.00', paid: false },
  { client: 'Atelier & Co.', date: 'Nov 22, 2026', status: 'Paid', amount: '$2,650.00', paid: true },
  { client: 'Common Ground', date: 'Nov 20, 2026', status: 'Sent', amount: '$6,200.00', paid: false },
  { client: 'Bureau Digital', date: 'Nov 18, 2026', status: 'Draft', amount: '$4,800.00', paid: false },
];

function YourGarageApp({ mobile, liveUrl }: { mobile?: boolean; liveUrl: string }) {
  const [isInteractive, setIsInteractive] = useState(false);

  if (mobile) {
    return (
      <div className="bg-[#0D0D11] flex h-[510px] items-center justify-center p-4 w-full">
        <div className="relative bg-[#171A20] border-[5px] border-[#3E3E45] flex h-[466px] items-start overflow-hidden rounded-[20px] w-[336px] shadow-2xl">
          <iframe
            src={liveUrl}
            title="yourGarage Mobile Live Preview"
            loading="lazy"
            className={`w-full h-full border-0 bg-[#171A20] ${
              isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          />

          {!isInteractive ? (
            <button
              type="button"
              onClick={() => setIsInteractive(true)}
              className="group absolute inset-0 z-10 flex flex-col items-center justify-end pb-6 bg-gradient-to-t from-[#050507]/80 via-transparent to-transparent cursor-pointer focus:outline-none"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FF5500] px-4 py-2 font-mono text-[11px] font-medium text-[#050507] shadow-lg transition-transform duration-200 group-hover:scale-105">
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>CLICK TO INTERACT</span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsInteractive(false)}
              className="absolute top-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#050507]/90 border border-[#222228] px-3 py-1 font-mono text-[10px] text-[#FF5500] hover:border-[#FF5500] transition-colors"
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
    <div className="relative bg-[#171A20] h-[510px] w-full overflow-hidden">
      <iframe
        src={liveUrl}
        title="yourGarage — Smart Vehicle Maintenance & ESP32 OBD-II Tracker"
        loading="lazy"
        className={`w-full h-full border-0 bg-[#171A20] ${
          isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      />

      {!isInteractive ? (
        <button
          type="button"
          onClick={() => setIsInteractive(true)}
          className="group absolute inset-0 z-10 flex flex-col items-center justify-end pb-7 bg-gradient-to-t from-[#050507]/75 via-transparent to-transparent cursor-pointer focus:outline-none"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FF5500] px-5 py-2.5 font-mono text-[11px] font-medium text-[#050507] shadow-xl transition-transform duration-200 group-hover:scale-105">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>CLICK TO INTERACT WITH LIVE SITE</span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsInteractive(false)}
          className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#050507]/90 border border-[#222228] px-3.5 py-1.5 font-mono text-[10px] text-[#FF5500] hover:border-[#FF5500] transition-colors shadow-lg"
        >
          <Lock className="w-3 h-3" />
          <span>LOCK SCROLL</span>
        </button>
      )}
    </div>
  );
}

function FormaApp({ mobile }: { mobile?: boolean }) {
  const [activeNav, setActiveNav] = useState('Invoices');
  const [filter, setFilter] = useState<'All invoices' | 'Draft' | 'Sent' | 'Paid'>('All invoices');

  const filtered =
    filter === 'All invoices'
      ? FORMA_INVOICES
      : FORMA_INVOICES.filter((inv) => inv.status === filter);

  if (mobile) {
    return (
      <div className="bg-[#0D0D11] flex h-[474px] items-center justify-center p-4 w-full">
        <div className="bg-[#F2F1ED] border-[5px] border-[#3E3E45] flex h-[430px] items-start overflow-hidden rounded-[18px] w-[302px]">
          <div className="flex flex-1 flex-col gap-[20px] h-full p-[20px] min-w-0">
            <p className="font-bold text-[23px] text-[#17171C] leading-normal">Invoices</p>

            <div className="flex flex-col gap-[6px]">
              <span className="font-mono text-[10px] text-[#67676E]">TOTAL OUTSTANDING</span>
              <span className="font-medium text-[29px] text-[#17171C] leading-none">$11,000.00</span>
            </div>

            <div className="flex gap-[18px] font-medium text-[12px]">
              {(['All invoices', 'Draft', 'Sent', 'Paid'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={filter === tab ? 'text-[#3B82F6]' : 'text-[#67676E]'}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="h-px bg-[#DADADD] w-full" />

            <div className="flex flex-col gap-[14px]">
              {filtered.map((inv) => (
                <div key={inv.client} className="contents">
                  <div className="flex items-center justify-between font-medium text-[13px] text-[#17171C]">
                    <span>{inv.client}</span>
                    <span>{inv.amount}</span>
                  </div>
                  <div className="h-px bg-[#DADADD] w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F1ED] flex flex-col md:flex-row min-h-[474px] w-full text-[#17171C]">
      {/* Sidebar */}
      <div className="bg-[#E8E7E3] flex flex-row md:flex-col justify-between md:justify-start gap-6 md:gap-[30px] p-5 md:p-[24px] md:w-[208px] shrink-0">
        <p className="font-bold text-[25px] tracking-[-1.25px] text-[#17171C] leading-none">
          forma.
        </p>

        <nav className="flex md:flex-col gap-4 md:gap-[22px] text-[13px] md:text-[14px] overflow-x-auto">
          {['Overview', 'Invoices', 'Clients', 'Transactions', 'Settings'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveNav(item)}
              className={`text-left whitespace-nowrap transition-colors ${
                activeNav === item ? 'font-bold text-[#17171C]' : 'font-normal text-[#67676E] hover:text-[#17171C]'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <p className="hidden md:block mt-auto font-mono text-[9px] text-[#67676E]">
          DEMO ENVIRONMENT
        </p>
      </div>

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col gap-[20px] p-6 sm:p-[32px] min-w-0">
        <div className="flex items-center justify-between gap-4">
          <p className="font-bold text-[24px] sm:text-[28px] text-[#17171C] leading-normal">
            {activeNav}
          </p>
          <button
            type="button"
            onClick={() => setFilter('All invoices')}
            className="bg-[#3B82F6] hover:opacity-90 transition-opacity px-[12px] py-[10px] rounded-[4px] font-bold text-[11px] text-white whitespace-nowrap"
          >
            New invoice
          </button>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-[6px]">
            <span className="font-mono text-[10px] text-[#67676E]">TOTAL OUTSTANDING</span>
            <span className="font-medium text-[34px] sm:text-[44px] text-[#17171C] leading-none">
              $11,000.00
            </span>
          </div>

          <div className="flex flex-col gap-[6px]">
            <span className="font-mono text-[10px] text-[#67676E]">PAID THIS MONTH</span>
            <span className="font-medium text-[22px] sm:text-[25px] text-[#17171C] leading-none">
              $2,650.00
            </span>
          </div>
        </div>

        <div className="flex gap-[22px] font-medium text-[12px]">
          {(['All invoices', 'Draft', 'Sent', 'Paid'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`transition-colors ${
                filter === tab ? 'text-[#3B82F6]' : 'text-[#67676E] hover:text-[#17171C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="h-px bg-[#DADADD] w-full" />

        <div className="flex flex-col gap-[16px]">
          {filtered.map((inv) => (
            <div key={inv.client} className="contents">
              <div className="grid grid-cols-4 items-center gap-2 text-[12px]">
                <span className="font-medium text-[13px] text-[#17171C] truncate">{inv.client}</span>
                <span className="text-[#67676E]">{inv.date}</span>
                <span
                  className={`text-[11px] text-center ${
                    inv.paid ? 'text-[#317448]' : 'text-[#67676E]'
                  }`}
                >
                  {inv.status}
                </span>
                <span className="font-medium text-[13px] text-[#17171C] text-right">
                  {inv.amount}
                </span>
              </div>
              <div className="h-px bg-[#DADADD] w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DevflowApp({ mobile }: { mobile?: boolean }) {
  const [activeNav, setActiveNav] = useState('My workspace');
  const [activeTab, setActiveTab] = useState<'Board' | 'Timeline' | 'Files'>('Board');

  if (mobile) {
    return (
      <div className="bg-[#0D0D11] flex h-[474px] items-center justify-center p-4 w-full">
        <div className="bg-[#101014] border-[5px] border-[#3E3E45] flex h-[430px] items-start overflow-hidden rounded-[18px] w-[302px]">
          <div className="flex flex-1 flex-col gap-[20px] h-full p-[20px] min-w-0">
            <p className="font-bold text-[23px] text-[#F4F4F6] leading-normal">Website launch</p>

            <div className="flex gap-[26px] font-medium text-[12px]">
              {(['Board', 'Timeline', 'Files'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={activeTab === t ? 'text-[#A3E635]' : 'text-[#92929B]'}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="h-px bg-[#29292F] w-full" />

            <div className="flex flex-col gap-[14px]">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#92929B]">IN PROGRESS</span>
                <span className="text-[#A3E635]">02</span>
              </div>

              <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[12px]">
                <span className="font-mono text-[9px] text-[#A3E635]">FRONTEND</span>
                <span className="font-medium text-[15px] text-[#F4F4F6]">Build dashboard shell</span>
                <span className="text-[10px] text-[#92929B]">React / TypeScript</span>
              </div>

              <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[12px]">
                <span className="font-mono text-[9px] text-[#A3E635]">BACKEND</span>
                <span className="font-medium text-[15px] text-[#F4F4F6]">Connect activity feed</span>
                <span className="text-[10px] text-[#92929B]">API / Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#101014] flex flex-col md:flex-row min-h-[474px] w-full">
      {/* Sidebar */}
      <div className="bg-[#16161B] flex flex-row md:flex-col justify-between md:justify-start gap-6 md:gap-[30px] p-5 md:p-[24px] md:w-[208px] shrink-0 border-b md:border-b-0 md:border-r border-[#222228]/60">
        <p className="font-bold text-[25px] tracking-[-1.25px] text-[#F4F4F6] leading-none">
          devflow.
        </p>

        <nav className="flex md:flex-col gap-4 md:gap-[22px] text-[13px] md:text-[14px] overflow-x-auto">
          {['My workspace', 'Projects', 'My tasks', 'Activity', 'Settings'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveNav(item)}
              className={`text-left whitespace-nowrap transition-colors ${
                activeNav === item ? 'font-bold text-[#F4F4F6]' : 'font-normal text-[#92929B] hover:text-[#F4F4F6]'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <p className="hidden md:block mt-auto font-mono text-[9px] text-[#92929B]">
          DEMO ENVIRONMENT
        </p>
      </div>

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col gap-[20px] p-6 sm:p-[32px] min-w-0">
        <div className="flex items-center justify-between gap-4">
          <p className="font-bold text-[24px] sm:text-[28px] text-[#F4F4F6] leading-normal">
            Website launch
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('Board')}
            className="bg-[#A3E635] hover:opacity-90 transition-opacity px-[12px] py-[10px] rounded-[4px] font-bold text-[11px] text-[#141418] whitespace-nowrap"
          >
            New task
          </button>
        </div>

        <div className="flex gap-[30px] font-medium text-[12px]">
          {(['Board', 'Timeline', 'Files'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              className={`transition-colors ${
                activeTab === t ? 'text-[#A3E635]' : 'text-[#92929B] hover:text-[#F4F4F6]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="h-px bg-[#29292F] w-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#92929B]">TO DO</span>
              <span className="text-[#A3E635]">02</span>
            </div>
            <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[14px]">
              <span className="font-mono text-[9px] text-[#A3E635]">DESIGN</span>
              <span className="font-medium text-[15px] text-[#F4F4F6]">Review onboarding flow</span>
              <span className="text-[10px] text-[#92929B]">Design / Interface</span>
            </div>
            <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[14px]">
              <span className="font-mono text-[9px] text-[#A3E635]">BACKEND</span>
              <span className="font-medium text-[15px] text-[#F4F4F6]">Define auth endpoints</span>
              <span className="text-[10px] text-[#92929B]">API / Security</span>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#92929B]">IN PROGRESS</span>
              <span className="text-[#A3E635]">02</span>
            </div>
            <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[14px]">
              <span className="font-mono text-[9px] text-[#A3E635]">FRONTEND</span>
              <span className="font-medium text-[15px] text-[#F4F4F6]">Build dashboard shell</span>
              <span className="text-[10px] text-[#92929B]">React / TypeScript</span>
            </div>
            <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[14px]">
              <span className="font-mono text-[9px] text-[#A3E635]">BACKEND</span>
              <span className="font-medium text-[15px] text-[#F4F4F6]">Connect activity feed</span>
              <span className="text-[10px] text-[#92929B]">API / Integration</span>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#92929B]">DONE</span>
              <span className="text-[#A3E635]">02</span>
            </div>
            <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[14px]">
              <span className="font-mono text-[9px] text-[#A3E635]">FOUNDATION</span>
              <span className="font-medium text-[15px] text-[#F4F4F6]">Initialize workspace</span>
              <span className="text-[10px] text-[#92929B]">Infrastructure</span>
            </div>
            <div className="bg-[#1C1C22] border border-[#29292F] rounded-[5px] p-[18px] flex flex-col gap-[14px]">
              <span className="font-mono text-[9px] text-[#A3E635]">DESIGN</span>
              <span className="font-medium text-[15px] text-[#F4F4F6]">Define design tokens</span>
              <span className="text-[10px] text-[#92929B]">Design system</span>
            </div>
          </div>
        </div>
      </div>
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
              {project.id === 'yourgarage' && (
                <YourGarageApp mobile={mode === 'mobile'} liveUrl={project.liveUrl} />
              )}
              {project.id === 'forma' && <FormaApp mobile={mode === 'mobile'} />}
              {project.id === 'devflow' && <DevflowApp mobile={mode === 'mobile'} />}
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
