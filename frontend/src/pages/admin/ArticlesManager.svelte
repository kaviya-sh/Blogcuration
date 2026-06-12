<script>
  import { onMount } from 'svelte';
  import { articles, articlesLoading, fetchArticles, fetchThemes, currentAdminPage } from '../../stores/store.js';

  let themeFilter  = '';
  let statusFilter = '';
  let slideOver    = null;
  let searchQuery  = '';
  let selected     = new Set();
  let activeStatus = 'all';

  onMount(() => { fetchArticles(); fetchThemes(); });

  $: filtered = $articles.filter(a => {
    const tOk = !themeFilter  || a.theme === themeFilter;
    const sOk = !statusFilter || a.status === statusFilter;
    const qOk = !searchQuery  || a.title?.toLowerCase().includes(searchQuery.toLowerCase())
                               || a.theme?.toLowerCase().includes(searchQuery.toLowerCase());
    return tOk && sOk && qOk;
  });

  $: uniqueThemes   = [...new Set($articles.map(a => a.theme).filter(Boolean))];
  $: uniqueStatuses = [...new Set($articles.map(a => a.status).filter(Boolean))];

  function scoreClass(v) { return v >= 9 ? 'high' : v >= 7 ? 'mid' : 'low'; }
  function fmtDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'medium' });
  }
  function openSlide(a) { slideOver = a; }
  function closeSlide() { slideOver = null; }

  function toggleSelect(id) {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    selected = s;
  }
  function selectAll() {
    selected = new Set(filtered.map(a => a.id));
  }
  function clearAll() { selected = new Set(); }

  // Stats from real backend data
  $: totalArticles  = $articles.length;
  $: totalPublished = $articles.filter(a => a.status === 'published').length;
  $: totalFeatured  = $articles.filter(a => a.featured).length;
  $: totalFailed    = $articles.filter(a => a.status === 'failed').length;
</script>

