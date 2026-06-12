<script>
  import {
    currentPage, interestedBlogs, scheduledPosts, bookmarks, activityLog,
    pipelineStats, rejectedIds, rejectBlog, interestBlog, toggleBookmark,
    selectedBlog, articleFrom, logRead, publicArticles, fetchPublicArticles
  } from '../stores/store.js';

  import { onMount } from 'svelte';
  onMount(() => fetchPublicArticles());

  let activeTab = 'foryou';
  let cardLang = {};       // { [blogId]: 'EN' | 'FR' }
  let translations = {};   // { [blogId]: { title: string, summary: string } }
  let translating = {};    // { [blogId]: boolean }

  async function translate(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|fr`;
    const res = await fetch(url);
    const data = await res.json();
    return data.responseData?.translatedText || text;
  }

  async function switchLang(blog, lang) {
    cardLang = { ...cardLang, [blog.id]: lang };
    if (lang === 'FR' && !translations[blog.id]) {
      translating = { ...translating, [blog.id]: true };
      const [title, summary] = await Promise.all([
        translate(blog.title || ''),
        translate(blog.summary || '')
      ]);
      translations[blog.id] = { title, summary };
      translations = translations; // trigger Svelte reactivity
      translating[blog.id] = false;
      translating = translating;   // trigger Svelte reactivity
    }
  }

  $: interestedIds      = $interestedBlogs.map(b => b.id);
  $: followedCategories = [...new Set($interestedBlogs.map(b => b.category).filter(Boolean))];

  // For You: personalized — sorted by user interests/followed categories
  $: forYouBlogs = (() => {
    const pool = $publicArticles.map(a => ({
      ...a,
      image: a.imageUrl,
      source: a.sourceUrl || 'BlogCurate',
      category: a.theme,
      readTime: '3 min',
    }));
    if (!followedCategories.length) return pool;
    const matched   = pool.filter(b => followedCategories.includes(b.category));
    const unmatched = pool.filter(b => !followedCategories.includes(b.category));
    return [...matched, ...unmatched];
  })();

  // Featured: articles marked as featured by the pipeline
  $: featuredBlogs = forYouBlogs.filter(b => b.featured);

  function getCtx(blog) {
    if (interestedIds.includes(blog.id))            return `In your interests · ${blog.category}`;
    if (followedCategories.includes(blog.category)) return `Because you follow ${blog.category}`;
    return null;
  }

  let dismissing = {};
  function animateReject(id) {
    dismissing = { ...dismissing, [id]: 'left' };
    setTimeout(() => { rejectBlog(id); delete dismissing[id]; dismissing = { ...dismissing }; }, 300);
  }
  function animateInterest(blog) {
    dismissing = { ...dismissing, [blog.id]: 'right' };
    setTimeout(() => { interestBlog(blog); delete dismissing[blog.id]; dismissing = { ...dismissing }; }, 300);
  }
  function openArticle(blog) {
    logRead(blog);
    selectedBlog.set(blog); articleFrom.set('home');
    currentPage.set('article'); window.scrollTo(0, 0);
  }
  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  }
</script>

<div class="home-root">

  <!-- ── CENTER FEED ── -->
  <div class="feed-col">

    <!-- Tab bar -->
    <div class="tab-row">
      <button class="tab" class:tab-active={activeTab==='foryou'}   on:click={() => activeTab='foryou'}>For you</button>
      <button class="tab" class:tab-active={activeTab==='featured'} on:click={() => activeTab='featured'}>Featured</button>
    </div>

    <!-- ── FOR YOU ── -->
    {#if activeTab === 'foryou'}

      {#if $interestedBlogs.length > 0}
        <div class="gen-bar">
          <span>✨ {$interestedBlogs.length} article{$interestedBlogs.length !== 1 ? 's' : ''} marked</span>
          <button class="gen-bar-btn" on:click={() => currentPage.set('preview')}>Generate Blog →</button>
        </div>
      {/if}

      {#each forYouBlogs as blog}
        {@const isRejected   = $rejectedIds.includes(blog.id)}
        {@const isInterested = interestedIds.includes(blog.id)}
        {@const isBookmarked = $bookmarks.includes(Number(blog.id))}
        {@const ctx          = getCtx(blog)}
        <article
          class="card"
          class:card-rejected={isRejected}
          class:card-out-right={dismissing[blog.id]==='right'}
          class:card-out-left={dismissing[blog.id]==='left'}
        >
          <div class="card-body">
            <div class="card-author">
              <div class="card-avatar">{blog.source[0]}</div>
              <span class="card-source">{blog.source}</span>
              <div class="lang-toggle">
                <button class="lang-btn" class:lang-active={!cardLang[blog.id] || cardLang[blog.id]==='EN'} on:click|stopPropagation={() => switchLang(blog, 'EN')}>EN</button>
                <button class="lang-btn" class:lang-active={cardLang[blog.id]==='FR'} on:click|stopPropagation={() => switchLang(blog, 'FR')}>{translating[blog.id] ? '…' : 'FR'}</button>
              </div>
            </div>

            {#if ctx}<p class="card-ctx">{ctx}</p>{/if}

            <h2 class="card-title" on:click={() => openArticle(blog)}>{cardLang[blog.id]==='FR' ? (translations[blog.id]?.title || blog.title) : blog.title}</h2>
            <p class="card-summary">{cardLang[blog.id]==='FR' ? (translations[blog.id]?.summary || blog.summary) : blog.summary}</p>

            <!-- Footer -->
            <div class="card-foot">
              <div class="card-foot-left">
                <span class="card-tag">{blog.category}</span>
                <span class="card-read">{blog.readTime} read</span>
              </div>
              <div class="card-foot-right">
                {#if isInterested}
                  <button class="act-chip act-interested" on:click={() => animateInterest(blog)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    Interested
                  </button>
                  <button class="act-chip act-generate" on:click={() => { selectedBlog.set(blog); currentPage.set('preview'); }}>
                    ✨ Generate
                  </button>
                {:else if !isRejected}
                  <button class="act-icon" title="Mark interested" on:click={() => animateInterest(blog)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                  </button>
                  <button class="act-icon" title="Not interested" on:click={() => animateReject(blog.id)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
                  </button>
                {/if}
                <button class="act-icon" class:act-bk={isBookmarked} title={isBookmarked ? 'Remove bookmark' : 'Bookmark'} on:click={() => toggleBookmark(blog.id)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.6"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Thumbnail — Medium: 112×112 square -->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <img class="card-thumb" src={blog.image} alt="" on:click={() => openArticle(blog)} />
        </article>
      {/each}

    <!-- ── FEATURED ── -->
    {:else}
      <div class="fy-header">
        <h2 class="fy-title">Featured</h2>
        <p class="fy-sub">Editor-selected stories — popular, trending, and high-quality picks from well-known writers and publications.</p>
      </div>
      {#each featuredBlogs as blog}
        {@const isRejected   = $rejectedIds.includes(blog.id)}
        {@const isInterested = interestedIds.includes(blog.id)}
        {@const isBookmarked = $bookmarks.includes(Number(blog.id))}
        <article class="card" class:card-rejected={isRejected}>
          <div class="card-body">
            <div class="card-author">
              <div class="card-avatar">{blog.source[0]}</div>
              <span class="card-source">{blog.source}</span>
              <div class="lang-toggle">
                <button class="lang-btn" class:lang-active={!cardLang[blog.id] || cardLang[blog.id]==='EN'} on:click|stopPropagation={() => switchLang(blog, 'EN')}>EN</button>
                <button class="lang-btn" class:lang-active={cardLang[blog.id]==='FR'} on:click|stopPropagation={() => switchLang(blog, 'FR')}>{translating[blog.id] ? '…' : 'FR'}</button>
              </div>
            </div>
            <h2 class="card-title" on:click={() => openArticle(blog)}>{cardLang[blog.id]==='FR' ? (translations[blog.id]?.title || blog.title) : blog.title}</h2>
            <p class="card-summary">{cardLang[blog.id]==='FR' ? (translations[blog.id]?.summary || blog.summary) : blog.summary}</p>
            <div class="card-foot">
              <div class="card-foot-left">
                <span class="card-tag">{blog.category}</span>
                <span class="card-read">{blog.readTime} read</span>
              </div>
              <div class="card-foot-right">
                {#if isInterested}
                  <button class="act-chip act-interested" on:click={() => animateInterest(blog)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    Interested
                  </button>
                  <button class="act-chip act-generate" on:click={() => { selectedBlog.set(blog); currentPage.set('preview'); }}>✨ Generate</button>
                {:else if !isRejected}
                  <button class="act-icon" title="Mark interested" on:click={() => animateInterest(blog)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                  </button>
                  <button class="act-icon" title="Not interested" on:click={() => animateReject(blog.id)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
                  </button>
                {/if}
                <button class="act-icon" class:act-bk={isBookmarked} on:click={() => toggleBookmark(blog.id)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.6"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                </button>
              </div>
            </div>
          </div>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <img class="card-thumb" src={blog.image} alt="" on:click={() => openArticle(blog)} />
        </article>
      {/each}
    {/if}

  </div>

  <!-- ── RIGHT SIDEBAR ── -->
  <!-- Medium sidebar: 264px, no card borders, just sections with gray headings -->
  <aside class="rsb">

    <div class="rsb-section">
      <h3 class="rsb-heading">Your Pipeline</h3>
      {#each [
        { label:'Interested',     value:$pipelineStats.interested, page:'interested' },
        { label:'Not Interested', value:$pipelineStats.rejected,   page:'rejected'   },
        { label:'Bookmarked',     value:$bookmarks.length,         page:'bookmarks'  },
        { label:'Scheduled',      value:$pipelineStats.scheduled,  page:'scheduled'  },
        { label:'Published',      value:$pipelineStats.published,  page:'published'  },
      ] as s}
        <button class="rsb-stat" on:click={() => currentPage.set(s.page)}>
          <span class="rsb-stat-label">{s.label}</span>
          <span class="rsb-stat-val">{s.value}</span>
        </button>
      {/each}
    </div>

    <div class="rsb-divider"></div>

    <div class="rsb-section">
      <h3 class="rsb-heading">Recent Activity</h3>
      {#if $activityLog.length === 0}
        <p class="rsb-empty">Your actions will appear here.</p>
      {:else}
        {#each $activityLog.slice(0,5) as item}
          <div class="rsb-row">
            <span class="rsb-row-icon">{item.icon}</span>
            <div>
              <div class="rsb-row-text">{item.text}</div>
              <div class="rsb-row-meta">{timeAgo(item.time)}</div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <div class="rsb-divider"></div>

    <div class="rsb-section">
      <div class="rsb-head-row">
        <h3 class="rsb-heading">Scheduled</h3>
        {#if $pipelineStats.scheduled > 0}
          <button class="rsb-link" on:click={() => currentPage.set('scheduled')}>See all</button>
        {/if}
      </div>
      {#if $pipelineStats.scheduled === 0}
        <p class="rsb-empty">Nothing scheduled yet.</p>
      {:else}
        {#each $scheduledPosts.filter(p=>p.status==='scheduled').slice(0,3) as post}
          <div class="rsb-row">
            <span class="rsb-dot"></span>
            <div>
              <div class="rsb-row-text">{post.title}</div>
              <div class="rsb-row-meta">{new Date(post.scheduledAt).toLocaleDateString('en-GB',{dateStyle:'short'})}</div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

  </aside>
</div>

<style>
  /* ─── Page root ─────────────────────────────────────────── */
  .home-root {
    display: flex;
    max-width: 1192px;
    margin: 0 auto;
    padding: 0 24px;
    gap: 0;
    align-items: flex-start;
    min-height: 100vh;
  }

  /* ─── Center feed column ────────────────────────────────── */
  /* Medium center col: ~680px, right sidebar: 264px, gap: ~88px */
  .feed-col {
    flex: 1;
    min-width: 0;
    max-width: 680px;
    padding-bottom: 80px;
    border-right: 1px solid rgba(0,0,0,0.09);
    padding-right: 48px;
  }

  /* ─── Tab row — Medium exact ──────────────────────────── */
  /* Thin bottom border, tabs are just text with a 1px black indicator */
  .tab-row {
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.09);
    padding-top: 20px;
    gap: 0;
    margin-bottom: 0;
  }
  .tab {
    background: none; border: none; cursor: pointer;
    font-size: 14px; font-weight: 400;
    color: rgba(0,0,0,0.55);
    font-family: var(--sans);
    padding: 0 0 12px;
    margin-right: 32px;
    border-bottom: 1px solid transparent;
    position: relative; top: 1px;
    transition: color 0.12s;
    white-space: nowrap;
  }
  .dark .tab { color: rgba(255,255,255,0.45); }
  .tab:hover { color: var(--text-black); }
  .dark .tab:hover { color: var(--text-black); }
  .tab.tab-active {
    color: var(--text-black);
    border-bottom-color: var(--text-black);
  }

  /* Generate bar */
  .gen-bar {
    display: flex; align-items: center; justify-content: space-between;
    background: var(--off-white); border: 1px solid var(--divider);
    border-radius: 4px; padding: 10px 16px; margin-top: 20px;
    font-size: 13px; color: var(--text-muted);
  }
  .gen-bar-btn {
    background: var(--text-black); color: var(--white); border: none;
    font-size: 13px; font-weight: 500; font-family: var(--sans);
    padding: 6px 16px; border-radius: 99px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .gen-bar-btn:hover { opacity: 0.82; }

  /* ─── Feed card — Medium exact ──────────────────────────── */
  /* 28px top/bottom padding, thumbnail 112×112 */
  .card {
    display: flex; align-items: flex-start;
    gap: 24px;
    padding: 28px 0;
    border-bottom: 1px solid rgba(0,0,0,0.09);
    transition: opacity 0.18s, transform 0.28s ease, background 0.15s;
    border-radius: 8px;
    margin: 0 -16px;
    padding-left: 16px; padding-right: 16px;
  }
  .card:hover { background: var(--off-white); }
  .card.card-rejected { opacity: 0.38; }
  .card.card-out-right { transform: translateX(40px); opacity: 0; pointer-events: none; }
  .card.card-out-left  { transform: translateX(-40px); opacity: 0; pointer-events: none; }

  .card-body { flex: 1; min-width: 0; }

  /* Author row */
  .card-author {
    display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
  }
  .card-avatar {
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--text-black); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; flex-shrink: 0;
  }
  .card-source { font-size: 13px; font-weight: 400; color: var(--text-black); }
  .card-lang {
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    background: #eef2ff; border: 1px solid #c7d2fe;
    color: #4338ca; padding: 1px 5px; border-radius: 3px;
  }

  .card-ctx {
    font-size: 12px; color: var(--text-muted); margin-bottom: 6px;
  }

  /* Title — Medium: 20px sohne/sans 700. We use serif for our brand */
  .card-title {
    font-family: var(--serif);
    font-size: 20px; font-weight: 700;
    color: var(--text-black); line-height: 1.28;
    letter-spacing: -0.3px; margin-bottom: 6px;
    cursor: pointer;
  }
  .card-title:hover { color: rgba(0,0,0,0.75); }
  .dark .card-title:hover { color: rgba(255,255,255,0.75); }

  /* Summary — Medium: 16px, line-height 1.5, 2-line clamp */
  .card-summary {
    font-size: 16px; color: var(--text-muted);
    line-height: 1.5; margin-bottom: 16px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Footer row */
  .card-foot {
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-foot-left { display: flex; align-items: center; gap: 10px; }
  .card-foot-right { display: flex; align-items: center; gap: 2px; }

  .card-tag {
    font-size: 12px; font-weight: 500;
    background: var(--off-white); color: var(--text-muted);
    padding: 3px 10px; border-radius: 99px;
  }
  .card-read { font-size: 13px; color: var(--text-muted); }

  /* Action chips */
  .act-chip {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; font-weight: 500; font-family: var(--sans);
    padding: 4px 12px; border-radius: 99px; cursor: pointer;
    border: 1px solid var(--divider); background: var(--white);
    color: var(--text-muted); transition: all 0.12s; white-space: nowrap;
  }
  .act-chip:hover { border-color: var(--text-black); color: var(--text-black); }
  .act-chip.act-interested {
    background: rgba(26,137,23,.07); border-color: var(--green,#1a8917);
    color: var(--green,#1a8917);
  }
  .act-chip.act-generate {
    background: var(--text-black); color: var(--white);
    border-color: var(--text-black);
  }
  .act-chip.act-generate:hover { opacity: 0.82; }

  /* Icon action buttons — Medium uses 28px circle */
  .act-icon {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 50%;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    transition: background 0.12s, color 0.12s;
  }
  .act-icon:hover { background: rgba(0,0,0,0.06); color: var(--text-black); }
  .dark .act-icon:hover { background: rgba(255,255,255,0.08); }
  .act-icon.act-bk { color: var(--text-black); }

  /* Thumbnail — Medium: 112×112 */
  .card-thumb {
    width: 112px; height: 112px; object-fit: cover;
    flex-shrink: 0; cursor: pointer;
  }

  /* Language toggle */
  .lang-toggle {
    display: inline-flex; border: 1px solid var(--divider); border-radius: 4px;
    overflow: hidden; margin-left: 6px;
  }
  .lang-btn {
    background: none; border: none; cursor: pointer;
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
    padding: 2px 7px; color: var(--text-muted); font-family: var(--sans);
    transition: background 0.12s, color 0.12s;
  }
  .lang-btn.lang-active { background: var(--text-black); color: #fff; }

  /* For You / Featured header */
  .fy-header { padding: 28px 0 12px; border-bottom: 1px solid rgba(0,0,0,0.09); margin-bottom: 4px; }
  .fy-header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .fy-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); letter-spacing: -0.2px; margin-bottom: 4px; }
  .fy-sub { font-size: 13px; color: var(--text-muted); max-width: 480px; line-height: 1.5; }
  .fy-badge-head {
    font-size: 11px; font-weight: 600; white-space: nowrap;
    color: #6a1b9a; background: #f3e5f5; border: 1px solid #e1bee7;
    padding: 3px 10px; border-radius: 3px; flex-shrink: 0; margin-top: 4px;
  }
  .fy-badge {
    font-size: 10px; font-weight: 600; color: var(--green,#1a8917);
    background: rgba(26,137,23,.08); border: 1px solid rgba(26,137,23,.2);
    padding: 1px 7px; border-radius: 3px;
  }
  .feat-pill {
    font-size: 10px; font-weight: 600; color: #6a1b9a;
    background: #f3e5f5; border: 1px solid #e1bee7;
    padding: 1px 7px; border-radius: 3px; margin-left: auto; white-space: nowrap;
  }

  /* ─── Right sidebar — Medium: 264px, no card borders ────── */
  .rsb {
    width: 264px;
    flex-shrink: 0;
    position: sticky; top: 77px;   /* 57px topbar + 20px breathing */
    padding: 20px 0 80px 56px;
    max-height: calc(100vh - 57px);
    overflow-y: auto;
  }
  .rsb::-webkit-scrollbar { width: 0; }

  .rsb-section { padding: 0 0 4px; }

  /* Medium sidebar headings: 13px uppercase tracked */
  .rsb-heading {
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--text-black);
    margin-bottom: 12px;
    font-family: var(--sans);
  }

  .rsb-divider {
    border-top: 1px solid rgba(0,0,0,0.09);
    margin: 20px 0;
  }

  .rsb-head-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 12px;
  }
  .rsb-head-row .rsb-heading { margin-bottom: 0; }

  .rsb-link {
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--green,#1a8917); font-family: var(--sans);
    padding: 0;
  }
  .rsb-link:hover { text-decoration: underline; }

  .rsb-stat {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 0;
    border-top: 1px solid rgba(0,0,0,0.06);
    background: none; border-left: none; border-right: none; border-bottom: none;
    cursor: pointer; width: 100%; font-family: var(--sans);
  }
  .rsb-stat:first-of-type { border-top: none; }
  .rsb-stat:hover .rsb-stat-label { color: var(--text-black); }
  .rsb-stat-label { font-size: 14px; color: var(--text-muted); }
  .rsb-stat-val   { font-size: 16px; font-weight: 700; color: var(--text-black); font-family: var(--serif); }

  .rsb-empty { font-size: 13px; color: var(--text-hint); padding: 4px 0; }

  .rsb-row {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 9px 0; border-top: 1px solid rgba(0,0,0,0.06);
  }
  .rsb-row:first-of-type { border-top: none; }
  .rsb-row-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .rsb-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--amber,#d97706); flex-shrink: 0; margin-top: 5px;
  }
  .rsb-row-text {
    font-size: 13px; color: var(--text-black); line-height: 1.4;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;
  }
  .rsb-row-meta { font-size: 12px; color: var(--text-muted); }

  /* ─── Responsive ─────────────────────────────────────────── */
  @media (max-width: 1080px) {
    .rsb { display: none; }
    .feed-col { border-right: none; padding-right: 0; max-width: 100%; }
  }
  @media (max-width: 728px) {
    .home-root { padding: 0 16px; }
    .card { flex-direction: column-reverse; gap: 12px; }
    .card-thumb { width: 100%; height: 200px; }
  }
</style>
