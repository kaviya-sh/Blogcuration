<script>
  import { selectedBlog, currentPage, interestedBlogs, rejectedIds, bookmarks, rejectBlog, interestBlog, toggleBookmark, articleFrom } from '../stores/store.js';

  $: from = $articleFrom;

  $: blog = $selectedBlog;
  $: isInterested = $interestedBlogs.some(b => b.id === blog?.id);
  $: isRejected   = $rejectedIds.includes(blog?.id);
  $: isBookmarked = $bookmarks.includes(blog?.id);

  function getScores(id) {
    const seed = id * 137;
    return {
      rel: Math.min(+((6.5 + (seed % 35) / 10)).toFixed(1), 10),
      inn: Math.min(+((6.0 + ((seed * 3) % 40) / 10)).toFixed(1), 10),
    };
  }
  function scoreClass(v) { return v >= 9 ? 'high' : v >= 7 ? 'mid' : 'low'; }
</script>

{#if blog}
  {@const sc = getScores(blog.id)}
  <div class="detail-wrap">
    <button class="back-btn" on:click={() => currentPage.set(from)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      Back
    </button>

    <img class="cover" src={blog.image} alt="" />

    <div class="meta-row">
      <span class="lang-pill {blog.lang}">{blog.lang}</span>
      <span class="dot">·</span>
      <span class="source">{blog.source}</span>
      <span class="dot">·</span>
      <span class="read-time">{blog.readTime}</span>
      <span class="dot">·</span>
      <span class="category">{blog.category}</span>
    </div>

    <h1 class="title">{blog.title}</h1>
    <p class="summary">{blog.summary}</p>

    <div class="tags">
      {#each blog.tags as t}<span class="tag">{t}</span>{/each}
    </div>

    <div class="scores">
      {#each [['Relevance', sc.rel], ['Innovation', sc.inn]] as [label, val]}
        <div class="score-row">
          <span class="score-label">{label}</span>
          <div class="score-track">
            <div class="score-fill {scoreClass(val)}" style="width:{(val/10)*100}%"></div>
          </div>
          <span class="score-val {scoreClass(val)}">{val}</span>
        </div>
      {/each}
    </div>

    <div class="actions">
      <button class="action-btn bookmark" class:active={isBookmarked} on:click={() => toggleBookmark(blog.id)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
        </svg>
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>

      {#if isInterested}
        <button class="action-btn generate" on:click={() => currentPage.set('preview')}>✨ Generate Blog</button>
      {:else}
        <button class="action-btn reject" class:active={isRejected} on:click={() => rejectBlog(blog.id)}>
          {isRejected ? 'Rejected' : 'Not Interested'}
        </button>
        <button class="action-btn interest" on:click={() => interestBlog(blog)}>👍 Interested</button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .detail-wrap { max-width: 720px; margin: 0 auto; padding: 32px 24px 80px; }

  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; margin-bottom: 28px; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text-black); }

  .cover { width: 100%; aspect-ratio: 2/1; object-fit: cover; border-radius: 6px; margin-bottom: 24px; }

  .meta-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); margin-bottom: 14px; flex-wrap: wrap; }
  .dot { color: var(--text-hint); }
  .lang-pill { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 100px; letter-spacing: 0.06em; }
  .lang-pill.EN { background: var(--off-white); color: var(--text-muted); border: 1px solid var(--divider); }
  .lang-pill.FR { background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; }
  .source { font-weight: 500; color: var(--text-body); }
  .category { background: var(--off-white); border: 1px solid var(--divider); padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 500; }

  .title { font-family: var(--serif); font-size: 30px; font-weight: 700; color: var(--text-black); line-height: 1.25; letter-spacing: -0.3px; margin-bottom: 16px; }
  .summary { font-size: 16px; line-height: 1.75; color: var(--text-body); margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--divider); }

  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 28px; }
  .tag { font-size: 11px; color: var(--text-muted); background: var(--off-white); border: 1px solid var(--divider); padding: 3px 10px; border-radius: 100px; }

  .scores { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
  .score-row { display: flex; align-items: center; gap: 12px; }
  .score-label { font-size: 13px; color: var(--text-muted); width: 80px; flex-shrink: 0; }
  .score-track { flex: 1; height: 6px; background: var(--divider); border-radius: 99px; overflow: hidden; }
  .score-fill { height: 100%; border-radius: 99px; transition: width 0.4s ease; }
  .score-fill.high { background: var(--green); }
  .score-fill.mid  { background: var(--amber, #f59e0b); }
  .score-fill.low  { background: var(--red); }
  .score-val { font-size: 13px; font-weight: 600; width: 30px; text-align: right; }
  .score-val.high { color: var(--green); }
  .score-val.mid  { color: var(--amber, #f59e0b); }
  .score-val.low  { color: var(--red); }

  .actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .action-btn {
    display: inline-flex; align-items: center; gap: 6px;
    border: 1px solid var(--divider); background: var(--white);
    font-size: 13px; font-family: var(--sans); cursor: pointer;
    padding: 8px 16px; border-radius: 100px; transition: all 0.15s;
    color: var(--text-body);
  }
  .action-btn:hover { border-color: var(--text-black); color: var(--text-black); }
  .action-btn.bookmark.active { color: var(--text-black); border-color: var(--text-black); }
  .action-btn.interest { background: var(--green); color: #fff; border-color: var(--green); }
  .action-btn.interest:hover { background: var(--green-dark); border-color: var(--green-dark); }
  .action-btn.reject.active { background: var(--red-light); color: var(--red); border-color: var(--red); }
  .action-btn.generate { background: var(--text-black); color: #fff; border-color: var(--text-black); }
  .action-btn.generate:hover { background: #333; }

  @media (max-width: 600px) {
    .title { font-size: 22px; }
    .summary { font-size: 14px; }
  }
</style>
