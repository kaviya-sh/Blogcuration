<script>
  // @ts-nocheck
  import { currentPage, scheduledPosts, interestedBlogs, selectedBlog, articleFrom } from '../stores/store.js';

  let activeTab = 'drafts';

  $: drafts    = $interestedBlogs;
  $: scheduled = $scheduledPosts.filter(p => p.status === 'scheduled');
  $: published = $scheduledPosts.filter(p => p.status === 'published');
  $: unlisted  = $scheduledPosts.filter(p => p.status === 'unlisted');

  const submissions = [
    { id: 1, title: 'AI Trends 2025 Submission',  publication: 'Towards AI',  status: 'Under Review', submitted: '2 days ago' },
    { id: 2, title: 'The Future of RAG Systems',  publication: 'The Gradient', status: 'Accepted',     submitted: '1 week ago' },
    { id: 3, title: 'Open Source LLMs Deep Dive', publication: 'AI Weekly',   status: 'Rejected',     submitted: '2 weeks ago' },
  ];

  const tabs = [
    { id: 'drafts',      label: 'Drafts'      },
    { id: 'scheduled',   label: 'Scheduled'   },
    { id: 'published',   label: 'Published'   },
    { id: 'unlisted',    label: 'Unlisted'    },
    { id: 'submissions', label: 'Submissions' },
  ];

  function openArticle(blog) {
    selectedBlog.set(blog);
    articleFrom.set('stories');
    currentPage.set('article');
    window.scrollTo(0, 0);
  }

  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'medium' });
  }
</script>

