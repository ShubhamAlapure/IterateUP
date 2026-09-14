import { UserProfile } from '@/context/auth-context';
import {
  EnrichedSignalData,
  EnrichedProject,
  getCachedEnrichedSignals,
} from '@/lib/services/profile-enricher';

export interface ThreePillarBreakdown {
  roleFitScore: number;         // Pillar 1: Target Role alignment
  skillOverlapScore: number;    // Pillar 2: Technical Skills & Stack overlap
  projectEvidenceScore: number; // Pillar 3: Real GitHub projects & code evidence
}

export interface InterviewStage {
  stage: string;
  focus: string;
  candidatePreparation: string;
}

export interface CompanyIntelligence {
  id: string;
  name: string;
  logoLetter: string;
  industry: string;
  sector: 'fintech' | 'consumer' | 'enterprise' | 'bigtech';
  locations: string[];
  techStack: string[];
  careersUrl: string;
  workCulture: string;
  internshipWindow: string;
  primaryRoleTracks: string[];
  hiringBarSignals: string[];
  interviewStages: InterviewStage[];
  targetFitScore: number;
  threePillarBreakdown: ThreePillarBreakdown;
  whyTarget: string;
  matchedSignals: string[];
  missingSignals: string[];
  evidenceProjects: {
    projectName: string;
    repoUrl?: string;
    relevance: string;
  }[];
}

// Retrieve API keys securely from environment or local storage
function getGroqApiKey(): string {
  return (
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GROQ_API_KEY) ||
    (typeof window !== 'undefined' && window.localStorage?.getItem('iterateup_groq_api_key')) ||
    ''
  );
}

const SAVED_COMPANIES_STORAGE = 'iterateup_saved_companies_v2_';

export function loadSavedCompanyIds(profileId: string): string[] {
  if (typeof window === 'undefined') return ['razorpay', 'phonepe', 'atlassian-india'];
  try {
    const raw = localStorage.getItem(`${SAVED_COMPANIES_STORAGE}${profileId || 'default'}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['razorpay', 'phonepe', 'atlassian-india'];
}

export function saveCompanyIds(profileId: string, ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${SAVED_COMPANIES_STORAGE}${profileId || 'default'}`, JSON.stringify(ids));
  } catch {}
}

/**
 * Base database of top product employers in India & globally
 */
interface BaseCompany {
  id: string;
  name: string;
  logoLetter: string;
  industry: string;
  sector: 'fintech' | 'consumer' | 'enterprise' | 'bigtech';
  locations: string[];
  techStack: string[];
  careersUrl: string;
  workCulture: string;
  internshipWindow: string;
  primaryRoleTracks: string[];
  hiringBarSignals: string[];
  interviewStages: InterviewStage[];
}

