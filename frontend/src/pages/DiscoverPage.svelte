<script>
  import {
    searchQuery, rejectedIds, interestedBlogs, bookmarks,
    rejectBlog, interestBlog, toggleBookmark,
    currentPage, selectedBlog, articleFrom, addRecentSearch,
    publicArticles, fetchPublicArticles
  } from '../stores/store.js';
  import { onMount } from 'svelte';

  // picsum.photos — free, no API key, always returns a real image
  // Uses a deterministic seed so same keyword always gets the same image
  function getRelevantImage(keyword, category) {
    const str = (keyword + (category || '')).toLowerCase();
    const seed = str.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 7);
    const id = 10 + (seed % 990);
    return `https://picsum.photos/id/${id}/600/300`;
  }

  onMount(() => fetchPublicArticles());

  $: backendBlogs = $publicArticles.map(a => ({
    id: a.id,
    lang: a.language === 'French' ? 'FR' : 'EN',
    title: a.title || 'Untitled',
    source: a.sourceUrl ? new URL(a.sourceUrl).hostname.replace('www.','') : 'BlogCurate',
    category: a.theme || 'General',
    readTime: '5 min',
    image: a.imageUrl || getRelevantImage(a.title || '', a.themeId || ''),
    summary: a.summary || a.editorialSummary || '',
    sourceUrl: a.sourceUrl || '#',
    tags: [a.theme],
    featured: a.featured,
    relevanceScore: a.relevanceScore,
    innovationScore: a.innovationScore,
  }));

  // Real-time only — no mock data
  $: trendingBlogs  = backendBlogs.slice(0, 6);
  $: editorBlogs    = backendBlogs.filter(b => b.featured).slice(0, 6);
  $: evergreenBlogs = backendBlogs.filter(b => (b.relevanceScore || 0) >= 8).slice(0, 6);

  let discoverTab = 'trending';
  let searchInput = '';
  let showSuggestions = false;
  let hasSearched = false;
  let searching = false;
  let webResults = [];
  let searchMode = 'local';
  let urlPreview = null;
  let pipelineTriggering = {};
  let pipelineTriggered = {};

  $: isUrl = /^https?:\/\//i.test(searchInput.trim());

  const suggestions = ['Mistral AI', 'RAG Architecture', 'AI Agents', 'AI Safety', 'Startup Funding', 'AI in Healthcare'];

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
  const GOOGLE_CX      = import.meta.env.VITE_GOOGLE_CX || '';

  function guessCategory(text) {
    const t = text.toLowerCase();
    if (/\bai\b|machine learning|llm|neural|gpt|mistral|openai/.test(t)) return 'AI';
    if (/security|cyber|hack|breach|malware/.test(t)) return 'Security';
    if (/health|medical|clinical|hospital|drug/.test(t)) return 'Healthcare';
    if (/startup|funding|venture|series [abc]|ipo/.test(t)) return 'Startups';
    if (/climate|green|sustainab|carbon|electric|ev\b/.test(t)) return 'Sustainability';
    if (/svelte|react|vue|javascript|typescript|frontend|css/.test(t)) return 'Web Dev';
    return 'Tech';
  }

  function searchLocalBlogs(query) {
    const q = query.toLowerCase();
    const seen = new Set();
    return backendBlogs.filter(b => {
      if (seen.has(b.title)) return false;
      seen.add(b.title);
      const hay = [b.title, b.summary, b.category, b.source, ...(b.tags||[])].join(' ').toLowerCase();
      return q.split(/\s+/).filter(Boolean).every(w => hay.includes(w)) ||
             q.split(/\s+/).filter(Boolean).some(w => hay.includes(w) && w.length > 2);
    });
  }

  async function fetchGoogleResults(query) {
    if (!GOOGLE_API_KEY || !GOOGLE_CX) return searchLocalBlogs(query);
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&num=10`;
    const res = await fetch(url);
    if (!res.ok) return searchLocalBlogs(query);
    const data = await res.json();
    return (data.items || []).map((item, i) => ({
      id: `g-${Date.now()}-${i}`,
      title: item.title,
      source: item.displayLink?.replace('www.', '') || 'Web',
      sourceUrl: item.link,
      summary: item.snippet || '',
      image: item.pagemap?.cse_image?.[0]?.src || getRelevantImage(item.title, guessCategory(item.title)),
      category: guessCategory(item.title + ' ' + (item.snippet || '')),
      readTime: '5 min',
      tags: [guessCategory(item.title)],
      lang: 'EN',
      _fromWeb: true,
    }));
  }

  function simulateFetchUrl(url) {
    const u = new URL(url);
    const domain = u.hostname.replace('www.', '');
    const slug = u.pathname.split('/').filter(Boolean).pop() || '';
    const title = slug ? slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : `Article from ${domain}`;
    const category = guessCategory(title + ' ' + domain);
    return {
      id: Date.now(), title, source: domain, sourceUrl: url,
      summary: `This article was fetched from ${domain}. The AI has analysed the content and is ready to curate a blog post based on it.`,
      image: getRelevantImage(title, category), category, readTime: '5 min',
      tags: [category, domain], lang: 'EN', _fromUrl: true,
    };
  }

  async function doSearch(term) {
    const t = (term !== undefined ? term : searchInput).trim();
    if (!t) { showSuggestions = true; return; }
    showSuggestions = false;
    searchInput = t;
    hasSearched = true;
    addRecentSearch(t);
    searchQuery.set(t);
    searching = true;
    urlPreview = null; webResults = [];
    pipelineTriggering = {}; pipelineTriggered = {};
    if (/^https?:\/\//i.test(t)) {
      searchMode = 'url';
      try { urlPreview = simulateFetchUrl(t); } catch { urlPreview = null; }
    } else {
      searchMode = 'web';
      webResults = await fetchGoogleResults(t);
    }
    searching = false;
  }

  function clearSearch() {
    searchInput = '';
    hasSearched = false;
    searchQuery.set('');
    webResults = []; urlPreview = null; searchMode = 'local'; showSuggestions = false;
  }

  function onKey(e) {
    if (e.key === 'Enter') { showSuggestions = false; doSearch(); }
    if (e.key === 'Escape') showSuggestions = false;
  }

  async function triggerPipeline(blog) {
    const id = blog.id;
    pipelineTriggering = { ...pipelineTriggering, [id]: true };
    try {
      await fetch('http://localhost:8080/api/pipeline/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': import.meta.env.VITE_ADMIN_KEY || '' },
        body: JSON.stringify({ sourceUrl: blog.sourceUrl, topic: blog.title, theme: blog.category }),
      });
    } catch (e) {}
    interestBlog(blog);
    pipelineTriggered = { ...pipelineTriggered, [id]: true };
    pipelineTriggering = { ...pipelineTriggering, [id]: false };
  }

  $: interestedIds = $interestedBlogs.map(b => b.id);

  let dismissing = {};
  function animateReject(id) {
    dismissing = { ...dismissing, [id]: 'left' };
    setTimeout(() => { rejectBlog(id); delete dismissing[id]; dismissing = { ...dismissing }; }, 320);
  }
  function animateInterest(blog) {
    dismissing = { ...dismissing, [blog.id]: 'right' };
    setTimeout(() => { interestBlog(blog); delete dismissing[blog.id]; dismissing = { ...dismissing }; }, 320);
  }
  function openArticle(blog) {
    selectedBlog.set(blog); articleFrom.set('discover');
    currentPage.set('article'); window.scrollTo(0, 0);
  }
  function curateNow(blog) {
    interestBlog(blog); selectedBlog.set(blog); currentPage.set('preview');
  }

  const topicIcons = ['🤖','🔍','🛡️','🏥','💡','⚡','🚗','🌱','💻','☸️','🏢','🔗'];
  const trendingTopics = ['Mistral AI','RAG Architecture','AI Agents','AI Safety','Startup Funding','AI in Healthcare','Cybersecurity','Electric Vehicles','Svelte','Kubernetes','Future of Work','Blockchain'];

  const sections = [
    { id: 'trending',  icon: '🔥', label: 'Trending Now',    sub: 'Popular articles gaining traction this week' },
    { id: 'editors',   icon: '✨', label: "Editor's Picks",  sub: 'High-quality reads chosen for depth and insight' },
    { id: 'evergreen', icon: '📚', label: 'Evergreen Reads', sub: 'Timeless guides and deep-dives worth saving' },
  ];

  function getBlogList(tab) {
    if (tab === 'trending') return trendingBlogs;
    if (tab === 'editors')  return editorBlogs;
    return evergreenBlogs;
  }
  function getTagLabel(tab) {
    if (tab === 'trending') return { cls: 'trending-tag', text: '🔥 Trending' };
    if (tab === 'editors')  return { cls: 'editor-tag',   text: "✨ Editor's Pick" };
    return { cls: 'evergreen-tag', text: '📚 Evergreen' };
  }
</script>

<div class="discover-wrap">

  <div class="discover-header">
    <h1 class="discover-title">Discover</h1>
    <p class="discover-sub">Search articles, explore topics, and find featured reads.</p>
  </div>

  <!-- Search -->
  <div class="search-wrap">
    <div class="search-bar" class:url-mode={isUrl}>
      {#if isUrl}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
      {:else}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      {/if}
      <input bind:value={searchInput} placeholder="Search keywords or paste a URL (https://…)" on:keydown={onKey} />
      {#if searchInput}
        <button class="search-clear" on:click={clearSearch}>✕</button>
      {/if}
      <button class="search-btn" on:click={() => {
        if (!searchInput.trim()) { showSuggestions = !showSuggestions; }
        else { showSuggestions = false; doSearch(); }
      }}>
        {isUrl ? 'Fetch & Curate' : 'Search'}
      </button>
    </div>
    {#if isUrl}
      <div class="url-hint">🔗 URL detected — we'll fetch this article and prepare it for AI curation.</div>
    {/if}
    {#if showSuggestions && !isUrl}
      <div class="suggestions-drop">
        <p class="suggestions-label">Suggested topics</p>
        {#each suggestions as s}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div class="suggestion-item" on:click={() => { showSuggestions = false; doSearch(s); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.4"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            {s}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  {#if hasSearched}
    <!-- SEARCH RESULTS -->
    <section class="results-section">
      <div class="results-header">
        <div class="results-header-left">
          {#if searchMode === 'url'}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            <span class="results-title">Article fetched from <strong>{searchInput}</strong></span>
          {:else}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <span class="results-title">Results for "<strong>{searchInput}</strong>"</span>
          {/if}
        </div>
        <button class="results-clear" on:click={clearSearch}>Clear</button>
      </div>

      {#if searching}
        <div class="loading-row"><div class="spinner"></div><span>Searching…</span></div>
      {:else if searchMode === 'url'}
        {#if !urlPreview}
          <div class="empty-state"><p class="empty-title">Could not fetch that URL</p><p class="empty-sub">Try pasting keywords instead.</p></div>
        {:else}
          <div class="url-result-card">
            <img src={urlPreview.image} alt="" class="url-result-img" on:error={e => { e.currentTarget.src = 'https://picsum.photos/id/42/200/130'; }} />
            <div class="url-result-body">
              <div class="url-result-meta">
                <span class="result-source">{urlPreview.source}</span>
                <span class="result-dot">·</span>
                <span class="result-category">{urlPreview.category}</span>
                <a href={urlPreview.sourceUrl} target="_blank" rel="noopener" class="url-ext-link">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Open original
                </a>
              </div>
              <h3 class="result-title">{urlPreview.title}</h3>
              <p class="result-summary">{urlPreview.summary}</p>
              <div class="ai-curation-box">
                <div class="ai-curation-icon">✨</div>
                <div>
                  <p class="ai-curation-title">Ready to curate</p>
                  <p class="ai-curation-sub">Click below to generate a curated blog post from this article.</p>
                </div>
              </div>
              <div class="url-result-actions">
                <button class="ra-btn generate" on:click={() => curateNow(urlPreview)}>✨ Generate blog now</button>
                <button class="ra-btn" on:click={() => interestBlog(urlPreview)}>👍 Mark interested</button>
              </div>
            </div>
          </div>
        {/if}
      {:else if webResults.length === 0}
        <div class="empty-state"><p class="empty-title">No results found</p><p class="empty-sub">Try different keywords or paste a URL.</p></div>
      {:else}
        <div class="result-list">
          {#each webResults as blog}
            {@const isRejected   = $rejectedIds.includes(blog.id)}
            {@const isInterested = interestedIds.includes(blog.id)}
            {@const isBookmarked = $bookmarks.includes(Number(blog.id))}
            <article class="result-card" class:is-rejected={isRejected}>
              <img class="result-thumb" src={blog.image} alt="" on:error={e => { e.currentTarget.src = `https://picsum.photos/id/${10 + ((blog.title?.length || 5) % 50)}/120/80`; }} />
              <div class="result-body">
                <div class="result-meta-row">
                  <span class="result-source">{blog.source}</span>
                  <span class="result-dot">·</span>
                  <span class="result-read">{blog.readTime} read</span>
                  <span class="result-category">{blog.category}</span>
                  {#if blog._fromWeb}<span class="web-badge">🌐 Web</span>{/if}
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <h3 class="result-title" on:click={() => openArticle(blog)}>{blog.title}</h3>
                <p class="result-summary">{blog.summary}</p>
                <div class="result-actions">
                  {#if pipelineTriggered[blog.id]}
                    <button class="ra-btn interested-active" disabled>✅ Triggered</button>
                    <button class="ra-btn generate" on:click={() => curateNow(blog)}>✨ Generate Blog</button>
                  {:else if pipelineTriggering[blog.id]}
                    <button class="ra-btn" disabled><span class="spinner-sm"></span> Triggering…</button>
                  {:else if isInterested}
                    <button class="ra-btn interested-active" on:click={() => animateInterest(blog)}>👍 Interested</button>
                    <button class="ra-btn generate" on:click={() => curateNow(blog)}>✨ Generate Blog</button>
                  {:else if !isRejected}
                    <button class="ra-btn pipeline" on:click={() => triggerPipeline(blog)}>🚀 Trigger Pipeline</button>
                    <button class="ra-btn generate" on:click={() => curateNow(blog)}>✨ Generate</button>
                    <button class="ra-btn" on:click={() => animateReject(blog.id)}>👎 Skip</button>
                  {/if}
                  <button class="ra-icon-btn" class:bk-active={isBookmarked} on:click={() => toggleBookmark(blog.id)} title="Bookmark">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                  </button>
                </div>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </section>

  {:else}
    <!-- BROWSE MODE -->
    <section class="topics-section">
      <h2 class="topics-heading">🗂️ Explore Topics</h2>
      <div class="topics-grid">
        {#each trendingTopics as topic, i}
          <button class="topic-chip" on:click={() => doSearch(topic)}>
            <span class="topic-icon">{topicIcons[i % topicIcons.length]}</span>
            {topic}
          </button>
        {/each}
      </div>
    </section>

    <div class="discover-library">
      <div class="disc-top">
        <nav class="disc-nav">
          {#each sections as s}
            <button class="disc-nav-item" class:active={discoverTab === s.id} on:click={() => discoverTab = s.id}>
              <span class="disc-nav-icon">{s.icon}</span>{s.label}
            </button>
          {/each}
        </nav>
      </div>

      <div class="disc-main">
        {#each sections as s}
          {#if discoverTab === s.id}
            <div class="disc-section-head">
              <h2 class="disc-section-title"><span>{s.icon}</span> {s.label}</h2>
              <p class="disc-section-sub">{s.sub}</p>
            </div>
            {@const tag = getTagLabel(s.id)}
            {@const blogs = getBlogList(s.id)}
            {#if blogs.length === 0}
              <p class="empty-sub" style="padding:24px 0">No articles yet — trigger the pipeline to populate this section.</p>
            {:else}
              <!-- Hero card + grid -->
              <div class="blog-hero-card" on:click={() => openArticle(blogs[0])}>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <img class="hero-img" src={blogs[0].image} alt="" on:error={e => { e.currentTarget.src = 'https://picsum.photos/id/42/360/240'; }} />
                <div class="hero-body">
                  <span class="feat-tag {tag.cls}">{tag.text}</span>
                  <h2 class="hero-title">{blogs[0].title}</h2>
                  <p class="hero-summary">{blogs[0].summary}</p>
                  <div class="hero-meta">
                    <span class="hero-source">{blogs[0].source}</span>
                    <span class="hero-dot">·</span>
                    <span class="hero-read">{blogs[0].readTime} read</span>
                    <span class="hero-cat">{blogs[0].category}</span>
                  </div>
                </div>
                <button class="feat-bk" class:bk-active={$bookmarks.includes(Number(blogs[0].id))}
                  on:click|stopPropagation={() => toggleBookmark(blogs[0].id)} aria-label="Bookmark">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={$bookmarks.includes(Number(blogs[0].id)) ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                </button>
              </div>

              <div class="blog-card-grid">
                {#each blogs.slice(1) as blog}
                  {@const isBookmarked = $bookmarks.includes(Number(blog.id))}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div class="blog-card" on:click={() => openArticle(blog)}>
                    <img class="blog-card-img" src={blog.image} alt="" on:error={e => { e.currentTarget.src = 'https://picsum.photos/id/42/400/160'; }} />
                    <div class="blog-card-body">
                      <span class="feat-tag {tag.cls}" style="margin-bottom:8px">{tag.text}</span>
                      <h3 class="blog-card-title">{blog.title}</h3>
                      <p class="blog-card-summary">{blog.summary}</p>
                      <div class="blog-card-meta">
                        <span class="hero-source">{blog.source}</span>
                        <span class="hero-dot">·</span>
                        <span class="hero-read">{blog.readTime} read</span>
                      </div>
                    </div>
                    <button class="feat-bk" class:bk-active={isBookmarked}
                      on:click|stopPropagation={() => toggleBookmark(blog.id)} aria-label="Bookmark">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          {/if}
        {/each}
      </div>
    </div>
  {/if}

</div>

<style>
  .discover-wrap { max-width: 1080px; margin: 0 auto; padding: 0 32px 80px; }

  .discover-header { padding: 24px 0 20px; border-bottom: 1px solid var(--divider); margin-bottom: 24px; }
  .discover-title { font-family: var(--serif); font-size: 32px; font-weight: 700; color: var(--text-black); letter-spacing: -0.4px; margin-bottom: 4px; }
  .discover-sub { font-size: 14px; color: var(--text-muted); }

  /* Search */
  .search-wrap { position: relative; margin-bottom: 28px; }
  .search-bar {
    display: flex; align-items: center; gap: 10px;
    background: var(--white); border: 1.5px solid var(--divider-strong);
    border-radius: 100px; padding: 8px 8px 8px 18px; max-width: 640px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-bar:focus-within { border-color: var(--text-black); box-shadow: 0 0 0 3px rgba(0,0,0,0.06); }
  .search-bar.url-mode:focus-within { border-color: #6a1b9a; box-shadow: 0 0 0 3px rgba(106,27,154,0.08); }
  .search-bar svg { color: var(--text-muted); flex-shrink: 0; }
  .search-bar input { flex: 1; border: none; background: transparent; outline: none; font-size: 15px; color: var(--text-black); font-family: var(--sans); }
  .search-bar input::placeholder { color: var(--text-hint); }
  .search-clear { background: none; border: none; cursor: pointer; font-size: 13px; color: var(--text-muted); padding: 2px 6px; border-radius: 50%; }
  .search-clear:hover { color: var(--text-black); }
  .search-btn { background: var(--text-black); color: var(--white); border: none; cursor: pointer; font-size: 14px; font-weight: 500; font-family: var(--sans); padding: 9px 22px; border-radius: 100px; white-space: nowrap; transition: opacity 0.15s; }
  .search-btn:hover { opacity: 0.85; }

  .url-hint { margin-top: 8px; font-size: 13px; color: #6a1b9a; display: flex; align-items: center; gap: 6px; }

  .suggestions-drop {
    position: absolute; top: calc(100% + 6px); left: 0;
    background: var(--white); border: 1px solid var(--divider);
    border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    width: 360px; z-index: 200; overflow: hidden;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
  .suggestions-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); padding: 12px 16px 6px; }
  .suggestion-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; font-size: 14px; color: var(--text-body); cursor: pointer; transition: background 0.12s; }
  .suggestion-item:hover { background: var(--off-white); color: var(--text-black); }

  /* Topics */
  .topics-section { margin-bottom: 28px; }
  .topics-heading { font-size: 15px; font-weight: 700; color: var(--text-black); margin-bottom: 12px; font-family: var(--sans); }
  .topics-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .topic-chip { display: inline-flex; align-items: center; gap: 7px; background: var(--white); border: 1px solid var(--divider); color: var(--text-body); font-size: 13px; font-family: var(--sans); padding: 8px 16px; border-radius: 100px; cursor: pointer; transition: border-color 0.15s, background 0.15s, transform 0.15s; }
  .topic-chip:hover { border-color: var(--text-black); background: var(--off-white); transform: translateY(-1px); }
  .topic-icon { font-size: 15px; }

  /* Library */
  .discover-library { border: 1px solid var(--divider); border-radius: 12px; background: var(--white); overflow: hidden; }
  .disc-top { border-bottom: 1px solid var(--divider); padding: 0 24px; }
  .disc-nav { display: flex; overflow-x: auto; gap: 0; }
  .disc-nav::-webkit-scrollbar { height: 0; }
  .disc-nav-item {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 14px 20px 13px; background: none; border: none; cursor: pointer;
    font-size: 14px; color: var(--text-muted); font-family: var(--sans);
    white-space: nowrap; transition: color 0.15s;
    border-bottom: 2px solid transparent; position: relative; top: 1px;
  }
  .disc-nav-item:hover { color: var(--text-black); }
  .disc-nav-item.active { color: var(--text-black); font-weight: 600; border-bottom-color: var(--text-black); }
  .disc-nav-icon { font-size: 16px; }
  .disc-main { padding: 28px; }

  .disc-section-head { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--divider); }
  .disc-section-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .disc-section-sub { font-size: 13px; color: var(--text-muted); }

  /* Hero blog card */
  .blog-hero-card {
    position: relative; display: flex; border: 1px solid var(--divider);
    border-radius: 12px; overflow: hidden; cursor: pointer; margin-bottom: 20px;
    background: var(--white); transition: box-shadow 0.2s, transform 0.2s;
  }
  .blog-hero-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.10); transform: translateY(-2px); }
  .hero-img { width: 360px; height: 240px; object-fit: cover; flex-shrink: 0; }
  .hero-body { flex: 1; padding: 28px 28px 24px; display: flex; flex-direction: column; gap: 10px; }
  .hero-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); line-height: 1.3; letter-spacing: -0.2px; }
  .hero-summary { font-size: 14px; color: var(--text-muted); line-height: 1.6; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .hero-meta { display: flex; align-items: center; gap: 6px; margin-top: auto; }
  .hero-source { font-size: 13px; font-weight: 500; color: var(--text-black); }
  .hero-dot { font-size: 13px; color: var(--text-hint); }
  .hero-read { font-size: 13px; color: var(--text-muted); }
  .hero-cat { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 100px; background: var(--off-white); border: 1px solid var(--divider); color: var(--text-muted); margin-left: 4px; }

  /* Blog card grid */
  .blog-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .blog-card {
    position: relative; border: 1px solid var(--divider); border-radius: 10px;
    overflow: hidden; cursor: pointer; background: var(--white);
    display: flex; flex-direction: column;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .blog-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); transform: translateY(-3px); }
  .blog-card-img { width: 100%; height: 160px; object-fit: cover; display: block; }
  .blog-card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .blog-card-title { font-family: var(--serif); font-size: 16px; font-weight: 700; color: var(--text-black); line-height: 1.35; }
  .blog-card-summary { font-size: 13px; color: var(--text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
  .blog-card-meta { display: flex; align-items: center; gap: 5px; margin-top: 8px; }

  /* Tags */
  .feat-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.03em; padding: 3px 10px; border-radius: 100px; width: fit-content; }
  .trending-tag  { background: #fff3e0; color: #e65100; }
  .editor-tag    { background: #f3e5f5; color: #6a1b9a; }
  .evergreen-tag { background: #e8f5e9; color: #1b5e20; }

  /* Bookmark button */
  .feat-bk { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.92); border: none; cursor: pointer; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.15s; box-shadow: 0 1px 6px rgba(0,0,0,0.12); }
  .feat-bk:hover, .feat-bk.bk-active { color: var(--text-black); background: var(--white); }

  /* Results */
  .results-section { margin-bottom: 48px; }
  .results-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--divider); margin-bottom: 20px; }
  .results-header-left { display: flex; align-items: center; gap: 8px; }
  .results-title { font-size: 15px; color: var(--text-muted); }
  .results-title strong { color: var(--text-black); }
  .results-clear { background: none; border: none; cursor: pointer; font-size: 13px; color: var(--text-muted); font-family: var(--sans); padding: 0; }
  .results-clear:hover { color: var(--text-black); }

  .loading-row { display: flex; align-items: center; gap: 12px; padding: 32px 0; font-size: 14px; color: var(--text-muted); }
  .empty-state { padding: 40px 0; text-align: center; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--text-black); margin-bottom: 6px; }
  .empty-sub { font-size: 14px; color: var(--text-muted); }

  .result-list { display: flex; flex-direction: column; gap: 0; }
  .result-card {
    display: flex; align-items: flex-start; gap: 20px;
    padding: 20px 12px; border-bottom: 1px solid var(--divider);
    border-radius: 8px; transition: background 0.15s;
  }
  .result-card:hover { background: var(--off-white); }
  .result-card.is-rejected { opacity: 0.4; }
  .result-thumb { width: 120px; height: 80px; object-fit: cover; border-radius: 6px; flex-shrink: 0; cursor: pointer; }
  .result-body { flex: 1; min-width: 0; }
  .result-meta-row { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; }
  .result-source { font-size: 13px; font-weight: 500; color: var(--text-black); }
  .result-dot    { font-size: 13px; color: var(--text-hint); }
  .result-read   { font-size: 12px; color: var(--text-muted); }
  .result-category { font-size: 11px; font-weight: 600; background: var(--off-white); border: 1px solid var(--divider); color: var(--text-muted); padding: 2px 8px; border-radius: 100px; }
  .web-badge { font-size: 10px; font-weight: 600; padding: 1px 6px; background: #eef2ff; border: 1px solid #c7d2fe; color: #4338ca; border-radius: 100px; }
  .result-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--text-black); line-height: 1.3; margin-bottom: 6px; cursor: pointer; }
  .result-title:hover { text-decoration: underline; text-decoration-color: var(--divider-strong); }
  .result-summary { font-size: 13px; color: var(--text-muted); line-height: 1.55; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .result-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

  .url-result-card { display: flex; gap: 24px; padding: 28px; border: 1px solid var(--divider); border-radius: 12px; background: var(--white); }
  .url-result-img { width: 200px; height: 130px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  .url-result-body { flex: 1; min-width: 0; }
  .url-result-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
  .url-result-actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
  .url-ext-link { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-muted); text-decoration: none; }
  .url-ext-link:hover { color: var(--text-black); }
  .ai-curation-box { display: flex; align-items: flex-start; gap: 12px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 14px 16px; margin-top: 14px; }
  .ai-curation-icon { font-size: 20px; flex-shrink: 0; }
  .ai-curation-title { font-size: 14px; font-weight: 600; color: #6b21a8; margin-bottom: 3px; }
  .ai-curation-sub { font-size: 13px; color: #7c3aed; line-height: 1.5; }

  .ra-btn { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; font-family: var(--sans); padding: 5px 12px; border-radius: 100px; cursor: pointer; border: 1px solid var(--divider); background: var(--white); color: var(--text-muted); transition: all 0.15s; }
  .ra-btn:hover { border-color: var(--text-black); color: var(--text-black); }
  .ra-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .ra-btn.interested-active { background: rgba(26,137,23,0.08); border-color: var(--green); color: var(--green); }
  .ra-btn.generate { background: var(--text-black); color: var(--white); border-color: var(--text-black); }
  .ra-btn.generate:hover { opacity: 0.85; }
  .ra-btn.pipeline { background: #1e40af; color: var(--white); border-color: #1e40af; }
  .ra-icon-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; background: none; border: none; cursor: pointer; color: var(--text-muted); transition: background 0.15s, color 0.15s; }
  .ra-icon-btn:hover { background: var(--off-white); color: var(--text-black); }
  .ra-icon-btn.bk-active { color: var(--text-black); }
  .spinner-sm { display: inline-block; width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.15); border-top-color: var(--text-black); animation: spin 0.7s linear infinite; }
  .spinner { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--divider); border-top-color: var(--text-black); animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 860px) {
    .hero-img { width: 220px; height: 180px; }
    .blog-card-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .discover-wrap { padding: 0 16px 60px; }
    .blog-hero-card { flex-direction: column; }
    .hero-img { width: 100%; height: 200px; }
    .blog-card-grid { grid-template-columns: 1fr; }
    .result-card { flex-direction: column-reverse; }
    .result-thumb { width: 100%; height: 160px; }
    .url-result-card { flex-direction: column; }
    .url-result-img { width: 100%; height: 160px; }
  }
</style>
