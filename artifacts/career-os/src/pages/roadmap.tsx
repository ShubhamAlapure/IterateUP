import { useState, useEffect, useMemo } from 'react';
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
  Target,
  FileText,
  Github,
  Linkedin,
  GraduationCap,
  Briefcase,
  Plus,
  RefreshCw,
  Cpu,
  Bot,
  UserCheck,
  Zap,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { useAuth } from '@/context/auth-context';
import {
  buildTailoredCareerSprint,
  generateAiTailoredSprintWithGroq,
  loadSavedCompletedTasks,
  saveCompletedTasks,
  SprintTask,
  SprintMilestone,
  TailoredSprintPlan,
} from '@/lib/services/roadmap-engine';
import {
  getCachedEnrichedSignals,
  fetchAndEnrichStudentProfile,
  cleanGithubUsername,
  EnrichedSignalData,
} from '@/lib/services/profile-enricher';

export default function RoadmapPage() {
  const { profile } = useAuth();
  const profileId = profile?.id || 'demo-student';

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    return loadSavedCompletedTasks(profileId);
  });

  const [customAddedTasks, setCustomAddedTasks] = useState<SprintTask[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<'m1' | 'm2' | 'm3' | 'm4'>('m2');
  const [newTaskImpact, setNewTaskImpact] = useState<'High' | 'Medium'>('High');

  // AI Sprint Advisor state
  const [showAiModal, setShowAiModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSprintResult, setAiSprintResult] = useState<any>(null);

  // Live or cached signals
  const [enrichedData, setEnrichedData] = useState<EnrichedSignalData | null>(() => {
    const gh = profile?.github_username || 'ShubhamAlapure';
    return getCachedEnrichedSignals(gh);
  });

  // Re-load saved completed tasks if profile changes
  useEffect(() => {
    if (profile?.id) {
      setCompletedTaskIds(loadSavedCompletedTasks(profile.id));
    }
  }, [profile?.id]);

  // Handle task checkbox toggle with persistence
  const handleToggleTask = (taskId: string) => {
    setCompletedTaskIds((prev) => {
      const updated = prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId];
      saveCompletedTasks(profileId, updated);
      return updated;
    });
  };

  // Build tailored career sprint plan
  const sprintPlan: TailoredSprintPlan = useMemo(() => {
    const basePlan = buildTailoredCareerSprint(profile, enrichedData, completedTaskIds);

    // Merge custom added tasks if any
    if (customAddedTasks.length > 0) {
      const updatedMilestones = basePlan.milestones.map((m) => {
        const matches = customAddedTasks.filter((t) => (t as any).targetMilestone === m.id);
        if (matches.length > 0) {
          const combinedTasks = [...m.tasks, ...matches];
          const done = combinedTasks.filter((t) => t.completed).length;
          return {
            ...m,
            tasks: combinedTasks,
            progressPercent: Math.round((done / combinedTasks.length) * 100),
          };
        }
        return m;
      });

      const allTasks = updatedMilestones.flatMap((m) => m.tasks);
      const doneCount = allTasks.filter((t) => t.completed).length;

      return {
        ...basePlan,
        milestones: updatedMilestones,
        totalTasksCount: allTasks.length,
        completedTasksCount: doneCount,
        overallPercentage: Math.round((doneCount / allTasks.length) * 100),
      };
    }

    return basePlan;
  }, [profile, enrichedData, completedTaskIds, customAddedTasks]);

  // Handle adding custom milestone task
  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: SprintTask = {
      id: `custom_task_${Date.now()}`,
      text: newTaskTitle.trim(),
      completed: false,
      impact: newTaskImpact,
      category: 'Code & Architecture',
      signalSource: 'target_role',
      signalLabel: 'Custom Milestone Action',
    };
    (newTask as any).targetMilestone = newTaskPhase;

    setCustomAddedTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  // Run AI Sprint Advisor with Groq LPU
  const handleRunAiAdvisor = async () => {
    setShowAiModal(true);
    setIsGeneratingAi(true);
    try {
      const res = await generateAiTailoredSprintWithGroq(profile, enrichedData);
      setAiSprintResult(res);
    } catch (e) {
      console.warn('AI Advisor error:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Filter milestones based on active filter
  const filteredMilestones = sprintPlan.milestones.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.status === activeFilter;
  });

  const ghUsername = profile?.github_username || 'ShubhamAlapure';
  const collegeName = profile?.college?.split(',')[0]?.trim() || 'MIT ADT University';

  return (
    <ProductShell>
      <TopBar eyebrow="Guided execution" title="Personalized Career Roadmap">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiAdvisor}
            className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary shadow-sm hover:bg-primary/20 focus-ring"
            title="AI Sprint Advisor powered by Groq LPU"
          >
            <Sparkles size={13} className="text-primary" />
            <span className="hidden sm:inline">AI Sprint Advisor</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 focus-ring"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Action</span>
          </button>
          <span className="hidden md:inline-flex rounded-full bg-secondary px-3 py-1 font-mono-ui text-xs text-muted-foreground">
            {sprintPlan.completedTasksCount} of {sprintPlan.totalTasksCount} steps ({sprintPlan.overallPercentage}%)
          </span>
        </div>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Roadmap Overview Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-semibold text-primary">
                  <Sparkles size={11} /> {sprintPlan.sprintBadge}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono-ui text-[10px] text-emerald-600 dark:text-emerald-400">
                  <UserCheck size={11} /> {sprintPlan.careerStageLabel}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {sprintPlan.sprintTitle}
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {sprintPlan.sprintDescription}
              </p>
              <p className="mt-2 text-xs font-medium text-primary flex items-center gap-1.5">
                <Target size={13} />
                Target Goal: <strong className="text-foreground">{sprintPlan.targetRole}</strong>
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
            {sprintPlan.phasesSummary.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                  phase.status === 'complete'
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : phase.status === 'current'
                    ? 'border-primary/40 bg-primary/5 shadow-sm'
                    : 'border-border bg-background'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-ui">
                    <span className="font-bold">Phase {phase.phase}</span>
                    <span
                      className={
                        phase.status === 'complete'
                          ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                          : phase.status === 'current'
                          ? 'text-primary font-bold'
                          : 'text-muted-foreground'
                      }
                    >
                      {phase.status === 'complete' ? '100%' : `${phase.progress}%`}
                    </span>
                  </div>
                  <h4 className="mt-2 font-display text-sm font-bold text-foreground">{phase.title}</h4>
                  <p className="mt-1 truncate text-xs text-muted-foreground" title={phase.detail}>
                    {phase.detail}
                  </p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
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
                <div className="mt-5 space-y-2.5 border-t border-border pt-4">
                  {milestone.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3.5 transition-colors ${
                        task.completed
                          ? 'border-border/60 bg-background/50 text-muted-foreground'
                          : 'border-border bg-background hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                            task.completed
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {task.completed && <CheckCircle2 size={13} />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-medium sm:text-sm leading-relaxed ${
                              task.completed ? 'line-through opacity-70' : 'text-foreground'
                            }`}
                          >
                            {task.text}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 font-mono-ui text-[10px] text-muted-foreground">
                              {task.signalSource === 'github' && <Github size={10} className="text-primary" />}
                              {task.signalSource === 'linkedin' && <Linkedin size={10} className="text-blue-500" />}
                              {task.signalSource === 'resume' && <FileText size={10} className="text-amber-500" />}
                              {task.signalSource === 'academics' && <GraduationCap size={10} className="text-emerald-500" />}
                              {task.signalSource === 'target_role' && <Target size={10} className="text-primary" />}
                              <span>{task.signalLabel}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`font-mono-ui text-[10px] uppercase tracking-wider shrink-0 mt-0.5 ${
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

        {/* AI Sprint Advisor Modal */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono-ui text-[10px] font-bold text-primary flex items-center gap-1">
                      <Cpu size={11} /> Groq LPU Powered (gpt-oss-120b)
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono-ui text-[10px] text-emerald-600 dark:text-emerald-400">
                      Sub-200ms Synthesis
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                    AI Career Sprint Synthesis
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tailored for: <strong className="text-foreground">{sprintPlan.targetRole}</strong> · {sprintPlan.careerStageLabel}
                  </p>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              {isGeneratingAi ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw size={24} className="mx-auto animate-spin text-primary" />
                  <p className="text-sm font-semibold text-foreground">
                    Synthesizing high-agency sprint roadmap with Groq LPU...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cross-referencing your education year, GitHub repos, resume status, and LinkedIn posts against {sprintPlan.targetRole} hiring standards.
                  </p>
                </div>
              ) : aiSprintResult ? (
                <div className="space-y-4 text-xs">
                  {/* Strategic Advice */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="font-mono-ui text-[10px] uppercase tracking-wider text-primary font-bold">
                      Staff Engineer Strategic Recommendation
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-foreground font-medium">
                      {aiSprintResult.sprintAdvice}
                    </p>
                  </div>

                  {/* Weekly Execution Schedule */}
                  <div>
                    <h5 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono-ui">
                      Weekly Focus &amp; Key Deliverables
                    </h5>
                    <div className="mt-2 space-y-2">
                      {(aiSprintResult.weeklySchedule || []).map((w: any, idx: number) => (
                        <div key={idx} className="rounded-xl border border-border bg-background p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <span className="font-mono-ui font-bold text-primary text-[11px]">{w.weekRange}: </span>
                            <span className="font-semibold text-foreground">{w.focus}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Deliverable: {w.keyDeliverable}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hiring Manager Tips */}
                  <div>
                    <h5 className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono-ui">
                      Hiring Manager Insider Tips
                    </h5>
                    <div className="mt-2 space-y-2">
                      {(aiSprintResult.hiringManagerTips || []).map((tip: string, idx: number) => (
                        <div key={idx} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <p className="text-foreground leading-relaxed flex items-start gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setShowAiModal(false)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                    >
                      Got it, Keep Sprint Active
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Add Action Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <h3 className="font-display text-xl font-bold text-foreground">Add Custom Milestone Action</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Insert a personalized weekly focus or build goal into your Career Sprint.
              </p>
              <form onSubmit={handleAddCustomTask} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Action Description</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Implement Kafka message stream in anvesh"
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Target Phase</label>
                  <select
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="m1">Phase 1: Resume & Identity</option>
                    <option value="m2">Phase 2: Proof of Work & Tech Gaps</option>
                    <option value="m3">Phase 3: SDE Interview & DSA</option>
                    <option value="m4">Phase 4: Targeted Outreach & Offers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Impact</label>
                  <select
                    value={newTaskImpact}
                    onChange={(e) => setNewTaskImpact(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="High">High Impact</option>
                    <option value="Medium">Medium Impact</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                  >
                    Add to Sprint
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProductShell>
  );
}
