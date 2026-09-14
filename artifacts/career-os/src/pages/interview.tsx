import { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  MessageSquareText,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Target,
} from 'lucide-react';
import { ProductShell, TopBar } from '@/components/career-shell';
import { interviewQuestions, InterviewQuestion } from '@/lib/mock/career-data';

export default function InterviewPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(interviewQuestions[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setFeedback(null);

    setTimeout(() => {
      setIsEvaluating(false);
      setFeedback(
        `Analysis against benchmark: Strong technical framing! You clearly mentioned debouncing and network cancellation. To level up this response, ensure you also explicitly cover keyboard accessibility (ARIA combobox specification) and time-complexity trade-offs.`
      );
    }, 1200);
  };

  const handleResetAnswer = () => {
    setUserAnswer('');
    setFeedback(null);
  };

  return (
    <ProductShell>
      <TopBar eyebrow="Interview readiness" title="Role-Specific Interview Room">
        <span className="font-mono-ui text-xs text-muted-foreground">
          Target: Product-Minded Software Engineer
        </span>
      </TopBar>

      <div className="page-in mx-auto max-w-[1420px] space-y-7 px-5 py-6 sm:px-8 lg:px-11 lg:py-8">
        {/* Banner with Interview Prep Philosophy */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-mono-ui text-[10px] font-semibold text-primary">
                <Sparkles size={11} /> Contextual Mock Simulator
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Practice with Your Real Evidence
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                No generic memorization. These questions are tailored to the roles you are actively applying for (Razorpay, PhonePe, Swiggy) and connect directly to your CityTransit Pune and UPI systems case studies.
              </p>
            </div>
          </div>
        </section>

        {/* 2-Column: Question Selector & Active Practice Workspace */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Questions Navigation */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">Select Practice Scenario</h3>

            <div className="space-y-3">
              {interviewQuestions.map((q) => {
                const isSelected = selectedQuestion.id === q.id;

                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setSelectedQuestion(q);
                      handleResetAnswer();
                    }}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                      isSelected
                        ? 'border-primary bg-card shadow-sm'
                        : 'border-border bg-card/60 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-mono-ui text-[10px] font-semibold ${
                          q.category === 'Technical'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : q.category === 'System Design'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {q.category} · {q.difficulty}
                      </span>
                      <span className="font-mono-ui text-[10px] text-muted-foreground">
                        {q.roleTarget}
                      </span>
                    </div>

                    <h4 className="mt-2.5 font-display text-base font-bold text-foreground leading-snug">
                      {q.question}
                    </h4>

                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {q.context}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Workspace */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="font-mono-ui text-xs font-semibold text-primary">
                  {selectedQuestion.category} Evaluation
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-mono-ui text-[10px] text-muted-foreground">
                  {selectedQuestion.difficulty} Difficulty
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                {selectedQuestion.question}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">{selectedQuestion.context}</p>

              {/* What interviewers look for */}
              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                <span className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  What Interviewers Evaluate:
                </span>
                <ul className="mt-2 space-y-1.5">
                  {selectedQuestion.whatInterviewersLookFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={13} className="text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* STAR Framework Breakdown */}
              <div className="mt-4 rounded-xl border border-border bg-background p-4 text-xs">
                <div className="flex items-center gap-1.5 font-mono-ui text-[10px] uppercase tracking-wider text-accent font-semibold">
                  <Target size={12} /> STAR Framework Guide
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-3 text-muted-foreground">
                  <div>
                    <strong className="text-foreground">S (Situation): </strong>
                    {selectedQuestion.starFramework.situation}
                  </div>
                  <div>
                    <strong className="text-foreground">T (Task): </strong>
                    {selectedQuestion.starFramework.task}
                  </div>
                  <div>
                    <strong className="text-foreground">A (Action): </strong>
                    {selectedQuestion.starFramework.action}
                  </div>
                  <div>
                    <strong className="text-foreground">R (Result): </strong>
                    {selectedQuestion.starFramework.result}
                  </div>
                </div>
              </div>

              {/* User Answer Interactive Box */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-foreground">
                  Draft Your Response / Talking Points:
                </label>
                <textarea
                  rows={5}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Outline your solution steps, STAR points, or code architecture..."
                  className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-xs leading-relaxed focus:border-primary focus:outline-none"
                />

                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetAnswer}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw size={12} /> Clear draft
                  </button>

                  <button
                    type="button"
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-ring disabled:opacity-50"
                  >
                    <Sparkles size={13} />
                    <span>{isEvaluating ? 'Evaluating...' : 'Score My Answer'}</span>
                  </button>
                </div>

                {/* Feedback Box */}
                {feedback && (
                  <div className="mt-4 rounded-xl border border-primary/30 bg-primary/8 p-4 text-xs leading-relaxed text-foreground">
                    <p className="font-semibold text-primary flex items-center gap-1.5">
                      <Sparkles size={14} /> Diagnostic Feedback
                    </p>
                    <p className="mt-1 text-muted-foreground">{feedback}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ProductShell>
  );
}
