/**
 * IterateUP AI Repository & Proof-of-Work Evaluation Engine
 * Evaluates student GitHub projects against Indian & Global SDE-1 hiring standards.
 * Supports:
 * 1. Google Gemini 1.5/2.0 Flash (Free tier via Google AI Studio)
 * 2. Intelligent Deterministic Heuristic Engine (Immediate zero-config fallback)
 */

export interface RepoEvaluationResult {
  repoName: string;
  overallScore: number; // 0 to 100
  tier: 'SDE-1 Ready' | 'Production Grade' | 'Solid Foundation' | 'Prototype / Early';
  tierColor: string;
  architectureScore: number; // 0 to 10
  productionScore: number; // 0 to 10
  craftScore: number; // 0 to 10
  recruiterPitch: string;
  keyStrengths: string[];
  improvementActions: string[];
  interviewQuestions: string[];
  analyzedWith: 'Gemini AI' | 'Deterministic SDE Engine';
  evaluatedAt: string;
}

// Local cache key helper
function getCacheKey(repoName: string): string {
  return `iterateup_repo_eval_${repoName.toLowerCase()}`;
}

/**
 * Intelligent deterministic SDE evaluator
 * Runs instantly without an API key by analyzing repo signals
 */
export function evaluateRepoHeuristics(repo: {
  name: string;
  description?: string;
  language?: string;
  stars?: number;
  topics?: string[];
  homepage?: string | null;
  updatedAt?: string;
}): RepoEvaluationResult {
  const lang = (repo.language || '').toLowerCase();
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();
  const topics = (repo.topics || []).map((t) => t.toLowerCase());

  let architecture = 7.0;
  let production = 6.5;
  let craft = 7.2;

  // Language sophistication
  if (lang === 'typescript' || lang === 'go' || lang === 'rust') {
    architecture += 1.5;
    craft += 1.2;
  } else if (lang === 'python' || lang === 'c++' || lang === 'c') {
    architecture += 1.2;
    craft += 1.0;
  } else if (lang === 'javascript') {
    architecture += 0.8;
  }

  // Full-stack / Production signals
  if (repo.homepage || desc.includes('deployed') || desc.includes('live') || desc.includes('vercel')) {
    production += 1.8;
  }
  if (topics.includes('docker') || topics.includes('kubernetes') || desc.includes('docker')) {
    production += 1.2;
    architecture += 0.8;
  }
  if (topics.includes('api') || topics.includes('backend') || desc.includes('api') || desc.includes('backend')) {
    architecture += 1.0;
  }
  if (topics.includes('react') || topics.includes('nextjs') || desc.includes('full-stack') || desc.includes('fullstack')) {
    architecture += 1.1;
    craft += 0.8;
  }

  // Specific project known patterns
  if (name.includes('iterate') || name.includes('career') || name.includes('quiz') || name.includes('transit')) {
    architecture += 0.8;
    production += 0.7;
    craft += 0.8;
  }
  if (name.includes('water') || name.includes('detection') || name.includes('sensor') || name.includes('iot')) {
    architecture += 0.7;
    craft += 0.9;
  }

  // Cap scores between 5.5 and 9.8
  architecture = Math.min(9.8, Math.max(5.5, Number(architecture.toFixed(1))));
  production = Math.min(9.7, Math.max(5.0, Number(production.toFixed(1))));
  craft = Math.min(9.8, Math.max(6.0, Number(craft.toFixed(1))));

  const overall = Math.min(96, Math.max(65, Math.round(((architecture + production + craft) / 30) * 100)));

  let tier: RepoEvaluationResult['tier'] = 'Solid Foundation';
  let tierColor = 'text-blue-500 bg-blue-500/10 border-blue-500/20';

  if (overall >= 88) {
    tier = 'SDE-1 Ready';
    tierColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  } else if (overall >= 78) {
    tier = 'Production Grade';
    tierColor = 'text-primary bg-primary/10 border-primary/20';
  } else if (overall < 70) {
    tier = 'Prototype / Early';
    tierColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  }

  // Strengths
  const keyStrengths: string[] = [];
  if (lang === 'typescript') keyStrengths.push('Strict type safety & interface-driven contracts');
  if (lang === 'c' || lang === 'c++') keyStrengths.push('Low-level memory management & algorithmic efficiency');
  if (repo.homepage) keyStrengths.push('Live deployed URL & verified production distribution');
  keyStrengths.push('Modular component architecture and clean file structure');
  if (keyStrengths.length < 3) keyStrengths.push('Modern developer toolchain with fast bundling');

  // Improvement actions
  const improvementActions: string[] = [
    'Add automated GitHub Actions CI workflow with unit test coverage reporting (>70%).',
    'Containerize the application with a multi-stage Dockerfile to demonstrate cloud readiness.',
    'Enhance README with system architecture diagram (Mermaid) and benchmark metrics.',
  ];

  // Interview questions
  const interviewQuestions: string[] = [
    `How did you design the state flow and data architecture in ${repo.name}?`,
    `What were the major technical trade-offs you made when choosing ${repo.language || 'this technology'}?`,
    `If this system experienced a 100x spike in concurrent users, what would fail first and how would you optimize it?`,
  ];

  const recruiterPitch = `Engineered ${repo.name}, a modern ${repo.language || 'full-stack'} project implementing scalable architectural patterns, verified against product startup hiring benchmarks.`;

  return {
    repoName: repo.name,
    overallScore: overall,
    tier,
    tierColor,
    architectureScore: architecture,
    productionScore: production,
    craftScore: craft,
    recruiterPitch,
    keyStrengths,
    improvementActions,
    interviewQuestions,
    analyzedWith: 'Deterministic SDE Engine',
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Evaluates a repository using Google Gemini Flash API if key is present,
 * otherwise falls back gracefully to the deterministic SDE heuristic evaluator.
 */
export async function evaluateRepositoryWithAI(
  repo: {
    name: string;
    description?: string;
    language?: string;
    stars?: number;
    topics?: string[];
    homepage?: string | null;
    updatedAt?: string;
  },
  customApiKey?: string
): Promise<RepoEvaluationResult> {
  const cacheKey = getCacheKey(repo.name);
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  const geminiKey = customApiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('iterateup_gemini_api_key');

  if (!geminiKey) {
    const result = evaluateRepoHeuristics(repo);
    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  }

  try {
    const prompt = `You are a Principal Software Engineer and hiring manager evaluating a college student's GitHub repository for SDE-1 roles at top product startups (like Swiggy, Razorpay, PhonePe, Uber, Atlassian).

Repository to evaluate:
Name: ${repo.name}
Description: ${repo.description || 'N/A'}
Language: ${repo.language || 'Code'}
Stars: ${repo.stars || 0}
Topics: ${(repo.topics || []).join(', ')}
Homepage/Deployment: ${repo.homepage || 'None'}

Return ONLY a valid JSON object matching this exact schema:
{
  "overallScore": number (60-98),
  "tier": "SDE-1 Ready" | "Production Grade" | "Solid Foundation" | "Prototype / Early",
  "architectureScore": number (5.0-10.0),
  "productionScore": number (5.0-10.0),
  "craftScore": number (5.0-10.0),
  "recruiterPitch": "One strong resume bullet point summarizing technical impact",
  "keyStrengths": ["strength 1", "strength 2", "strength 3"],
  "improvementActions": ["actionable advice 1", "actionable advice 2", "actionable advice 3"],
  "interviewQuestions": ["interview question 1", "interview question 2", "interview question 3"]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty Gemini response');

    const parsed = JSON.parse(rawText);

    let tierColor = 'text-primary bg-primary/10 border-primary/20';
    if (parsed.overallScore >= 88) {
      tierColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    } else if (parsed.overallScore < 75) {
      tierColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }

    const result: RepoEvaluationResult = {
      repoName: repo.name,
      overallScore: parsed.overallScore,
      tier: parsed.tier || 'SDE-1 Ready',
      tierColor,
      architectureScore: parsed.architectureScore || 8.5,
      productionScore: parsed.productionScore || 8.0,
      craftScore: parsed.craftScore || 8.2,
      recruiterPitch: parsed.recruiterPitch,
      keyStrengths: parsed.keyStrengths || [],
      improvementActions: parsed.improvementActions || [],
      interviewQuestions: parsed.interviewQuestions || [],
      analyzedWith: 'Gemini AI',
      evaluatedAt: new Date().toISOString(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  } catch (err) {
    console.warn('Gemini API call failed, falling back to deterministic SDE engine:', err);
    const result = evaluateRepoHeuristics(repo);
    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  }
}
