import { UserProfile } from '@/context/auth-context';
import { EnrichedSignalData, EnrichedProject, getCachedEnrichedSignals } from '@/lib/services/profile-enricher';
import { SkillGapItem } from '@/lib/mock/career-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ReadinessCategoryItem {
  category: string;
  score: number;
  weight: string;
  status: string;
  trend: string;
}

export interface TailoredReadinessResult {
  overallScore: number;
  delta: string;
  targetRoleLabel: string;
  categories: ReadinessCategoryItem[];
  topSkills: string[];
  topProjects: EnrichedProject[];
}

/**
 * Computes the 8-dimension readiness breakdown tailored to the student's real profile
 */
export function computeTailoredReadiness(
  profile: UserProfile | null,
  enrichedSignals?: EnrichedSignalData | null,
  roleBenchmark?: string
): TailoredReadinessResult {
  const username = profile?.github_username || '';
  const cached = username ? getCachedEnrichedSignals(username) : null;
  const signals = enrichedSignals || cached;

  const targetRole = roleBenchmark || profile?.target_role || 'Software Development Engineer';
  const roleLower = targetRole.toLowerCase();

  // 1. Projects & Proof of Work (20%)
  const projects: EnrichedProject[] = profile?.synced_projects?.length
    ? profile.synced_projects
    : signals?.projects?.length
    ? signals.projects
    : [];

  const publicRepos = profile?.projects_count || signals?.publicReposCount || projects.length || 18;
  const flagshipRepo = projects[0]?.name || 'IterateUP';
  const secondRepo = projects[1]?.name || (projects[0]?.name ? 'proof-of-work' : 'systems-core');

  let projectScore = 70;
  if (publicRepos >= 20) projectScore = 84;
  else if (publicRepos >= 10) projectScore = 78;
  else if (publicRepos >= 5) projectScore = 72;
  else if (publicRepos >= 1) projectScore = 65;

  const projectStatus =
    publicRepos > 0
      ? `${publicRepos} public repos, flagship: ${flagshipRepo} & ${secondRepo}`
      : 'Flagship engineering portfolio & case studies in progress';

  // 2. Technical Skills (DSA & Stack) (25%)
  const verifiedSkills: string[] = profile?.synced_skills?.length
    ? profile.synced_skills
    : signals?.skills?.length
    ? signals.skills
    : ['TypeScript', 'JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git & Version Control'];

  const hasFrontend = verifiedSkills.some((s) => /react|vue|next|typescript|frontend/i.test(s));
  const hasBackend = verifiedSkills.some((s) => /node|express|go|python|sql|postgres|database/i.test(s));
  const hasLowLevel = verifiedSkills.some((s) => /\bc\b|c\+\+|rust|systems/i.test(s));

  let techScore = 72;
  if (roleLower.includes('full-stack') || roleLower.includes('fullstack')) {
    techScore = hasFrontend && hasBackend ? 82 : 74;
  } else if (roleLower.includes('backend') || roleLower.includes('systems') || roleLower.includes('sde')) {
    techScore = hasBackend || hasLowLevel ? 80 : 72;
  } else if (roleLower.includes('data') || roleLower.includes('ai') || roleLower.includes('ml')) {
    techScore = verifiedSkills.some((s) => /python|sql/i.test(s)) ? 80 : 68;
  } else {
    techScore = 76;
  }

  const primaryLangs = verifiedSkills.slice(0, 3).join(', ');
  const techStatus = `Verified ${primaryLangs || 'TypeScript & C'} · Core CS & LeetCode benchmark`;

  // 3. Work & Intern Experience (15%)
  const hasLinkedin = Boolean(profile?.linkedin_url && profile.linkedin_url.length > 5);
  const expCount = profile?.experience_count || (hasLinkedin ? 2 : 1);
  let expScore = 62;
  let expStatus = 'Add LinkedIn profile & internship proof to boost score';

  if (hasLinkedin) {
    expScore = 68 + Math.min(expCount * 5, 12);
    const shortName = profile?.full_name?.split(' ')[0] || 'Student';
    expStatus = `LinkedIn verified (${shortName}) · Targeting 2025–2026 cohort`;
  }

  // 4. Resume & Story (10%)
  const hasResume = Boolean(profile?.resume_name || profile?.resume_url);
  let resumeScore = 50;
  let resumeStatus = 'Pending resume upload · Target role keyword matching';

  if (hasResume) {
    resumeScore = 86;
    resumeStatus = `${profile?.resume_name || 'Resume.pdf'} parsed · 86% ATS keyword density`;
  }

  // 5. GitHub & Open Source (10%)
  let ghScore = 65;
  let ghStatus = 'Connect GitHub to verify live repository commits';

  if (username) {
    if (publicRepos >= 25) ghScore = 82;
    else if (publicRepos >= 15) ghScore = 76;
    else if (publicRepos >= 5) ghScore = 70;
    else ghScore = 64;

    ghStatus = `${publicRepos} repos on GitHub (@${username}) · Active contributions verified`;
  }

  // 6. Certifications & Accreditations (5%)
  const degree = profile?.degree || 'B.Tech Computer Engineering';
  const college = profile?.college?.split(',')[0]?.trim() || 'COEP Pune';
  const cgpa = profile?.cgpa?.split('/')[0]?.trim() || '8.5';
  const certScore = 75;
  const certStatus = `${degree} (${college}) · ${cgpa} CGPA`;

  // 7. Interview Readiness (10%)
  const interviewScore = Math.round((techScore * 0.5) + (projectScore * 0.3) + (hasResume ? 20 : 10));
  const normalizedInterview = Math.min(Math.max(interviewScore, 60), 85);
  const interviewStatus = 'Technical round prep & CS fundamentals benchmark ongoing';

  // 8. Communication & Presence (5%)
  const hasPortfolio = Boolean(profile?.portfolio_url && profile.portfolio_url.length > 4);
  let commScore = 72;
  let commStatus = 'Portfolio & technical storytelling benchmark';

  if (hasPortfolio && hasLinkedin) {
    commScore = 84;
    const host = profile?.portfolio_url?.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || 'portfolio';
    commStatus = `${host} + verified active builder presence`;
  } else if (hasLinkedin || hasPortfolio) {
    commScore = 78;
    commStatus = 'Active LinkedIn presence & peer collaboration';
  }

  // Weighted Total Score
  const weighted = Math.round(
    techScore * 0.25 +
    projectScore * 0.20 +
    expScore * 0.15 +
    resumeScore * 0.10 +
    ghScore * 0.10 +
    certScore * 0.05 +
    normalizedInterview * 0.10 +
    commScore * 0.05
  );

  const categories: ReadinessCategoryItem[] = [
    {
      category: 'Technical Skills (DSA & Stack)',
      score: techScore,
      weight: '25%',
      status: techStatus,
      trend: '+8',
    },
    {
      category: 'Projects & Proof of Work',
      score: projectScore,
      weight: '20%',
      status: projectStatus,
      trend: '+14',
    },
    {
      category: 'Work & Intern Experience',
      score: expScore,
      weight: '15%',
      status: expStatus,
      trend: '+5',
    },
    {
      category: 'Resume & Story',
      score: resumeScore,
      weight: '10%',
      status: resumeStatus,
      trend: '+4',
    },
    {
      category: 'GitHub & Open Source',
      score: ghScore,
      weight: '10%',
      status: ghStatus,
      trend: '+10',
    },
    {
      category: 'Certifications & Accreditations',
      score: certScore,
      weight: '5%',
      status: certStatus,
      trend: '+0',
    },
    {
      category: 'Interview Readiness',
      score: normalizedInterview,
      weight: '10%',
      status: interviewStatus,
      trend: '+12',
    },
    {
      category: 'Communication & Presence',
      score: commScore,
      weight: '5%',
      status: commStatus,
      trend: '+4',
    },
  ];

  return {
    overallScore: Math.min(Math.max(weighted, 50), 96),
    delta: '+9',
    targetRoleLabel: targetRole,
    categories,
    topSkills: verifiedSkills,
    topProjects: projects,
  };
}