<div class="articles-page" class:has-slide={slideOver}>
  <div class="page-hdr">
    <button class="back-btn" on:click={() => currentAdminPage.set('dashboard')}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Dashboard
    </button>
    <h1 class="page-title">Articles</h1>
  </div>
  <div style="border-top:1px solid var(--divider);margin-bottom:20px"></div>

  <!-- Stats row -->
  <div class="art-stats">
    {#each [
      { label:'Total Articles', val: totalArticles },
      { label:'Published',      val: totalPublished },
      { label:'Featured',       val: totalFeatured },
      { label:'Failed',         val: totalFailed },
    ] as s}
      <div class="art-stat">
        <div class="art-stat-val">{s.val}</div>
        <div class="art-stat-lbl">{s.label}</div>
      </div>
    {/each}
  </div>

  <!-- Search + legacy filters -->
  <div class="filter-bar">
    <div class="search-wrap">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-ico"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input class="search-input" bind:value={searchQuery} placeholder="Search by title, category, keyword…"/>
    </div>
    <select bind:value={themeFilter} style="width:auto">
      <option value="">All Themes</option>
      {#each uniqueThemes as t}<option value={t}>{t}</option>{/each}
    </select>
    <select bind:value={statusFilter} style="width:auto">
      <option value="">All Status</option>
      {#each uniqueStatuses as s}<option value={s}>{s}</option>{/each}
    </select>
    <button class="btn btn-secondary btn-sm" on:click={() => fetchArticles(themeFilter)}>↻ Refresh</button>
  </div>

  <!-- Status tabs -->
  <div class="status-tabs">
    {#each statusTabs as st}
      <button class="stab" class:stab-active={activeStatus===st} on:click={()=>activeStatus=st}>
        {st === 'all' ? 'All' : st}
      </button>
    {/each}
  </div>

  <!-- Bulk actions bar -->
  {#if selected.size > 0}
    <div class="bulk-bar">
      <span class="bulk-count">{selected.size} selected</span>
      <button class="bulk-btn bulk-green" on:click={clearAll}>✓ Approve</button>
      <button class="bulk-btn bulk-amber">⏱ Schedule</button>
      <button class="bulk-btn bulk-red">✗ Reject</button>
      <button class="bulk-btn bulk-red">🗑 Delete</button>
      <button class="bulk-clear" on:click={clearAll}>Clear</button>
    </div>
  {/if}

  <!-- Articles table (real data) -->
  {#if filtered.length > 0}
    <div class="art-table-card">
      <div class="table-scroll">
        <table class="art-table">
          <thead>
            <tr>
              <th style="width:32px">
                <input type="checkbox" on:change={e => e.target.checked ? selectAll() : clearAll()}/>
              </th>
              <th>Thumbnail</th><th>Title</th><th>Category</th>
              <th>Source</th><th class="num">AI Score</th>
              <th>Publish Date</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
        {#each filtered as a}
          {@const publishedAt = a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-GB', { dateStyle: 'medium' }) : ''}
          <tr class:row-selected={selected.has(a.id)}>
            <td><input type="checkbox" checked={selected.has(a.id)} on:change={()=>toggleSelect(a.id)}/></td>
            <td>
              {#if a.imageUrl}
                <img src={a.imageUrl} alt="" style="width:36px;height:36px;object-fit:cover;border-radius:4px" />
              {:else}
                <div class="thumb-emoji">📄</div>
              {/if}
            </td>
            <td class="td-title">{a.title}</td>
            <td><span class="cat-tag">{a.theme}</span></td>
            <td class="td-muted">{a.sourceUrl ? new URL(a.sourceUrl).hostname.replace('www.','') : '—'}</td>
            <td class="num"><span class="score-chip">{((a.relevanceScore + a.innovationScore) / 2).toFixed(0)}</span></td>
            <td class="td-muted">{publishedAt}</td>
            <td><span class="badge {a.status === 'published' ? 'badge-complete' : a.status === 'failed' ? 'badge-error' : 'badge-gray'}">{a.status}</span></td>
            <td>
              <div class="act-row">
                <button class="act-btn" title="View" on:click={() => openSlide(a)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                {#if a.sourceUrl}
                  <a href={a.sourceUrl} target="_blank" rel="noopener" class="act-btn" title="Open source">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <!-- Empty state -->
  {#if !$articlesLoading && filtered.length === 0}
    <div class="empty-state" style="margin-top:24px">
      <h3>No articles found.</h3>
      <p>Try changing the filters or trigger a pipeline run.</p>
    </div>
  {/if}
</div>

<!-- Slide-over / Quick Preview -->
{#if slideOver}
  <div
    class="overlay"
    role="button" tabindex="0" aria-label="Close panel"
    on:click={closeSlide}
    on:keydown={e => (e.key==='Enter'||e.key==='Escape')&&closeSlide()}
  ></div>
  <div class="slide-over">
    <div class="slide-top-bar">
      <span class="slide-top-label">Quick Preview</span>
      <button class="slide-close" on:click={closeSlide}>✕</button>
    </div>
    {#if slideOver.imageUrl}
      <img src={slideOver.imageUrl} alt="" class="slide-img" />
    {:else if slideOver.thumb}
      <div class="slide-thumb-placeholder">{slideOver.thumb}</div>
    {/if}
    <div class="slide-body">
      <div class="slide-meta">
        {#if slideOver.theme}<span class="badge badge-theme">{slideOver.theme}</span>{/if}
        {#if slideOver.category}<span class="badge badge-gray">{slideOver.category}</span>{/if}
        {#if slideOver.lang === 'FR'}<span class="badge badge-fr">FR</span>{/if}
        {#if slideOver.featured}<span class="badge badge-featured">⭐ Featured</span>{/if}
        {#if slideOver.status}<span class="badge {statusBadgeMap[slideOver.status]??'badge-gray'}">{slideOver.status}</span>{/if}
      </div>
      <h2 class="slide-title">{slideOver.title}</h2>
      {#if slideOver.summary}
        <p class="slide-summary">{slideOver.summary}</p>
      {/if}
      {#if slideOver.source || slideOver.date}
        <div class="slide-info">
          {#if slideOver.source}<span class="slide-info-item">Source: <b>{slideOver.source}</b></span>{/if}
          {#if slideOver.date}<span class="slide-info-item">Date: <b>{slideOver.date}</b></span>{/if}
        </div>
      {/if}
      {#if slideOver.relevanceScore !== undefined}
        <div class="slide-scores">
          <div class="score-bar-row">
            <span class="score-bar-label">Relevance</span>
            <div class="score-bar-track"><div class="score-bar-fill" style="width:{(slideOver.relevanceScore/10)*100}%"></div></div>
            <span class="score-bar-val {slideOver.relevanceScore>=9?'high':''}">{slideOver.relevanceScore?.toFixed(1)} / 10</span>
          </div>
          <div class="score-bar-row">
            <span class="score-bar-label">Innovation</span>
            <div class="score-bar-track"><div class="score-bar-fill" style="width:{(slideOver.innovationScore/10)*100}%"></div></div>
            <span class="score-bar-val {slideOver.innovationScore>=9?'high':''}">{slideOver.innovationScore?.toFixed(1)} / 10</span>
          </div>
        </div>
      {/if}
      <div class="slide-actions">
        <button class="btn btn-primary btn-sm">Publish Now</button>
        <button class="btn btn-secondary btn-sm">Edit</button>
        <button class="btn btn-danger btn-sm">Delete</button>
      </div>
      {#if slideOver.sourceUrl}
        <a href={slideOver.sourceUrl} target="_blank" rel="noopener" class="btn btn-secondary btn-full" style="margin-top:10px">
          Read original →
        </a>
      {/if}
    </div>
  </div>
{/if}

<style>
  .back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; margin-bottom: 12px; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text-black); }
  .articles-page { max-width: 1100px; }
  .page-title { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); margin-bottom: 24px; }

  /* Stats */
  .art-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1px; margin-bottom: 20px;
    border: 1px solid var(--divider); border-radius: var(--radius);
    overflow: hidden; background: var(--divider);
  }
  .art-stat { background: var(--white); padding: 16px 18px; transition: background 0.15s; }
  .art-stat:hover { background: var(--off-white); }
  .art-stat-val { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); line-height: 1; margin-bottom: 3px; }
  .art-stat-lbl { font-size: 12px; color: var(--text-muted); font-family: var(--sans); }

  /* Filter bar */
  .filter-bar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 14px; }
  .search-wrap { display: flex; align-items: center; gap: 8px; background: var(--white); border: 1px solid var(--divider); border-radius: var(--radius); padding: 0 12px; height: 36px; flex: 1; min-width: 200px; max-width: 360px; }
  .search-ico { color: var(--text-hint); flex-shrink: 0; }
  .search-input { border: none; background: none; outline: none; font-size: 14px; color: var(--text-black); font-family: var(--sans); flex: 1; padding: 0; }
  .search-input::placeholder { color: var(--text-hint); }

  /* Status tabs */
  .status-tabs { display: flex; gap: 2px; flex-wrap: wrap; margin-bottom: 16px; border-bottom: 1px solid var(--divider); padding-bottom: 0; }
  .stab {
    padding: 7px 14px; font-size: 13px; font-weight: 500;
    border: none; background: none; cursor: pointer; color: var(--text-muted);
    font-family: var(--sans); border-bottom: 2px solid transparent;
    transition: all 0.15s; margin-bottom: -1px;
  }
  .stab:hover { color: var(--text-black); }
  .stab-active { color: var(--text-black); border-bottom-color: var(--text-black); }

  /* Bulk bar */
  .bulk-bar {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    padding: 8px 12px; background: var(--off-white);
    border: 1px solid var(--divider); border-radius: var(--radius);
    margin-bottom: 12px;
  }
  .bulk-count { font-size: 13px; font-weight: 600; color: var(--text-black); font-family: var(--sans); margin-right: 4px; }
  .bulk-btn {
    padding: 4px 12px; border-radius: var(--radius); font-size: 12px; font-weight: 500;
    border: 1px solid; cursor: pointer; font-family: var(--sans); transition: all 0.12s;
  }
  .bulk-green { background: var(--green-light); color: var(--green-dark); border-color: var(--green); }
  .bulk-amber { background: var(--amber-light); color: var(--amber); border-color: var(--amber); }
  .bulk-red   { background: var(--red-light);   color: var(--red);   border-color: var(--red); }
  .bulk-clear { background: none; border: none; font-size: 12px; color: var(--text-muted); cursor: pointer; font-family: var(--sans); }
  .bulk-clear:hover { color: var(--text-black); }

  /* Articles table */
  .art-table-card { border: 1px solid var(--divider); border-radius: var(--radius); overflow: hidden; background: var(--white); }
  .table-scroll { overflow-x: auto; }
  .art-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: var(--sans); }
  .art-table th {
    text-align: left; padding: 8px 12px;
    font-size: 11px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.4px;
    border-bottom: 1px solid var(--divider); background: var(--off-white);
  }
  .art-table th.num { text-align: right; }
  .art-table td { padding: 10px 12px; border-bottom: 1px solid var(--divider); color: var(--text-body); vertical-align: middle; }
  .art-table tr:last-child td { border-bottom: none; }
  .art-table tr:hover td { background: var(--off-white); }
  .art-table tr.row-selected td { background: var(--green-light); }
  .art-table .num { text-align: right; }
  .td-title { font-weight: 500; color: var(--text-black); max-width: 220px; }
  .td-muted { color: var(--text-muted); white-space: nowrap; }
  .thumb-emoji { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 20px; background: var(--off-white); border-radius: var(--radius); }
  .cat-tag { display: inline-block; padding: 2px 8px; border-radius: var(--radius); font-size: 11px; font-weight: 500; background: var(--off-white); color: var(--text-body); border: 1px solid var(--divider); }
  .score-chip { display:inline-block; padding:2px 8px; border-radius:100px; font-size:12px; font-weight:700; background:var(--green-light); color:var(--green-dark); }
  .act-row { display: flex; gap: 3px; }
  .act-btn {
    width: 26px; height: 26px; border-radius: var(--radius);
    border: 1px solid var(--divider); background: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-muted); transition: all 0.12s;
  }
  .act-btn:hover { background: var(--off-white); border-color: var(--text-black); color: var(--text-black); }
  .act-pub:hover { background: var(--green-light); border-color: var(--green); color: var(--green); }
  .act-del:hover { background: var(--red-light); border-color: var(--red); color: var(--red); }

  /* Legacy list */
  .skel-list { display: flex; flex-direction: column; }
  .skel-row { display: flex; gap: 16px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid var(--divider); }
  .article-list { display: flex; flex-direction: column; }
  .article-row {
    display: flex; gap: 16px; align-items: flex-start;
    padding: 20px 0; border-bottom: 1px solid var(--divider);
    cursor: pointer; transition: background 0.15s;
    width: 100%; background: none; border-left: none; border-right: none; border-top: none;
    text-align: left; font-family: var(--sans);
  }
  .article-row:hover { background: var(--off-white); margin: 0 -16px; padding-left: 16px; padding-right: 16px; box-shadow: inset 2px 0 0 var(--text-black); }
  .article-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius); flex-shrink: 0; }
  .article-thumb.placeholder { background: var(--divider); }
  .article-body { flex: 1; min-width: 0; }
  .article-title { font-size: 15px; font-weight: 500; color: var(--text-black); line-height: 1.4; margin-bottom: 6px; }
  .star { margin-right: 4px; }
  .article-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
  .meta-date { font-size: 12px; color: var(--text-muted); }
  .article-summary { font-size: 13px; color: var(--text-muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .article-scores { display: flex; flex-direction: column; gap: 4px; align-items: flex-end; flex-shrink: 0; }
  .score-val { font-size: 13px; font-weight: 500; color: var(--text-muted); }
  .score-val.high { color: var(--green); }
  .score-val.mid  { color: var(--amber); }
  .score-val.low  { color: var(--red); }

  /* Slide-over */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 400; }
  .slide-over {
    position: fixed; top: 0; right: 0; bottom: 0; width: 400px;
    background: var(--white); border-left: 1px solid var(--divider);
    z-index: 500; overflow-y: auto;
  }
  .slide-top-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--divider); }
  .slide-top-label { font-size: 13px; font-weight: 600; color: var(--text-muted); font-family: var(--sans); text-transform: uppercase; letter-spacing: 0.4px; }
  .slide-close { background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text-muted); padding: 4px; }
  .slide-close:hover { color: var(--text-black); }
  .slide-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
  .slide-thumb-placeholder { height: 120px; display: flex; align-items: center; justify-content: center; font-size: 48px; background: var(--off-white); }
  .slide-body { padding: 20px; }
  .slide-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .slide-title { font-family: var(--serif); font-size: 20px; font-weight: 700; color: var(--text-black); line-height: 1.3; margin-bottom: 12px; }
  .slide-summary { font-family: var(--serif); font-size: 15px; color: var(--text-body); line-height: 1.8; margin-bottom: 16px; }
  .slide-info { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; font-size: 13px; color: var(--text-muted); font-family: var(--sans); }
  .slide-info b { color: var(--text-body); }
  .slide-scores { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .slide-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  @media (max-width: 640px) {
    .slide-over { width: 100%; }
    .art-stats { grid-template-columns: repeat(2,1fr); }
  }
</style>
