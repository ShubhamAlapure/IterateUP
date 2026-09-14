export type ActionState = 'ready' | 'in-progress' | 'done';

export const mockStudent = {
  firstName: 'Aarav',
  fullName: 'Aarav Sharma',
  initials: 'AS',
  email: 'aarav.sharma@coep.ac.in',
  avatarUrl: '',
  school: 'COEP Technological University, Pune',
  year: 'B.Tech 3rd Year (Class of 2026)',
  field: 'Computer Engineering',
  target: 'Product-minded Software Engineer',
  location: 'Pune, Maharashtra, India',
  bio: 'Pre-final year Computer Engineering student at COEP Pune. Focused on building high-performance web systems, responsive UI craft, and scalable microservices. Active open-source builder and hackathon participant.',
  targetRoles: ['Product Engineer', 'SDE Intern', 'Full-Stack Developer'],
  preferredLocations: ['Pune', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Remote'],
  gpa: '8.94 / 10.0 CGPA',
};

export const readiness = {
  score: 72,
  delta: '+9',
  label: 'On a strong upward track',
  nextMilestone: 'Ship containerized proof-of-work project',
};

export const readinessBreakdown = [
  { category: 'Technical Skills (DSA & Stack)', score: 76, weight: '25%', status: 'Strong React & Core CS, LeetCode in progress', trend: '+8' },
  { category: 'Projects & Proof of Work', score: 78, weight: '20%', status: '2 public repos, 1 live Pune transit case study', trend: '+14' },
  { category: 'Work & Intern Experience', score: 65, weight: '15%', status: '1 Pune startup internship + CSI Tech Lead', trend: '+5' },
  { category: 'Resume & Story', score: 84, weight: '10%', status: 'High ATS parse rate, quantified metrics', trend: '+4' },
  { category: 'GitHub & Open Source', score: 70, weight: '10%', status: '34 repos, 482 commits on GitHub', trend: '+10' },
  { category: 'Certifications & Accreditations', score: 72, weight: '5%', status: 'AWS Cloud Practitioner & NPTEL Elite', trend: '+0' },
  { category: 'Interview Readiness', score: 62, weight: '10%', status: 'Behavioral ready, technical round prep ongoing', trend: '+12' },
  { category: 'Communication & Presence', score: 80, weight: '5%', status: 'Active portfolio, hackathon presenter', trend: '+4' },
];

export const todayActions = [
  { id: 'portfolio', title: 'Add live demo & architecture diagrams to CityTransit project', meta: '15 min · Highest impact', kind: 'Focus', state: 'ready' as ActionState, href: '/projects' },
  { id: 'leetcode', title: 'Solve 2 medium problems on Dynamic Programming & Sliding Window', meta: '35 min · SDE Skill gap: algorithms', kind: 'Practice', state: 'in-progress' as ActionState, href: '/skills' },
  { id: 'razorpay', title: 'Review Razorpay frontend internship match and requirements', meta: '5 min · 92% match', kind: 'Explore', state: 'ready' as ActionState, href: '/jobs' },
];

export const skills = [
  { name: 'Product thinking & UI craft', score: 80, trend: 'ahead', color: 'teal', category: 'Product Craft' },
  { name: 'Frontend systems (React & TS)', score: 76, trend: 'steady', color: 'teal', category: 'Frontend' },
  { name: 'Data structures & Algorithms (DSA)', score: 62, trend: 'focus', color: 'coral', category: 'Core CS' },
  { name: 'Backend API design (Node / Express)', score: 74, trend: 'steady', color: 'teal', category: 'Backend' },
  { name: 'Technical communication', score: 72, trend: 'building', color: 'gold', category: 'Soft Skills' },
  { name: 'Docker & Cloud deployment', score: 52, trend: 'focus', color: 'coral', category: 'Infrastructure' },
];

export interface SkillGapItem {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  evidence: string[];
  recommendedAction: string;
  suggestedResource: string;
  resourceHref: string;
}

export const skillGapsList: SkillGapItem[] = [
  {
    id: 'algos',
    name: 'Advanced Data Structures & Algorithms (DSA)',
    category: 'Core Computer Science',
    currentLevel: 62,
    targetLevel: 85,
    gap: 23,
    priority: 'High',
    evidence: ['COEP Data Structures & Algorithms Coursework (Grade AA)', 'Solved 115 LeetCode Easy/Medium problems'],
    recommendedAction: 'Master graph traversals (BFS/DFS), dynamic programming patterns, and binary search trees.',
    suggestedResource: 'Striver SDE Sheet & MIT 6.006 Algorithms',
    resourceHref: '/courses',
  },
  {
    id: 'docker',
    name: 'Docker Containerization & CI/CD',
    category: 'Infrastructure & DevOps',
    currentLevel: 50,
    targetLevel: 78,
    gap: 28,
    priority: 'High',
    evidence: ['Basic Dockerfile in CityTransit repository', 'Local docker-compose setup for Postgres & Redis'],
    recommendedAction: 'Create optimized multi-stage production Dockerfiles and set up automated GitHub Actions CI/CD.',
    suggestedResource: 'Docker & Containers for Developers',
    resourceHref: '/courses',
  },
  {
    id: 'system-design',
    name: 'High-Concurrency System Design',
    category: 'Architecture',
    currentLevel: 55,
    targetLevel: 80,
    gap: 25,
    priority: 'Medium',
    evidence: ['COEP Distributed Systems module', 'Redis caching experiment in UPI payment simulator'],
    recommendedAction: 'Design an idempotent payment processing pipeline with Redis rate-limiting and message queues.',
    suggestedResource: 'System Design Interview – Alex Xu',
    resourceHref: '/projects',
  },
  {
    id: 'state-mgmt',
    name: 'Advanced React State & Web Performance',
    category: 'Frontend Engineering',
    currentLevel: 76,
    targetLevel: 88,
    gap: 12,
    priority: 'Low',
    evidence: ['Built CityTransit with TanStack Query and custom memoization', 'Zustand state store for Tiny Teams India'],
    recommendedAction: 'Implement optimistic cache updates and virtualization for large Indian transit datasets.',
    suggestedResource: 'Full Stack Open Part 7: React Query',
    resourceHref: '/courses',
  },
  {
    id: 'db-indexing',
    name: 'PostgreSQL Query Optimization & Indexing',
    category: 'Backend & Data',
    currentLevel: 64,
    targetLevel: 80,
    gap: 16,
    priority: 'Medium',
    evidence: ['COEP DBMS Lab coursework', 'Drizzle ORM schema design for student team management'],
    recommendedAction: 'Profile high-latency queries using EXPLAIN ANALYZE and implement composite B-Tree indexes.',
    suggestedResource: 'High Performance PostgreSQL Foundations',
    resourceHref: '/courses',
  },
];

export const roadmap = [
  { phase: '01', title: 'Position your profile', detail: 'Resume, GitHub portfolio, and proof of work signal', status: 'complete', progress: 100 },
  { phase: '02', title: 'Build proof of work', detail: 'Full-stack apps closing DSA & Docker gaps', status: 'current', progress: 68 },
  { phase: '03', title: 'Interview mastery', detail: 'Technical screens, DSA speed, and STAR behavioral practice', status: 'upcoming', progress: 25 },
  { phase: '04', title: 'Targeted applications', detail: 'Top Indian startups, MNCs, and referral networks', status: 'upcoming', progress: 0 },
];

export interface RoadmapMilestone {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  status: 'done' | 'active' | 'pending';
  estimatedWeeks: string;
  tasks: { id: string; text: string; completed: boolean; impact: string }[];
}

export const roadmapMilestones: RoadmapMilestone[] = [
  {
    id: 'm1',
    phaseId: '01',
    title: 'Phase 1: Resume, Identity & GitHub Positioning',
    description: 'Establish your presence as a product-focused software engineer with quantifiable Indian student credentials.',
    status: 'done',
    estimatedWeeks: 'Weeks 1–3 (Completed)',
    tasks: [
      { id: 't1', text: 'Craft 1-page ATS-optimized resume highlighting B.Tech Computer Engineering at COEP Pune', completed: true, impact: 'High' },
      { id: 't2', text: 'Clean up GitHub profile README with pinned repositories and language stats', completed: true, impact: 'High' },
      { id: 't3', text: 'Deploy personal portfolio on custom domain (aaravsharma.dev) with live case studies', completed: true, impact: 'Medium' },
    ],
  },
  {
    id: 'm2',
    phaseId: '02',
    title: 'Phase 2: Proof of Work & Closing Tech Gaps',
    description: 'Build flagship projects specifically tailored to close your Docker, algorithms, and system design gaps.',
    status: 'active',
    estimatedWeeks: 'Weeks 4–8 (In Progress)',
    tasks: [
      { id: 't4', text: 'Complete CityTransit Pune real-time bus and metro route tracking platform', completed: true, impact: 'High' },
      { id: 't5', text: 'Build Tiny Teams India: Real-time collaborative workspace with Redis & WebSockets', completed: false, impact: 'High' },
      { id: 't6', text: 'Containerize full-stack services with Docker and deploy to production cloud', completed: false, impact: 'High' },
      { id: 't7', text: 'Publish technical deep-dive writeup on handling UPI idempotency and latency', completed: false, impact: 'Medium' },
    ],
  },
  {
    id: 'm3',
    phaseId: '03',
    title: 'Phase 3: SDE Interview & DSA Mastery',
    description: 'Gain fluency in data structures, behavioral STAR storytelling, and live pair-programming.',
    status: 'pending',
    estimatedWeeks: 'Weeks 9–11',
    tasks: [
      { id: 't8', text: 'Complete 75 curated problems from Striver SDE Sheet (Arrays, Graphs, DP)', completed: false, impact: 'High' },
      { id: 't9', text: 'Conduct 3 mock technical interviews with COEP alumni working at Razorpay and Microsoft', completed: false, impact: 'High' },
      { id: 't10', text: 'Prepare and refine 5 core STAR behavioral stories for tech leadership rounds', completed: false, impact: 'Medium' },
    ],
  },
  {
    id: 'm4',
    phaseId: '04',
    title: 'Phase 4: Targeted Outreach & Offer Conversion',
    description: 'Submit deliberate applications to prioritized companies and negotiate favorable compensation.',
    status: 'pending',
    estimatedWeeks: 'Weeks 12–14',
    tasks: [
      { id: 't11', text: 'Finalize top 25 target companies in Bengaluru, Pune, and Hyderabad with recruiter contacts', completed: false, impact: 'High' },
      { id: 't12', text: 'Secure 4 employee referrals from COEP Pune alumni network on LinkedIn', completed: false, impact: 'High' },
      { id: 't13', text: 'Apply for on-campus T&P drives and off-campus high-growth tech product internships', completed: false, impact: 'High' },
    ],
  },
];

export interface ProjectDetail {
  id: string;
  title: string;
  detail: string;
  tag: string;
  progress: number;
  color: 'teal' | 'coral' | 'gold';
  whyThisProject: string;
  skillGapAddressed: string;
  whatYouWillLearn: string[];
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  status: 'In Progress' | 'Planned' | 'Completed';
  specification: {
    overview: string;
    architecture: string;
    milestones: string[];
  };
}

export const projects: ProjectDetail[] = [
  {
    id: 'citytransit',
    title: 'CityTransit Pune',
    detail: 'Real-time Pune Metro & PMPML bus transit intelligence and multi-modal route navigation.',
    tag: 'Flagship Case Study',
    progress: 80,
    color: 'teal',
    status: 'In Progress',
    whyThisProject: 'Indian product companies (Swiggy, Zomato, Razorpay) look for candidates who turn real local infrastructure data into ultra-fast, responsive web interfaces.',
    skillGapAddressed: 'Data visualization, performance optimization, accessible UI craft, TypeScript architecture.',
    whatYouWillLearn: [
      'Parsing real-time GTFS transit feeds and Indian bus schedule datasets',
      'Building accessible route cards and interactive map overlays with sub-100ms render speeds',
      'Web worker offloading for compute-heavy shortest-path transit graph queries',
    ],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'TanStack Query', 'Mapbox GL', 'Node.js'],
    githubUrl: 'https://github.com/aaravsharma/citytransit-pune',
    liveUrl: 'https://citytransit.aaravsharma.dev',
    specification: {
      overview: 'A live dashboard aggregating Pune PMPML bus arrivals, metro lines, and estimated travel times across key hubs like Hinjawadi, Shivajinagar, and Kothrud.',
      architecture: 'Vite/React frontend + Express API gateway with cached transit route responses in Redis.',
      milestones: [
        'Data ingestion pipeline for Pune open transit data (Done)',
        'Accessible map filtering & stop arrival cards (Done)',
        'Worker-based route calculation engine (In Progress)',
        'Docker containerization and deployment to cloud (Upcoming)',
      ],
    },
  },
  {
    id: 'tinyteams',
    title: 'Tiny Teams India',
    detail: 'A friction-free collaborative workspace designed for college capstone & hackathon teams.',
    tag: 'Next Build',
    progress: 30,
    color: 'coral',
    status: 'Planned',
    whyThisProject: 'Demonstrates concurrency handling, WebSocket state synchronisation, and optimistic updates essential for modern collaborative SaaS companies.',
    skillGapAddressed: 'WebSockets, Redis pub/sub, Docker containers, concurrency handling, database schema modeling.',
    whatYouWillLearn: [
      'Building collaborative WebSocket rooms with conflict resolution for group tasks',
      'Implementing Redis pub/sub backplane for instant message broadcasting',
      'Dockerizing full-stack multi-container application with docker-compose',
    ],
    techStack: ['TypeScript', 'Express', 'WebSocket', 'PostgreSQL', 'Drizzle ORM', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/aaravsharma/tiny-teams-india',
    specification: {
      overview: 'Lightweight project planner built for Indian engineering college capstone teams with async check-ins and GitHub pull request links.',
      architecture: 'Modular Node.js service using WebSocket protocol + Postgres for persistence and Redis for presence.',
      milestones: [
        'Database schema design with Drizzle ORM (Done)',
        'Authentication & workspace membership model (In Progress)',
        'Real-time task board updates with WebSockets (Upcoming)',
        'Deployment with automated CI/CD pipeline (Upcoming)',
      ],
    },
  },
  {
    id: 'upi-engine',
    title: 'High-Concurrency UPI Gateway Simulator',
    detail: 'Idempotent payment webhook dispatcher and transaction analytics engine.',
    tag: 'Fintech Systems',
    progress: 92,
    color: 'teal',
    status: 'Completed',
    whyThisProject: 'Directly demonstrates distributed system fundamentals prized by top Indian fintechs (Razorpay, PhonePe, Cred): idempotency keys, rate limiting, and webhook resilience.',
    skillGapAddressed: 'System design, Idempotency keys, Redis caching, PostgreSQL indexing, API rate limiting.',
    whatYouWillLearn: [
      'Idempotent transaction handling preventing duplicate deductions during network timeouts',
      'Token bucket rate limiting to prevent API burst overload',
      'Asynchronous webhook retry queues with exponential backoff',
    ],
    techStack: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Jest'],
    githubUrl: 'https://github.com/aaravsharma/upi-simulator',
    liveUrl: 'https://upi-engine.aaravsharma.dev',
    specification: {
      overview: 'Benchmarked at 3,800 req/sec with sub-15ms response times, handling simulated NPCI payment gateway callbacks.',
      architecture: 'Node HTTP gateway with Redis LRU cache, Postgres read replica, and asynchronous metrics aggregator.',
      milestones: [
        'Idempotency key logic & unit tests (Done)',
        'Postgres indexing on transaction UUID and timestamps (Done)',
        'Redis caching and benchmark testing (Done)',
        'Docker container published to DockerHub (Done)',
      ],
    },
  },
];

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  skillsCovered: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  certificate: boolean;
  cost: 'Free' | 'Free to Audit' | 'Paid';
  rating: number;
  reviewCount: string;
  reasonForRecommendation: string;
  skillGapAddressed: string;
  url: string;
  tag: string;
}

