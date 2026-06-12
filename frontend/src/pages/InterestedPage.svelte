<script>
  import { currentPage, interestedBlogs, rejectBlog, selectedBlog, articleFrom } from '../stores/store.js';

  let categoryFilter = 'All';

  $: categories = ['All', ...new Set($interestedBlogs.map(b => b.category))];
  $: filtered = categoryFilter === 'All' ? $interestedBlogs : $interestedBlogs.filter(b => b.category === categoryFilter);
  $: progress = $interestedBlogs.length;

  function openArticle(blog) {
    selectedBlog.set(blog);
    articleFrom.set('interested');
    currentPage.set('article');
    window.scrollTo(0, 0);
  }
</script>

<div class="list-wrap">
  <div class="list-header">
    <div>
      <button class="back-btn" on:click={() => currentPage.set('dashboard')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Dashboard
      </button>
      <h1 class="list-title">Interested Blogs</h1>
      <p class="list-sub">{$interestedBlogs.length} blog{$interestedBlogs.length !== 1 ? 's' : ''} marked as interested</p>
    </div>
    {#if $interestedBlogs.length > 0}
      <button class="primary-btn" on:click={() => currentPage.set('preview')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Generate Blog ({$interestedBlogs.length})
      </button>
    {/if}
  </div>

  {#if $interestedBlogs.length > 0}
    <!-- Progress bar -->
    <div class="progress-wrap">
      <div class="progress-info">
        <span class="progress-label">Selection progress</span>
        <span class="progress-count">{progress} selected</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:{Math.min(progress * 10, 100)}%"></div>
      </div>
    </div>

    <!-- Category chips -->
    <div class="chip-row">
      {#each categories as cat}
        <button
          class="chip"
          class:active={categoryFilter === cat}
          on:click={() => categoryFilter = cat}
        >
          {cat}
          {#if cat !== 'All'}
            <span class="chip-count">{$interestedBlogs.filter(b => b.category === cat).length}</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if $interestedBlogs.length === 0}
    <div class="empty-wrap">
      <p class="empty-title">No interested blogs yet</p>
      <p class="empty-sub">Go to Discover, search a topic, and mark blogs as Interested.</p>
      <button class="primary-btn" style="margin-top:20px" on:click={() => currentPage.set('home')}>Start Searching</button>
    </div>
  {:else}
    <div class="blog-list">
      {#each filtered as blog}
        <div class="blog-row">
          <img src={blog.image} alt="" class="blog-thumb" style="cursor:pointer" on:click={() => openArticle(blog)} />
          <div class="blog-body">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <div class="blog-meta" on:click={() => openArticle(blog)} style="cursor:pointer">
              <span class="blog-source">{blog.source}</span>
              <span class="meta-dot">·</span>
              <span class="blog-time">{blog.readTime}</span>
              <span class="meta-dot">·</span>
              <span class="blog-cat">{blog.category}</span>
            </div>
            <h2 class="blog-title">{blog.title}</h2>
            <p class="blog-summary">{blog.summary}</p>
            <div class="blog-tags">
              {#each blog.tags as t}<span class="tag-pill">{t}</span>{/each}
            </div>
          </div>
          <div class="blog-actions">
            <button class="action-btn generate" on:click={() => generateForBlog(blog)}>Generate</button>
            <button class="action-btn reject" on:click={() => rejectBlog(blog.id)}>Remove</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .list-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

  /* Progress */
  .progress-wrap { padding: 20px 0 4px; }
  .progress-info { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .progress-label { font-size: 12px; color: var(--text-muted); font-weight: 500; }
  .progress-count { font-size: 12px; color: var(--text-black); font-weight: 600; }
  .progress-track {
    height: 4px; background: var(--divider); border-radius: 99px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: var(--green); border-radius: 99px;
    transition: width 0.4s ease;
  }

  /* Category chips */
  .chip-row {
    display: flex; flex-wrap: wrap; gap: 8px;
    padding: 16px 0 20px; border-bottom: 1px solid var(--divider);
  }
  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 14px; border-radius: 100px;
    font-size: 13px; font-weight: 500; font-family: var(--sans);
    border: 1px solid var(--divider); background: var(--white);
    color: var(--text-muted); cursor: pointer; transition: all 0.15s;
  }
  .chip:hover { border-color: var(--divider-strong); color: var(--text-black); }
  .chip.active { background: var(--text-black); color: #fff; border-color: var(--text-black); }
  .chip-count {
    background: rgba(255,255,255,0.2); border-radius: 99px;
    padding: 1px 6px; font-size: 11px;
  }
  .chip:not(.active) .chip-count {
    background: var(--off-white); color: var(--text-muted);
  }

  .list-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; padding: 32px 0 28px; border-bottom: 1px solid var(--divider);
  }
  .back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; margin-bottom: 12px; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text-black); }
  .list-title {
    font-family: var(--serif); font-size: 28px; font-weight: 700;
    color: var(--text-black); letter-spacing: -0.3px; margin-bottom: 4px;
  }
  .list-sub { font-size: 14px; color: var(--text-muted); }

  .primary-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--text-black); color: #fff; border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; white-space: nowrap;
    transition: background 0.15s; flex-shrink: 0;
  }
  .primary-btn:hover { background: #333; }

  .empty-wrap { padding: 64px 0; text-align: center; }
  .empty-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); margin-bottom: 8px; }
  .empty-sub   { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

  .blog-list { padding-top: 8px; }
  .blog-row {
    display: flex; align-items: flex-start; gap: 20px;
    padding: 24px 0; border-bottom: 1px solid var(--divider);
  }
  .blog-row:last-child { border-bottom: none; }
  .blog-thumb { width: 100px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
  .blog-body  { flex: 1; min-width: 0; }

  .blog-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
  .meta-dot  { color: var(--text-hint); }
  .blog-source { font-weight: 500; color: var(--text-body); }
  .blog-cat {
    background: var(--off-white); border: 1px solid var(--divider);
    padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 500;
  }
  .blog-title {
    font-family: var(--serif); font-size: 18px; font-weight: 700;
    color: var(--text-black); line-height: 1.3; letter-spacing: -0.2px; margin-bottom: 6px;
  }
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
  .action-btn.reject:hover { border-color: var(--red); color: var(--red); }

  @media (max-width: 600px) {
    .blog-row { flex-direction: column; }
    .blog-thumb { width: 100%; height: 160px; }
    .list-header { flex-direction: column; }
    .blog-actions { flex-direction: row; }
  }
</style>
