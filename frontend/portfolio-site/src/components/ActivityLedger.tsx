import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Language, SiteContent } from '../data/content';

interface ActivityLedgerProps {
  copy: SiteContent['activity'];
  language: Language;
}

type ActivityStatus = 'pi-deployed' | 'deploying' | 'commit';

interface LedgerEntry {
  sha: string;
  repo: string;
  message: string;
  timestamp: string;
  url: string;
  status: ActivityStatus;
}

const CACHE_KEY = 'eslender-gh-activity-v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

const FALLBACK_ENTRIES: LedgerEntry[] = [
  {
    sha: '92f39a0',
    repo: 'desk-hub',
    message: 'fix(frontend): exclude portfolio-site and your-garage-landing from parent Next.js build',
    timestamp: '2026-11-23T14:12:35Z',
    url: 'https://github.com/EslenderCV/desk-hub/actions/runs/45191477283',
    status: 'pi-deployed',
  },
  {
    sha: '639cbe8',
    repo: 'desk-hub',
    message: 'feat(portfolio): replace eslender.dev root with new Vite portfolio',
    timestamp: '2026-11-23T14:00:20Z',
    url: 'https://github.com/EslenderCV/desk-hub/commit/639cbe8',
    status: 'pi-deployed',
  },
  {
    sha: 'c36f7ef',
    repo: 'desk-hub',
    message: 'fix(deploy): target Raspberry Pi runner on push and sync cloudflared ingress',
    timestamp: '2026-11-23T13:59:12Z',
    url: 'https://github.com/EslenderCV/desk-hub/actions/runs/45188807192',
    status: 'pi-deployed',
  },
  {
    sha: '08461fc',
    repo: 'yourGarage',
    message: 'fix: service detail go back name',
    timestamp: '2026-10-31T17:25:58Z',
    url: 'https://github.com/EslenderCV/yourGarage/commit/08461fcc9fd0449b43a32e3cc07e5d5f7bff8611',
    status: 'commit',
  },
];

