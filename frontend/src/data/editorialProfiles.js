// Editorial Profiles: AI-analyzed summaries of theme characteristics
// Generated weekly from the 50 most recent published articles per theme
// Guides all downstream editorial decisions

export const mockEditorialProfiles = [
  {
    id: 'profile-ai-001',
    themeId: 'theme-ai-001',
    themeName: 'AI & LLMs',
    generatedAt: '2026-05-21T09:30:00Z',
    articlesAnalyzed: 50,
    dominantKeywords: [
      { keyword: 'large language model', frequency: 28, sectors: ['enterprise', 'research'] },
      { keyword: 'retrieval augmented generation', frequency: 24, sectors: ['enterprise', 'infrastructure'] },
      { keyword: 'fine-tuning', frequency: 19, sectors: ['research', 'product'] },
      { keyword: 'prompt engineering', frequency: 18, sectors: ['product', 'enterprise'] },
      { keyword: 'ai agents', frequency: 16, sectors: ['product', 'research'] },
      { keyword: 'vector database', frequency: 14, sectors: ['infrastructure', 'enterprise'] },
      { keyword: 'ai safety', frequency: 12, sectors: ['research', 'policy'] },
      { keyword: 'open source llm', frequency: 11, sectors: ['research', 'infrastructure'] },
    ],
    coveredSectors: [
      { sector: 'Enterprise & SaaS', articleCount: 18, growthTrend: 'rising' },
      { sector: 'Research & Academia', articleCount: 14, growthTrend: 'stable' },
      { sector: 'Infrastructure & DevTools', articleCount: 12, growthTrend: 'rising' },
      { sector: 'Startups & Funding', articleCount: 5, growthTrend: 'stable' },
      { sector: 'Safety & Ethics', articleCount: 4, growthTrend: 'rising' },
    ],
    editorialSpirit: 'We publish rigorous analyses of production AI systems: how teams architect RAG pipelines, fine-tune models, and deploy agents at scale. Academic rigor meets engineering pragmatism. We favor technical depth, real-world constraints, and founder/engineer perspectives over hype.',
    topSources: [
      'Hugging Face Blog',
      'Towards Data Science',
      'Wired',
      'TechCrunch',
      'VentureBeat',
    ],
    topAuthors: [
      'Jeremy Howard',
      'Andrej Karpathy',
      'Sam Altman',
      'Dario Amodei',
      'Yann LeCun',
    ],
    lastCalibrationQuality: 0.87,
    acceptanceRate: 0.34,
    rejectionReasons: {
      'Generic intro-to-ML content': 0.25,
      'Unsubstantiated hype claims': 0.22,
      'No novel engineering insight': 0.20,
      'Outdated benchmark data': 0.18,
      'Missing technical depth': 0.15,
    },
  },
  {
    id: 'profile-startup-001',
    themeId: 'theme-startup-001',
    themeName: 'AI Startups & Funding',
    generatedAt: '2026-05-21T10:15:00Z',
    articlesAnalyzed: 48,
    dominantKeywords: [
      { keyword: 'series a funding', frequency: 22, sectors: ['startup', 'venture'] },
      { keyword: 'ai startup', frequency: 19, sectors: ['startup', 'venture'] },
      { keyword: 'venture capital', frequency: 17, sectors: ['venture', 'funding'] },
      { keyword: 'y combinator', frequency: 14, sectors: ['startup', 'accelerator'] },
      { keyword: 'product market fit', frequency: 13, sectors: ['startup', 'growth'] },
      { keyword: 'archiecture pattern', frequency: 10, sectors: ['infrastructure', 'startup'] },
      { keyword: 'go to market', frequency: 9, sectors: ['startup', 'growth'] },
      { keyword: 'competitive moat', frequency: 8, sectors: ['startup', 'strategy'] },
    ],
    coveredSectors: [
      { sector: 'AI-Native Companies', articleCount: 22, growthTrend: 'rising' },
      { sector: 'Vertical AI (Domain-Specific)', articleCount: 12, growthTrend: 'rising' },
      { sector: 'Developer Tools & Infrastructure', articleCount: 10, growthTrend: 'stable' },
      { sector: 'Enterprise SaaS', articleCount: 4, growthTrend: 'stable' },
    ],
    editorialSpirit: 'We spotlight founders building defensible AI businesses: companies with clear ICP focus, proprietary data moats, or novel application layers. We value founder insights over market commentary, early unit economics over valuation announcements. We skip generic SaaS coverage; this space is AI-first or irrelevant.',
    topSources: [
      'Crunchbase News',
      'TechCrunch',
      'First Round Review',
      'VentureBeat',
      'Forbes',
    ],
    topAuthors: [
      'Sarah Buhr',
      'Jason Lemkin',
      'Tomás Tito Parreiras',
      'Olivia Fox Cabane',
      'Brex Founders',
    ],
    lastCalibrationQuality: 0.84,
    acceptanceRate: 0.41,
    rejectionReasons: {
      'Generic funding announcement': 0.28,
      'No founder insight or strategy angle': 0.24,
      'Market commentary without data': 0.21,
      'Duplicate coverage of existing narrative': 0.16,
      'Missing competitive analysis': 0.11,
    },
  },
  {
    id: 'profile-engineering-001',
    themeId: 'theme-engineering-001',
    themeName: 'Web & Infrastructure Engineering',
    generatedAt: '2026-05-21T11:00:00Z',
    articlesAnalyzed: 52,
    dominantKeywords: [
      { keyword: 'vector database', frequency: 15, sectors: ['database', 'infrastructure'] },
      { keyword: 'postgresql', frequency: 13, sectors: ['database', 'backend'] },
      { keyword: 'docker kubernetes', frequency: 12, sectors: ['devops', 'infrastructure'] },
      { keyword: 'rag pipeline', frequency: 11, sectors: ['ai', 'infrastructure'] },
      { keyword: 'api design', frequency: 9, sectors: ['backend', 'architecture'] },
      { keyword: 'performance optimization', frequency: 8, sectors: ['infrastructure', 'backend'] },
      { keyword: 'svelte frontend', frequency: 7, sectors: ['frontend', 'framework'] },
      { keyword: 'database migration', frequency: 6, sectors: ['database', 'devops'] },
    ],
    coveredSectors: [
      { sector: 'Databases & Storage', articleCount: 16, growthTrend: 'rising' },
      { sector: 'Backend & APIs', articleCount: 14, growthTrend: 'stable' },
      { sector: 'DevOps & Infrastructure', articleCount: 12, growthTrend: 'stable' },
      { sector: 'Frontend & Frameworks', articleCount: 10, growthTrend: 'stable' },
    ],
    editorialSpirit: 'We publish battle-tested engineering advice from teams shipping at scale. We value concrete architecture decisions, performance trade-offs, and lessons from production failures. Code samples and metrics over philosophy. We skip beginner tutorials unless they solve a novel problem.',
    topSources: [
      'Hacker News',
      'InfoQ',
      'Dev.to',
      'High Scalability',
      'GitHub Blog',
    ],
    topAuthors: [
      'Martin Fowler',
      'Brendan Gregg',
      'Rich Harris',
      'Sam Seely',
      'Julia Evans',
    ],
    lastCalibrationQuality: 0.89,
    acceptanceRate: 0.38,
    rejectionReasons: {
      'Lacks production context or metrics': 0.26,
      'Outdated technology stack': 0.22,
      'Insufficient technical depth': 0.20,
      'No novel optimization or pattern': 0.19,
      'Repeats well-known best practice': 0.13,
    },
  },
  {
    id: 'profile-sustainability-001',
    themeId: 'theme-sustainability-001',
    themeName: 'Green Energy & Sustainability',
    generatedAt: '2026-05-21T11:45:00Z',
    articlesAnalyzed: 45,
    dominantKeywords: [
      { keyword: 'renewable energy', frequency: 20, sectors: ['energy', 'climate'] },
      { keyword: 'carbon neutral', frequency: 16, sectors: ['climate', 'policy'] },
      { keyword: 'electric vehicle', frequency: 14, sectors: ['transport', 'technology'] },
      { keyword: 'green hydrogen', frequency: 12, sectors: ['energy', 'industry'] },
      { keyword: 'carbon credit', frequency: 10, sectors: ['policy', 'finance'] },
      { keyword: 'climate transition', frequency: 9, sectors: ['policy', 'industry'] },
      { keyword: 'esg investing', frequency: 7, sectors: ['finance', 'investment'] },
      { keyword: 'circular economy', frequency: 6, sectors: ['sustainability', 'industry'] },
    ],
    coveredSectors: [
      { sector: 'Energy Production & Storage', articleCount: 18, growthTrend: 'rising' },
      { sector: 'Transportation & Mobility', articleCount: 14, growthTrend: 'rising' },
      { sector: 'Climate Policy & Regulation', articleCount: 9, growthTrend: 'stable' },
      { sector: 'Finance & ESG Investing', articleCount: 4, growthTrend: 'stable' },
    ],
    editorialSpirit: 'We report on the economic transition to green energy with skepticism and precision. We favor hard data on costs, adoption curves, and policy impact over optimism about future potential. We cover breakthrough economics (parity, subsidy phase-out, scale inflection points) and real implementation challenges.',
    topSources: [
      'Bloomberg Green',
      'Reuters',
      'Nature Energy',
      'Carbon Brief',
      'Axios',
    ],
    topAuthors: [
      'Jennifer Ruelas',
      'David Hodari',
      'Kimberly Brubaker',
      'Joe Ryan',
      'Jessica Shankleman',
    ],
    lastCalibrationQuality: 0.82,
    acceptanceRate: 0.29,
    rejectionReasons: {
      'Lacks economic analysis or cost data': 0.31,
      'Activist framing without evidence': 0.25,
      'Repeats published forecasts': 0.20,
      'Missing implementation realism': 0.16,
      'Outdated baseline numbers': 0.08,
    },
  },
];

/**
 * Generate a fresh editorial profile by analyzing article data.
 * In production, this would be called from a backend API.
 * For now, returns mock data with the specified theme.
 */
export function generateEditorialProfile(themeId, themeName, articlesData) {
  // Placeholder for backend integration
  // When backend is ready, this will:
  // 1. Extract keywords from 50 most recent articles
  // 2. Calculate keyword frequency and sector mapping
  // 3. Generate the 50-word editorial spirit statement
  // 4. Identify top sources and authors
  // 5. Calculate acceptance metrics

  return {
    id: `profile-${themeId}-${Date.now()}`,
    themeId,
    themeName,
    generatedAt: new Date().toISOString(),
    articlesAnalyzed: Math.min(50, articlesData?.length || 0),
    dominantKeywords: [],
    coveredSectors: [],
    editorialSpirit: '',
    topSources: [],
    topAuthors: [],
    lastCalibrationQuality: 0.85,
    acceptanceRate: 0.35,
    rejectionReasons: {},
  };
}
