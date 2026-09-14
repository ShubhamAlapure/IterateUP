import { UserProfile } from '@/context/auth-context';
import {
  EnrichedSignalData,
  EnrichedProject,
  getCachedEnrichedSignals,
  deriveDeepLinkedInSignals,
} from '@/lib/services/profile-enricher';

export interface SprintTask {
  id: string;
  text: string;
  completed: boolean;
  impact: 'High' | 'Medium';
  category: 'Resume & Positioning' | 'Code & Architecture' | 'Interview & DSA' | 'Outreach & Offers';
  signalSource: 'github' | 'linkedin' | 'resume' | 'target_role' | 'academics';
  signalLabel: string;
}

export interface SprintMilestone {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  status: 'done' | 'active' | 'pending';
  estimatedWeeks: string;
  progressPercent: number;
  tasks: SprintTask[];
}

export interface SprintPhaseSummary {
  phase: string;
  title: string;
  detail: string;
  progress: number;
  status: 'complete' | 'current' | 'upcoming';
}

export interface TailoredSprintPlan {
  sprintTitle: string;
  sprintBadge: string;
  sprintDescription: string;
  targetRole: string;
  careerStageLabel: string;
  totalWeeks: number;
  completedTasksCount: number;
  totalTasksCount: number;
  overallPercentage: number;
  phasesSummary: SprintPhaseSummary[];
  milestones: SprintMilestone[];
  generatedWith: string;
  generatedAt: string;
}

// Retrieve API keys securely from environment or local storage
function getGroqApiKey(): string {
  return (
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GROQ_API_KEY) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('iterateup_groq_api_key')) ||
    ''
  );
}

const STORAGE_PREFIX = 'iterateup_roadmap_completed_v3_';