export const coursesList: CourseRecommendation[] = [
  {
    id: 'c1',
    title: 'Striver SDE Sheet & Advanced DSA',
    provider: 'take U forward / Striver',
    skillsCovered: ['Dynamic Programming', 'Graph Traversals', 'Binary Trees', 'Sliding Window'],
    difficulty: 'Intermediate',
    duration: '60 hours · Self-paced',
    certificate: false,
    cost: 'Free',
    rating: 4.9,
    reviewCount: '150k+',
    reasonForRecommendation: 'The most trusted DSA roadmap in India for cracking technical coding rounds at top product companies.',
    skillGapAddressed: 'Data Structures & Algorithms (DSA)',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    tag: 'Highest Priority in India',
  },
  {
    id: 'c2',
    title: 'Docker & Kubernetes: The Practical Guide',
    provider: 'Udemy / Maximilian Schwarzmüller',
    skillsCovered: ['Dockerfiles', 'Multi-stage Builds', 'Docker Compose', 'Kubernetes Deployments'],
    difficulty: 'Intermediate',
    duration: '23 hours · 8 modules',
    certificate: true,
    cost: 'Paid',
    rating: 4.8,
    reviewCount: '48.2k',
    reasonForRecommendation: 'Will give you the skills needed to containerize your CityTransit and Tiny Teams projects for cloud deployments.',
    skillGapAddressed: 'Docker Containerization & CI/CD',
    url: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/',
    tag: 'High Impact',
  },
  {
    id: 'c3',
    title: 'Full Stack Open 2025: Deep Dive into Modern Web Development',
    provider: 'University of Helsinki',
    skillsCovered: ['React Concurrency', 'TypeScript', 'GraphQL', 'CI/CD Pipelines', 'Relational DBs'],
    difficulty: 'Advanced',
    duration: '60 hours · Free ECTS credits',
    certificate: true,
    cost: 'Free',
    rating: 4.9,
    reviewCount: '32.1k',
    reasonForRecommendation: 'World-renowned curriculum teaching industry-standard testing, deployment, and TypeScript craft.',
    skillGapAddressed: 'Frontend Systems & Full-Stack Testing',
    url: 'https://fullstackopen.com/en/',
    tag: 'Industry Standard',
  },
  {
    id: 'c4',
    title: 'NPTEL: Database Management Systems',
    provider: 'IIT Kharagpur / NPTEL',
    skillsCovered: ['B-Tree Indexing', 'Transactions & ACID', 'Query Optimization', 'Relational Algebra'],
    difficulty: 'Intermediate',
    duration: '8 Weeks · IIT Faculty',
    certificate: true,
    cost: 'Free to Audit',
    rating: 4.8,
    reviewCount: '24.5k',
    reasonForRecommendation: 'Rigorous foundation in relational database internals recognized across Indian engineering hiring.',
    skillGapAddressed: 'PostgreSQL Query Optimization & Indexing',
    url: 'https://nptel.ac.in/courses/106105175',
    tag: 'Academic Rigor',
  },
  {
    id: 'c5',
    title: 'System Design Interview – An Insider’s Guide',
    provider: 'Alex Xu / ByteByteGo',
    skillsCovered: ['Rate Limiting', 'Consistent Hashing', 'Notification Systems', 'Distributed Cache'],
    difficulty: 'Advanced',
    duration: '28 hours · Visual chapters',
    certificate: true,
    cost: 'Paid',
    rating: 4.9,
    reviewCount: '19.5k',
    reasonForRecommendation: 'Provides clean mental models for architectural interview questions at PhonePe, Razorpay, and Swiggy.',
    skillGapAddressed: 'High-Concurrency System Design',
    url: 'https://bytebytego.com/',
    tag: 'Interview Must-Have',
  },
];

