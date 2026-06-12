<script>
  import { currentPage, bookmarks, toggleBookmark, selectedBlog, articleFrom } from '../stores/store.js';
  import { mockBlogs } from '../data/mockData.js';

  $: bookmarkedBlogs = mockBlogs.filter(b => $bookmarks.includes(b.id));

  function openArticle(blog) {
    selectedBlog.set(blog);
    articleFrom.set('discover');
    currentPage.set('article');
    window.scrollTo(0, 0);
  }
</script>

<div class="list-wrap">
  <div class="list-header">
    <div>
      <h1 class="list-title">Bookmarks</h1>
      <p class="list-sub">{bookmarkedBlogs.length} article{bookmarkedBlogs.length !== 1 ? 's' : ''} saved</p>
    </div>
  </div>

  {#if bookmarkedBlogs.length === 0}
    <div class="empty-wrap">
      <p class="empty-title">No bookmarks yet</p>
      <p class="empty-sub">Bookmark articles from Discover to save them here.</p>
      <button class="primary-btn" style="margin-top:20px" on:click={() => currentPage.set('discover')}>Go to Discover</button>
    </div>
  {:else}
    <div class="blog-list">
      {#each bookmarkedBlogs as blog}
        <div class="blog-row">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
            <h2 class="blog-title" on:click={() => openArticle(blog)} style="cursor:pointer">{blog.title}</h2>
            <p class="blog-summary">{blog.summary}</p>
            <div class="blog-tags">
              {#each blog.tags as t}<span class="tag-pill">{t}</span>{/each}
            </div>
          </div>
          <div class="blog-actions">
            <button class="action-btn remove" on:click={() => toggleBookmark(blog.id)}>Remove</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .list-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }
  .list-header { padding: 32px 0 28px; border-bottom: 1px solid var(--divider); margin-bottom: 8px; }
  .back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; margin-bottom: 12px; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text-black); }
  .list-title { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); letter-spacing: -0.3px; margin-bottom: 4px; }
  .list-sub { font-size: 14px; color: var(--text-muted); }
  .primary-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--text-black); color: var(--white); border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; transition: opacity 0.15s;
  }
  .primary-btn:hover { opacity: 0.85; }
  .empty-wrap { padding: 64px 0; text-align: center; }
  .empty-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); margin-bottom: 8px; }
  .empty-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; }
  .blog-list { padding-top: 8px; }
  .blog-row { display: flex; align-items: flex-start; gap: 20px; padding: 24px 0; border-bottom: 1px solid var(--divider); }
  .blog-row:last-child { border-bottom: none; }
  .blog-thumb { width: 100px; height: 68px; object-fit: cover; border-radius: 4px; flex-shrink: 0; }
  .blog-body { flex: 1; min-width: 0; }
  .blog-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
  .meta-dot { color: var(--text-hint); }
  .blog-source { font-weight: 500; color: var(--text-body); }
  .blog-cat { background: var(--off-white); border: 1px solid var(--divider); padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 500; }
  .blog-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--text-black); line-height: 1.3; letter-spacing: -0.2px; margin-bottom: 6px; }
  .blog-summary { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .blog-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag-pill { font-size: 11px; color: var(--text-muted); background: var(--off-white); border: 1px solid var(--divider); padding: 3px 10px; border-radius: 100px; }
  .blog-actions { flex-shrink: 0; }
  .action-btn { display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--divider); background: var(--white); font-size: 13px; font-family: var(--sans); cursor: pointer; padding: 7px 16px; border-radius: 100px; transition: all 0.15s; color: var(--text-body); white-space: nowrap; }
  .action-btn.remove:hover { border-color: var(--red); color: var(--red); }
  @media (max-width: 600px) {
    .blog-row { flex-direction: column; }
    .blog-thumb { width: 100%; height: 160px; }
  }
</style>