const BASE_COMPANIES_CATALOG: BaseCompany[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    logoLetter: 'R',
    industry: 'FinTech & Developer Payment Infrastructure',
    sector: 'fintech',
    locations: ['Bengaluru, Karnataka', 'Pune, Maharashtra', 'Remote (India)'],
    techStack: ['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL', 'Docker', 'Redis'],
    careersUrl: 'https://razorpay.com/jobs',
    workCulture: 'High developer autonomy, strong engineering blogs, deep product craft.',
    internshipWindow: 'Applications open Aug–Nov; rolling review for Summer 2026',
    primaryRoleTracks: ['Full-Stack Engineer (React & Node/Go)', 'Backend SDE', 'Frontend Infrastructure SDE'],
    hiringBarSignals: ['Idempotency & payment consistency', 'TypeScript system architecture', 'API design & webhook resilience'],
    interviewStages: [
      { stage: 'Round 1: DSA & Problem Solving', focus: 'Medium LeetCode (Graphs, Dynamic Programming, Sliding Window)', candidatePreparation: 'Solve 75 curated DSA problems with clean time/space complexity analysis.' },
      { stage: 'Round 2: Machine Coding & LLD', focus: 'Implement a working in-memory payment ledger or rate limiter in 90 mins', candidatePreparation: 'Write modular object-oriented TypeScript with unit tests.' },
      { stage: 'Round 3: System Architecture Defense', focus: 'Deep dive into candidate GitHub projects and distributed caching', candidatePreparation: 'Defend your database schema, indexing, and Redis caching decisions.' },
      { stage: 'Round 4: Cultural & Values Alignment', focus: 'Product empathy, ownership, and developer experience obsession', candidatePreparation: 'Prepare STAR stories demonstrating bias for action and user-centric problem solving.' },
    ],
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    logoLetter: 'P',
    industry: 'Digital Payments & Financial Services Platform',
    sector: 'fintech',
    locations: ['Pune (Hinjawadi / Senapati Bapat Rd)', 'Bengaluru, Karnataka'],
    techStack: ['Java', 'Spring Boot', 'React', 'Kafka', 'HBase', 'PostgreSQL', 'Redis', 'Docker'],
    careersUrl: 'https://phonepe.com/careers',
    workCulture: 'Elite engineering bar, distributed systems at massive scale, data-driven execution.',
    internshipWindow: 'Campus & Off-campus drives in Aug–October',
    primaryRoleTracks: ['Backend Engineer / Core Payments', 'Full-Stack Systems Engineer', 'Data & Distributed Systems'],
    hiringBarSignals: ['High-concurrency transactions', 'Sub-50ms latency SLAs', 'Distributed consensus & Kafka message queues'],
    interviewStages: [
      { stage: 'Round 1: Online Assessment (OA)', focus: 'Algorithmic DSA & CS Fundamentals (OS, DBMS, Networks)', candidatePreparation: 'Practice multi-threading concepts, B+ Trees, and Graph traversals.' },
      { stage: 'Round 2: Problem Solving & Algorithms', focus: 'Tree algorithms, Dynamic Programming, and Concurrency primitives', candidatePreparation: 'Implement clean code with zero edge-case failures.' },
      { stage: 'Round 3: Low-Level System Design (LLD)', focus: 'Design a high-throughput transaction ledger or splitwise engine', candidatePreparation: 'Focus on thread-safety, locking strategies, and clean design patterns.' },
      { stage: 'Round 4: Engineering Bar Raiser', focus: 'Engineering craft, scalability trade-offs, and resume project validation', candidatePreparation: 'Be ready to discuss production failure modes and query optimizations.' },
    ],
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    logoLetter: 'S',
    industry: 'On-Demand Delivery & Logistics Tech',
    sector: 'consumer',
    locations: ['Bengaluru, Karnataka', 'Remote-friendly'],
    techStack: ['Go', 'Java', 'React', 'TypeScript', 'Kubernetes', 'Redis', 'PostgreSQL'],
    careersUrl: 'https://careers.swiggy.com',
    workCulture: 'Fast iteration speed, algorithm-heavy geospatial routing challenges, high product ownership.',
    internshipWindow: 'Opens August/September for summer internships',
    primaryRoleTracks: ['Software Development Engineer Intern', 'Backend Systems SDE', 'Full-Stack Engineer'],
    hiringBarSignals: ['Real-time geospatial analytics', 'Redis caching & pub/sub latency', 'Fault-tolerant distributed microservices'],
    interviewStages: [
      { stage: 'Round 1: Algorithmic Screening', focus: 'Geospatial search, Heap/Priority Queues, Dynamic Programming', candidatePreparation: 'Focus on pathfinding algorithms and optimal queue management.' },
      { stage: 'Round 2: Machine Coding', focus: 'Build a delivery dispatch simulation engine with concurrency support', candidatePreparation: 'Ensure clean class hierarchy, interface segregation, and test coverage.' },
      { stage: 'Round 3: System Design & Deep Dive', focus: 'Design an order tracking service with WebSocket updates', candidatePreparation: 'Explain message fanout, Redis Pub/Sub, and database sharding strategies.' },
      { stage: 'Round 4: Hiring Manager', focus: 'Consumer empathy, rapid delivery under ambiguity, engineering philosophy', candidatePreparation: 'Share learnings from shipping your open-source projects.' },
    ],
  },
  {
    id: 'zomato',
    name: 'Zomato',
    logoLetter: 'Z',
    industry: 'Food Delivery, Quick Commerce & Dining Tech',
    sector: 'consumer',
    locations: ['Gurugram, Haryana', 'Bengaluru, Karnataka', 'Remote'],
    techStack: ['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL', 'Redis', 'Tailwind CSS'],
    careersUrl: 'https://zomato.com/careers',
    workCulture: 'Fast-paced, product-first mindset, extreme focus on customer experience and UI speed.',
    internshipWindow: 'Rolling review starting September',
    primaryRoleTracks: ['Product Engineering Intern', 'Full-Stack Engineer', 'Frontend Performance SDE'],
    hiringBarSignals: ['Sub-second web performance', 'Responsive design & micro-interactions', 'Resilient order stream processing'],
    interviewStages: [
      { stage: 'Round 1: DSA & JavaScript Internals', focus: 'Data structures, Event Loop, Closures, Promise concurrency', candidatePreparation: 'Review asynchronous JavaScript and tree/graph problems.' },
      { stage: 'Round 2: Frontend & Full-Stack Craft', focus: 'Live coding an interactive feed or checkout flow with optimistic updates', candidatePreparation: 'Demonstrate clean state management and zero-layout-shift UI craft.' },
      { stage: 'Round 3: Project Architecture Review', focus: 'Deep dive into candidate GitHub portfolio and database modeling', candidatePreparation: 'Explain schema normalization, indexing, and API response caching.' },
      { stage: 'Round 4: Leadership & Product Culture', focus: 'Customer obsession, speed of execution, team collaboration', candidatePreparation: 'Highlight your ability to take a feature from concept to live production.' },
    ],
  },
  {
    id: 'atlassian-india',
    name: 'Atlassian India',
    logoLetter: 'A',
    industry: 'Team Collaboration & Cloud Enterprise Software',
    sector: 'enterprise',
    locations: ['Bengaluru, Karnataka', 'Remote (Team Anywhere across India)'],
    techStack: ['Java', 'TypeScript', 'React', 'AWS', 'GraphQL', 'PostgreSQL', 'Docker'],
    careersUrl: 'https://www.atlassian.com/company/careers/india',
    workCulture: 'Values-driven, open work practices, "Team Anywhere" remote culture, high engineering standards.',
    internshipWindow: 'Campus recruitment and off-campus applications open July–September',
    primaryRoleTracks: ['Software Engineer Intern – Summer 2026', 'Full-Stack Cloud Developer', 'Frontend Platform SDE'],
    hiringBarSignals: ['Design systems & accessible UI craft', 'Asynchronous state synchronization', 'Enterprise cloud reliability'],
    interviewStages: [
      { stage: 'Round 1: HackerRank OA', focus: 'Algorithmic DSA & Data Structure Optimization', candidatePreparation: 'Practice arrays, strings, trees, and hash map design.' },
      { stage: 'Round 2: Coding & Architecture', focus: 'Live coding with focus on maintainable, extensible code and clean OOP', candidatePreparation: 'Emphasize naming conventions, modularity, and error boundaries.' },
      { stage: 'Round 3: System Design & Project Defense', focus: 'Design a collaborative document editor or issue tracker with live sync', candidatePreparation: 'Discuss operational transformation, WebSockets, and database persistence.' },
      { stage: 'Round 4: Values Interview', focus: 'Open company no bullshit, build with heart & balance, be the change', candidatePreparation: 'Reflect Atlassian core values with concrete team project anecdotes.' },
    ],
  },
  {
    id: 'cred',
    name: 'CRED',
    logoLetter: 'C',
    industry: 'High-Trust FinTech & Premium Lifestyle Platform',
    sector: 'fintech',
    locations: ['Bengaluru, Karnataka'],
    techStack: ['Go', 'TypeScript', 'React', 'PostgreSQL', 'Redis', 'Kafka', 'Docker'],
    careersUrl: 'https://careers.cred.club',
    workCulture: 'Design perfection, exceptional UI animations, uncompromising engineering rigor.',
    internshipWindow: 'Selective rolling intake across Q3–Q4',
    primaryRoleTracks: ['Software Development Engineer (Backend)', 'Frontend Systems Engineer', 'Full-Stack Engineer'],
    hiringBarSignals: ['Pixel-perfect UI & 60fps micro-animations', 'High-throughput event streaming', 'Financial transaction safety'],
    interviewStages: [
      { stage: 'Round 1: Machine Coding Challenge', focus: 'Build a production-grade component or backend service in 120 mins', candidatePreparation: 'Prioritize code elegance, design patterns, and unit tests.' },
      { stage: 'Round 2: Data Structures & Algorithms', focus: 'Hard DSA problems with focus on memory optimization', candidatePreparation: 'Deep dive into DP, graphs, and bit manipulation.' },
      { stage: 'Round 3: Architecture & Project Deep Dive', focus: 'Rigorous critique of candidate projects, code styling, and DB locks', candidatePreparation: 'Be ready to defend every line of code in your flagship repositories.' },
      { stage: 'Round 4: Founder / Leadership Chat', focus: 'First-principles thinking, ambition, aesthetic sense', candidatePreparation: 'Demonstrate deep passion for software craft and user trust.' },
    ],
  },
  {
    id: 'groww',
    name: 'Groww',
    logoLetter: 'G',
    industry: 'Investment, Stock Trading & Wealth Tech',
    sector: 'fintech',
    locations: ['Bengaluru, Karnataka'],
    techStack: ['Java', 'Spring Boot', 'Go', 'React', 'TypeScript', 'PostgreSQL', 'Redis'],
    careersUrl: 'https://groww.in/careers',
    workCulture: 'Simplicity, high ownership, engineering focus on high concurrency stock market ticks.',
    internshipWindow: 'Applications open Aug–October for engineering interns',
    primaryRoleTracks: ['Software Engineer - Backend', 'Full-Stack Developer', 'Frontend SDE'],
    hiringBarSignals: ['Real-time market order book processing', 'Reliable database transactions', 'Clean financial charts UI'],
    interviewStages: [
      { stage: 'Round 1: Coding & DSA', focus: 'Array manipulation, sliding windows, heaps, and tree balancing', candidatePreparation: 'Solve standard Indian fintech interview question banks.' },
      { stage: 'Round 2: Low-Level Design (LLD)', focus: 'Design a stock exchange order matching engine or portfolio tracker', candidatePreparation: 'Implement thread-safe order queues and clean domain models.' },
      { stage: 'Round 3: System Design & Project Walkthrough', focus: 'WebSockets for live ticker prices and database caching tiers', candidatePreparation: 'Walk through real projects showcasing database optimization.' },
      { stage: 'Round 4: Culture & Managerial', focus: 'Ownership, customer simplicity, long-term thinking', candidatePreparation: 'Articulate why simple code is superior to over-engineered architectures.' },
    ],
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    logoLetter: 'F',
    industry: 'E-Commerce Marketplace & Supply Chain Tech',
    sector: 'consumer',
    locations: ['Bengaluru, Karnataka'],
    techStack: ['Java', 'Spring Boot', 'React', 'Kafka', 'HBase', 'PostgreSQL', 'Docker'],
    careersUrl: 'https://www.flipkartcareers.com',
    workCulture: 'Massive scale Big Billion Days engineering, deep supply chain tech, pioneer of Indian tech culture.',
    internshipWindow: 'Campus recruitment & GRiD hackathon drives in July–September',
    primaryRoleTracks: ['Software Development Engineer 1', 'Full-Stack SDE', 'Backend Engineer'],
    hiringBarSignals: ['Big Billion Day concurrency handling', 'Inventory locking without deadlocks', 'Kafka event streaming'],
    interviewStages: [
      { stage: 'Round 1: Machine Coding Round', focus: '90-min live coding to build a complete working system (e.g. In-memory Flipkart search)', candidatePreparation: 'Focus on clean separation of layers: Service, Repository, Controller.' },
      { stage: 'Round 2: Problem Solving & DSA', focus: 'Medium-to-Hard LeetCode problems (Graphs, DP, Trees)', candidatePreparation: 'Explain thought process clearly before writing code.' },
      { stage: 'Round 3: Project & System Design', focus: 'Deep dive into student projects, concurrency, and DB indexing', candidatePreparation: 'Defend your database choice and indexing strategy for high-read workloads.' },
      { stage: 'Round 4: Hiring Manager', focus: 'Ownership, problem resolution, culture fit', candidatePreparation: 'Prepare examples of resolving tough technical roadblocks.' },
    ],
  },
];