export interface CompanyIntelligence {
  id: string;
  name: string;
  logoLetter: string;
  industry: string;
  locations: string[];
  techStack: string[];
  targetFitScore: number;
  whyTarget: string;
  hiringRoles: string[];
  internshipWindow: string;
  careersUrl: string;
  workCulture: string;
  matchedSignals: string[];
  missingSignals: string[];
}

export const targetCompanies: CompanyIntelligence[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    logoLetter: 'R',
    industry: 'FinTech & Developer Payment Infrastructure',
    locations: ['Bengaluru, Karnataka', 'Remote (India)'],
    techStack: ['TypeScript', 'React', 'Node.js', 'Go', 'PostgreSQL', 'Docker'],
    targetFitScore: 92,
    whyTarget: 'Razorpay places immense value on developer experience, payment reliability, and frontend craft — your top signals.',
    hiringRoles: ['Software Engineering Intern – Summer 2026', 'Frontend Infrastructure SDE'],
    internshipWindow: 'Applications open Aug–Nov; rolling review',
    careersUrl: 'https://razorpay.com/jobs',
    workCulture: 'High developer autonomy, strong engineering blogs, deep product empathy.',
    matchedSignals: ['Product craft', 'TypeScript & React focus', 'UPI payment simulator project'],
    missingSignals: ['Golang microservices depth', 'Kafka message queuing under extreme scale'],
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    logoLetter: 'P',
    industry: 'Digital Payments & Financial Services Platform',
    locations: ['Pune, Maharashtra', 'Bengaluru, Karnataka'],
    techStack: ['Java', 'Spring Boot', 'React', 'Kafka', 'HBase', 'PostgreSQL'],
    targetFitScore: 88,
    whyTarget: 'Major Pune office near Hinjawadi/Senapati Bapat Road. Top-tier compensation and immense scale processing billions of monthly transactions.',
    hiringRoles: ['Software Engineer Intern – Core Payments', 'Frontend Engineering Intern'],
    internshipWindow: 'Campus & Off-campus drives in Aug–October',
    careersUrl: 'https://phonepe.com/careers',
    workCulture: 'High engineering bar, distributed systems at scale, data-driven decision making.',
    matchedSignals: ['Pune local student priority', 'System design awareness', 'Idempotent architecture focus'],
    missingSignals: ['Enterprise Java / Spring Boot depth', 'High-throughput Kafka streaming'],
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    logoLetter: 'S',
    industry: 'On-Demand Delivery & Logistics Tech',
    locations: ['Bengaluru, Karnataka', 'Remote-friendly'],
    techStack: ['Go', 'Java', 'React Native', 'React', 'Kubernetes', 'Redis'],
    targetFitScore: 84,
    whyTarget: 'Your CityTransit Pune case study aligns with Swiggy’s real-time geospatial routing and sub-second arrival calculations.',
    hiringRoles: ['Software Development Engineer Intern', 'Product Engineer Intern'],
    internshipWindow: 'Opens August/September for summer internships',
    careersUrl: 'https://careers.swiggy.com',
    workCulture: 'Fast iteration speed, algorithm-heavy routing challenges, high product ownership.',
    matchedSignals: ['Geospatial transit analytics', 'React & TypeScript mastery', 'Local Indian context'],
    missingSignals: ['Go language experience', 'Real-time vehicle telemetry systems'],
  },
  {
    id: 'zomato',
    name: 'Zomato',
    logoLetter: 'Z',
    industry: 'Food Delivery, Quick Commerce & Dining Tech',
    locations: ['Gurugram, Haryana', 'Bengaluru', 'Remote'],
    techStack: ['TypeScript', 'React', 'PHP/Go', 'PostgreSQL', 'Redis'],
    targetFitScore: 86,
    whyTarget: 'Known for bold, snappy user interfaces, high app performance, and thoughtful consumer-facing micro-interactions.',
    hiringRoles: ['Product Engineering Intern', 'Software Engineer (Frontend)'],
    internshipWindow: 'Rolling review starting September',
    careersUrl: 'https://zomato.com/careers',
    workCulture: 'Fast-paced, product-first mindset, extreme focus on customer experience.',
    matchedSignals: ['Consumer UI craft', 'High performance web rendering', 'Clean portfolio design'],
    missingSignals: ['High-throughput mobile app bridge experience'],
  },
  {
    id: 'tcs-digital',
    name: 'TCS (Digital & Innovator Track)',
    logoLetter: 'T',
    industry: 'IT Services, Digital Transformation & R&D',
    locations: ['Pune (Sahyadri Park / Hinjawadi)', 'Mumbai', 'Pan-India'],
    techStack: ['Java', 'Python', 'Cloud / AWS', 'React', 'Enterprise Databases'],
    targetFitScore: 82,
    whyTarget: 'TCS Digital and Innovator offers structured roles with higher compensation bands (₹7.5 LPA to ₹11 LPA) and massive Pune campus presence.',
    hiringRoles: ['Digital Systems Engineer', 'Research & Innovation Fellow'],
    internshipWindow: 'National Qualifier Test (NQT) in July–September',
    careersUrl: 'https://www.tcs.com/careers',
    workCulture: 'Structured enterprise processes, global client exposure, campus placement mainstay.',
    matchedSignals: ['COEP campus placement alignment', 'Strong foundational computer science'],
    missingSignals: ['Enterprise cloud certifications'],
  },
  {
    id: 'atlassian-india',
    name: 'Atlassian India',
    logoLetter: 'A',
    industry: 'Team Collaboration & Cloud Enterprise Software',
    locations: ['Bengaluru, Karnataka', 'Remote (Team Anywhere across India)'],
    techStack: ['Java', 'TypeScript', 'React', 'AWS', 'GraphQL', 'PostgreSQL'],
    targetFitScore: 90,
    whyTarget: 'Famous for exceptional culture, generous compensation (₹1,00,000+/month stipend), and "Team Anywhere" remote policy in India.',
    hiringRoles: ['Software Engineer Intern – Summer 2026'],
    internshipWindow: 'Campus recruitment and off-campus applications open July–September',
    careersUrl: 'https://www.atlassian.com/company/careers/india',
    workCulture: 'Values-driven, open work practices, focus on long-term sustainable engineering.',
    matchedSignals: ['React & design systems familiarity', 'Open source collaboration mindset'],
    missingSignals: ['Large scale enterprise Java microservices'],
  },
];

