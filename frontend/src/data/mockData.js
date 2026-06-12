// ── Discover blogs ──
export const mockBlogs = [
  { id: 1,  lang: 'EN', title: 'How Mistral AI is Reshaping Open-Source LLMs in 2025', titleFR: "Comment Mistral AI redéfinit les LLM open-source en 2025", source: 'TechCrunch', category: 'AI', readTime: '6 min', image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=300&fit=crop', summary: "Mistral AI's latest open-weight models are challenging closed-source giants by delivering GPT-4-level performance at a fraction of the cost, with full local deployment support.", summaryFR: "Les derniers modèles open-weight de Mistral AI défient les géants propriétaires en offrant des performances de niveau GPT-4 à une fraction du coût, avec support de déploiement local.", tags: ['AI', 'LLM', 'Open Source'], keywords: ['mistral', 'ai', 'llm', 'open source', 'language model'] },
  { id: 2,  lang: 'EN', title: 'The Rise of Retrieval-Augmented Generation in Enterprise Search', titleFR: "L'essor de la génération augmentée par récupération dans la recherche d'entreprise", source: 'Wired', category: 'AI', readTime: '8 min', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=300&fit=crop', summary: 'RAG architectures are becoming the default pattern for enterprise AI, combining vector databases with LLMs to deliver accurate, grounded answers from private knowledge bases.', summaryFR: "Les architectures RAG deviennent le schéma par défaut pour l'IA d'entreprise, combinant bases de données vectorielles et LLM pour fournir des réponses précises depuis des bases de connaissances privées.", tags: ['RAG', 'Enterprise', 'Search'], keywords: ['rag', 'retrieval', 'augmented', 'generation', 'enterprise', 'search', 'ai'] },
  { id: 3,  lang: 'FR', title: "Ollama rend les LLM locaux accessibles à tous les développeurs", titleEN: 'Ollama Makes Local LLMs Accessible to Every Developer', source: 'Dev.to', category: 'AI', readTime: '5 min', image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=300&fit=crop', summary: "Le lanceur de modèles local d'Ollama a démocratisé l'accès aux LLM open-source, permettant aux développeurs d'exécuter Mistral, LLaMA et Gemma sur du matériel grand public.", summaryEN: "Ollama's local model launcher has democratised access to open-source LLMs, letting developers run Mistral, LLaMA and Gemma on consumer hardware.", tags: ['Ollama', 'IA locale', 'LLM'], keywords: ['ollama', 'local', 'llm', 'ai', 'developer', 'mistral', 'llama'] },
  { id: 4,  lang: 'EN', title: 'Prompt Engineering Best Practices for Production AI Systems', titleFR: "Meilleures pratiques d'ingénierie de prompt pour les systèmes IA en production", source: 'Towards Data Science', category: 'AI', readTime: '10 min', image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&h=300&fit=crop', summary: 'Structured prompting, chain-of-thought reasoning, and few-shot examples are no longer optional — they are engineering disciplines that determine the reliability of AI-powered products.', summaryFR: "Le prompting structuré, le raisonnement en chaîne et les exemples few-shot ne sont plus optionnels — ce sont des disciplines d'ingénierie qui déterminent la fiabilité des produits IA.", tags: ['Prompt Engineering', 'AI', 'Production'], keywords: ['prompt', 'engineering', 'ai', 'chain of thought', 'few-shot', 'production'] },
  { id: 5,  lang: 'EN', title: 'Fine-Tuning vs RAG: Choosing the Right Strategy for Your AI Product', titleFR: "Fine-Tuning vs RAG : choisir la bonne stratégie pour votre produit IA", source: 'Hugging Face Blog', category: 'AI', readTime: '9 min', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=300&fit=crop', summary: 'Fine-tuning gives you style and tone control; RAG gives you factual grounding. Understanding when to use each — or combine both — is the key architectural decision in modern AI product development.', summaryFR: "Le fine-tuning vous donne le contrôle du style et du ton ; le RAG vous ancre dans les faits. Savoir quand utiliser l'un ou l'autre — ou les combiner — est la décision architecturale clé du développement IA moderne.", tags: ['Fine-tuning', 'RAG', 'AI'], keywords: ['fine-tuning', 'rag', 'ai', 'strategy', 'llm', 'language model'] },
  { id: 6,  lang: 'FR', title: "GPT-4o contre Claude 3.5 : un benchmark pratique pour les développeurs", titleEN: 'GPT-4o vs Claude 3.5: A Practical Benchmark for Developers', source: 'InfoQ', category: 'AI', readTime: '7 min', image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=600&h=300&fit=crop', summary: "Une évaluation comparative de GPT-4o et Claude 3.5 Sonnet sur des tâches de codage, de raisonnement et de résumé — avec des conseils pratiques sur le modèle à choisir.", summaryEN: 'A comparative evaluation of GPT-4o and Claude 3.5 Sonnet across coding, reasoning and summarisation tasks — with practical advice on which model to choose.', tags: ['GPT-4', 'Claude', 'Benchmark'], keywords: ['gpt', 'claude', 'openai', 'anthropic', 'benchmark', 'ai', 'llm'] },
  { id: 7,  lang: 'EN', title: 'AI Agents in 2025: From Demos to Production Deployments', titleFR: "Agents IA en 2025 : des démos aux déploiements en production", source: 'VentureBeat', category: 'AI', readTime: '8 min', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=300&fit=crop', summary: 'AI agents are moving beyond research prototypes. This analysis covers the architectures, tooling, and failure modes that engineering teams are encountering as they deploy autonomous agents at scale.', summaryFR: "Les agents IA dépassent les prototypes de recherche. Cette analyse couvre les architectures, outils et modes d'échec rencontrés lors du déploiement d'agents autonomes à grande échelle.", tags: ['AI Agents', 'Automation', 'Production'], keywords: ['ai agents', 'agents', 'autonomous', 'automation', 'ai', 'production'] },
  { id: 8,  lang: 'EN', title: 'AI Safety in 2025: What Frontier Labs Are Actually Doing', titleFR: "Sécurité de l'IA en 2025 : ce que font vraiment les laboratoires frontières", source: 'MIT Technology Review', category: 'AI', readTime: '11 min', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=300&fit=crop', summary: 'A detailed look at the safety research programmes at OpenAI, Anthropic, and DeepMind — what they are measuring, what they are not, and where the gaps remain.', summaryFR: "Un regard détaillé sur les programmes de recherche en sécurité d'OpenAI, Anthropic et DeepMind — ce qu'ils mesurent, ce qu'ils ne mesurent pas, et où se situent les lacunes.", tags: ['AI Safety', 'Research', 'Ethics'], keywords: ['ai safety', 'safety', 'alignment', 'openai', 'anthropic', 'deepmind', 'ethics'] },
  { id: 9,  lang: 'EN', title: 'Vector Databases: Pinecone vs Weaviate vs Chroma in 2025', titleFR: "Bases de données vectorielles : Pinecone vs Weaviate vs Chroma en 2025", source: 'InfoQ', category: 'Engineering', readTime: '7 min', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=300&fit=crop', summary: 'A head-to-head comparison of the leading vector database solutions, evaluating query latency, scalability, cost, and developer experience for AI-native application architectures.', summaryFR: "Une comparaison directe des principales solutions de bases de données vectorielles, évaluant la latence des requêtes, la scalabilité, le coût et l'expérience développeur.", tags: ['Vector DB', 'Infrastructure', 'AI'], keywords: ['vector', 'database', 'pinecone', 'weaviate', 'chroma', 'embeddings', 'infrastructure'] },
  { id: 10, lang: 'FR', title: "Construire un pipeline RAG en production avec pgvector et LangChain", titleEN: 'Building a Production RAG Pipeline with pgvector and LangChain', source: 'Dev.to', category: 'Engineering', readTime: '12 min', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=300&fit=crop', summary: "Un guide étape par étape pour construire un système RAG prêt pour la production en utilisant l'extension pgvector de PostgreSQL et LangChain.", summaryEN: 'A step-by-step guide to building a production-ready RAG system using PostgreSQL pgvector extension and LangChain.', tags: ['RAG', 'pgvector', 'LangChain'], keywords: ['rag', 'pgvector', 'langchain', 'postgresql', 'vector', 'database', 'pipeline'] },
  { id: 11, lang: 'EN', title: 'Startup Funding in 2025: AI Dominates as Other Sectors Cool', titleFR: "Financement des startups en 2025 : l'IA domine tandis que les autres secteurs ralentissent", source: 'Crunchbase News', category: 'Startups', readTime: '6 min', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=300&fit=crop', summary: 'AI startups captured 42% of all global venture funding in Q1 2025, while fintech and consumer apps saw continued contraction. A breakdown of where the money is flowing and why.', summaryFR: "Les startups IA ont capté 42 % du financement mondial en capital-risque au T1 2025, tandis que la fintech et les applications grand public continuent de se contracter.", tags: ['Startup', 'Funding', 'VC'], keywords: ['startup', 'funding', 'venture capital', 'vc', 'investment', 'ai', '2025'] },
  { id: 12, lang: 'FR', title: "Comment la promotion W25 de Y Combinator reflète le nouveau modèle de startup IA", titleEN: "How YC's W25 Batch Reflects the New AI Startup Playbook", source: 'TechCrunch', category: 'Startups', readTime: '7 min', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop', summary: "68 % de la promotion Hiver 2025 de YC sont des entreprises natives de l'IA. Nous analysons les tendances — IA verticale, flux de travail agentiques et outillage d'infrastructure.", summaryEN: "68% of YC's Winter 2025 batch are AI-native companies. We analyse the trends — vertical AI, agentic workflows, and infrastructure tooling.", tags: ['YC', 'Startup', 'IA'], keywords: ['startup', 'y combinator', 'yc', 'funding', 'ai', 'batch', 'accelerator'] },
  { id: 13, lang: 'EN', title: 'From Idea to $1M ARR: The Lean AI Startup Playbook', titleFR: "De l'idée à 1M$ ARR : le guide lean de la startup IA", source: 'First Round Review', category: 'Startups', readTime: '9 min', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop', summary: 'Founders who reached $1M ARR in under 12 months share the tactics that worked: tight ICP focus, AI-assisted sales, and ruthless prioritisation over feature breadth.', summaryFR: "Des fondateurs ayant atteint 1M$ ARR en moins de 12 mois partagent leurs tactiques : focus ICP serré, ventes assistées par IA et priorisation impitoyable.", tags: ['Startup', 'ARR', 'Growth'], keywords: ['startup', 'arr', 'revenue', 'growth', 'founder', 'saas', 'playbook'] },
  { id: 14, lang: 'EN', title: 'AI in Healthcare: How Diagnostic Models Are Entering Clinical Practice', titleFR: "L'IA en santé : comment les modèles de diagnostic entrent dans la pratique clinique", source: 'Nature Medicine', category: 'Healthcare', readTime: '10 min', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=300&fit=crop', summary: 'Diagnostic AI models trained on millions of medical images are now being deployed in hospitals across Europe and the US, with early data showing significant improvements in detection accuracy.', summaryFR: "Les modèles d'IA diagnostiques entraînés sur des millions d'images médicales sont déployés dans des hôpitaux en Europe et aux États-Unis, avec des améliorations significatives de la précision de détection.", tags: ['AI', 'Healthcare', 'Diagnostics'], keywords: ['healthcare', 'medical', 'ai', 'diagnostics', 'hospital', 'clinical', 'health'] },
  { id: 15, lang: 'FR', title: "Technologies de santé portables en 2025 : au-delà du comptage de pas", titleEN: 'Wearable Health Tech in 2025: Beyond Step Counting', source: 'The Verge', category: 'Healthcare', readTime: '6 min', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=300&fit=crop', summary: "La dernière génération de wearables peut désormais surveiller la glycémie, détecter la fibrillation auriculaire et signaler les premiers signes d'infection.", summaryEN: 'The latest generation of wearables can now monitor blood glucose, detect atrial fibrillation, and flag early signs of infection.', tags: ['Wearables', 'Santé', 'IoT'], keywords: ['healthcare', 'wearable', 'health', 'fitness', 'monitoring', 'medical device'] },
  { id: 16, lang: 'FR', title: "Hydrogène vert : l'économie commence enfin à fonctionner", titleEN: "Green Hydrogen: The Economics Are Finally Working", source: 'Bloomberg Green', category: 'Sustainability', readTime: '8 min', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=300&fit=crop', summary: "Les coûts des électrolyseurs ont chuté de 60 % depuis 2020. Combiné à l'électricité renouvelable bon marché, l'hydrogène vert approche la parité de coût avec l'hydrogène gris.", summaryEN: 'Electrolyser costs have dropped 60% since 2020. Combined with cheap renewable electricity, green hydrogen is approaching cost parity with grey hydrogen.', tags: ['Hydrogène', 'Énergie', 'Climat'], keywords: ['sustainability', 'green', 'hydrogen', 'energy', 'climate', 'renewable', 'carbon'] },
  { id: 17, lang: 'EN', title: 'Electric Vehicles in 2025: The Tipping Point Has Arrived', titleFR: "Véhicules électriques en 2025 : le point de bascule est arrivé", source: 'Reuters', category: 'Sustainability', readTime: '7 min', image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=300&fit=crop', summary: 'EV sales crossed 25% of new car registrations globally in Q1 2025. Price parity with combustion vehicles has been reached in three major markets, accelerating the transition faster than most forecasts predicted.', summaryFR: "Les ventes de VE ont dépassé 25 % des nouvelles immatriculations mondiales au T1 2025. La parité de prix avec les véhicules thermiques est atteinte dans trois grands marchés.", tags: ['EV', 'Electric Vehicles', 'Climate'], keywords: ['electric vehicle', 'ev', 'sustainability', 'climate', 'transport', 'carbon', 'green'] },
  { id: 18, lang: 'EN', title: 'The State of Cybersecurity in 2025: AI Attacks and AI Defences', titleFR: "État de la cybersécurité en 2025 : attaques IA et défenses IA", source: 'Dark Reading', category: 'Security', readTime: '9 min', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=300&fit=crop', summary: 'Threat actors are now using LLMs to generate highly personalised phishing campaigns at scale. Security teams are responding with AI-powered detection — an arms race reshaping the entire field.', summaryFR: "Les acteurs malveillants utilisent désormais des LLM pour générer des campagnes de phishing hautement personnalisées à grande échelle. Les équipes de sécurité répondent par une détection assistée par IA.", tags: ['Cybersecurity', 'AI', 'Threats'], keywords: ['cybersecurity', 'security', 'hacking', 'phishing', 'ai', 'threat', 'attack', 'defence'] },
  { id: 19, lang: 'FR', title: "Svelte 5 Runes : guide complet du nouveau modèle de réactivité", titleEN: 'Svelte 5 Runes: A Complete Guide to the New Reactivity Model', source: 'Svelte Blog', category: 'Web Dev', readTime: '11 min', image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&h=300&fit=crop', summary: "Svelte 5 introduit les runes — une nouvelle primitive de réactivité qui remplace les déclarations réactives implicites de Svelte 4. Ce guide couvre chaque rune avec des exemples pratiques.", summaryEN: 'Svelte 5 introduces runes — a new reactivity primitive replacing Svelte 4 implicit reactive declarations. This guide covers every rune with practical examples.', tags: ['Svelte', 'JavaScript', 'Frontend'], keywords: ['svelte', 'javascript', 'frontend', 'web', 'reactivity', 'runes', 'framework'] },
  { id: 20, lang: 'EN', title: 'Four-Day Work Week: 12-Month Data from 61 UK Companies', titleFR: "Semaine de quatre jours : données sur 12 mois issues de 61 entreprises britanniques", source: 'Guardian', category: 'Future of Work', readTime: '7 min', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop', summary: 'A longitudinal study tracking 61 UK companies that adopted a permanent four-day work week reports 92% staff retention and no statistically significant revenue decline after 12 months.', summaryFR: "Une étude longitudinale suivant 61 entreprises britanniques ayant adopté la semaine de quatre jours permanente fait état de 92 % de rétention du personnel et d'aucune baisse de revenus significative après 12 mois.", tags: ['Work', 'Productivity', 'HR'], keywords: ['future of work', 'four day', 'work week', 'productivity', 'remote', 'hr', 'workplace'] },
];

// ── Search Query Generator ──────────────────────────────────────────────────
// Produces 5 targeted queries per theme covering:
//   1. Innovation press   2. Academic preprints   3. Startup funding
//   4. Patent filings     5. Industry press releases
// Queries rotate weekly via weekSeed to avoid repeating the same searches.

const QUERY_TEMPLATES = {
  EN: {
    innovation:  (t, v) => [`${t} breakthrough innovation ${v}`, `latest ${t} technology advances ${v}`, `${t} disruption new developments ${v}`],
    academic:    (t, v) => [`${t} research preprint arxiv ${v}`, `${t} academic study findings ${v}`, `${t} scientific paper 2025 ${v}`],
    funding:     (t, v) => [`${t} startup funding Series A ${v}`, `${t} venture capital investment ${v}`, `${t} raised million funding round ${v}`],
    patent:      (t, v) => [`${t} patent filing USPTO ${v}`, `${t} intellectual property new patent ${v}`, `${t} patent application innovation ${v}`],
    press:       (t, v) => [`${t} industry press release ${v}`, `${t} product launch announcement ${v}`, `${t} market report industry news ${v}`],
  },
  FR: {
    innovation:  (t, v) => [`${t} innovation percée technologique ${v}`, `dernières avancées ${t} technologie ${v}`, `${t} disruption nouveaux développements ${v}`],
    academic:    (t, v) => [`${t} recherche prépublication académique ${v}`, `${t} étude scientifique résultats ${v}`, `${t} article scientifique 2025 ${v}`],
    funding:     (t, v) => [`${t} startup financement Série A ${v}`, `${t} capital-risque investissement ${v}`, `${t} levée de fonds millions ${v}`],
    patent:      (t, v) => [`${t} dépôt brevet INPI ${v}`, `${t} propriété intellectuelle nouveau brevet ${v}`, `${t} demande de brevet innovation ${v}`],
    press:       (t, v) => [`${t} communiqué de presse industrie ${v}`, `${t} lancement produit annonce ${v}`, `${t} rapport marché actualités secteur ${v}`],
  },
};

// Novelty variants rotated by week — ensures different phrasing each week
const NOVELTY_VARIANTS = {
  EN: ['site:techcrunch.com OR site:wired.com', 'site:venturebeat.com OR site:forbes.com', 'site:reuters.com OR site:bloomberg.com', 'site:nature.com OR site:arxiv.org', 'site:crunchbase.com OR site:pitchbook.com'],
  FR: ['site:lemonde.fr OR site:lefigaro.fr', 'site:latribune.fr OR site:lesechos.fr', 'site:bfmtv.com OR site:challenges.fr', 'site:hal.science OR site:cairn.info', 'site:businessfrance.fr OR site:bpifrance.fr'],
};

/**
 * Generate 5 targeted search queries for a theme.
 * @param {string} theme  - e.g. "AI Agents"
 * @param {'EN'|'FR'} lang
 * @param {number} weekSeed - Math.floor(Date.now() / 604800000) for weekly rotation
 * @returns {Array<{type: string, lang: string, query: string}>}
 */
export function generateSearchQueries(theme, lang = 'EN', weekSeed = 0) {
  const t = theme;
  const tpl = QUERY_TEMPLATES[lang];
  const variants = NOVELTY_VARIANTS[lang];
  const types = ['innovation', 'academic', 'funding', 'patent', 'press'];
  const typeLabels = {
    innovation: 'Innovation Press',
    academic:   'Academic Preprint',
    funding:    'Startup Funding',
    patent:     'Patent Filing',
    press:      'Industry Press Release',
  };

  return types.map((type, i) => {
    const pool = tpl[type](t, '');
    // Rotate which variant from the pool is shown each week
    const query = pool[(weekSeed + i) % pool.length].trim();
    // Append a novelty site-scoping hint that also rotates weekly
    const siteHint = variants[(weekSeed + i) % variants.length];
    return {
      type,
      typeLabel: typeLabels[type],
      lang,
      query: `${query} ${siteHint}`,
      queryClean: query, // version without site hint for display
    };
  });
}

// Current ISO week number — changes every Monday, drives novelty rotation
export function currentWeekSeed() {
  return Math.floor(Date.now() / 604800000);
}

export const mockGeneratedBlog = {
  title: 'How Mistral AI is Reshaping Open-Source LLMs in 2025',
  category: 'AI',
  tags: ['AI', 'Open Source', 'LLM', 'Mistral'],
  readTime: '6 min',
  coverImage: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=500&fit=crop',
  wordCount: 420,
  qualityScore: 9.2,
  content: [
    { type: 'h2', text: 'The Open-Source LLM Revolution' },
    { type: 'p',  text: 'The artificial intelligence landscape has undergone a seismic shift in 2025. Mistral AI, the Paris-based startup founded by former DeepMind and Meta researchers, has emerged as the most credible challenger to OpenAI\'s dominance — not by matching its resources, but by fundamentally rethinking what an AI company needs to be.' },
    { type: 'h2', text: 'What Makes Mistral Different' },
    { type: 'p',  text: 'Unlike its closed-source competitors, Mistral releases its most capable models under permissive open-weight licences. The Mixtral 8x22B model delivers performance competitive with GPT-4 on standard benchmarks while activating only 39 billion parameters per forward pass through its mixture-of-experts architecture.' },
    { type: 'p',  text: 'This represents a 3–4x reduction in inference cost for equivalent capability — a difference that fundamentally changes the economics of deploying AI at scale.' },
    { type: 'h2', text: 'The Enterprise Implications' },
    { type: 'p',  text: "For enterprise technology leaders, Mistral's trajectory raises a question that was unthinkable 18 months ago: why pay for closed-source API access when open-weight alternatives deliver comparable results on private infrastructure?" },
    { type: 'h2', text: 'What This Means for Innovation' },
    { type: 'p',  text: 'The commoditisation of LLM capability is accelerating. Within 12–18 months, access to a capable language model will be as unremarkable as access to a database. The competitive advantage will shift entirely to what you build on top — the data, the workflows, the user experience, and the domain expertise baked into the product.' },
  ],
};

export const trendingTopics = [
  'Mistral AI', 'RAG Architecture', 'AI Agents', 'AI Safety',
  'Startup Funding', 'AI in Healthcare', 'Cybersecurity', 'Electric Vehicles',
  'Svelte', 'Kubernetes', 'Future of Work', 'Blockchain',
];
