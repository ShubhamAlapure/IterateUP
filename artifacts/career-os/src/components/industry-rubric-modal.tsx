import { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  FolderGit2,
  Github,
  GraduationCap,
  Info,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { IndustryRubricPillar } from '@/lib/services/skills-readiness-engine';

interface IndustryRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  readinessScore: number;
  readinessLabel: string;
  targetRole: string;
  percentileRank: string;
  pillars: IndustryRubricPillar[];
}

export function IndustryRubricModal({
  isOpen,
  onClose,
  readinessScore,
  readinessLabel,
  targetRole,
  percentileRank,
  pillars,
}: IndustryRubricModalProps) {
  const [expandedPillar, setExpandedPillar] = useState<string>(pillars[0]?.id || 'target_role_fit');

  if (!isOpen) return null;

  const togglePillar = (id: string) => {
    setExpandedPillar((prev) => (prev === id ? '' : id));
  };

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'target_role_fit':
        return <Target className="text-emerald-400" size={18} />;
      case 'github_code_craft':
        return <FolderGit2 className="text-cyan-400" size={18} />;
      case 'linkedin_credentials':
        return <Award className="text-amber-400" size={18} />;
      case 'production_architecture':
        return <Cpu className="text-indigo-400" size={18} />;
      case 'resume_ats_academics':
        return <GraduationCap className="text-emerald-400" size={18} />;
      default:
        return <ShieldCheck className="text-emerald-400" size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#162224] text-[#f7f3e9] shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="relative border-b border-white/10 bg-gradient-to-r from-[#1c2e30] via-[#1f3335] to-[#1a292b] p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus:outline-none"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#9bd8b9]/15 px-3 py-1 font-mono-ui text-[11px] font-semibold text-[#9bd8b9]">
              <ShieldCheck size={14} /> Industry Benchmark Engine
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono-ui text-[10px] text-[#c5d2cc]">
              Tier-1 Product SDE Bar
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Industry-Standard Readiness Rubric
              </h2>
              <p className="mt-1 text-xs text-[#c5d2cc] leading-relaxed">
                Objective, deterministic evaluation mapped to real job specifications, GitHub code evidence, LinkedIn credentials, and resume ATS compliance.
              </p>
            </div>

            <div className="flex items-baseline gap-3 rounded-2xl border border-white/10 bg-black/30 px-5 py-3 shrink-0">
              <div>
                <p className="font-mono-ui text-[9px] uppercase tracking-wider text-[#a9dfc4]">Total Rating</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-extrabold text-[#9bd8b9]">{readinessScore}</span>
                  <span className="font-mono-ui text-sm text-white/50">/100</span>
                </div>
              </div>
              <div className="border-l border-white/10 pl-3">
                <span className="inline-block rounded-md bg-emerald-500/20 px-2 py-0.5 font-mono-ui text-[10px] font-bold text-[#a9dfc4]">
                  {percentileRank}
                </span>
                <p className="mt-1 font-mono-ui text-[10px] text-[#c5d2cc] max-w-[130px] truncate">{readinessLabel}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs text-[#d5e1d9]">
            <Target size={14} className="text-[#9bd8b9] shrink-0" />
            <span>
              Target Role Benchmark: <strong className="text-white">{targetRole}</strong>
            </span>
          </div>
        </div>

        {/* Pillars Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#a9dfc4] font-mono-ui">
            <span>5 STANDARDIZED EVALUATION PILLARS</span>
            <span>TOTAL WEIGHT: 100%</span>
          </div>

          {pillars.map((pillar) => {
            const isExpanded = expandedPillar === pillar.id;
            const percentage = Math.round((pillar.score / pillar.maxScore) * 100);

            return (
              <div
                key={pillar.id}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isExpanded
                    ? 'border-[#9bd8b9]/40 bg-[#1f3335]/70 shadow-lg'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => togglePillar(pillar.id)}
                  className="flex w-full items-center justify-between p-4 text-left sm:p-5 focus:outline-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 shrink-0">
                      {getPillarIcon(pillar.id)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white truncate">{pillar.name}</h3>
                        <span className="rounded bg-white/10 px-2 py-0.5 font-mono-ui text-[10px] text-[#9bd8b9]">
                          {pillar.grade}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#a3b8b0] line-clamp-1">{pillar.benchmarkStandard}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="font-display text-lg font-bold text-[#9bd8b9]">{pillar.score}</span>
                        <span className="font-mono-ui text-xs text-white/50">/{pillar.maxScore}</span>
                      </div>
                      <span className="font-mono-ui text-[10px] text-white/40">{pillar.weightPercent}% weight</span>
                    </div>
                    <div className="text-white/60">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </button>

                {/* Progress bar under header */}
                <div className="h-1.5 w-full bg-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#59c996] to-[#9bd8b9] transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/20 p-4 sm:p-5 space-y-4 animate-fadeIn">
                    {/* Evidence summary badge */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-[#d9e6e0]">
                      <strong className="text-[#9bd8b9] block font-mono-ui text-[10px] uppercase tracking-wider mb-1">
                        Verified Evidence Detected:
                      </strong>
                      {pillar.evidenceSummary}
                    </div>

                    {/* Breakdown items */}
                    <div className="space-y-2.5">
                      <p className="font-mono-ui text-[10px] uppercase tracking-wider text-[#a9dfc4]">
                        Criteria Breakdown & Point Attribution
                      </p>
                      {pillar.breakdownItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-white/[0.03] p-3 border border-white/5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-[#9bd8b9] shrink-0" />
                              <p className="text-xs font-semibold text-white truncate">{item.label}</p>
                            </div>
                            <p className="mt-1 text-[11px] text-[#a3b8b0] leading-relaxed pl-5">
                              {item.evidence}
                            </p>
                          </div>
                          <div className="pl-5 sm:pl-0 text-right shrink-0">
                            <span className="font-mono-ui text-xs font-bold text-[#9bd8b9]">
                              +{item.pointsAwarded}
                            </span>
                            <span className="font-mono-ui text-[10px] text-white/40">/{item.maxPoints} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Improvement tip */}
                    <div className="flex items-start gap-2.5 rounded-xl border border-[#df9a78]/30 bg-[#df9a78]/10 p-3 text-xs text-[#f9dfd5]">
                      <Zap size={14} className="text-[#df9a78] shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-[#f9dfd5]">To earn full points in this pillar: </strong>
                        <span>{pillar.improvementTip}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-[#162224] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a3b8b0]">
          <div className="flex items-center gap-2">
            <Info size={14} className="text-[#9bd8b9]" />
            <span>Deterministic engine: ratings remain stable across sessions and tab changes.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-[#9bd8b9] px-5 py-2.5 text-xs font-bold text-[#162224] transition-all hover:bg-[#86cca7]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