export interface JobMatch {
  id: string;
  company: string;
  role: string;
  location: string;
  match: number;
  signal: string;
  salary: string;
  type: string;
  matchedSkills: string[];
  missingSkills: string[];
  verifiedSource: string;
  applyUrl: string;
  deadline: string;
  whyThisRole: string;
}

export const jobMatches: JobMatch[] = [
  {
    id: 'j1',
    company: 'Razorpay',
    role: 'Frontend Engineer Intern – Summer 2026',
    location: 'Bengaluru, Karnataka · Hybrid',
    match: 92,
    signal: 'Your product craft + React + TypeScript evidence align strongly with Razorpay Checkout systems.',
    salary: '₹85,000 / month stipend + housing assistance',
    type: '12-Week Summer Internship',
    matchedSkills: ['React 19', 'TypeScript', 'Design Systems', 'REST API Integration', 'Product Empathy'],
    missingSkills: ['Golang fundamentals', 'High-throughput Kafka streaming'],
    verifiedSource: 'Official Razorpay Careers Portal',
    applyUrl: 'https://razorpay.com/jobs',
    deadline: 'Rolling review · Priority review ends April 25',
    whyThisRole: 'Razorpay looks for engineers who build developer documentation and web checkouts with equal precision. Your CityTransit work is a strong signal.',
  },
  {
    id: 'j2',
    company: 'PhonePe',
    role: 'Software Engineer Intern – Core Platform',
    location: 'Pune, Maharashtra · Hybrid',
    match: 88,
    signal: 'Strong systems thinking and Pune campus presence; close algorithmic speed gap for the coding round.',
    salary: '₹75,000 / month stipend + benefits',
    type: 'Summer Internship',
    matchedSkills: ['TypeScript / Node.js', 'State Management', 'Relational Databases', 'System Design Basics'],
    missingSkills: ['Java Spring Boot microservices', 'Extreme scale concurrency'],
    verifiedSource: 'PhonePe University Talent Portal',
    applyUrl: 'https://phonepe.com/careers',
    deadline: 'May 10, 2025',
    whyThisRole: 'High-volume transaction processing right at PhonePe’s Pune development center near Senapati Bapat Road.',
  },
  {
    id: 'j3',
    company: 'Swiggy',
    role: 'Backend SDE Intern – Logistics Engine',
    location: 'Bengaluru, Karnataka · Hybrid',
    match: 84,
    signal: 'Your CityTransit Pune project directly connects with Swiggy’s real-time routing challenges.',
    salary: '₹70,000 / month stipend',
    type: 'Summer Internship',
    matchedSkills: ['TypeScript', 'Node.js', 'PostgreSQL & Drizzle', 'Redis Caching', 'Geospatial Logic'],
    missingSkills: ['Golang concurrency', 'Distributed event logging'],
    verifiedSource: 'Swiggy Careers Portal',
    applyUrl: 'https://careers.swiggy.com',
    deadline: 'Rolling review',
    whyThisRole: 'Deliver software powering millions of orders across 500+ Indian cities every day with sub-second driver dispatching.',
  },
  {
    id: 'j4',
    company: 'Zomato',
    role: 'Product Engineer Intern',
    location: 'Gurugram, Haryana · Remote Option',
    match: 86,
    signal: 'Your focus on keyboard interactions and UI speed aligns with Zomato’s consumer app standards.',
    salary: '₹65,000 / month stipend',
    type: '6-Month Internship / Pre-Placement Offer',
    matchedSkills: ['Modern React', 'TypeScript strict mode', 'Web performance optimization', 'CSS architecture'],
    missingSkills: ['Mobile React Native bridge', 'A/B test telemetry pipelines'],
    verifiedSource: 'Zomato Campus Talent Portal',
    applyUrl: 'https://zomato.com/careers',
    deadline: 'Open until filled',
    whyThisRole: 'Fast-paced, creative product engineering team crafting consumer experiences for food lovers across India.',
  },
  {
    id: 'j5',
    company: 'TCS',
    role: 'Digital Systems Engineer',
    location: 'Pune (Hinjawadi Phase 3), Maharashtra',
    match: 82,
    signal: 'Campus placement favorite at COEP. Strong fit for Digital & Innovator compensation tracks.',
    salary: '₹7.5 – ₹11.5 LPA (Full-time CTC)',
    type: 'Full-time New Grad Placement',
    matchedSkills: ['Core CS Fundamentals', 'Java / Python', 'DBMS & SQL', 'Git Workflows', 'COEP Student Signal'],
    missingSkills: ['Enterprise Cloud Architecture'],
    verifiedSource: 'TCS Campus Placement Drive',
    applyUrl: 'https://www.tcs.com/careers',
    deadline: 'On-Campus Drive: August 2025',
    whyThisRole: 'Stable, prestigious institutional track with R&D project options located right in Pune.',
  },
];

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  status: 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';
  date: string;
  color: 'teal' | 'gold' | 'slate' | 'coral';
  location: string;
  salary: string;
  nextAction: string;
  nextActionDate?: string;
  notes: string;
  applicationUrl: string;
}

