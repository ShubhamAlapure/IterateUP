import { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  DollarSign,
  ExternalLink,
  Filter,
  MapPin,
  Send,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { jobMatches, JobMatch } from '@/lib/mock/career-data';

export default function JobsPage() {
  const [trackedJobs, setTrackedJobs] = useState<string[]>(['j1', 'j5']);
  const [filterMatch, setFilterMatch] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleTrackInApp = (job: JobMatch) => {
    if (trackedJobs.includes(job.id)) return;
    setTrackedJobs([...trackedJobs, job.id]);
    setFeedbackMessage(`Added ${job.company} ${job.role} to your Applications Pipeline!`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const filteredJobs = jobMatches.filter((job) => job.match >= filterMatch);

  return (
    <ProductShell>
      <TopBar eyebrow="Matching engine" title="Target Job & Internship Matches">
        <span className="font-mono-ui text-xs text-muted-foreground">
          {trackedJobs.length} roles tracked in pipeline
        </span>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {feedbackMessage && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {feedbackMessage}
          </div>
        )}

        {/* Banner with Match Methodology */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-semibold text-primary">
                <Sparkles size={11} /> Structured Skills Matching
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Roles Calibrated to Your Story
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Matches are not keyword searches. We evaluate your projects, course evidence, and target role parameters against real employer requirements with transparent skill breakdown.
              </p>
            </div>

            {/* Match filter */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5">
              <span className="px-2 text-xs text-muted-foreground">Minimum Match:</span>
              {[0, 80, 85, 90].map((threshold) => (
                <button
                  key={threshold}
                  onClick={() => setFilterMatch(threshold)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                    filterMatch === threshold
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {threshold === 0 ? 'All' : `${threshold}%+`}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs List */}
        <div className="space-y-5">
          {filteredJobs.map((job) => {
            const isTracked = trackedJobs.includes(job.id);

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-sm sm:p-7"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary font-display text-xl font-bold text-primary shadow-inner">
                      {job.company.slice(0, 1)}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                          {job.role}
                        </h3>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono-ui text-xs font-bold text-primary">
                          {job.match}% Match
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{job.company}</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} className="text-primary" /> {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono-ui text-foreground font-medium">
                          <DollarSign size={13} className="text-emerald-500" /> {job.salary}
                        </span>
                        <span className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px]">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top CTA buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleTrackInApp(job)}
                      disabled={isTracked}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                        isTracked
                          ? 'border border-border bg-secondary text-muted-foreground'
                          : 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {isTracked ? (
                        <>
                          <Check size={13} /> In Applications
                        </>
                      ) : (
                        <>
                          <Send size={13} /> Track Application
                        </>
                      )}
                    </button>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring"
                    >
                      Official Apply <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Match Signals & Skill Overlap */}
                <div className="mt-6 grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
                  {/* Matched skills */}
                  <div>
                    <span className="font-mono-ui text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                      Verified Strengths Matched
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                        >
                          <CheckCircle2 size={11} /> {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing skills */}
                  <div>
                    <span className="font-mono-ui text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                      Skill Gaps for this Role
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.missingSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400"
                        >
                          <AlertCircle size={11} /> {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Why This Matches & Source Attribution */}
                <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                  <p className="leading-relaxed">
                    <strong className="text-foreground">Why this fits: </strong>
                    {job.whyThisRole}
                  </p>
                  <div className="flex shrink-0 items-center gap-3 font-mono-ui text-[11px]">
                    <span className="text-muted-foreground">{job.deadline}</span>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-foreground">
                      Source: {job.verifiedSource}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProductShell>
  );
}
