import { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  GraduationCap,
  Sparkles,
  Star,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { coursesList, CourseRecommendation } from '@/lib/mock/career-data';

export default function CoursesPage() {
  const [costFilter, setCostFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredCourses = coursesList.filter((course) => {
    if (costFilter === 'free' && course.cost === 'Paid') return false;
    if (costFilter === 'paid' && course.cost !== 'Paid') return false;
    if (difficultyFilter !== 'all' && course.difficulty.toLowerCase() !== difficultyFilter) return false;
    return true;
  });

  return (
    <ProductShell>
      <TopBar eyebrow="Learning engine" title="Targeted Coursework & Curricula">
        <span className="font-mono-ui text-xs text-muted-foreground">
          {filteredCourses.length} curated resources
        </span>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Banner with Learning Engine Logic */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-semibold text-primary">
                <Sparkles size={11} /> Goal → Gap → Curriculum
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Precision Learning for Specific Gaps
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Not a generic course catalog. These selections are chosen to close the exact gaps (Algorithms, Containerization, System Design) holding back your internship match scores.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Cost Filter */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
                {['all', 'free', 'paid'].map((cost) => (
                  <button
                    key={cost}
                    onClick={() => setCostFilter(cost)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                      costFilter === cost
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cost === 'all' ? 'All Costs' : cost}
                  </button>
                ))}
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
                {['all', 'intermediate', 'advanced'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                      difficultyFilter === diff
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Course Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-bold text-primary">
                      {course.tag}
                    </span>
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">{course.provider}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-foreground sm:text-xl">
                      {course.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Star size={13} fill="currentColor" />
                    <span>{course.rating}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">({course.reviewCount})</span>
                  </div>
                </div>

                {/* Meta details: Duration, Level, Cost, Certificate */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} className="text-primary" /> {course.duration}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap size={13} className="text-primary" /> {course.difficulty}
                  </span>
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] font-semibold text-foreground">
                    {course.cost}
                  </span>
                  {course.certificate && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Award size={13} /> Certificate available
                    </span>
                  )}
                </div>

                {/* Skill Gap Connected */}
                <div className="mt-5 space-y-2 rounded-xl border border-border bg-background p-4 text-xs">
                  <div>
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-accent font-semibold">
                      Addresses Skill Gap:
                    </span>
                    <p className="mt-0.5 font-semibold text-foreground">{course.skillGapAddressed}</p>
                  </div>
                  <div>
                    <span className="font-mono-ui text-[9px] uppercase tracking-wider text-primary font-semibold">
                      Reason for Recommendation:
                    </span>
                    <p className="mt-0.5 text-muted-foreground leading-relaxed">
                      {course.reasonForRecommendation}
                    </p>
                  </div>
                </div>

                {/* Covered topics */}
                <div className="mt-4">
                  <p className="font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">
                    Core Topics Covered:
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {course.skillsCovered.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course link */}
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-muted-foreground font-medium">Free access / audit available</span>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring"
                >
                  Start Course <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProductShell>
  );
}
