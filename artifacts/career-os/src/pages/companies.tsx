import { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { targetCompanies, CompanyIntelligence } from '@/lib/mock/career-data';

export default function CompaniesPage() {
  const [savedCompanies, setSavedCompanies] = useState<string[]>(['stripe', 'notion']);
  const [industryFilter, setIndustryFilter] = useState<string>('all');

  const toggleSave = (id: string) => {
    setSavedCompanies((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredCompanies = targetCompanies.filter((company) => {
    if (industryFilter === 'all') return true;
    if (industryFilter === 'saved') return savedCompanies.includes(company.id);
    return true;
  });

  return (
    <ProductShell>
      <TopBar eyebrow="Market intelligence" title="Target Companies">
        <span className="font-mono-ui text-xs text-muted-foreground">
          {savedCompanies.length} saved to target list
        </span>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Banner with Company Targeting Criteria */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-semibold text-primary">
                <Sparkles size={11} /> Evidence-Weighted Targeting
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Companies Where Your Signal Matters
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Ranked by tech stack overlap with your CityTransit Pune and Tiny Teams India code evidence, plus historical COEP Pune placement patterns and tech hiring in Pune &amp; Bengaluru.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
              {['all', 'saved'].map((f) => (
                <button
                  key={f}
                  onClick={() => setIndustryFilter(f)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    industryFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'saved' ? `Saved Targets (${savedCompanies.length})` : 'All Companies'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Company Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((comp) => {
            const isSaved = savedCompanies.includes(comp.id);

            return (
              <div
                key={comp.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary font-display text-xl font-bold text-primary shadow-inner">
                        {comp.logoLetter}
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-foreground">{comp.name}</h3>
                        <p className="text-xs text-muted-foreground">{comp.industry}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSave(comp.id)}
                      className="rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      title={isSaved ? 'Remove from targets' : 'Save to targets'}
                    >
                      {isSaved ? (
                        <BookmarkCheck size={16} className="text-primary" />
                      ) : (
                        <Bookmark size={16} />
                      )}
                    </button>
                  </div>

                  {/* Fit Score & Why */}
                  <div className="mt-4 rounded-xl border border-border bg-background p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">
                        Candidate Fit Score
                      </span>
                      <span className="font-mono-ui text-sm font-bold text-primary">
                        {comp.targetFitScore}% Match
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${comp.targetFitScore}%` }}
                      />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Why target: </strong>
                      {comp.whyTarget}
                    </p>
                  </div>

                  {/* Locations & Cycle Window */}
                  <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-primary shrink-0" />
                      <span>{comp.locations.join(' · ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-primary shrink-0" />
                      <span>{comp.internshipWindow}</span>
                    </div>
                  </div>

                  {/* Matched vs Missing Signals */}
                  <div className="mt-4 space-y-2 border-t border-border pt-3">
                    <div>
                      <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                        Matched Strengths:
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {comp.matchedSignals.map((sig) => (
                          <span
                            key={sig}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            <CheckCircle2 size={10} /> {sig}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                        Gaps to Close:
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {comp.missingSignals.map((sig) => (
                          <span
                            key={sig}
                            className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                          >
                            <XCircle size={10} /> {sig}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {comp.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Verified Link */}
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-mono-ui text-[10px] text-muted-foreground">
                    Verified Careers Portal
                  </span>
                  <a
                    href={comp.careersUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent focus-ring"
                  >
                    View Openings <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProductShell>
  );
}