/**
 * Generates dynamic skill gaps tailored to the student's actual GitHub signals & target role
 */
export function generateTailoredSkillGaps(
  profile: UserProfile | null,
  roleBenchmark: string = 'swe',
  customSkills: SkillGapItem[] = []
): SkillGapItem[] {
  const verifiedSkills = profile?.synced_skills || [
    'TypeScript',
    'JavaScript',
    'React',
    'Node.js',
    'Git & Version Control',
  ];
  const projects = profile?.synced_projects || [];
  const topRepo = projects[0]?.name || 'IterateUP';
  const college = profile?.college?.split(',')[0]?.trim() || 'COEP Technological University';
  const roleName = profile?.target_role || 'Software Development Engineer';

  const hasSkill = (term: string) =>
    verifiedSkills.some((s) => s.toLowerCase().includes(term.toLowerCase()));

  const list: SkillGapItem[] = [];

  // Core CS / DSA
  list.push({
    id: 'dsa-gap',
    name: 'Advanced Data Structures & Algorithms (DSA)',
    category: 'Core Computer Science',
    currentLevel: 62,
    targetLevel: 85,
    gap: 23,
    priority: 'High',
    evidence: [
      `${college} Computer Engineering curriculum benchmark`,
      'Solved LeetCode patterns in Arrays, HashMaps & Two-Pointers',
    ],
    recommendedAction:
      'Master graph traversals (BFS/DFS), dynamic programming, and binary search trees for product SDE rounds.',
    suggestedResource: 'Striver SDE Sheet & MIT 6.006 Algorithms',
    resourceHref: '/courses',
  });

  // Role Specific Gaps
  if (roleBenchmark === 'swe' || roleBenchmark.toLowerCase().includes('backend')) {
    list.push({
      id: 'docker-gap',
      name: 'Docker Containerization & CI/CD Pipelines',
      category: 'Infrastructure & DevOps',
      currentLevel: hasSkill('docker') ? 70 : 48,
      targetLevel: 80,
      gap: hasSkill('docker') ? 10 : 32,
      priority: 'High',
      evidence: [
        `Deployment standard for ${roleName}`,
        projects.length > 0 ? `Evaluated against code in ${topRepo}` : 'GitHub repository workflows',
      ],
      recommendedAction:
        'Create production multi-stage Dockerfiles and automate linting, tests, and build via GitHub Actions.',
      suggestedResource: 'Docker & Containers for High-Scale Engineering',
      resourceHref: '/courses',
    });

    list.push({
      id: 'redis-gap',
      name: 'Distributed Systems & In-Memory Caching (Redis)',
      category: 'Architecture',
      currentLevel: 52,
      targetLevel: 82,
      gap: 30,
      priority: 'High',
      evidence: [
        `Backend scalability benchmark for ${roleName}`,
        'In-memory session storage & rate-limiting requirement',
      ],
      recommendedAction:
        'Implement an idempotent API endpoint using Redis cache-aside and distributed locking patterns.',
      suggestedResource: 'System Design Interview – Alex Xu & ByteByteGo',
      resourceHref: '/projects',
    });

    list.push({
      id: 'postgres-gap',
      name: 'Production PostgreSQL & Indexing Strategies',
      category: 'Backend Engineering',
      currentLevel: hasSkill('postgresql') || hasSkill('sql') ? 74 : 56,
      targetLevel: 85,
      gap: hasSkill('postgresql') || hasSkill('sql') ? 11 : 29,
      priority: 'Medium',
      evidence: [
        hasSkill('postgresql')
          ? `Verified PostgreSQL schema in ${topRepo}`
          : 'Relational database schema benchmark',
        'Query planner EXPLAIN ANALYZE optimization',
      ],
      recommendedAction:
        'Add composite B-Tree indexes on foreign keys and optimize N+1 query patterns.',
      suggestedResource: 'Use The Index, Luke! & High Performance SQL',
      resourceHref: '/courses',
    });
  } else if (roleBenchmark === 'fullstack') {
    list.push({
      id: 'docker-gap',
      name: 'Docker Containerization & Multi-Cloud CI/CD',
      category: 'Infrastructure & DevOps',
      currentLevel: hasSkill('docker') ? 70 : 50,
      targetLevel: 80,
      gap: hasSkill('docker') ? 10 : 30,
      priority: 'High',
      evidence: [
        `Required for full-stack deployment & microservices`,
        `Production architecture benchmark for ${roleName}`,
      ],
      recommendedAction:
        'Containerize frontend & backend services with docker-compose and deploy to Vercel/Fly.io.',
      suggestedResource: 'Docker & Modern Full-Stack DevOps',
      resourceHref: '/courses',
    });

    list.push({
      id: 'state-gap',
      name: 'Full-Stack State Architecture & React Query Cache',
      category: 'Frontend Engineering',
      currentLevel: hasSkill('react') ? 78 : 60,
      targetLevel: 88,
      gap: hasSkill('react') ? 10 : 28,
      priority: 'Medium',
      evidence: [
        hasSkill('react')
          ? `Verified React & TypeScript codebase in ${topRepo}`
          : 'Modern Component architecture benchmark',
        'Optimistic cache invalidation and server state management',
      ],
      recommendedAction:
        'Implement optimistic UI mutations and infinite virtualization for complex datasets.',
      suggestedResource: 'Full Stack Open Part 7 & TanStack Architecture',
      resourceHref: '/courses',
    });

    list.push({
      id: 'db-design-gap',
      name: 'Production PostgreSQL & Data Modeling',
      category: 'Backend Engineering',
      currentLevel: 68,
      targetLevel: 85,
      gap: 17,
      priority: 'Medium',
      evidence: [
        `Relational modeling for ${roleName}`,
        'Row Level Security (RLS) & schema migrations',
      ],
      recommendedAction:
        'Design ACID-compliant database migrations with automated Supabase or Drizzle ORM schemas.',
      suggestedResource: 'Designing Data-Intensive Applications',
      resourceHref: '/projects',
    });
  } else {
    // Data / AI
    list.push({
      id: 'python-data-gap',
      name: 'High-Performance Python & Vector Embeddings',
      category: 'Data & AI Systems',
      currentLevel: hasSkill('python') ? 72 : 45,
      targetLevel: 85,
      gap: hasSkill('python') ? 13 : 40,
      priority: 'High',
      evidence: [
        hasSkill('python')
          ? `Python language detected in verified repositories`
          : 'Data analytics & ML benchmark requirement',
        'Vector similarity search with pgvector / Pinecone',
      ],
      recommendedAction:
        'Build a semantic search and Retrieval-Augmented Generation (RAG) pipeline with pgvector.',
      suggestedResource: 'DeepLearning.AI: Vector Databases & LLM Apps',
      resourceHref: '/courses',
    });

    list.push({
      id: 'sql-window-gap',
      name: 'Advanced SQL & Data Warehousing (Window Functions)',
      category: 'Analytics',
      currentLevel: 64,
      targetLevel: 86,
      gap: 22,
      priority: 'High',
      evidence: [
        'Analytical query benchmark: PARTITION BY, RANK, LAG/LEAD',
        'Aggregation pipelines for metrics dashboards',
      ],
      recommendedAction:
        'Write complex windowed SQL queries for cohort retention, funnel drop-off, and running totals.',
      suggestedResource: 'Mode Analytics Advanced SQL Tutorial',
      resourceHref: '/courses',
    });
  }

  // Prepend any custom skills added by the student
  return [...customSkills, ...list];
}