export const applicationActivity: ApplicationItem[] = [
  {
    id: 'app-1',
    company: 'PhonePe',
    role: 'Software Engineer Intern',
    status: 'Interview',
    date: 'Mar 18',
    color: 'teal',
    location: 'Pune, Maharashtra · Hybrid',
    salary: '₹75,000/mo',
    nextAction: 'Round 2 Technical Pair Programming on DSA (Binary Trees & Caching)',
    nextActionDate: 'Thursday, Mar 27 at 3:30 PM IST',
    notes: 'Recruiter mentioned they loved the CityTransit Pune case study. Review Striver SDE sheet and STAR answers.',
    applicationUrl: 'https://phonepe.com/careers',
  },
  {
    id: 'app-2',
    company: 'Swiggy',
    role: 'Backend SDE Intern',
    status: 'Assessment',
    date: 'Mar 15',
    color: 'gold',
    location: 'Bengaluru, Karnataka',
    salary: '₹70,000/mo',
    nextAction: 'Complete HackerEarth 90-minute online coding test by Friday',
    nextActionDate: 'Due Mar 28',
    notes: 'Covers 3 algorithmic problems and 10 MCQs on OS, DBMS, and Networks.',
    applicationUrl: 'https://careers.swiggy.com',
  },
  {
    id: 'app-3',
    company: 'Razorpay',
    role: 'Frontend Engineer Intern – Summer 2026',
    status: 'Applied',
    date: 'Mar 20',
    color: 'gold',
    location: 'Bengaluru, Karnataka',
    salary: '₹85,000/mo',
    nextAction: 'Prepare for recruiter screening; review Razorpay API documentation',
    notes: 'Referred by COEP Pune alum working on payment checkout infrastructure.',
    applicationUrl: 'https://razorpay.com/jobs',
  },
  {
    id: 'app-4',
    company: 'Zomato',
    role: 'Product Engineer Intern',
    status: 'Saved',
    date: 'Mar 22',
    color: 'slate',
    location: 'Gurugram / Remote',
    salary: '₹65,000/mo',
    nextAction: 'Tailor resume bullets to emphasize web performance & Lighthouse scores',
    notes: 'Targeting next week after completing the Tiny Teams demo release.',
    applicationUrl: 'https://zomato.com/careers',
  },
  {
    id: 'app-5',
    company: 'TCS (Digital Track)',
    role: 'Digital Systems Engineer',
    status: 'Offer',
    date: 'Mar 10',
    color: 'teal',
    location: 'Pune Hinjawadi, Maharashtra',
    salary: '₹7.5 LPA',
    nextAction: 'Submit formal letter of intent and graduation marksheets',
    nextActionDate: 'Due April 15',
    notes: 'Secured via National Qualifier Test (NQT) + on-campus interview at COEP.',
    applicationUrl: 'https://www.tcs.com/careers',
  },
  {
    id: 'app-6',
    company: 'Atlassian India',
    role: 'Software Engineer Intern',
    status: 'Saved',
    date: 'Mar 12',
    color: 'slate',
    location: 'Bengaluru / Remote (Team Anywhere)',
    salary: '₹1,00,000/mo',
    nextAction: 'Finish deploying Tiny Teams before requesting alumni referral',
    notes: 'Priority target for culture and remote flexibility.',
    applicationUrl: 'https://www.atlassian.com/company/careers/india',
  },
];

