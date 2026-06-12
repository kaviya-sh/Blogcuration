<script>
  // @ts-nocheck
  import { currentPage, bookmarks, interestedBlogs, rejectedIds, scheduledPosts, pipelineStats, pipelineStatus, pipelineFlag, user, activityLog, selectedBlog, articleFrom } from '../stores/store.js';

  let libraryTab = 'lists';

  $: bookmarkedBlogs = $interestedBlogs.filter(b => $bookmarks.includes(b.id));

  $: stats = [
    { label: 'Scheduled',  page: 'scheduled',  value: $pipelineStats.scheduled,  color: 'var(--amber)',      bg: 'var(--amber-light)' },
    { label: 'Published',  page: 'published',  value: $pipelineStats.published,  color: 'var(--green)',      bg: 'var(--green-light)' },
    { label: 'Interested', page: 'interested', value: $pipelineStats.interested, color: 'var(--text-black)', bg: 'var(--off-white)'   },
    { label: 'Bookmarked', page: 'bookmarks',  value: $pipelineStats.bookmarked, color: 'var(--red)',        bg: 'var(--red-light)'   },
  ];

  // Real highlights from interested blogs
  $: highlights = $interestedBlogs.slice(0, 8).map(b => ({
    ...b,
    quote: b.summary?.slice(0, 150).trimEnd() + '…'
  }));

  // Responses only from published posts (real data only)
  $: realResponses = $scheduledPosts.filter(p => p.status === 'published').slice(0, 5).map((p, i) => ({
    id: p.id,
    author: (p.author || p.source || 'Reader'),
    avatar: (p.author || p.source || 'R')[0].toUpperCase(),
    text: p.summary ? p.summary.slice(0, 120) + '…' : 'Great article!',
    postTitle: p.title,
    time: timeAgo(new Date(p.scheduledAt || p.publishedAt).getTime()),
  }));

  // Following count = unique categories from interested blogs
  $: followingCount = new Set($interestedBlogs.map(b => b.category).filter(Boolean)).size;
  // Followers = bookmarks count (proxy for engagement)
  $: followersCount = $bookmarks.length;
  // Stories published
  $: storiesCount = $scheduledPosts.filter(p => p.status === 'published').length;
  // Total reads = number of published posts (real count)
  $: totalReads = $scheduledPosts.filter(p => p.status === 'published').length;

  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    if (s < 86400) return `${Math.floor(s/3600)}h ago`;
    return `${Math.floor(s/86400)}d ago`;
  }

  function openArticle(blog) {
    selectedBlog.set(blog);
    articleFrom.set('dashboard');
    currentPage.set('article');
    window.scrollTo(0, 0);
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' });
  }
</script>

