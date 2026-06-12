<script>
  import { currentPage, scheduledPosts, selectedBlog } from '../stores/store.js';
  $: posts = $scheduledPosts.filter(p => p.status === 'scheduled');

  function editPost(post) {
    selectedBlog.set(post);
    currentPage.set('preview');
  }
</script>

<div class="list-wrap">
  <div class="list-header">
    <button class="back-btn" on:click={() => currentPage.set('dashboard')}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      Dashboard
    </button>
    <h1 class="list-title">Scheduled Posts</h1>
    <p class="list-sub">{posts.length} blog{posts.length !== 1 ? 's' : ''} waiting to publish</p>
  </div>

  {#if posts.length === 0}
    <div class="empty-wrap">
      <p class="empty-title">No scheduled posts</p>
      <p class="empty-sub">Search a topic, generate a blog, and schedule it to see it here.</p>
      <button class="primary-btn" style="margin-top:20px" on:click={() => currentPage.set('home')}>Start Curating</button>
    </div>
  {:else}
    <div class="post-list">
      {#each [...posts].reverse() as post}
        <div class="post-row">
          <span class="post-dot"></span>
          <div class="post-body">
            <h2 class="post-title">{post.title}</h2>
            <div class="post-meta">
              <span class="post-status">Scheduled</span>
              <span class="meta-dot">·</span>
              <span class="post-cat">{post.category}</span>
              <span class="meta-dot">·</span>
              <span class="post-time">{new Date(post.scheduledAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
          </div>
          <button class="action-btn" on:click={() => editPost(post)}>Edit</button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .list-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

  .list-header {
    padding: 32px 0 28px; border-bottom: 1px solid var(--divider);
    margin-bottom: 8px;
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
    display: inline-flex; align-items: center;
    background: var(--text-black); color: #fff; border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; transition: background 0.15s;
  }
  .primary-btn:hover { background: #333; }

  .empty-wrap { padding: 64px 0; text-align: center; }
  .empty-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); margin-bottom: 8px; }
  .empty-sub   { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

  .post-list { padding-top: 8px; }
  .post-row {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 0; border-bottom: 1px solid var(--divider);
  }
  .post-row:last-child { border-bottom: none; }
  .post-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--amber); flex-shrink: 0;
  }
  .post-body { flex: 1; min-width: 0; }
  .post-title {
    font-family: var(--serif); font-size: 17px; font-weight: 600;
    color: var(--text-black); line-height: 1.3; margin-bottom: 6px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .post-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; }
  .meta-dot    { color: var(--text-hint); }
  .post-status { font-weight: 600; color: var(--amber); }
  .post-cat    { background: var(--off-white); border: 1px solid var(--divider); padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 500; color: var(--text-muted); }
  .post-time   { color: var(--text-muted); }

  .action-btn {
    display: inline-flex; align-items: center;
    border: 1px solid var(--divider); background: var(--white);
    font-size: 13px; font-family: var(--sans); cursor: pointer;
    padding: 7px 16px; border-radius: 100px; transition: all 0.15s;
    color: var(--text-body); white-space: nowrap; flex-shrink: 0;
  }
  .action-btn:hover { border-color: var(--text-black); color: var(--text-black); }
</style>