export interface InterviewQuestion {
  id: string;
  roleTarget: string;
  category: 'Technical' | 'System Design' | 'Behavioral' | 'Product Craft';
  difficulty: 'Medium' | 'Hard' | 'Core';
  question: string;
  context: string;
  whatInterviewersLookFor: string[];
  starFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  sampleAnswerSummary: string;
  commonPitfalls: string[];
  feedbackSignals: string;
}

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'q1',
    roleTarget: 'Frontend & Product Engineering',
    category: 'Technical',
    difficulty: 'Medium',
    question: 'How would you build an autocomplete search dropdown for Indian transit stops that stays fluid on 4G networks with sub-100ms latency?',
    context: 'Standard practical round question asked at Razorpay, Swiggy, and Flipkart testing debounce handling, memory management, and network cancellation.',
    whatInterviewersLookFor: [
      'Understanding debouncing (150ms-250ms) vs throttling for keyboard inputs',
      'Virtualization (windowing) for rendering 5,000+ transit bus stops without DOM layout thrashing',
      'AbortController usage to cancel stale in-flight HTTP requests when the user types quickly',
      'ARIA accessibility standards (role="combobox", aria-expanded, aria-activedescendant)',
    ],
    starFramework: {
      situation: 'In CityTransit Pune, searching across 4,200 PMPML bus and metro stops caused input lag and stale search responses on slower mobile connections.',
      task: 'Optimize stop search to achieve consistent 60fps input response and eliminate race conditions.',
      action: 'Implemented an AbortController on each keystroke fetch, an optimized 180ms debounce timer, and CSS content-visibility with client-side indexing.',
      result: 'Reduced memory usage by 74% and input response latency from 280ms to 24ms.',
    },
    sampleAnswerSummary: 'Start by explaining input debouncing (180ms). Then discuss cancellation of stale network promises using AbortController. For rendering thousands of stops, highlight DOM node virtualization or pagination. Conclude by mentioning keyboard accessibility (ArrowDown, Enter, Escape).',
    commonPitfalls: [
      'Forgetting to cancel previous pending network requests (race condition causing wrong results to render)',
      'Rendering all items into the DOM simultaneously, causing layout freezes',
      'Ignoring keyboard accessibility and screen reader announcements',
    ],
    feedbackSignals: 'Demonstrates real production engineering maturity rather than simple tutorial knowledge.',
  },
  {
    id: 'q2',
    roleTarget: 'Product Engineering',
    category: 'Behavioral',
    difficulty: 'Core',
    question: 'Tell me about a time you had a technical disagreement with a peer or teammate during a hackathon or capstone project. How did you resolve it?',
    context: 'Evaluates empathy, collaborative problem solving, data-driven decisions, and ability to prioritize delivery deadlines.',
    whatInterviewersLookFor: [
      'Constructive communication without blaming teammates',
      'Using metrics, user tests, or prototypes to evaluate options objectively',
      'Commitment to the chosen direction once decided ("disagree and commit")',
    ],
    starFramework: {
      situation: 'During the Smart India Hackathon internal qualifier at COEP, my teammate wanted to use a heavy microservices setup while I advocated for a modular monolith with typed REST APIs.',
      task: 'Reach a technical consensus without stalling our 36-hour delivery deadline.',
      action: 'Built a 1-hour prototype comparison demonstrating that the modular monolith cut deployment complexity and let us ship 3x faster.',
      result: 'The team agreed on the modular monolith. We cleared the internal round and delivered our working prototype 4 hours ahead of deadline.',
    },
    sampleAnswerSummary: 'Frame the disagreement around user outcomes and deadline rather than personal ego. Show how you gathered objective data through a time-boxed spike and aligned the team peacefully.',
    commonPitfalls: [
      'Framing the other person as simply "wrong" or unknowledgeable',
      'Saying you never have disagreements (shows lack of experience or avoidance)',
      'Not demonstrating a clear positive outcome for the project',
    ],
    feedbackSignals: 'High emotional intelligence, pragmatic engineering focus.',
  },
  {
    id: 'q3',
    roleTarget: 'Software Engineer',
    category: 'System Design',
    difficulty: 'Hard',
    question: 'Design an idempotent payment processing system (like UPI callbacks at PhonePe or Razorpay) that prevents double deductions during network failures.',
    context: 'Tests understanding of idempotency keys, distributed locks, database transactions (ACID), and asynchronous webhook retries.',
    whatInterviewersLookFor: [
      'Idempotency key implementation with unique transaction tokens and distributed locking via Redis',
      'Database transaction isolation (SERIALIZABLE or SELECT FOR UPDATE) to avoid race conditions',
      'Handling timeout scenarios when the bank gateway does not respond immediately',
      'Asynchronous webhook delivery with exponential backoff and dead-letter queues',
    ],
    starFramework: {
      situation: 'In my UPI Gateway Simulator project, simulated mobile network dropouts caused webhook retries to trigger duplicate transaction records.',
      task: 'Design a bulletproof idempotency layer guaranteeing that no transaction is processed more than once.',
      action: 'Implemented Redis SETNX with a 120-second TTL on the idempotency key, paired with PostgreSQL database transaction status checks.',
      result: 'Handled 5,000 simulated concurrent retries with zero duplicate deductions.',
    },
    sampleAnswerSummary: 'Break down the architecture into: 1. Client request with unique Idempotency-Key header, 2. Redis distributed lock, 3. DB transaction record lookup, 4. Bank gateway call, 5. Storing response and releasing lock.',
    commonPitfalls: [
      'Relying solely on frontend button disabling (network retries happen at the HTTP/gateway layer)',
      'Not specifying lock expiration TTL, leading to deadlocks if the server crashes mid-flight',
      'Failing to differentiate between pending, success, and failed transaction states',
    ],
    feedbackSignals: 'Deep understanding of real-world Indian fintech reliability and distributed data consistency.',
  },
];