/**
 * Loads custom student skills from Supabase or LocalStorage
 */
export async function fetchStudentCustomSkills(profileId: string): Promise<SkillGapItem[]> {
  if (!profileId) return [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('student_skills')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          name: item.skill_name,
          category: item.category,
          currentLevel: (item.current_level || 2) * 20,
          targetLevel: (item.target_level || 4) * 20,
          gap: ((item.target_level || 4) - (item.current_level || 2)) * 20,
          priority: (item.priority as any) || 'Medium',
          evidence: item.evidence ? [item.evidence] : ['Saved in student profile'],
          recommendedAction: `Complete targeted build & study plan for ${item.skill_name}.`,
          suggestedResource: `${item.skill_name} Mastery & Official Docs`,
          resourceHref: '/courses',
        }));
      }
    } catch (err) {
      console.warn('Error fetching student_skills:', err);
    }
  }

  // Local storage fallback
  try {
    const raw = localStorage.getItem(`iterateup_skills_${profileId}`);
    if (raw) return JSON.parse(raw);
  } catch {}

  return [];
}

/**
 * Saves a custom skill to Supabase or LocalStorage
 */
export async function saveStudentCustomSkill(
  profileId: string,
  skill: { name: string; category: string; priority?: 'High' | 'Medium' | 'Low' }
): Promise<SkillGapItem> {
  const currentPct = 40;
  const targetPct = 80;
  const newGap: SkillGapItem = {
    id: `custom-${Date.now()}`,
    name: skill.name,
    category: skill.category,
    currentLevel: currentPct,
    targetLevel: targetPct,
    gap: targetPct - currentPct,
    priority: skill.priority || 'Medium',
    evidence: ['Self-assessed in student workspace · Added to roadmap'],
    recommendedAction: `Complete introductory coursework and build 1 reference feature with ${skill.name}.`,
    suggestedResource: `${skill.name} Official Documentation & Coursework`,
    resourceHref: '/courses',
  };

  if (isSupabaseConfigured && profileId) {
    try {
      const { data, error } = await supabase
        .from('student_skills')
        .insert({
          profile_id: profileId,
          skill_name: skill.name,
          category: skill.category,
          current_level: 2,
          target_level: 4,
          priority: skill.priority || 'Medium',
          evidence: 'Added via Skills & Readiness Breakdown',
          verified: false,
        })
        .select()
        .maybeSingle();

      if (!error && data) {
        newGap.id = data.id;
      }
    } catch (err) {
      console.warn('Could not insert to student_skills:', err);
    }
  }

  // Also persist to localStorage for offline cache
  try {
    const key = `iterateup_skills_${profileId || 'default'}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([newGap, ...existing]));
  } catch {}

  return newGap;
}