function formatRelativeTime(isoDate: string, lang: Language): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return '';
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));

  if (diffSec < 60) {
    return lang === 'es' ? 'ahora' : 'just now';
  }
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) {
    return lang === 'es' ? `hace ${mins}m` : `${mins}m ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return lang === 'es' ? `hace ${hours}h` : `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return lang === 'es' ? `hace ${days}d` : `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  return lang === 'es' ? `hace ${months}mes` : `${months}mo ago`;
}

export function ActivityLedger({ copy, language }: ActivityLedgerProps) {
  const [entries, setEntries] = useState<LedgerEntry[]>(FALLBACK_ENTRIES);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      try {
        const raw = window.sessionStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { savedAt: number; items: LedgerEntry[] };
          if (
            Date.now() - parsed.savedAt < CACHE_TTL_MS &&
            Array.isArray(parsed.items) &&
            parsed.items.length > 0
          ) {
            if (!cancelled) setEntries(parsed.items);
            return;
          }
        }
      } catch {
        // Ignore storage read errors
      }

      try {
        const [runsRes, deskCommitsRes, garageCommitsRes] = await Promise.all([
          fetch('https://api.github.com/repos/EslenderCV/desk-hub/actions/runs?per_page=6'),
          fetch('https://api.github.com/repos/EslenderCV/desk-hub/commits?per_page=3'),
          fetch('https://api.github.com/repos/EslenderCV/yourGarage/commits?per_page=2'),
        ]);

        if (!deskCommitsRes.ok && !garageCommitsRes.ok) return;

        const runsData = runsRes.ok ? await runsRes.json() : { workflow_runs: [] };
        const deskCommits = deskCommitsRes.ok ? await deskCommitsRes.json() : [];
        const garageCommits = garageCommitsRes.ok ? await garageCommitsRes.json() : [];

        const runBySha = new Map<
          string,
          { status: string; conclusion: string | null; html_url: string; updated_at: string }
        >();

        if (Array.isArray(runsData?.workflow_runs)) {
          for (const r of runsData.workflow_runs) {
            if (typeof r?.head_sha === 'string' && !runBySha.has(r.head_sha)) {
              runBySha.set(r.head_sha, r);
            }
          }
        }

        const combined: LedgerEntry[] = [];

        if (Array.isArray(deskCommits)) {
          for (const c of deskCommits) {
            const fullSha = String(c?.sha ?? '');
            if (!fullSha) continue;
            const run = runBySha.get(fullSha);
            const firstLine = String(c?.commit?.message ?? '')
              .split('\n')[0]
              .trim();
            const isRunning = run?.status === 'in_progress' || run?.status === 'queued';

            combined.push({
              sha: fullSha.slice(0, 7),
              repo: 'desk-hub',
              message: firstLine,
              timestamp: run?.updated_at ?? c?.commit?.author?.date ?? new Date().toISOString(),
              url: run?.html_url ?? c?.html_url ?? 'https://github.com/EslenderCV/desk-hub',
              status: isRunning ? 'deploying' : 'pi-deployed',
            });
          }
        }

        if (Array.isArray(garageCommits)) {
          for (const c of garageCommits) {
            const fullSha = String(c?.sha ?? '');
            if (!fullSha) continue;
            const firstLine = String(c?.commit?.message ?? '')
              .split('\n')[0]
              .trim();

            combined.push({
              sha: fullSha.slice(0, 7),
              repo: 'yourGarage',
              message: firstLine,
              timestamp: c?.commit?.author?.date ?? new Date().toISOString(),
              url: c?.html_url ?? 'https://github.com/EslenderCV/yourGarage',
              status: 'commit',
            });
          }
        }

        combined.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        const topEntries = combined.slice(0, 4);
        if (topEntries.length > 0 && !cancelled) {
          setEntries(topEntries);
          try {
            window.sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ savedAt: Date.now(), items: topEntries })
            );
          } catch {
            // Ignore storage write errors
          }
        }
      } catch {
        // Keep fallback entries if offline or rate-limited
      }
    }

    loadActivity();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      aria-label={copy.heading}
      className="px-6 sm:px-10 lg:px-[64px] pb-[72px] lg:pb-[96px]"
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 font-mono text-[12px]">
        <span className="text-[#FF5500]">{copy.heading}</span>

        <div className="inline-flex items-center gap-[9px] rounded-[30px] border border-[#222228] bg-[#101014] px-[12px] py-[6px]">
          <img
            src="/assets/figma/available-status.svg"
            alt=""
            width={6}
            height={6}
            className="w-[6px] h-[6px] shrink-0"
          />
          <span className="text-[11px] leading-none text-[#A3E635]">{copy.runnerStatus}</span>
        </div>
      </div>

      {/* Minimalist Hairline Commit & CI Ledger */}
      <div className="border-t border-[#222228]">
        {entries.map((item, idx) => (
          <motion.a
            key={`${item.repo}-${item.sha}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              duration: 0.55,
              delay: idx * 0.06,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="group border-b border-[#222228] py-4 px-2 sm:px-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-6 hover:bg-[#101014]/80 transition-colors"
          >
            {/* Left: Hash + Repo Tag + Message */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <span className="font-mono text-[12px] text-[#FF5500] group-hover:underline w-[64px] shrink-0">
                {item.sha}
              </span>

              <span className="font-mono text-[11px] text-[#F4F4F6] bg-[#141418] border border-[#222228] rounded-[4px] px-2.5 py-0.5 shrink-0">
                {item.repo}
              </span>

              <span className="text-[14px] sm:text-[15px] text-[#8A8A93] group-hover:text-[#F4F4F6] transition-colors truncate">
                {item.message}
              </span>
            </div>

            {/* Right: CI Deployment Status + Relative Time + External Icon */}
            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 font-mono text-[11px] pl-[68px] md:pl-0 shrink-0">
              {item.status === 'pi-deployed' && (
                <span className="text-[#A3E635]">✓ {copy.piDeployedLabel}</span>
              )}
              {item.status === 'deploying' && (
                <span className="text-[#FF5500] animate-pulse">● {copy.deployingLabel}</span>
              )}
              {item.status === 'commit' && (
                <span className="text-[#3B82F6]">✓ {copy.verifiedCommitLabel}</span>
              )}

              <div className="flex items-center gap-3">
                <span className="text-[#8A8A93] min-w-[64px] text-right">
                  {formatRelativeTime(item.timestamp, language)}
                </span>
                <img
                  src="/assets/figma/external-link-sm.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="w-[14px] h-[14px] opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
                />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