export const studentSettings = {
  notifications: {
    dailyDigest: true,
    dailyDigestTime: '08:30 AM IST',
    jobAlerts: true,
    interviewReminders: true,
    weeklyProgressReport: true,
  },
  careerPreferences: {
    primaryTargetRole: 'Product-minded Software Engineer',
    secondaryRole: 'Full-Stack SDE Intern',
    targetGraduation: 'May / June 2026',
    willingToRelocate: true,
    remotePreference: 'Open to Pune, Bengaluru, Hyderabad, Mumbai, or Remote',
    minTargetCompensation: '₹60,000/mo (Internship) · ₹14 LPA (Full-time)',
  },
  privacy: {
    profileVisibility: 'Private (Visible only to matched verified recruiters)',
    shareResumeDirectly: true,
    allowCollegePlacementAccess: true,
    universityAffiliation: 'COEP Technological University, Pune – Training & Placement Cell',
  },
};

export const navGroups = [
  {
    label: 'Work space',
    items: [
      { label: 'Overview', href: '/dashboard', icon: 'grid' },
      { label: 'My profile', href: '/profile', icon: 'user' },
      { label: 'Skills', href: '/skills', icon: 'sparkles' },
      { label: 'Roadmap', href: '/roadmap', icon: 'route' },
    ],
  },
  {
    label: 'Build your edge',
    items: [
      { label: 'Projects', href: '/projects', icon: 'layers' },
      { label: 'Courses', href: '/courses', icon: 'book' },
      { label: 'Companies', href: '/companies', icon: 'building' },
    ],
  },
  {
    label: 'Make your move',
    items: [
      { label: 'Jobs', href: '/jobs', icon: 'briefcase' },
      { label: 'Applications', href: '/applications', icon: 'send' },
      { label: 'Interview room', href: '/interview', icon: 'message' },
    ],
  },
];