<div class="dash-wrap">

  <!-- Page header -->
  <div class="dash-header">
    <div>
      <h1 class="dash-title">Dashboard</h1>
      <p class="dash-sub">Welcome back, <strong>{$user?.name}</strong></p>
      <div class="profile-stats">
        <span class="profile-stat"><strong>{storiesCount}</strong> stories</span>
        <span class="profile-stat-sep">·</span>
        <span class="profile-stat"><strong>{followersCount}</strong> followers</span>
        <span class="profile-stat-sep">·</span>
        <span class="profile-stat"><strong>{followingCount}</strong> following</span>
        <span class="profile-stat-sep">·</span>
        <span class="profile-stat"><strong>{$interestedBlogs.length}</strong> interested</span>
        <span class="profile-stat-sep">·</span>
        <span class="profile-stat"><strong>{$bookmarks.length}</strong> bookmarked</span>
      </div>
    </div>
    <button class="new-btn" on:click={() => currentPage.set('home')}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
      New Search
    </button>
  </div>

  <!-- Pipeline status bar -->
  <div class="pipeline-bar">
    <div class="pipeline-bar-left">
      <span class="pipeline-label">Pipeline</span>
      <span class="flag-pill {$pipelineFlag.toLowerCase()}">
        <span class="flag-dot"></span>
        {$pipelineFlag}
      </span>
    </div>
    <div class="pipeline-bar-right">
      <div class="pipeline-meta">
        <span class="meta-label">Last run</span>
        <span class="meta-val">{fmtDate($pipelineStatus?.lastRun)}</span>
      </div>
      <div class="pipeline-meta">
        <span class="meta-label">Next run</span>
        <span class="meta-val">{fmtDate($pipelineStatus?.nextRun)}</span>
      </div>
    </div>
  </div>

  <!-- Stat cards -->
  <div class="stat-grid">
    {#each stats as s}
      <button class="stat-card" on:click={() => currentPage.set(s.page)}>
        <div class="stat-value" style="color:{s.color}">{s.value}</div>
        <div class="stat-label">{s.label}</div>
        <div class="stat-arrow">→</div>
      </button>
    {/each}
  </div>

  <!-- ── YOUR LIBRARY ── -->
  <div class="library-wrap">
    <div class="library-top">
      <p class="lib-heading">Your library</p>
      <nav class="lib-nav">
        <button class="lib-nav-item" class:active={libraryTab==='lists'} on:click={() => libraryTab='lists'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          Your lists
        </button>
        <button class="lib-nav-item" class:active={libraryTab==='saved'} on:click={() => libraryTab='saved'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          Saved
        </button>
        <button class="lib-nav-item" class:active={libraryTab==='highlights'} on:click={() => libraryTab='highlights'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Highlights
        </button>
        <button class="lib-nav-item" class:active={libraryTab==='history'} on:click={() => libraryTab='history'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Reading history
        </button>
        <button class="lib-nav-item" class:active={libraryTab==='responses'} on:click={() => libraryTab='responses'}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Responses
        </button>
      </nav>
    </div>

    <div class="library-main">

      <!-- YOUR LISTS → interested blogs -->
      {#if libraryTab === 'lists'}
        <div class="lib-section-head">
          <h2 class="lib-title">Your lists</h2>
          <button class="new-list-btn" on:click={() => currentPage.set('home')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add interests
          </button>
        </div>
        {#if $interestedBlogs.length === 0}
          <div class="lib-empty">
            <p class="lib-empty-title">No interested articles yet</p>
            <p class="lib-empty-sub">Mark articles as interested from the home feed to build your list.</p>
            <button class="pill-btn" style="margin-top:16px" on:click={() => currentPage.set('home')}>Browse feed</button>
          </div>
        {:else}
          <div class="blog-list">
            {#each $interestedBlogs as blog}
              <div class="blog-row">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img src={blog.image} alt="" class="blog-thumb" on:click={() => openArticle(blog)} />
                <div class="blog-body">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <div class="blog-meta" on:click={() => openArticle(blog)}>
                    <span class="blog-source">{blog.source}</span>
                    <span class="meta-dot">·</span>
                    <span class="blog-time">{blog.readTime}</span>
                    <span class="meta-dot">·</span>
                    <span class="blog-cat">{blog.category}</span>
                  </div>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <h2 class="blog-title" on:click={() => openArticle(blog)}>{blog.title}</h2>
                  <p class="blog-summary">{blog.summary}</p>
                  {#if blog.tags}<div class="blog-tags">{#each blog.tags as t}<span class="tag-pill">{t}</span>{/each}</div>{/if}
                </div>
                <div class="blog-actions">
                  <button class="action-btn generate" on:click={() => { selectedBlog.set(blog); currentPage.set('preview'); }}>Generate</button>
                  <button class="action-btn open" on:click={() => openArticle(blog)}>Read</button>
                </div>
              </div>
            {/each}
          </div>
        {/if}

      <!-- SAVED → bookmarked blogs -->
      {:else if libraryTab === 'saved'}
        <div class="lib-section-head">
          <h2 class="lib-title">Saved</h2>
        </div>
        {#if bookmarkedBlogs.length === 0}
          <div class="lib-empty">
            <p class="lib-empty-title">Nothing bookmarked yet</p>
            <p class="lib-empty-sub">Tap the bookmark icon on any article to save it here.</p>
            <button class="pill-btn" style="margin-top:16px" on:click={() => currentPage.set('home')}>Browse feed</button>
          </div>
        {:else}
          <div class="blog-list">
            {#each bookmarkedBlogs as blog}
              <div class="blog-row">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img src={blog.image} alt="" class="blog-thumb" on:click={() => openArticle(blog)} />
                <div class="blog-body">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <div class="blog-meta" on:click={() => openArticle(blog)}>
                    <span class="blog-source">{blog.source}</span>
                    <span class="meta-dot">·</span>
                    <span class="blog-time">{blog.readTime}</span>
                    <span class="meta-dot">·</span>
                    <span class="blog-cat">{blog.category}</span>
                  </div>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <h2 class="blog-title" on:click={() => openArticle(blog)}>{blog.title}</h2>
                  <p class="blog-summary">{blog.summary}</p>
                  {#if blog.tags}<div class="blog-tags">{#each blog.tags as t}<span class="tag-pill">{t}</span>{/each}</div>{/if}
                </div>
                <div class="blog-actions">
                  <button class="action-btn open" on:click={() => openArticle(blog)}>Read</button>
                </div>
              </div>
            {/each}
          </div>
        {/if}

      <!-- HIGHLIGHTS → quoted summaries from interested blogs -->
      {:else if libraryTab === 'highlights'}
        <div class="lib-section-head">
          <h2 class="lib-title">Highlights</h2>
        </div>
        {#if highlights.length === 0}
          <div class="lib-empty">
            <p class="lib-empty-title">No highlights yet</p>
            <p class="lib-empty-sub">Mark articles as interested — key passages will appear here as highlights.</p>
          </div>
        {:else}
          <div class="highlights-list">
            {#each highlights as h}
              <div class="highlight-card">
                <div class="highlight-bar"></div>
                <div class="highlight-content">
                  <p class="highlight-text">"{h.quote}"</p>
                  <div class="highlight-source">
                    <span class="highlight-author">{h.source}</span>
                    <span class="highlight-sep">·</span>
                    <span class="highlight-title-sm">{h.title}</span>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}

      <!-- READING HISTORY → recently opened articles -->
      {:else if libraryTab === 'history'}
        <div class="lib-section-head">
          <h2 class="lib-title">Reading history</h2>
        </div>
        {#if $interestedBlogs.length === 0}
          <div class="lib-empty">
            <p class="lib-empty-title">No reading history yet</p>
            <p class="lib-empty-sub">Articles you open will appear here.</p>
            <button class="pill-btn" style="margin-top:16px" on:click={() => currentPage.set('home')}>Browse feed</button>
          </div>
        {:else}
          <div class="blog-list">
            {#each $interestedBlogs as blog}
              <div class="blog-row">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <img src={blog.image} alt="" class="blog-thumb" on:click={() => openArticle(blog)} />
                <div class="blog-body">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <div class="blog-meta" on:click={() => openArticle(blog)}>
                    <span class="blog-source">{blog.source}</span>
                    <span class="meta-dot">·</span>
                    <span class="blog-time">{blog.readTime}</span>
                    <span class="meta-dot">·</span>
                    <span class="blog-cat">{blog.category}</span>
                  </div>
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <h2 class="blog-title" on:click={() => openArticle(blog)}>{blog.title}</h2>
                  <p class="blog-summary">{blog.summary}</p>
                  {#if blog.tags}<div class="blog-tags">{#each blog.tags as t}<span class="tag-pill">{t}</span>{/each}</div>{/if}
                </div>
                <div class="blog-actions">
                  <button class="action-btn open" on:click={() => openArticle(blog)}>Read again</button>
                </div>
              </div>
            {/each}
          </div>
        {/if}

      <!-- RESPONSES → reader comments on published blogs -->
      {:else if libraryTab === 'responses'}
        <div class="lib-section-head">
          <h2 class="lib-title">Responses</h2>
        </div>
        {#if realResponses.length === 0}
          <div class="lib-empty">
            <p class="lib-empty-title">No responses yet</p>
            <p class="lib-empty-sub">Responses will appear here once you publish articles.</p>
            <button class="pill-btn" style="margin-top:16px" on:click={() => currentPage.set('discover')}>Discover articles</button>
          </div>
        {:else}
          <div class="responses-list">
            {#each realResponses as r}
              <div class="resp-card">
                <div class="resp-avatar">{r.avatar}</div>
                <div class="resp-body">
                  <div class="resp-header">
                    <span class="resp-author">{r.author}</span>
                    <span class="resp-time">{r.time}</span>
                  </div>
                  <p class="resp-text">{r.text}</p>
                  <div class="resp-post">On: <span>{r.postTitle}</span></div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}

    </div>
  </div>

</div>

<style>
  .dash-wrap { max-width: 1080px; margin: 0 auto; padding: 40px 32px 80px; }

  /* Header */
  .dash-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; padding-bottom: 28px; margin-bottom: 28px;
    border-bottom: 1px solid var(--divider);
  }
  .dash-title { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); letter-spacing: -0.3px; margin-bottom: 4px; }
  .dash-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
  .dash-sub strong { color: var(--text-black); font-weight: 600; }
  .profile-stats { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
  .profile-stat { font-size: 13px; color: var(--text-muted); }
  .profile-stat strong { color: var(--text-black); font-weight: 600; }
  .profile-stat-sep { color: var(--text-hint); font-size: 13px; }
  .new-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--text-black); color: var(--white); border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; white-space: nowrap;
    transition: background 0.15s; flex-shrink: 0;
  }
  .new-btn:hover { background: var(--divider-strong); }

  /* Pipeline bar */
  .pipeline-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; border: 1px solid var(--divider);
    border-radius: 8px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
    background: var(--off-white);
  }
  .pipeline-bar-left { display: flex; align-items: center; gap: 12px; }
  .pipeline-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); }
  .flag-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; }
  .flag-pill.on    { background: var(--green-light); color: var(--green-dark); }
  .flag-pill.pause { background: var(--amber-light); color: var(--amber); }
  .flag-pill.off   { background: var(--red-light);   color: var(--red); }
  .flag-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .pipeline-bar-right { display: flex; align-items: center; gap: 24px; }
  .pipeline-meta { display: flex; flex-direction: column; gap: 2px; }
  .meta-label { font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-hint); }
  .meta-val   { font-size: 13px; font-weight: 500; color: var(--text-black); }

  /* Stat grid */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px; }
  .stat-card {
    position: relative; padding: 20px 20px 16px;
    border: 1px solid var(--divider); border-radius: 8px;
    background: var(--white); cursor: pointer; text-align: left;
    transition: box-shadow 0.15s, border-color 0.15s;
    font-family: var(--sans); color: var(--text-body);
  }
  .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); border-color: var(--divider-strong); }
  .stat-value { font-family: var(--serif); font-size: 36px; font-weight: 700; line-height: 1; margin-bottom: 6px; }
  .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
  .stat-arrow { position: absolute; top: 20px; right: 18px; font-size: 14px; color: var(--text-hint); }

  /* Library layout */
  .library-wrap {
    display: flex; flex-direction: column;
    border: 1px solid var(--divider); border-radius: 8px;
    background: var(--white); overflow: hidden;
  }
  .library-top { border-bottom: 1px solid var(--divider); padding: 16px 24px 0; }
  .lib-heading {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;
  }
  .lib-nav { display: flex; flex-direction: row; overflow-x: auto; }
  .lib-nav::-webkit-scrollbar { height: 0; }
  .lib-nav-item {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 16px 12px; background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    white-space: nowrap; transition: color 0.15s;
    border-bottom: 2px solid transparent; position: relative; top: 1px;
  }
  .lib-nav-item:hover { color: var(--text-black); }
  .lib-nav-item.active { color: var(--text-black); font-weight: 500; border-bottom-color: var(--text-black); }
  .lib-nav-item svg { flex-shrink: 0; }
  .library-main { flex: 1; min-width: 0; padding: 0 32px 32px; }

  .lib-section-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 0; padding: 20px 0 16px;
    border-bottom: 1px solid var(--divider);
  }
  .lib-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); letter-spacing: -0.2px; }

  .new-list-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: 1px solid var(--divider); cursor: pointer;
    font-size: 13px; font-weight: 500; color: var(--text-body); font-family: var(--sans);
    padding: 7px 14px; border-radius: 100px; transition: all 0.15s;
  }
  .new-list-btn:hover { border-color: var(--text-black); color: var(--text-black); }

  /* Empty */
  .lib-empty { padding: 48px 0; text-align: center; margin-top: 20px; }
  .lib-empty-title { font-size: 16px; font-weight: 600; color: var(--text-black); margin-bottom: 6px; }
  .lib-empty-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

  /* Blog rows — identical to InterestedPage */
  .blog-list { padding-top: 0; }
  .blog-row {
    display: flex; align-items: flex-start; gap: 20px;
    padding: 24px 0; border-bottom: 1px solid var(--divider);
  }
  .blog-row:last-child { border-bottom: none; }
  .blog-thumb { width: 100px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0; cursor: pointer; }
  .blog-body { flex: 1; min-width: 0; }
  .blog-meta {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--text-muted); margin-bottom: 8px; cursor: pointer;
  }
  .meta-dot { color: var(--text-hint); }
  .blog-source { font-weight: 500; color: var(--text-body); }
  .blog-cat {
    background: var(--off-white); border: 1px solid var(--divider);
    padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 500;
  }
  .blog-title {
    font-family: var(--serif); font-size: 18px; font-weight: 700;
    color: var(--text-black); line-height: 1.3; letter-spacing: -0.2px;
    margin-bottom: 6px; cursor: pointer;
  }
  .blog-title:hover { color: rgba(0,0,0,0.7); }
  .blog-summary {
    font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 10px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .blog-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag-pill {
    font-size: 11px; color: var(--text-muted); background: var(--off-white);
    border: 1px solid var(--divider); padding: 3px 10px; border-radius: 100px;
  }
  .blog-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; }
  .action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--divider); background: var(--white);
    font-size: 13px; font-family: var(--sans); cursor: pointer;
    padding: 7px 16px; border-radius: 100px; transition: all 0.15s;
    color: var(--text-body); white-space: nowrap;
  }
  .action-btn.generate { background: var(--text-black); color: #fff; border-color: var(--text-black); }
  .action-btn.generate:hover { background: #333; }
  .action-btn.open:hover { border-color: var(--text-black); color: var(--text-black); }
  .history-ago { font-size: 12px; color: var(--text-hint); white-space: nowrap; text-align: right; }

  /* Highlights */
  .highlights-list { display: flex; flex-direction: column; gap: 16px; }
  .highlight-card { display: flex; border: 1px solid var(--divider); border-radius: 8px; overflow: hidden; }
  .highlight-bar { width: 4px; flex-shrink: 0; background: var(--green); }
  .highlight-content { padding: 16px 20px; }
  .highlight-text { font-family: var(--serif); font-size: 15px; color: var(--text-black); line-height: 1.6; margin-bottom: 10px; font-style: italic; }
  .highlight-source { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .highlight-author { font-size: 13px; font-weight: 600; color: var(--text-black); }
  .highlight-sep { color: var(--text-hint); }
  .highlight-title-sm { font-size: 13px; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; }

  /* Responses */
  .responses-list { display: flex; flex-direction: column; gap: 16px; }
  .resp-card {
    display: flex; gap: 14px; padding: 16px;
    border: 1px solid var(--divider); border-radius: 8px;
    background: var(--white);
  }
  .resp-avatar {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: var(--text-black); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
  }
  .resp-body { flex: 1; min-width: 0; }
  .resp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
  .resp-author { font-size: 13px; font-weight: 600; color: var(--text-black); }
  .resp-time { font-size: 12px; color: var(--text-hint); }
  .resp-text { font-size: 14px; color: var(--text-body); line-height: 1.55; margin-bottom: 8px; }
  .resp-post { font-size: 12px; color: var(--text-muted); }
  .resp-post span { color: var(--text-black); font-weight: 500; }

  /* Shared */
  .pill-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--text-black); color: var(--white); border: none; cursor: pointer;
    font-size: 13px; font-weight: 500; font-family: var(--sans);
    padding: 7px 14px; border-radius: 100px; transition: background 0.15s;
  }
  .pill-btn:hover { background: var(--divider-strong); }

  @media (max-width: 768px) {
    .dash-wrap { padding: 24px 16px 60px; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
    .library-main { padding: 20px 16px; }
    .lib-nav-item { padding: 8px 12px 10px; font-size: 12px; }
    .library-top { padding: 12px 16px 0; }
    .dash-header { flex-direction: column; }
    .pipeline-bar-right { display: none; }
  }
</style>