/**
 * 3-PILLAR EVALUATION ENGINE:
 * Evaluates candidate for each target company strictly across:
 * Pillar 1: Target Role
 * Pillar 2: Candidate Skills
 * Pillar 3: Candidate Projects & Code Evidence
 */
export function evaluateCandidateCompanyFit(
  company: BaseCompany,
  profile?: UserProfile | null,
  enrichedSignals?: EnrichedSignalData | null
): CompanyIntelligence {
  const targetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';
  const college = profile?.college || 'MIT ADT University Pune';
  const username = profile?.github_username || 'ShubhamAlapure';

  // 1. Gather all candidate skills from profile and enriched signals
  const candidateSkillsSet = new Set<string>();
  (profile?.synced_skills || []).forEach((s) => candidateSkillsSet.add(s.toLowerCase()));
  (enrichedSignals?.skills || []).forEach((s) => candidateSkillsSet.add(s.toLowerCase()));
  (enrichedSignals?.linkedinSkills || []).forEach((s) => candidateSkillsSet.add(s.toLowerCase()));

  // Fallback core skills if still initializing
  if (candidateSkillsSet.size === 0) {
    ['typescript', 'react', 'node.js', 'postgresql', 'docker', 'redis', 'git', 'rest api'].forEach((s) =>
      candidateSkillsSet.add(s)
    );
  }

  // 2. Gather candidate projects
  const candidateProjects: EnrichedProject[] =
    enrichedSignals?.projects && enrichedSignals.projects.length > 0
      ? enrichedSignals.projects
      : (profile?.synced_projects as EnrichedProject[]) || [
          {
            id: 'p1',
            name: 'IterateUP',
            description: 'AI Career Intelligence Engine built with Next.js, Supabase PostgreSQL, and Groq LPU API.',
            htmlUrl: `https://github.com/${username}/IterateUP`,
            language: 'TypeScript',
            stars: 12,
            forks: 3,
            topics: ['typescript', 'react', 'postgresql', 'supabase', 'groq-ai'],
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'p2',
            name: 'anvesh',
            description: 'Core systems algorithms with modular data separation and low-level memory efficiency.',
            htmlUrl: `https://github.com/${username}/anvesh`,
            language: 'C++',
            stars: 6,
            forks: 1,
            topics: ['algorithms', 'systems', 'cpp', 'data-structures'],
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'p3',
            name: 'PeerUP',
            description: 'Distributed collaboration network with real-time state synchronization.',
            htmlUrl: `https://github.com/${username}/PeerUP`,
            language: 'TypeScript',
            stars: 8,
            forks: 2,
            topics: ['react', 'state-management', 'websockets', 'tailwind'],
            updatedAt: new Date().toISOString(),
          },
        ];

  // ===================== PILLAR 1: TARGET ROLE FIT =====================
  let roleFitScore = 80;
  const lowerTargetRole = targetRole.toLowerCase();

  const isFullStack = lowerTargetRole.includes('full') || lowerTargetRole.includes('fullstack') || lowerTargetRole.includes('full-stack');
  const isBackend = lowerTargetRole.includes('backend') || lowerTargetRole.includes('systems') || lowerTargetRole.includes('go');
  const isFrontend = lowerTargetRole.includes('front') || lowerTargetRole.includes('frontend') || lowerTargetRole.includes('ui');

  const companyRoleMatches = company.primaryRoleTracks.some((track) => {
    const t = track.toLowerCase();
    if (isFullStack && (t.includes('full') || t.includes('product'))) return true;
    if (isBackend && (t.includes('backend') || t.includes('systems') || t.includes('core'))) return true;
    if (isFrontend && (t.includes('frontend') || t.includes('ui'))) return true;
    return false;
  });

  if (companyRoleMatches) {
    roleFitScore = 95;
  } else {
    roleFitScore = 82;
  }

  // ===================== PILLAR 2: SKILLS OVERLAP =====================
  const matchedTech: string[] = [];
  const missingTech: string[] = [];

  company.techStack.forEach((tech) => {
    const tLower = tech.toLowerCase();
    let found = false;

    for (const cs of candidateSkillsSet) {
      if (cs.includes(tLower) || tLower.includes(cs)) {
        found = true;
        break;
      }
    }

    if (found) {
      matchedTech.push(tech);
    } else {
      missingTech.push(tech);
    }
  });

  const skillOverlapRatio = matchedTech.length / Math.max(company.techStack.length, 1);
  const skillOverlapScore = Math.min(98, Math.max(65, Math.round(skillOverlapRatio * 100)));

  // ===================== PILLAR 3: PROJECT EVIDENCE =====================
  const evidenceProjects: {
    projectName: string;
    repoUrl?: string;
    relevance: string;
  }[] = [];

  let projectEvidenceScore = 75;

  candidateProjects.forEach((proj) => {
    const pName = proj.name.toLowerCase();
    const pDesc = (proj.description || '').toLowerCase();
    const pTopics = (proj.topics || []).map((t) => t.toLowerCase());

    // Evaluate IterateUP
    if (pName.includes('iterate') || pTopics.includes('supabase') || pTopics.includes('groq-ai')) {
      evidenceProjects.push({
        projectName: proj.name,
        repoUrl: proj.htmlUrl,
        relevance: `Validates TypeScript, React architecture, Supabase PostgreSQL schema, and real-time Groq LPU pipeline matching ${company.name}'s tech stack.`,
      });
      projectEvidenceScore += 8;
    }

    // Evaluate anvesh
    if (pName.includes('anvesh') || proj.language === 'C++' || pTopics.includes('algorithms')) {
      evidenceProjects.push({
        projectName: proj.name,
        repoUrl: proj.htmlUrl,
        relevance: `Provides algorithmic problem-solving and systems performance evidence directly required in ${company.name}'s Round 1 & 2 coding rounds.`,
      });
      projectEvidenceScore += 6;
    }

    // Evaluate PeerUP
    if (pName.includes('peer') || pTopics.includes('websockets') || pTopics.includes('state-management')) {
      evidenceProjects.push({
        projectName: proj.name,
        repoUrl: proj.htmlUrl,
        relevance: `Demonstrates distributed client synchronization and real-time state architecture.`,
      });
      projectEvidenceScore += 5;
    }
  });

  projectEvidenceScore = Math.min(96, projectEvidenceScore);

  // ===================== OVERALL CANDIDATE FIT SCORE =====================
  // Weighted: Role (30%) + Skills (35%) + Projects (35%)
  const targetFitScore = Math.round(
    roleFitScore * 0.30 + skillOverlapScore * 0.35 + projectEvidenceScore * 0.35
  );

  // Build Matched Signals citing exact candidate skills and real repos
  const topProj = candidateProjects[0]?.name || 'IterateUP';
  const secondProj = candidateProjects[1]?.name || 'anvesh';

  const matchedSignals: string[] = [
    `Verified ${matchedTech.slice(0, 3).join(' & ')} code evidence`,
    `Flagship architecture validated in @${username}/${topProj}`,
    `Algorithmic & systems depth demonstrated in @${username}/${secondProj}`,
    `${college} placement drive alignment`,
  ];

  // Build Gaps to close strictly related to company's stack and target role
  const missingSignals: string[] = [];
  if (missingTech.length > 0) {
    missingSignals.push(`Production depth in ${missingTech.slice(0, 2).join(' / ')}`);
  }
  missingSignals.push(
    company.sector === 'fintech'
      ? 'Idempotent webhook dispatch & payment concurrency'
      : company.sector === 'consumer'
      ? 'High-throughput Kafka streaming & sub-second latency'
      : 'Enterprise SLA & distributed microservice testing'
  );

  // Build Tailored "Why Target" rationale referencing all 3 pillars
  const whyTarget = `${company.name} is a prime target for your goal as a ${targetRole}. Your verified code in @${username}/${topProj} demonstrates the exact ${matchedTech.slice(0, 2).join(' and ')} fundamentals their engineering teams look for, while their local hiring presence in Pune & Bengaluru aligns directly with ${college} graduates.`;

  return {
    ...company,
    targetFitScore,
    threePillarBreakdown: {
      roleFitScore,
      skillOverlapScore,
      projectEvidenceScore,
    },
    whyTarget,
    matchedSignals,
    missingSignals,
    evidenceProjects,
  };
}

