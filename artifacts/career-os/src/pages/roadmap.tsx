import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  ListTodo,
  Milestone,
  Route,
  Sparkles,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { roadmap, roadmapMilestones, RoadmapMilestone } from '@/lib/mock/career-data';

export default function RoadmapPage() {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>(roadmapMilestones);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleToggleTask = (milestoneId: string, taskId: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      })
    );
  };

  const filteredMilestones = milestones.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.status === activeFilter;
  });

  const totalTasks = milestones.reduce((sum, m) => sum + m.tasks.length, 0);
  const completedTasks = milestones.reduce(
    (sum, m) => sum + m.tasks.filter((t) => t.completed).length,
    0
  );
  const overallPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <ProductShell>
      <TopBar eyebrow="Guided execution" title="Personalized Career Roadmap">
        <div className="flex items-center gap-2">
          <span className="font-mono-ui text-xs text-muted-foreground">
            {completedTasks} of {totalTasks} steps completed ({overallPercentage}%)
          </span>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Roadmap Overview Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-semibold text-primary">
                <Sparkles size={11} /> High Agency Path
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Your 14-Week Career Sprint
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                A non-generic sequence tailored to your goal of landing a product engineering internship. Each phase closes a verified profile gap.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1.5">
              {['all', 'done', 'active', 'pending'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter === 'done' ? 'Completed' : filter === 'active' ? 'Current' : filter === 'pending' ? 'Upcoming' : 'All Phases'}
                </button>
              ))}
            </div>
          </div>

          {/* Phase progression track */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {roadmap.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-xl border p-4 transition-all ${
                  phase.status === 'complete'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : phase.status === 'current'
                    ? 'border-primary/40 bg-primary/5 shadow-sm'
                    : 'border-border bg-background'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono-ui">
                  <span className="font-bold">Phase {phase.phase}</span>
                  <span
                    className={
                      phase.status === 'complete'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : phase.status === 'current'
                        ? 'text-primary font-bold'
                        : 'text-muted-foreground'
                    }
                  >
                    {phase.status === 'complete' ? '100%' : phase.status === 'current' ? `${phase.progress}%` : 'Upcoming'}
                  </span>
                </div>
                <h4 className="mt-2 font-display text-sm font-bold text-foreground">{phase.title}</h4>
                <p className="mt-1 truncate text-xs text-muted-foreground">{phase.detail}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      phase.status === 'complete' ? 'bg-emerald-500' : 'bg-primary'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones & Interactive Task Checklists */}
        <div className="space-y-6">
          {filteredMilestones.map((milestone) => {
            const mCompleted = milestone.tasks.filter((t) => t.completed).length;
            const mTotal = milestone.tasks.length;
            const mPercent = Math.round((mCompleted / mTotal) * 100);

            return (
              <section
                key={milestone.id}
                className={`rounded-2xl border p-6 transition-all sm:p-7 ${
                  milestone.status === 'active'
                    ? 'border-primary/50 bg-card shadow-sm'
                    : 'border-border bg-card/60'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        milestone.status === 'done'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : milestone.status === 'active'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {milestone.status === 'done' ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Milestone size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-ui text-xs font-bold text-primary">
                          {milestone.phaseId}
                        </span>
                        <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 font-mono-ui text-xs text-muted-foreground">
                      <Clock size={13} /> {milestone.estimatedWeeks}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 font-mono-ui text-xs font-semibold ${
                        milestone.status === 'done'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : milestone.status === 'active'
                          ? 'bg-primary/15 text-primary'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      {mCompleted} / {mTotal} Done
                    </span>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="mt-5 space-y-2 border-t border-border pt-4">
                  {milestone.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(milestone.id, task.id)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-colors ${
                        task.completed
                          ? 'border-border/60 bg-background/50 text-muted-foreground'
                          : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className={`grid h-5 w-5 place-items-center rounded-md border transition-colors ${
                            task.completed
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {task.completed && <CheckCircle2 size={13} />}
                        </button>
                        <span
                          className={`text-xs font-medium sm:text-sm ${
                            task.completed ? 'line-through opacity-70' : 'text-foreground'
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      <span
                        className={`font-mono-ui text-[10px] uppercase tracking-wider ${
                          task.impact === 'High' ? 'text-accent font-semibold' : 'text-muted-foreground'
                        }`}
                      >
                        {task.impact} Impact
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </ProductShell>
  );
}
