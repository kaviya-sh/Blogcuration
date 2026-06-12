<script>
  import { onMount, onDestroy } from 'svelte';
  import { currentPage, publishTime, timezone, schedulePost, searchQuery, bilingual, interestedBlogs, selectedBlog, readingHistory, bookmarks } from '../stores/store.js';
  import { mockGeneratedBlog } from '../data/mockData.js';

  let loading      = true;
  let regenerating = false;
  let editing      = false;
  let published    = false;
  let copied       = false;
  let typingDone   = true;
  let displayedTitle = '';
  let countdown    = { h: 0, m: 0, s: 0 };
  let interval;

  let relevanceScore  = 8.7;
  let innovationScore = 9.2;
  $: isFeatured = relevanceScore >= 9 && innovationScore >= 9;
  $: scorePillClass = (v) => v >= 9 ? 'high' : v >= 7 ? 'mid' : 'low';

  const BANNED = ['revolutionary','game-changing','groundbreaking','unprecedented','disruptive','amazing','incredible','world-class','best-in-class','cutting-edge'];
  $: bannedFound = BANNED.filter(w => blog.content.some(b => b.text?.toLowerCase().includes(w)));
  $: wordCount = blog.content.filter(b => b.type === 'p').map(b => b.text).join(' ').split(/\s+/).filter(Boolean).length;
  $: wcStatus = wordCount >= 90 && wordCount <= 110 ? 'ok' : wordCount < 90 ? 'low' : 'high';

  const source = $selectedBlog ?? ($interestedBlogs.length > 0 ? $interestedBlogs[0] : null) ?? mockGeneratedBlog;
  const sourceTopic = source?.title ?? source?.category ?? $searchQuery ?? 'Technology';
  const sourceCategory = source?.category ?? source?.theme ?? 'Tech';
  const sourceTags = source?.tags ?? [sourceCategory];

  let blog = {
    ...mockGeneratedBlog,
    title: source?.title ?? mockGeneratedBlog.title,
    category: sourceCategory,
    tags: sourceTags,
    coverImage: source?.image ?? source?.imageUrl ?? mockGeneratedBlog.coverImage,
    content: generateContentForTopic(sourceTopic, sourceCategory),
  };
  let editTitle   = blog.title;
  let editContent = blog.content.map(b => b.type === 'h2' ? `## ${b.text}` : b.text).join('\n\n');

  function generateContentForTopic(topic, category) {
    // Use the source article's actual summary as the first paragraph if available
    const sourceSummary = source?.summary || source?.editorialSummary || '';
    const t = topic;
    const c = category;
    return [
      { type: 'h2', text: `The State of ${c} in 2025` },
      { type: 'p',  text: sourceSummary || `The landscape around ${t} has evolved significantly over the past year. What began as an emerging trend has now become a core focus for organisations navigating the demands of a fast-moving industry.` },
      { type: 'h2', text: 'Key Developments and What They Mean' },
      { type: 'p',  text: `This past year has seen accelerated investment in ${t}. The most impactful shifts are not in isolated breakthroughs but in the convergence of mature tooling, broader adoption, and clearer regulatory frameworks that are making real-world deployment more predictable.` },
      { type: 'h2', text: 'What Practitioners Are Doing Differently' },
      { type: 'p',  text: `The organisations seeing the strongest results approach ${t} as a capability to build rather than a product to buy. They invest in measurement, iterate quickly on early pilots, and prioritise internal knowledge development over vendor dependency.` },
      { type: 'h2', text: `The Outlook for ${c}` },
      { type: 'p',  text: `The window for differentiation is open. Teams that build genuine competency in ${t} now will hold a structural advantage as the field matures and competition intensifies. Early action combined with clear success metrics remains the most reliable path to durable results.` },
    ];
  }

  onMount(async () => {
    await new Promise(r => setTimeout(r, 800));
    loading = false;
    displayedTitle = blog.title;
    interval = setInterval(tick, 1000);
    tick();
  });
  onDestroy(() => { clearInterval(interval); });

  function tick() {
    const [hh, mm] = $publishTime.split(':').map(Number);
    const target = new Date();
    target.setHours(hh, mm, 0, 0);
    if (target <= new Date()) target.setDate(target.getDate() + 1);
    const diff = Math.max(0, Math.floor((target - new Date()) / 1000));
    countdown = { h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
  }
  $: $publishTime, tick();

  // Read admin AI behaviour config
  const AI_BEHAVIOUR_KEY = 'admin_ai_behaviour';
  function getAiBehaviour() {
    try { return JSON.parse(localStorage.getItem(AI_BEHAVIOUR_KEY) || 'null') || {}; } catch { return {}; }
  }

  let variantIndex = 0;

  async function regenerate() {
    regenerating = true; editing = false;
    const cfg = getAiBehaviour();

    // Respect admin toggles
    const useHistory   = cfg.useUserHistory  !== false;
    const useBookmarks = cfg.useBookmarks    !== false;
    const useInterests = cfg.useInterests    !== false;
    const tone         = cfg.tone            || 'Professional';
    const style        = cfg.writingStyle    || 'Concise';
    const introStyle   = cfg.introStyle      || 'context';
    const prefLength   = cfg.preferredLength || 'medium';
    const diversify    = cfg.diversifyTopics === true;

    // Build user interest profile
    const interestedCats  = useInterests  ? [...new Set($interestedBlogs.map(b => b.category).filter(Boolean))] : [];
    const readCats        = useHistory    ? [...new Set($readingHistory.map(b => b.category || b.theme).filter(Boolean))] : [];
    const bookmarkedBlogs = useBookmarks  ? $interestedBlogs.filter(b => $bookmarks.includes(Number(b.id))) : [];
    const bookmarkedCats  = [...new Set(bookmarkedBlogs.map(b => b.category).filter(Boolean))];

    const catScore = {};
    readCats.forEach(c       => { catScore[c] = (catScore[c] || 0) + 1; });
    interestedCats.forEach(c => { catScore[c] = (catScore[c] || 0) + 2; });
    bookmarkedCats.forEach(c => { catScore[c] = (catScore[c] || 0) + 3; });

    // Diversify: skip the previously used category if enabled
    const sortedCats = Object.entries(catScore).sort((a, b) => b[1] - a[1]).map(e => e[0]);
    let topCat = sourceCategory;
    if (sortedCats.length > 0) {
      topCat = diversify && sortedCats.length > 1 && sortedCats[0] === blog.category
        ? sortedCats[1]
        : sortedCats[0];
    }

    const recentTitles = $interestedBlogs.slice(0, 3).map(b => b.title).filter(Boolean);

    // Build intro based on admin intro style
    const introMap = {
      context:  recentTitles.length > 0 ? `Based on your interest in: ${recentTitles.slice(0,2).join('; ')}` : `The field of ${topCat} is evolving rapidly.`,
      hook:     `Here is what most practitioners in ${topCat} are getting wrong — and how to fix it.`,
      stat:     `Teams investing seriously in ${topCat} report 3× faster delivery cycles. Here is what they do differently.`,
      question: `What separates organisations that succeed in ${topCat} from those that stall? The answer is simpler than you think.`,
    };
    const intro = introMap[introStyle] || introMap.context;

    // Build tone-adjusted paragraph suffix
    const toneSuffix = {
      Professional:    'This analysis draws on observed patterns across leading organisations.',
      Conversational:  'Think of this as a practical playbook you can start using this week.',
      Academic:        'The evidence base for these recommendations is drawn from empirical studies.',
      Journalistic:    'Interviews with practitioners reveal a consistent set of success factors.',
      Opinionated:     'The uncomfortable truth is that most teams are approaching this backwards.',
    }[tone] || '';

    // Word count target based on preferred length
    const lengthTarget = { short: '~300 words', medium: '~500 words', long: '~900 words' }[prefLength] || '~500 words';

    // Style-specific structure label
    const structureNote = {
      'Concise':       'Keep each section tight. One idea per paragraph.',
      'In-depth':      'Expand on each point with supporting detail.',
      'Listicle':      'Use numbered points where possible.',
      'How-to Guide':  'Structure as actionable steps.',
      'Opinion Piece': 'Take a clear stance and defend it.',
      'Case Study':    'Ground each section in a real-world example pattern.',
    }[style] || '';

    const personalised = [
      {
        title: `${topCat}: What’s Changing in 2025 and Why It Matters`,
        sections: [
          { h: `The ${topCat} Landscape Right Now`, p: `${intro} ${toneSuffix}`.trim() },
          { h: 'Where the Real Opportunity Lies', p: `The teams gaining the most ground are not necessarily those with the largest budgets. They are the ones with the clearest problem statements and the fastest feedback loops. ${structureNote}` },
          { h: 'The Signals Worth Watching', p: `Three indicators consistently predict whether an initiative in ${topCat} will succeed: executive sponsorship, a defined measurement framework, and a culture of iteration. Target ${lengthTarget}.` },
          { h: `Your Next Step in ${topCat}`, p: `The window for early-mover advantage is narrowing. Teams that begin building genuine capability now will find themselves structurally ahead as the field matures.` },
        ],
      },
      {
        title: `A ${style} on ${sourceTopic} for ${topCat} Practitioners`,
        sections: [
          { h: 'Why This Topic Deserves More Attention', p: `${intro} ${sourceTopic} continues to be underestimated by practitioners outside the core community.` },
          { h: 'The Practical Reality', p: `Moving from awareness to application is where most teams stall. The gap is rarely technical — it is organisational. ${toneSuffix}` },
          { h: 'Patterns That Work', p: `The most repeatable successes share a common structure: narrow scope, fast iteration, visible metrics, and a named owner. ${structureNote}` },
          { h: 'Building for the Long Term', p: `Short-term pilots not designed to scale create debt. Build with the assumption that what you start today will need to handle ten times the load within two years. Target ${lengthTarget}.` },
        ],
      },
      {
        title: `The Insider’s Perspective on ${topCat}`,
        sections: [
          { h: 'The Gap Between the Hype and the Work', p: `${intro} The day-to-day reality of ${topCat} looks nothing like conference presentations. ${toneSuffix}` },
          { h: 'What Experienced Practitioners Do Differently', p: `They scope ruthlessly. They define success before they begin. They treat the first version as a learning exercise. ${structureNote}` },
          { h: 'The Tools That Actually Get Used', p: `The tool that wins is rarely the most powerful — it is the one the team will actually use consistently.` },
          { h: 'What to Prioritise Next Quarter', p: `Pick one metric, one owner, one four-week experiment. That discipline, repeated, is what separates teams that grow from teams that stagnate. Target ${lengthTarget}.` },
        ],
      },
    ];

    const v = personalised[variantIndex % personalised.length];
    variantIndex++;
    const newContent = v.sections.flatMap(s => [
      { type: 'h2', text: s.h },
      { type: 'p',  text: s.p },
    ]);

    blog = {
      ...blog,
      title: v.title,
      content: newContent,
      category: topCat,
      qualityScore: +(8.2 + Math.random() * 1.5).toFixed(1),
      wordCount: 360 + Math.floor(Math.random() * 100),
    };
    editTitle   = blog.title;
    editContent = blog.content.map(b => b.type === 'h2' ? `## ${b.text}` : b.text).join('\n\n');
    displayedTitle = blog.title;
    relevanceScore  = +(Math.max(cfg.minVariantScore || 7, 8) + Math.random()).toFixed(1);
    innovationScore = +(Math.max(cfg.minVariantScore || 7, 8) + Math.random()).toFixed(1);
    regenerating = false;
  }

  function startEdit() {
    editTitle   = blog.title;
    editContent = blog.content.map(b => b.type === 'h2' ? `## ${b.text}` : b.text).join('\n\n');
    editing = true;
  }
  function saveEdit() {
    blog = {
      ...blog,
      title: editTitle.trim() || blog.title,
      content: editContent.split('\n\n').filter(Boolean).map(line =>
        line.startsWith('## ') ? { type: 'h2', text: line.slice(3).trim() } : { type: 'p', text: line.trim() }
      ),
      wordCount: editContent.split(/\s+/).length,
    };
    editing = false;
  }
  function cancelEdit() { editing = false; }

  async function copyMarkdown() {
    const md = `# ${blog.title}\n\n` +
      blog.content.map(b => b.type === 'h2' ? `## ${b.text}` : b.text).join('\n\n');
    await navigator.clipboard.writeText(md);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  async function exportPDF() {
    const content = `${blog.title}\n\n` +
      blog.content.map(b => b.type === 'h2' ? `\n${b.text}\n` : b.text).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${blog.title.slice(0, 40).replace(/[^a-z0-9]/gi, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function exportMarkdown() {
    const md = `# ${blog.title}\n\n` +
      blog.content.map(b => b.type === 'h2' ? `## ${b.text}` : b.text).join('\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${blog.title.slice(0, 40).replace(/[^a-z0-9]/gi, '-')}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  $: readingTime = Math.max(1, Math.ceil(wordCount / 200));
  /** @param {number} n */
  function pad(n) { return String(n).padStart(2, '0'); }

  function handleSchedule() {
    const [hh, mm] = $publishTime.split(':').map(Number);
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    if (d <= new Date()) d.setDate(d.getDate() + 1);
    schedulePost({ id: Date.now(), title: blog.title, scheduledAt: d.toISOString(), status: 'scheduled', category: blog.category, cmsStatus: 'pending', coverImage: blog.coverImage, summary: blog.content.find(b => b.type === 'p')?.text || '' });
    published = true;
  }
</script>

<div class="preview-wrap">

  {#if loading || regenerating}
    <div class="loading-state">
      <div class="spinner"></div>
      <p class="loading-text">{regenerating ? 'Regenerating with Mistral AI…' : 'Generating your blog with Mistral AI…'}</p>
    </div>

  {:else if published}
    <div class="success-wrap">
      <div class="success-card">
        <div class="success-check">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h1 class="success-title">Blog Scheduled</h1>
        <p class="success-sub">Your blog will be published at <strong>{$publishTime}</strong> ({$timezone})</p>
        <div class="success-actions">
          <button class="outline-btn" on:click={() => currentPage.set('dashboard')}>View Queue</button>
          <button class="primary-btn" on:click={() => currentPage.set('home')}>Curate Another</button>
        </div>
      </div>
    </div>

  {:else}
    <!-- Page header -->
    <div class="page-head">
      <button class="back-btn" on:click={() => currentPage.set('discover')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Discover
      </button>
      <div class="page-head-row">
        <div>
          <h1 class="page-title">Blog Preview</h1>
          <p class="page-sub">Generated by Mistral AI · Review before scheduling</p>
        </div>
        {#if !editing}
          <button class="primary-btn" on:click={handleSchedule}>
            Schedule Blog
          </button>
        {/if}
      </div>
    </div>

    <div class="layout">

      <!-- ── Left: Blog content ── -->
      <div class="content-col">

        {#if editing}
          <!-- Edit mode -->
          <div class="edit-card">
            <div class="edit-head">
              <span class="section-label">Editing</span>
              <div class="edit-head-actions">
                <button class="ghost-btn" on:click={cancelEdit}>Cancel</button>
                <button class="primary-btn" on:click={saveEdit}>Save Changes</button>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label" for="edit-title">Title</label>
              <input id="edit-title" bind:value={editTitle} placeholder="Blog title…" class="edit-title-input" />
            </div>
            <div class="field-group">
              <label class="field-label" for="edit-content">Content — use ## for section headings, blank line between paragraphs</label>
              <textarea id="edit-content" bind:value={editContent} rows="20" class="edit-textarea"
                placeholder="## Section Heading&#10;&#10;Paragraph text here…"></textarea>
            </div>
          </div>

        {:else}
          <!-- Blog article -->
          <article class="blog-article">
            <img src={blog.coverImage} alt="" class="blog-cover" />

            <div class="blog-inner">
              <!-- Category + tags -->
              <div class="blog-tags">
                <span class="cat-pill">{blog.category}</span>
                {#each blog.tags as t}<span class="tag-pill">{t}</span>{/each}
                {#if isFeatured}<span class="featured-pill">Featured</span>{/if}
              </div>

              <!-- Title -->
              <h1 class="blog-title">{typingDone ? blog.title : displayedTitle}<span class="typing-cursor" class:hidden={typingDone}>|</span></h1>

              <!-- Byline -->
              <div class="blog-byline">
                <span class="byline-item">Mistral AI</span>
                <span class="byline-dot">·</span>
                <span class="byline-item">{blog.readTime} read</span>
                <span class="byline-dot">·</span>
                <span class="byline-item">{new Date().toLocaleDateString('en-GB', { dateStyle: 'medium' })}</span>
              </div>

              <!-- Quality signals -->
              <div class="signals-row">
                <span class="signal-pill {scorePillClass(relevanceScore)}">Relevance {relevanceScore}/10</span>
                <span class="signal-pill {scorePillClass(innovationScore)}">Innovation {innovationScore}/10</span>
                <span class="signal-pill {wcStatus === 'ok' ? 'ok' : 'warn'}">{wordCount} words</span>
                <span class="signal-pill ok">{readingTime} min read</span>
                {#if bannedFound.length > 0}
                  <span class="signal-pill warn">⚠ {bannedFound.length} flagged term{bannedFound.length > 1 ? 's' : ''}</span>
                {/if}
              </div>

              <!-- Body -->
              <div class="blog-body">
                {#each blog.content as block}
                  {#if block.type === 'h2'}
                    <h2 class="body-h2">{block.text}</h2>
                  {:else}
                    <p class="body-p">{block.text}</p>
                  {/if}
                {/each}
              </div>
            </div>
          </article>
        {/if}
      </div>

      <!-- ── Right: Sidebar ── -->
      <aside class="sidebar">

        <!-- Schedule -->
        <div class="side-card">
          <div class="side-heading">Schedule</div>
          <div class="time-display">
            <span class="time-big">{$publishTime}</span>
            <span class="time-tz">{$timezone}</span>
          </div>
          <div class="countdown">
            Publishes in
            <span class="cd-seg">{pad(countdown.h)}<span class="cd-unit">h</span></span>
            <span class="cd-seg">{pad(countdown.m)}<span class="cd-unit">m</span></span>
            <span class="cd-seg">{pad(countdown.s)}<span class="cd-unit">s</span></span>
          </div>
          <div class="field-group">
            <label class="field-label" for="pub-time">Publish time</label>
            <input id="pub-time" type="time" bind:value={$publishTime} />
          </div>
          <div class="field-group">
            <label class="field-label" for="pub-tz">Timezone</label>
            <select id="pub-tz" bind:value={$timezone}>
              <option value="Asia/Kolkata">IST — Asia/Kolkata</option>
              <option value="Europe/Paris">CET — Europe/Paris</option>
              <option value="America/New_York">EST — America/New_York</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <button class="primary-btn full" on:click={handleSchedule} disabled={editing}>
            Schedule Blog
          </button>
        </div>

        <!-- AI info -->
        <div class="side-card">
          <div class="side-heading">AI Details</div>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Model</span>
              <span class="info-val">Mistral 7B · Ollama</span>
            </div>
            <div class="info-row">
              <span class="info-label">Words</span>
              <span class="info-val">~{blog.wordCount}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Quality</span>
              <span class="info-val">{blog.qualityScore} / 10</span>
            </div>
            <div class="info-row">
              <span class="info-label">Language</span>
              <span class="info-val">{$bilingual ? 'EN + FR' : 'English'}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="side-card">
          <div class="side-heading">Actions</div>
          <div class="action-list">
            {#if editing}
              <button class="action-btn primary" on:click={saveEdit}>Save Changes</button>
              <button class="action-btn" on:click={cancelEdit}>Cancel Edit</button>
            {:else}
              <button class="action-btn" on:click={startEdit}>Edit Blog</button>
              <button class="action-btn" on:click={regenerate}>Regenerate</button>
              <button class="action-btn" on:click={copyMarkdown}>
                {copied ? '✓ Copied!' : 'Copy Markdown'}
              </button>
              <button class="action-btn" on:click={exportMarkdown}>Export .md</button>
              <button class="action-btn" on:click={exportPDF}>Export .txt</button>
            {/if}
            <button class="action-btn danger" on:click={() => { interestedBlogs.set([]); currentPage.set('discover'); }}>Remove All & Discard</button>
          </div>
        </div>

      </aside>
    </div>
  {/if}
</div>

<style>
  .preview-wrap {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 32px 80px;
  }

  /* Loading */
  .loading-state {
    display: flex; flex-direction: column; align-items: center;
    gap: 16px; padding: 120px 0;
  }
  .loading-text { font-size: 15px; color: var(--text-muted); font-family: var(--sans); }

  /* Success */
  .success-wrap {
    display: flex; align-items: center; justify-content: center;
    padding: 100px 24px;
  }
  .success-card {
    text-align: center; max-width: 400px;
  }
  .success-check {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--green-light); color: var(--green);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
  }
  .success-title {
    font-family: var(--serif); font-size: 28px; font-weight: 700;
    color: var(--text-black); margin-bottom: 8px;
  }
  .success-sub { font-size: 15px; color: var(--text-muted); margin-bottom: 28px; line-height: 1.6; }
  .success-actions { display: flex; gap: 10px; justify-content: center; }

  /* Page header */
  .page-head {
    padding: 32px 0 28px;
    border-bottom: 1px solid var(--divider);
    margin-bottom: 32px;
  }
  .back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; margin-bottom: 12px; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text-black); }
  .page-head-row {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }
  .page-title {
    font-family: var(--serif); font-size: 28px; font-weight: 700;
    color: var(--text-black); letter-spacing: -0.3px; margin-bottom: 4px;
  }
  .page-sub { font-size: 14px; color: var(--text-muted); }

  /* Layout */
  .layout { display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: start; }

  /* Blog article */
  .blog-article {
    border: 1px solid var(--divider); border-radius: 8px; overflow: hidden;
    background: var(--white);
  }
  .blog-cover { width: 100%; height: 260px; object-fit: cover; display: block; }
  .blog-inner { padding: 36px 40px 40px; }

  .blog-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
  .cat-pill {
    font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 100px;
    background: var(--text-black); color: #fff; letter-spacing: 0.03em;
  }
  .tag-pill {
    font-size: 11px; color: var(--text-muted); background: var(--off-white);
    border: 1px solid var(--divider); padding: 3px 10px; border-radius: 100px;
  }
  .featured-pill {
    font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px;
    background: var(--amber-light); color: var(--amber);
  }

  .blog-title {
    font-family: var(--serif); font-size: 30px; font-weight: 700;
    color: var(--text-black); line-height: 1.25; letter-spacing: -0.4px;
    margin-bottom: 14px;
  }
  .typing-cursor {
    display: inline-block;
    color: var(--green);
    animation: blink 0.7s step-end infinite;
    margin-left: 1px;
  }
  .typing-cursor.hidden { display: none; }
  @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }

  .blog-byline {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--text-muted);
    padding-bottom: 16px; margin-bottom: 16px;
    border-bottom: 1px solid var(--divider);
  }
  .byline-dot { color: var(--text-hint); }

  /* Quality signals */
  .signals-row {
    display: flex; flex-wrap: wrap; gap: 6px;
    padding-bottom: 20px; margin-bottom: 24px;
    border-bottom: 1px solid var(--divider);
  }
  .signal-pill {
    font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;
    letter-spacing: 0.02em;
  }
  .signal-pill.high { background: var(--green-light); color: var(--green-dark); }
  .signal-pill.mid  { background: var(--amber-light); color: var(--amber); }
  .signal-pill.low  { background: var(--off-white);   color: var(--text-muted); }
  .signal-pill.ok   { background: var(--green-light); color: var(--green-dark); }
  .signal-pill.warn { background: var(--amber-light); color: var(--amber); }

  /* Blog body — Medium-style reading typography */
  .blog-body { }
  .body-h2 {
    font-family: var(--serif); font-size: 20px; font-weight: 700;
    color: var(--text-black); line-height: 1.3; letter-spacing: -0.2px;
    margin: 32px 0 12px;
  }
  .body-p {
    font-family: var(--serif); font-size: 18px; color: var(--text-body);
    line-height: 1.8; margin-bottom: 20px; letter-spacing: 0.01em;
  }

  /* Edit card */
  .edit-card {
    border: 1px solid var(--divider); border-radius: 8px;
    background: var(--white); padding: 28px;
  }
  .edit-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .edit-head-actions { display: flex; gap: 8px; }
  .edit-title-input {
    font-size: 16px; font-weight: 600; font-family: var(--sans);
  }
  .edit-textarea {
    font-family: var(--sans); font-size: 14px; line-height: 1.7;
    resize: vertical;
  }

  /* Sidebar */
  .sidebar { display: flex; flex-direction: column; gap: 16px; }
  .side-card {
    border: 1px solid var(--divider); border-radius: 8px;
    background: var(--white); padding: 20px;
  }
  .side-heading {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px;
  }

  /* Time display */
  .time-display {
    display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;
  }
  .time-big {
    font-family: var(--serif); font-size: 32px; font-weight: 700;
    color: var(--text-black); line-height: 1;
  }
  .time-tz { font-size: 12px; color: var(--text-muted); }
  .countdown {
    font-size: 12px; color: var(--text-muted); margin-bottom: 16px;
    display: flex; align-items: center; gap: 4px;
  }
  .cd-seg { font-weight: 600; color: var(--text-black); }
  .cd-unit { font-weight: 400; color: var(--text-muted); font-size: 11px; }

  /* Info list */
  .info-list { display: flex; flex-direction: column; gap: 0; }
  .info-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; border-bottom: 1px solid var(--divider);
  }
  .info-row:last-child { border-bottom: none; }
  .info-label { font-size: 13px; color: var(--text-muted); }
  .info-val   { font-size: 13px; font-weight: 500; color: var(--text-black); }

  /* Action list */
  .action-list { display: flex; flex-direction: column; gap: 8px; }
  .action-btn {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 10px 16px; border-radius: 8px;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    cursor: pointer; border: 1px solid var(--divider);
    background: var(--white); color: var(--text-body);
    transition: all 0.15s;
  }
  .action-btn:hover { background: var(--off-white); border-color: var(--divider-strong); }
  .action-btn.primary { background: var(--text-black); color: #fff; border-color: var(--text-black); }
  .action-btn.primary:hover { background: #333; }
  .action-btn.danger { color: var(--red); }
  .action-btn.danger:hover { background: var(--red-light); border-color: var(--red); }

  /* Shared buttons */
  .primary-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    background: var(--text-black); color: #fff; border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; white-space: nowrap;
    transition: background 0.15s; flex-shrink: 0;
  }
  .primary-btn:hover:not(:disabled) { background: #333; }
  .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .primary-btn.full { width: 100%; border-radius: 8px; }

  .outline-btn {
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--white); color: var(--text-black);
    border: 1px solid var(--divider-strong); cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; transition: background 0.15s;
  }
  .outline-btn:hover { background: var(--off-white); }

  .ghost-btn {
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; transition: color 0.15s;
  }
  .ghost-btn:hover { color: var(--text-black); }

  /* Form fields */
  .field-group { margin-bottom: 14px; }
  .field-group:last-child { margin-bottom: 0; }
  .field-label {
    display: block; font-size: 12px; font-weight: 500;
    color: var(--text-muted); margin-bottom: 6px;
  }
  .section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted);
  }

  @media (max-width: 860px) {
    .preview-wrap { padding: 0 16px 60px; }
    .layout { grid-template-columns: 1fr; }
    .sidebar { order: -1; }
    .blog-inner { padding: 24px 20px; }
    .blog-title { font-size: 24px; }
    .body-p { font-size: 16px; }
    .page-head-row { flex-direction: column; }
  }
</style>