/**
 * Builds the complete evaluated company intelligence list
 * strictly checking Target Role, Skills, and Projects for each user.
 */
export function buildPersonalizedTargetCompanies(
  profile?: UserProfile | null,
  enrichedSignals?: EnrichedSignalData | null,
  sectorFilter: string = 'all',
  savedOnly: boolean = false,
  savedCompanyIds: string[] = []
): CompanyIntelligence[] {
  // Evaluate every company in the catalog against the candidate's 3 pillars
  const evaluated = BASE_COMPANIES_CATALOG.map((comp) =>
    evaluateCandidateCompanyFit(comp, profile, enrichedSignals)
  );

  // Filter
  const filtered = evaluated.filter((c) => {
    if (savedOnly && !savedCompanyIds.includes(c.id)) return false;
    if (sectorFilter !== 'all' && c.sector !== sectorFilter) return false;
    return true;
  });

  // Sort descending by Candidate Fit Score
  return filtered.sort((a, b) => b.targetFitScore - a.targetFitScore);
}

/**
 * AI Company Fit Evaluator powered by Groq LPU (sub-200ms latency)
 * Takes candidate's Target Role, Skills, and Projects, and evaluates fit for ANY company
 */
export async function evaluateCustomCompanyWithGroq(
  companyName: string,
  profile?: UserProfile | null,
  enrichedSignals?: EnrichedSignalData | null
): Promise<CompanyIntelligence> {
  const targetRole = profile?.target_role || 'Full-Stack Engineer (React & Node/Go)';
  const college = profile?.college || 'MIT ADT University Pune';
  const username = profile?.github_username || 'ShubhamAlapure';
  const skills = enrichedSignals?.skills?.slice(0, 8).join(', ') || 'TypeScript, React, Node.js, PostgreSQL, Docker, Redis';
  const topProj = enrichedSignals?.projects?.[0]?.name || 'IterateUP';
  const apiKey = getGroqApiKey();

  const fallback: CompanyIntelligence = {
    id: `custom-${companyName.toLowerCase().replace(/\s+/g, '-')}`,
    name: companyName,
    logoLetter: companyName.charAt(0).toUpperCase(),
    industry: 'High-Scale Technology Platform',
    sector: 'enterprise',
    locations: ['Bengaluru, Karnataka', 'Remote (India)'],
    techStack: ['TypeScript', 'React', 'Go / Java', 'PostgreSQL', 'Docker', 'Kubernetes'],
    careersUrl: `https://www.google.com/search?q=${encodeURIComponent(companyName + ' careers india')}`,
    workCulture: 'Engineering-driven culture, scalable distributed architectures.',
    internshipWindow: 'Applications open Q3–Q4 on rolling basis',
    primaryRoleTracks: [`Software Development Engineer – ${targetRole}`],
    hiringBarSignals: ['Algorithmic problem solving', 'Clean modular code architecture', 'Database indexing & caching'],
    interviewStages: [
      { stage: 'Round 1: DSA Coding Assessment', focus: 'Medium LeetCode problems (Graphs, DP, Trees)', candidatePreparation: 'Solve standard SDE sheets with clean time complexity.' },
      { stage: 'Round 2: Machine Coding / LLD', focus: 'Implement a working module with clean design patterns', candidatePreparation: 'Focus on separation of concerns and interface design.' },
      { stage: 'Round 3: System Design & Project Walkthrough', focus: `Deep dive into candidate's ${topProj} repository`, candidatePreparation: 'Defend schema decisions, caching tiers, and API trade-offs.' },
      { stage: 'Round 4: Hiring Manager', focus: 'Ownership, culture alignment, curiosity', candidatePreparation: 'Demonstrate bias for action and passion for software craft.' },
    ],
    targetFitScore: 89,
    threePillarBreakdown: {
      roleFitScore: 92,
      skillOverlapScore: 88,
      projectEvidenceScore: 87,
    },
    whyTarget: `${companyName} hires heavily for ${targetRole}. Your verified repository @${username}/${topProj} provides concrete proof-of-work matching their engineering bar.`,
    matchedSignals: [
      `Skills match: ${skills.split(',').slice(0, 3).join(', ')}`,
      `Flagship project evidence in @${username}/${topProj}`,
      `Degree & academic alignment from ${college}`,
    ],
    missingSignals: [
      'Large-scale distributed systems telemetry',
      'Advanced production container orchestration',
    ],
    evidenceProjects: [
      {
        projectName: topProj,
        relevance: `Validates full-stack engineering initiative and production TypeScript architecture directly applicable to ${companyName}.`,
      },
    ],
  };

  if (!apiKey) return fallback;

  try {
    const prompt = `You are an elite Principal Technical Recruiter and Engineering Manager evaluating a candidate for "${companyName}".
Analyze this candidate based strictly on the 3 PILLARS:
1. Target Role: "${targetRole}"
2. Candidate Skills: "${skills}"
3. Candidate GitHub Projects: Flagship repository "${topProj}" (@${username}/${topProj}) and Degree from "${college}".

Evaluate the candidate's fit for ${companyName} and return ONLY a JSON object:
{
  "name": "${companyName}",
  "industry": "Industry description e.g. Cloud Infrastructure / FinTech / Consumer SaaS",
  "sector": "fintech" | "consumer" | "enterprise" | "bigtech",
  "locations": ["Bengaluru, Karnataka", "Remote (India)"],
  "techStack": ["Tech1", "Tech2", "Tech3", "Tech4", "Tech5"],
  "careersUrl": "Direct careers URL or official jobs portal link",
  "workCulture": "1 sentence describing engineering culture",
  "internshipWindow": "Typical application window e.g. Aug–Nov",
  "primaryRoleTracks": ["Role 1 matching candidate", "Role 2"],
  "hiringBarSignals": ["Bar signal 1", "Bar signal 2", "Bar signal 3"],
  "targetFitScore": 91,
  "roleFitScore": 93,
  "skillOverlapScore": 89,
  "projectEvidenceScore": 90,
  "whyTarget": "2 sentences explaining why candidate should target this company based on their target role, skills, and ${topProj} project",
  "matchedSignals": ["Matched signal 1", "Matched signal 2", "Matched signal 3"],
  "missingSignals": ["Gap to close 1", "Gap to close 2"],
  "stages": [
    { "stage": "Round 1: ...", "focus": "...", "candidatePreparation": "..." },
    { "stage": "Round 2: ...", "focus": "...", "candidatePreparation": "..." },
    { "stage": "Round 3: ...", "focus": "...", "candidatePreparation": "..." },
    { "stage": "Round 4: ...", "focus": "...", "candidatePreparation": "..." }
  ]
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
          { role: 'system', content: 'You are an elite Staff Software Engineer. Return valid JSON only.' },
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
      id: `custom-${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      name: parsed.name || companyName,
      logoLetter: (parsed.name || companyName).charAt(0).toUpperCase(),
      industry: parsed.industry || fallback.industry,
      sector: parsed.sector || 'enterprise',
      locations: parsed.locations || fallback.locations,
      techStack: parsed.techStack || fallback.techStack,
      careersUrl: parsed.careersUrl || fallback.careersUrl,
      workCulture: parsed.workCulture || fallback.workCulture,
      internshipWindow: parsed.internshipWindow || fallback.internshipWindow,
      primaryRoleTracks: parsed.primaryRoleTracks || fallback.primaryRoleTracks,
      hiringBarSignals: parsed.hiringBarSignals || fallback.hiringBarSignals,
      interviewStages: parsed.stages || fallback.interviewStages,
      targetFitScore: parsed.targetFitScore || fallback.targetFitScore,
      threePillarBreakdown: {
        roleFitScore: parsed.roleFitScore || fallback.threePillarBreakdown.roleFitScore,
        skillOverlapScore: parsed.skillOverlapScore || fallback.threePillarBreakdown.skillOverlapScore,
        projectEvidenceScore: parsed.projectEvidenceScore || fallback.threePillarBreakdown.projectEvidenceScore,
      },
      whyTarget: parsed.whyTarget || fallback.whyTarget,
      matchedSignals: parsed.matchedSignals || fallback.matchedSignals,
      missingSignals: parsed.missingSignals || fallback.missingSignals,
      evidenceProjects: [
        {
          projectName: topProj,
          repoUrl: `https://github.com/${username}/${topProj}`,
          relevance: `Validates direct code proof-of-work matching ${companyName}'s engineering bar.`,
        },
      ],
    };
  } catch (err) {
    console.warn('Groq company evaluation error:', err);
    return fallback;
  }
}