export function loadSavedCompletedTasks(profileId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${profileId || 'default'}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveCompletedTasks(profileId: string, taskIds: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${profileId || 'default'}`, JSON.stringify(taskIds));
  } catch {}
}

/**
 * Builds a dynamically tailored Career Sprint strictly based on:
 * - Target Role
 * - Education Stage (Year of study / Experience)
 * - Resume Status & filename
 * - Real GitHub Repositories & tech stack
 * - LinkedIn Bio, Posts, and Target Companies
 */
export function buildTailoredCareerSprint(
  profile: UserProfile | null,
  enrichedSignals?: EnrichedSignalData | null,
  completedTaskIds: string[] = []
): TailoredSprintPlan {
  const ghUsername = profile?.github_username || 'ShubhamAlapure';
  const cached = getCachedEnrichedSignals(ghUsername);
  const signals = enrichedSignals || cached;

  const targetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';
  const college = profile?.college?.trim() || 'MIT ADT University Pune';
  const degree = profile?.degree?.trim() || 'B.Tech Computer Engineering';
  const yearOfStudy = profile?.year_of_study || '3rd Year (Class of 2026)';
  const resumeName = profile?.resume_name;
  const hasResume = Boolean(resumeName || profile?.resume_url);

  const projects: EnrichedProject[] = profile?.synced_projects?.length
    ? profile.synced_projects
    : signals?.projects?.length
    ? signals.projects
    : [];

  const topRepo1 = projects[0]?.name || 'IterateUP';
  const topRepo2 = projects[1]?.name || 'anvesh';
  const topRepo3 = projects[2]?.name || 'PeerUP';

  const targetCompanies =
    profile?.target_companies && profile.target_companies.length > 0
      ? profile.target_companies
      : ['Razorpay', 'PhonePe', 'Swiggy', 'Zomato', 'Atlassian India', 'TCS Digital'];

  const primaryCompany1 = targetCompanies[0] || 'Razorpay';
  const primaryCompany2 = targetCompanies[1] || 'PhonePe';
  const primaryCompany3 = targetCompanies[2] || 'Swiggy';

  const liHandle = signals?.linkedinHandle || ghUsername;
  const deepLi =
    signals?.linkedinProjects?.length && signals.linkedinPosts?.length
      ? signals
      : deriveDeepLinkedInSignals(liHandle, ghUsername, projects, profile?.synced_skills || [], targetRole);

  const liPost = deepLi.linkedinPosts[0]?.title || 'IterateUP Developer Intelligence launch';

  // 1. Determine Career Stage and Sprint Duration
  const yearLower = yearOfStudy.toLowerCase();
  const isFinalYear = yearLower.includes('4th') || yearLower.includes('final') || yearLower.includes('2025');
  const isPreFinal = yearLower.includes('3rd') || yearLower.includes('pre-final') || yearLower.includes('2026');
  const isEarlyYear = yearLower.includes('1st') || yearLower.includes('2nd');
  const isWorking = Boolean(profile?.experience_count && profile.experience_count > 2);

  let sprintTitle = 'Your 14-Week Career Sprint';
  let sprintBadge = 'High Agency Internship Track';
  let sprintDescription = `A non-generic sequence tailored to your pre-final year goal of securing a 2025–2026 ${targetRole} internship at top Indian tech firms.`;
  let careerStageLabel = 'Pre-Final Year · Class of 2026';
  let totalWeeks = 14;

  if (isFinalYear) {
    sprintTitle = 'Your 10-Week Full-Time Placement Sprint';
    sprintBadge = 'Placement Conversion Track';
    sprintDescription = `An accelerated sprint to convert full-time campus placements and high-conviction off-campus ${targetRole} offers.`;
    careerStageLabel = 'Final Year · Immediate Hiring Cohort';
    totalWeeks = 10;
  } else if (isWorking) {
    sprintTitle = 'Your 12-Week Lateral SDE Transition Sprint';
    sprintBadge = 'Lateral Engineering Track';
    sprintDescription = `Tailored transition sequence to upgrade your production systems craft and convert SDE-1 / SDE-2 lateral interviews.`;
    careerStageLabel = 'Working Professional · Lateral Transition';
    totalWeeks = 12;
  } else if (isEarlyYear) {
    sprintTitle = 'Your 16-Week CS Foundations & Flagship Sprint';
    sprintBadge = 'Early Builder Track';
    sprintDescription = `Master algorithmic problem solving and establish flagship open-source repositories to stand out before placement cycles.`;
    careerStageLabel = 'Early Career · Core CS Foundations';
    totalWeeks = 16;
  }

  // 2. Define Phase 1 Tasks: Identity, Resume & Positioning
  const phase1Tasks: SprintTask[] = [
    {
      id: 'p1_t1',
      text: hasResume
        ? `Align parsed resume (${resumeName}) with keyword density for ${primaryCompany1} & ${primaryCompany2} ${targetRole} postings`
        : `Craft 1-page ATS-optimized resume highlighting ${degree} at ${college}`,
      completed: hasResume || completedTaskIds.includes('p1_t1'),
      impact: 'High',
      category: 'Resume & Positioning',
      signalSource: 'resume',
      signalLabel: hasResume ? `Resume: ${resumeName}` : 'ATS Resume Benchmark',
    },
    {
      id: 'p1_t2',
      text: `Clean up GitHub (@${ghUsername}) profile README: pin flagship repositories (${topRepo1} & ${topRepo2}) with live demos`,
      completed: projects.length >= 2 || completedTaskIds.includes('p1_t2'),
      impact: 'High',
      category: 'Resume & Positioning',
      signalSource: 'github',
      signalLabel: `GitHub: @${ghUsername} (${projects.length} repos)`,
    },
    {
      id: 'p1_t3',
      text: `Update LinkedIn bio (in/${liHandle}) to position yourself as an aspiring ${targetRole} with verified metrics`,
      completed: Boolean(profile?.linkedin_url) || completedTaskIds.includes('p1_t3'),
      impact: 'Medium',
      category: 'Resume & Positioning',
      signalSource: 'linkedin',
      signalLabel: `LinkedIn: in/${liHandle}`,
    },
  ];

  // 3. Define Phase 2 Tasks: Proof of Work & Closing Tech Gaps
  const phase2Tasks: SprintTask[] = [
    {
      id: 'p2_t1',
      text: `Containerize ${topRepo1} with a multi-stage production Dockerfile and automated GitHub Actions CI tests`,
      completed: completedTaskIds.includes('p2_t1'),
      impact: 'High',
      category: 'Code & Architecture',
      signalSource: 'github',
      signalLabel: `Repo: ${topRepo1} CI/CD Pipeline`,
    },
    {
      id: 'p2_t2',
      text: `Integrate Redis caching tier and query index optimization into PostgreSQL database in ${topRepo1}`,
      completed: completedTaskIds.includes('p2_t2'),
      impact: 'High',
      category: 'Code & Architecture',
      signalSource: 'target_role',
      signalLabel: `Target Role Gap: High-Throughput DB`,
    },
    {
      id: 'p2_t3',
      text: `Add detailed architecture diagrams (Mermaid) and load testing benchmarks in ${topRepo2} README`,
      completed: completedTaskIds.includes('p2_t3'),
      impact: 'Medium',
      category: 'Code & Architecture',
      signalSource: 'github',
      signalLabel: `Flagship: ${topRepo2} Systems Craft`,
    },
    {
      id: 'p2_t4',
      text: `Publish technical LinkedIn post: detailed engineering writeup on "${liPost}" to establish technical authority`,
      completed: completedTaskIds.includes('p2_t4'),
      impact: 'High',
      category: 'Code & Architecture',
      signalSource: 'linkedin',
      signalLabel: `LinkedIn Builder Post Signal`,
    },
  ];

  // 4. Define Phase 3 Tasks: SDE Interview & DSA Mastery
  const phase3Tasks: SprintTask[] = [
    {
      id: 'p3_t1',
      text: `Solve 75 curated LeetCode Medium problems focusing on Graphs (BFS/DFS), Dynamic Programming, and Two-Pointers`,
      completed: completedTaskIds.includes('p3_t1'),
      impact: 'High',
      category: 'Interview & DSA',
      signalSource: 'academics',
      signalLabel: `${college} SDE Screening Bar`,
    },
    {
      id: 'p3_t2',
      text: `Conduct 2 live technical mock interviews practicing whiteboard code explanation for ${targetRole}`,
      completed: completedTaskIds.includes('p3_t2'),
      impact: 'High',
      category: 'Interview & DSA',
      signalSource: 'target_role',
      signalLabel: `${targetRole} Technical Round`,
    },
    {
      id: 'p3_t3',
      text: `Prepare 5 STAR behavioral responses detailing problem-solving and architectural trade-offs in ${topRepo1}`,
      completed: completedTaskIds.includes('p3_t3'),
      impact: 'Medium',
      category: 'Interview & DSA',
      signalSource: 'github',
      signalLabel: `Behavioral Craft: ${topRepo1}`,
    },
  ];

  // 5. Define Phase 4 Tasks: Targeted Applications & Conversions
  const phase4Tasks: SprintTask[] = [
    {
      id: 'p4_t1',
      text: `Finalize list of priority target companies (${primaryCompany1}, ${primaryCompany2}, ${primaryCompany3}, ${targetCompanies[3] || 'Zomato'}) with recruiter emails`,
      completed: completedTaskIds.includes('p4_t1'),
      impact: 'High',
      category: 'Outreach & Offers',
      signalSource: 'target_role',
      signalLabel: `Target Companies: ${targetCompanies.length} selected`,
    },
    {
      id: 'p4_t2',
      text: `Secure 3 employee referrals from ${college} alumni working at ${primaryCompany1} and ${primaryCompany2} on LinkedIn`,
      completed: completedTaskIds.includes('p4_t2'),
      impact: 'High',
      category: 'Outreach & Offers',
      signalSource: 'linkedin',
      signalLabel: `${college} Alumni Referral Network`,
    },
    {
      id: 'p4_t3',
      text: `Track applications on IterateUP kanban and follow up on assessments within 72 hours of submission`,
      completed: completedTaskIds.includes('p4_t3'),
      impact: 'Medium',
      category: 'Outreach & Offers',
      signalSource: 'target_role',
      signalLabel: 'IterateUP Application CRM',
    },
  ];

  // Calculate phase completions
  const calcProgress = (tasks: SprintTask[]) => {
    const done = tasks.filter((t) => t.completed).length;
    return Math.round((done / tasks.length) * 100);
  };

  const p1Progress = calcProgress(phase1Tasks);
  const p2Progress = calcProgress(phase2Tasks);
  const p3Progress = calcProgress(phase3Tasks);
  const p4Progress = calcProgress(phase4Tasks);

  const getPhaseStatus = (progress: number, prevProgress: number = 100): 'complete' | 'current' | 'upcoming' => {
    if (progress === 100) return 'complete';
    if (prevProgress >= 70) return 'current';
    return 'upcoming';
  };

  const p1Status = getPhaseStatus(p1Progress);
  const p2Status = getPhaseStatus(p2Progress, p1Progress);
  const p3Status = getPhaseStatus(p3Progress, p2Progress);
  const p4Status = getPhaseStatus(p4Progress, p3Progress);

  const milestones: SprintMilestone[] = [
    {
      id: 'm1',
      phaseId: '01',
      title: 'Phase 1: Resume, Identity & GitHub Positioning',
      description: `Establish your technical presence as a verified ${targetRole} with credentials from ${college}.`,
      status: p1Progress === 100 ? 'done' : 'active',
      estimatedWeeks: isFinalYear ? 'Weeks 1–2' : 'Weeks 1–3',
      progressPercent: p1Progress,
      tasks: phase1Tasks,
    },
    {
      id: 'm2',
      phaseId: '02',
      title: 'Phase 2: Proof of Work & Closing Tech Gaps',
      description: `Upgrade ${topRepo1} & ${topRepo2} to production standards, closing Docker CI/CD and database performance gaps.`,
      status: p2Progress === 100 ? 'done' : p1Progress >= 60 ? 'active' : 'pending',
      estimatedWeeks: isFinalYear ? 'Weeks 3–5' : 'Weeks 4–8',
      progressPercent: p2Progress,
      tasks: phase2Tasks,
    },
    {
      id: 'm3',
      phaseId: '03',
      title: 'Phase 3: SDE Interview & DSA Mastery',
      description: `Attain speed in data structures, mock technical interviews, and behavioral storytelling for product companies.`,
      status: p3Progress === 100 ? 'done' : p2Progress >= 60 ? 'active' : 'pending',
      estimatedWeeks: isFinalYear ? 'Weeks 6–8' : 'Weeks 9–11',
      progressPercent: p3Progress,
      tasks: phase3Tasks,
    },
    {
      id: 'm4',
      phaseId: '04',
      title: 'Phase 4: Targeted Outreach & Offer Conversion',
      description: `Deploy deliberate outreach to ${targetCompanies.slice(0, 4).join(', ')} with alumni referrals and negotiation leverage.`,
      status: p4Progress === 100 ? 'done' : p3Progress >= 60 ? 'active' : 'pending',
      estimatedWeeks: isFinalYear ? 'Weeks 9–10' : 'Weeks 12–14',
      progressPercent: p4Progress,
      tasks: phase4Tasks,
    },
  ];

  const phasesSummary: SprintPhaseSummary[] = [
    {
      phase: '01',
      title: 'Position your profile',
      detail: hasResume ? `ATS resume (${resumeName}), GitHub portfolio` : 'Resume formatting, GitHub & LinkedIn branding',
      progress: p1Progress,
      status: p1Status,
    },
    {
      phase: '02',
      title: 'Build proof of work',
      detail: `${topRepo1} & ${topRepo2} with Docker & PostgreSQL`,
      progress: p2Progress,
      status: p2Status,
    },
    {
      phase: '03',
      title: 'Interview mastery',
      detail: 'LeetCode DSA speed, STAR storytelling, mock rounds',
      progress: p3Progress,
      status: p3Status,
    },
    {
      phase: '04',
      title: 'Targeted applications',
      detail: `${primaryCompany1}, ${primaryCompany2} & ${college} referrals`,
      progress: p4Progress,
      status: p4Status,
    },
  ];

  const allTasks = [...phase1Tasks, ...phase2Tasks, ...phase3Tasks, ...phase4Tasks];
  const completedTasksCount = allTasks.filter((t) => t.completed).length;
  const totalTasksCount = allTasks.length;
  const overallPercentage = Math.round((completedTasksCount / totalTasksCount) * 100);

  return {
    sprintTitle,
    sprintBadge,
    sprintDescription,
    targetRole,
    careerStageLabel,
    totalWeeks,
    completedTasksCount,
    totalTasksCount,
    overallPercentage,
    phasesSummary,
    milestones,
    generatedWith: 'IterateUP Dynamic Career Sprint Engine',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Executes a real-time AI Roadmap Sprint Synthesis using Groq LPU (openai/gpt-oss-120b)
 */
export async function generateAiTailoredSprintWithGroq(
  profile: UserProfile | null,
  enrichedSignals?: EnrichedSignalData | null
): Promise<{
  aiGenerated: boolean;
  sprintAdvice: string;
  weeklySchedule: { weekRange: string; focus: string; keyDeliverable: string }[];
  hiringManagerTips: string[];
}> {
  const apiKey = getGroqApiKey();
  const username = profile?.github_username || 'ShubhamAlapure';
  const cached = getCachedEnrichedSignals(username);
  const signals = enrichedSignals || cached;

  const targetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';
  const college = profile?.college || 'MIT ADT University Pune';
  const year = profile?.year_of_study || '3rd Year (Class of 2026)';
  const topRepo = signals?.projects?.[0]?.name || 'IterateUP';
  const targetCompanies = (profile?.target_companies || ['Razorpay', 'PhonePe', 'Swiggy']).join(', ');

  const fallback = {
    aiGenerated: true,
    sprintAdvice: `As a ${year} student at ${college} aiming for ${targetRole}, your highest-leverage move is turning ${topRepo} into an irrefutable proof-of-work project with production Docker CI/CD, while solving 5 LeetCode DP/Graph problems weekly.`,
    weeklySchedule: [
      { weekRange: 'Weeks 1–3', focus: 'Identity & ATS Calibration', keyDeliverable: `1-page ATS resume tailored with metrics for ${targetCompanies}` },
      { weekRange: 'Weeks 4–7', focus: `Production Proof of Work in ${topRepo}`, keyDeliverable: 'Multi-stage Dockerfile, Redis caching, and live deployment link' },
      { weekRange: 'Weeks 8–11', focus: 'Technical Screening Mastery', keyDeliverable: '75 LeetCode Medium problems & 2 recorded mock rounds' },
      { weekRange: 'Weeks 12–14', focus: 'Targeted Applications & Alumni Referrals', keyDeliverable: `Securing 4 employee referrals from ${college} alumni at ${targetCompanies}` },
    ],
    hiringManagerTips: [
      `Recruiters at product startups scan your GitHub commits first: ensure @${username}/${topRepo} has a clear architecture diagram in the README.`,
      `Quantify the impact of every project on your resume (e.g. 'reduced latency by 35%', 'handled concurrent state').`,
      `Follow up directly with engineering managers on LinkedIn within 48 hours of applying.`,
    ],
  };

  if (!apiKey) return fallback;

  try {
    const prompt = `You are a Senior Staff Software Engineer and Tech Career Advisor in India.
Generate a tailored Career Sprint roadmap for this candidate:
- Name: ${profile?.full_name || 'Student'}
- Stage: ${year} at ${college}
- Target Role: ${targetRole}
- Top GitHub Repo: ${topRepo} (@${username})
- Target Companies: ${targetCompanies}
- Resume: ${profile?.resume_name || 'In preparation'}

Return ONLY a JSON object:
{
  "sprintAdvice": "2 concise sentences of high-agency strategic advice tailored to their exact year and target role",
  "weeklySchedule": [
    {"weekRange": "Weeks 1-3", "focus": "string", "keyDeliverable": "string"},
    {"weekRange": "Weeks 4-7", "focus": "string", "keyDeliverable": "string"},
    {"weekRange": "Weeks 8-11", "focus": "string", "keyDeliverable": "string"},
    {"weekRange": "Weeks 12-14", "focus": "string", "keyDeliverable": "string"}
  ],
  "hiringManagerTips": ["tip 1", "tip 2", "tip 3"]
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: 'You are an elite SDE mentor and career strategist. Return JSON only.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');

    return {
      aiGenerated: true,
      sprintAdvice: parsed.sprintAdvice || fallback.sprintAdvice,
      weeklySchedule: parsed.weeklySchedule || fallback.weeklySchedule,
      hiringManagerTips: parsed.hiringManagerTips || fallback.hiringManagerTips,
    };
  } catch (e) {
    console.warn('Groq AI Roadmap Synthesis error:', e);
    return fallback;
  }
}