<div class="stories-wrap">

  <div class="stories-header">
    <div>
      <h1 class="stories-title">Your Stories</h1>
      <p class="stories-sub">Manage your drafts, scheduled, and published content.</p>
    </div>
    <button class="write-btn" on:click={() => currentPage.set('home')}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
      Write a story
    </button>
  </div>

  <div class="tab-row">
    {#each tabs as t}
      <button class="tab" class:tab-active={activeTab === t.id} on:click={() => activeTab = t.id}>
        {t.label}
        {#if t.id === 'drafts' && drafts.length > 0}
          <span class="tab-count">{drafts.length}</span>
        {:else if t.id === 'scheduled' && scheduled.length > 0}
          <span class="tab-count">{scheduled.length}</span>
        {:else if t.id === 'published' && published.length > 0}
          <span class="tab-count">{published.length}</span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="tab-body">

    <!-- DRAFTS — real interestedBlogs -->
    {#if activeTab === 'drafts'}
      {#if drafts.length === 0}
        <div class="empty">
          <p class="empty-title">No drafts yet</p>
          <p class="empty-sub">Articles you mark as interested become your drafts ready to generate.</p>
          <button class="pill-btn" on:click={() => currentPage.set('home')}>Browse feed</button>
        </div>
      {:else}
        <div class="story-list">
          {#each drafts as s}
            <div class="story-row">
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <img src={s.image} alt="" class="story-thumb" on:click={() => openArticle(s)} />
              <div class="story-body">
                <div class="story-meta">
                  <span class="story-source">{s.source}</span>
                  <span class="mdot">·</span>
                  <span>{s.readTime}</span>
                  <span class="mdot">·</span>
                  <span class="tag-pill">{s.category}</span>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <h3 class="story-title" on:click={() => openArticle(s)}>{s.title}</h3>
                <p class="story-summary">{s.summary}</p>
                {#if s.tags}<div class="tag-row">{#each s.tags as t}<span class="tag-pill">{t}</span>{/each}</div>{/if}
              </div>
              <div class="story-actions">
                <button class="action-btn primary" on:click={() => { selectedBlog.set(s); currentPage.set('preview'); }}>Generate</button>
                <span class="status-pill draft">Draft</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}

    <!-- SCHEDULED — real scheduledPosts -->
    {:else if activeTab === 'scheduled'}
      {#if scheduled.length === 0}
        <div class="empty">
          <p class="empty-title">Nothing scheduled</p>
          <p class="empty-sub">Generate a blog and schedule it — it will appear here.</p>
          <button class="pill-btn" on:click={() => currentPage.set('interested')}>Go to Interested</button>
        </div>
      {:else}
        <div class="story-list">
          {#each scheduled as s}
            <div class="story-row">
              {#if s.image}<img src={s.image} alt="" class="story-thumb" />{/if}
              <div class="story-body">
                <div class="story-meta">
                  {#if s.category}<span class="tag-pill">{s.category}</span>{/if}
                </div>
                <h3 class="story-title">{s.title}</h3>
                <p class="story-date">Scheduled for {fmtDate(s.scheduledAt)}</p>
              </div>
              <div class="story-actions">
                <button class="action-btn" on:click={() => currentPage.set('scheduled')}>View</button>
                <span class="status-pill scheduled">Scheduled</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}

    <!-- PUBLISHED — real scheduledPosts filtered -->
    {:else if activeTab === 'published'}
      {#if published.length === 0}
        <div class="empty">
          <p class="empty-title">Nothing published yet</p>
          <p class="empty-sub">Your published posts will appear here.</p>
        </div>
      {:else}
        <div class="story-list">
          {#each published as s}
            <div class="story-row">
              {#if s.image}<img src={s.image} alt="" class="story-thumb" />{/if}
              <div class="story-body">
                <div class="story-meta">
                  {#if s.category}<span class="tag-pill">{s.category}</span>{/if}
                </div>
                <h3 class="story-title">{s.title}</h3>
                <p class="story-date">Published {fmtDate(s.publishedAt || s.scheduledAt)}</p>
              </div>
              <div class="story-actions">
                <button class="action-btn" on:click={() => currentPage.set('published')}>View</button>
                <span class="status-pill published">Published</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}

    <!-- UNLISTED -->
    {:else if activeTab === 'unlisted'}
      <div class="empty">
        <p class="empty-title">No unlisted stories</p>
        <p class="empty-sub">Stories set to unlisted are visible only via direct link.</p>
      </div>

    <!-- SUBMISSIONS -->
    {:else if activeTab === 'submissions'}
      <div class="story-list">
        {#each submissions as s}
          <div class="story-row">
            <div class="story-body">
              <div class="story-meta">
                Submitted to <strong>{s.publication}</strong>
                <span class="mdot">·</span>
                {s.submitted}
              </div>
              <h3 class="story-title">{s.title}</h3>
            </div>
            <div class="story-actions">
              <span class="status-pill {s.status === 'Accepted' ? 'published' : s.status === 'Rejected' ? 'rejected' : 'scheduled'}">{s.status}</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}

  </div>
</div>

<style>
  .stories-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

  .stories-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; padding: 32px 0 0;
  }
  .stories-title { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); letter-spacing: -0.3px; margin-bottom: 4px; }
  .stories-sub { font-size: 14px; color: var(--text-muted); }

  .write-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--text-black); color: #fff; border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; white-space: nowrap;
    transition: background 0.15s; flex-shrink: 0;
  }
  .write-btn:hover { background: #333; }

  .tab-row {
    display: flex; align-items: center;
    border-bottom: 1px solid var(--divider);
    margin-top: 24px; overflow-x: auto;
  }
  .tab-row::-webkit-scrollbar { height: 0; }
  .tab {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 14px; font-weight: 400; color: var(--text-muted);
    font-family: var(--sans); padding: 0 0 12px;
    margin-right: 28px; white-space: nowrap;
    border-bottom: 2px solid transparent;
    position: relative; top: 1px; transition: color 0.12s;
  }
  .tab:hover { color: var(--text-black); }
  .tab.tab-active { color: var(--text-black); font-weight: 500; border-bottom-color: var(--text-black); }
  .tab-count {
    font-size: 11px; font-weight: 600;
    background: var(--off-white); border: 1px solid var(--divider);
    color: var(--text-muted); padding: 1px 6px; border-radius: 99px;
  }
  .tab.tab-active .tab-count { background: var(--text-black); color: #fff; border-color: var(--text-black); }

  .tab-body { padding-top: 4px; }

  .empty { padding: 64px 0; text-align: center; }
  .empty-title { font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--text-black); margin-bottom: 8px; }
  .empty-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }

  /* Story rows — InterestedPage exact */
  .story-list { padding-top: 4px; }
  .story-row {
    display: flex; align-items: flex-start; gap: 20px;
    padding: 24px 0; border-bottom: 1px solid var(--divider);
  }
  .story-row:last-child { border-bottom: none; }
  .story-thumb { width: 100px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0; cursor: pointer; }
  .story-body { flex: 1; min-width: 0; }
  .story-meta {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--text-muted); margin-bottom: 8px; flex-wrap: wrap;
  }
  .story-source { font-weight: 500; color: var(--text-body); }
  .mdot { color: var(--text-hint); }
  .story-title {
    font-family: var(--serif); font-size: 18px; font-weight: 700;
    color: var(--text-black); line-height: 1.3; letter-spacing: -0.2px;
    margin-bottom: 6px; cursor: pointer;
  }
  .story-title:hover { color: rgba(0,0,0,0.7); }
  .story-summary {
    font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 10px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .story-date { font-size: 12px; color: var(--text-hint); margin-top: 4px; }
  .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag-pill {
    background: var(--off-white); border: 1px solid var(--divider);
    padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 500;
    color: var(--text-muted);
  }

  .story-actions { display: flex; flex-direction: column; gap: 8px; flex-shrink: 0; align-items: flex-end; }
  .action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--divider); background: var(--white);
    font-size: 13px; font-family: var(--sans); cursor: pointer;
    padding: 7px 16px; border-radius: 100px; transition: all 0.15s;
    color: var(--text-body); white-space: nowrap;
  }
  .action-btn:hover { border-color: var(--text-black); color: var(--text-black); }
  .action-btn.primary { background: var(--text-black); color: #fff; border-color: var(--text-black); }
  .action-btn.primary:hover { background: #333; }

  .status-pill {
    font-size: 11px; font-weight: 600; padding: 3px 10px;
    border-radius: 100px; white-space: nowrap;
  }
  .status-pill.draft     { background: var(--off-white); color: var(--text-muted); border: 1px solid var(--divider); }
  .status-pill.scheduled { background: #fef3c7; color: #d97706; }
  .status-pill.published { background: #dcfce7; color: #1a8917; }
  .status-pill.rejected  { background: #fee2e2; color: #dc2626; }

  .pill-btn {
    display: inline-flex; align-items: center;
    background: var(--text-black); color: #fff; border: none; cursor: pointer;
    font-size: 13px; font-weight: 500; font-family: var(--sans);
    padding: 8px 18px; border-radius: 100px; transition: background 0.15s;
  }
  .pill-btn:hover { background: #333; }

  @media (max-width: 640px) {
    .stories-header { flex-direction: column; }
    .story-row { flex-wrap: wrap; }
    .story-thumb { width: 100%; height: 160px; }
  }
</style>
