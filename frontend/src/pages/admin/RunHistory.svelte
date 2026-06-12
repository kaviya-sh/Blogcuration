<script>
  import { onMount } from 'svelte';
  import { runHistory, runsLoading, fetchRuns, currentAdminPage } from '../../stores/store.js';

  let expandedId = null;
  let activeFilter = 'today';

  onMount(fetchRuns);

  function fmt(str) { return str || '—'; }
  function runtime(start, end) {
    if (!start || !end) return '—';
    const m = Math.round((new Date(end) - new Date(start)) / 60000);
    return `${m} min`;
  }
  function statusBadge(s) {
    if (s === 'Complete') return 'badge-complete';
    if (s === 'Error')    return 'badge-error';
    return 'badge-skipped';
  }
  function toggle(id) { expandedId = expandedId === id ? null : id; }

  // Mock runtime history for enhanced display
  const mockRuns = [
    { id:'RUN-001', source:'TechCrunch RSS',    found:142, curated:38, score:94, runtime:'4m 12s', status:'Success',  time:'Today, 08:00' },
    { id:'RUN-002', source:'Medium Publications',found:87, curated:22, score:91, runtime:'2m 48s', status:'Success',  time:'Today, 08:05' },
    { id:'RUN-003', source:'Wired News API',     found:63, curated:14, score:88, runtime:'1m 55s', status:'Warning',  time:'Today, 08:09' },
    { id:'RUN-004', source:'Hacker News',        found:210,curated:51, score:96, runtime:'5m 30s', status:'Success',  time:'Today, 09:00' },
    { id:'RUN-005', source:'Reuters API',        found:0,  curated:0,  score:0,  runtime:'0m 12s', status:'Failed',   time:'Today, 09:12' },
    { id:'RUN-006', source:'Dev.to Scraper',     found:55, curated:18, score:89, runtime:'3m 10s', status:'Success',  time:'Yesterday, 08:00' },
    { id:'RUN-007', source:'Bloomberg Feed',     found:98, curated:27, score:85, runtime:'3m 44s', status:'Warning',  time:'Yesterday, 09:00' },
  ];

  const timeline = [
    { time:'09:12', source:'Reuters API',       fetched:0,   status:'Failed',  duration:'12s'  },
    { time:'09:00', source:'Hacker News',       fetched:210, status:'Success', duration:'5m 30s'},
    { time:'08:09', source:'Wired News API',    fetched:63,  status:'Warning', duration:'1m 55s'},
    { time:'08:05', source:'Medium',            fetched:87,  status:'Success', duration:'2m 48s'},
    { time:'08:00', source:'TechCrunch RSS',    fetched:142, status:'Success', duration:'4m 12s'},
  ];

  const errors = [
    { type:'Failed API Calls',        count:3, items:['Reuters API — 503 timeout','Bloomberg API — auth expired','NewsData.io — rate limit'] },
    { type:'Missing Sources',         count:1, items:['Custom scraper: forbes.com — selector changed'] },
    { type:'AI Processing Errors',    count:2, items:['GPT token limit exceeded on run RUN-005','Duplicate detection DB timeout'] },
  ];

  const filters = ['today','7days','30days','custom'];
  const filterLabels = { today:'Today', '7days':'Last 7 Days', '30days':'Last 30 Days', custom:'Custom Range' };

  function tStatusClass(s) {
    if (s==='Success') return 'ts-ok';
    if (s==='Warning') return 'ts-warn';
    return 'ts-fail';
  }
  function rStatusClass(s) {
    if (s==='Success') return 'badge-complete';
    if (s==='Warning') return 'badge-amber';
    return 'badge-error';
  }
</script>

<button class="back-btn" on:click={() => currentAdminPage.set('dashboard')}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
  Dashboard
</button>
<h1 class="page-title">Runtime History</h1>
<div style="border-top:1px solid var(--divider);margin-bottom:20px"></div>

<!-- Stats cards -->
<div class="rh-stats">
  <div class="rh-stat">
    <div class="rhs-icon">▶</div>
    <div class="rhs-val">24</div>
    <div class="rhs-lbl">Total Runs Today</div>
  </div>
  <div class="rh-stat rhs-green">
    <div class="rhs-icon">✓</div>
    <div class="rhs-val">19</div>
    <div class="rhs-lbl">Successful Runs</div>
  </div>
  <div class="rh-stat rhs-red">
    <div class="rhs-icon">✗</div>
    <div class="rhs-val">3</div>
    <div class="rhs-lbl">Failed Runs</div>
  </div>
  <div class="rh-stat">
    <div class="rhs-icon">⏱</div>
    <div class="rhs-val">3m 24s</div>
    <div class="rhs-lbl">Avg Processing Time</div>
  </div>
</div>

<!-- Filter tabs -->
<div class="rh-filters">
  {#each filters as f}
    <button class="rh-ftab" class:rh-ftab-active={activeFilter===f} on:click={()=>activeFilter=f}>
      {filterLabels[f]}
    </button>
  {/each}
  {#if activeFilter==='custom'}
    <div class="custom-range">
      <input type="date" style="width:140px"/>
      <span style="color:var(--text-muted);font-size:13px">–</span>
      <input type="date" style="width:140px"/>
    </div>
  {/if}
</div>

<!-- Two-col grid: timeline + logs table -->
<div class="rh-grid">

  <!-- Activity timeline -->
  <div class="rh-card">
    <div class="rh-card-title">Activity Timeline</div>
    <div class="timeline">
      {#each timeline as t}
        <div class="tl-row">
          <div class="tl-time">{t.time}</div>
          <div class="tl-dot {tStatusClass(t.status)}"></div>
          <div class="tl-body">
            <div class="tl-source">{t.source}</div>
            <div class="tl-meta">
              {t.fetched} articles · {t.duration}
              <span class="badge {rStatusClass(t.status)}" style="margin-left:6px">{t.status}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Error monitoring -->
  <div class="rh-card">
    <div class="rh-card-title">Error Monitoring</div>
    <div class="error-list">
      {#each errors as e}
        <div class="error-block">
          <div class="error-head">
            <span class="error-type">{e.type}</span>
            <span class="error-count">{e.count}</span>
          </div>
          {#each e.items as item}
            <div class="error-item">
              <span class="error-dot"></span>
              <span class="error-text">{item}</span>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Runtime logs table -->
<div class="rh-card" style="margin-top:16px">
  <div class="rh-card-title" style="margin-bottom:14px">Runtime Logs</div>
  <div class="table-scroll">
    <table class="rh-table">
      <thead>
        <tr>
          <th>Run ID</th><th>Source Name</th><th class="num">Articles Found</th>
          <th class="num">Curated</th><th class="num">AI Score</th>
          <th>Runtime</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each mockRuns as r}
          <tr>
            <td class="td-mono">{r.id}</td>
            <td>{r.source}</td>
            <td class="num">{r.found}</td>
            <td class="num">{r.curated}</td>
            <td class="num">
              {#if r.score > 0}
                <span class="score-chip">{r.score}</span>
              {:else}—{/if}
            </td>
            <td class="td-muted">{r.runtime}</td>
            <td><span class="badge {rStatusClass(r.status)}">{r.status}</span></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- Existing real run history -->
<div style="margin-top:32px;padding-top:24px;border-top:1px solid var(--divider)">
  <div class="rh-card-title" style="margin-bottom:14px">Live Pipeline Runs</div>

  {#if $runsLoading}
    <div class="skel-wrap">
      {#each Array(5) as _}
        <div class="skel-row">
          <div class="skeleton" style="width:120px;height:14px"></div>
          <div class="skeleton" style="width:120px;height:14px"></div>
          <div class="skeleton" style="width:40px;height:14px"></div>
          <div class="skeleton" style="width:40px;height:14px"></div>
          <div class="skeleton" style="width:40px;height:14px"></div>
          <div class="skeleton" style="width:40px;height:14px"></div>
          <div class="skeleton" style="width:70px;height:22px;border-radius:100px"></div>
        </div>
      {/each}
    </div>
  {:else if $runHistory.length === 0}
    <div class="empty-state">
      <h3>No runs yet.</h3>
      <p>Trigger a manual run from the Dashboard to see history here.</p>
    </div>
  {:else}
    <div class="table-scroll">
      <table class="rh-table">
        <thead>
          <tr>
            <th>Started</th><th>Completed</th>
            <th class="num">Disc.</th><th class="num">Scored</th>
            <th class="num">Rejected</th><th class="num pub">Published</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each $runHistory as run}
            <tr class="run-row" on:click={() => toggle(run.id)}>
              <td>{fmt(run.startedAt)}</td>
              <td>{fmt(run.completedAt)}</td>
              <td class="num">{run.discovered ?? '—'}</td>
              <td class="num">{run.scored ?? '—'}</td>
              <td class="num">{run.rejected ?? '—'}</td>
              <td class="num pub">{run.published ?? '—'}</td>
              <td><span class="badge {statusBadge(run.status)}">{run.status}</span></td>
            </tr>
            {#if expandedId === run.id}
              <tr class="expanded-row">
                <td colspan="7">
                  <div class="expanded-inner">
                    <div class="exp-item"><span class="exp-label">Runtime</span><span>{runtime(run.startedAt, run.completedAt)}</span></div>
                    <div class="exp-item"><span class="exp-label">Run ID</span><span>#{run.id}</span></div>
                    {#if run.status === 'Error'}
                      <div class="exp-item"><span class="exp-label">Error</span><span style="color:var(--red)">Pipeline encountered an error during execution.</span></div>
                    {/if}
                  </div>
                </td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .back-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; margin-bottom: 12px; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text-black); }
  .page-title { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); margin: 0 0 24px 0; }

  /* Stats */
  .rh-stats {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1px; margin-bottom: 18px;
    border: 1px solid var(--divider); border-radius: var(--radius); overflow: hidden;
    background: var(--divider);
  }
  .rh-stat {
    background: var(--white); padding: 20px 18px;
    transition: background 0.15s;
  }
  .rh-stat:hover { background: var(--off-white); }
  .rhs-icon { font-size: 16px; margin-bottom: 8px; color: var(--text-muted); }
  .rhs-val  { font-family: var(--serif); font-size: 30px; font-weight: 700; color: var(--text-black); line-height: 1; margin-bottom: 4px; }
  .rhs-lbl  { font-size: 12px; color: var(--text-muted); font-family: var(--sans); }
  .rhs-green .rhs-val { color: var(--green); }
  .rhs-red   .rhs-val { color: var(--red); }

  /* Filters */
  .rh-filters { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; margin-bottom: 20px; }
  .rh-ftab {
    padding: 6px 14px; border-radius: var(--radius); font-size: 13px; font-weight: 500;
    border: 1px solid var(--divider); background: var(--white); color: var(--text-muted);
    cursor: pointer; font-family: var(--sans); transition: all 0.15s;
  }
  .rh-ftab:hover { border-color: var(--text-black); color: var(--text-black); }
  .rh-ftab-active { background: var(--text-black); color: var(--white); border-color: var(--text-black); }
  .custom-range { display: flex; align-items: center; gap: 8px; margin-left: 8px; }

  /* Grid */
  .rh-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* Card */
  .rh-card {
    background: var(--white); border: 1px solid var(--divider);
    border-radius: var(--radius); padding: 20px;
  }
  .rh-card-title { font-size: 14px; font-weight: 600; color: var(--text-black); font-family: var(--sans); margin-bottom: 16px; }

  /* Timeline */
  .timeline { display: flex; flex-direction: column; gap: 0; }
  .tl-row { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--divider); }
  .tl-row:last-child { border-bottom: none; }
  .tl-time { font-size: 12px; color: var(--text-hint); font-family: var(--sans); width: 48px; flex-shrink: 0; padding-top: 2px; }
  .tl-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .ts-ok   { background: var(--green); }
  .ts-warn { background: var(--amber); }
  .ts-fail { background: var(--red); }
  .tl-body { flex: 1; }
  .tl-source { font-size: 13px; font-weight: 500; color: var(--text-black); font-family: var(--sans); margin-bottom: 2px; }
  .tl-meta { font-size: 12px; color: var(--text-muted); font-family: var(--sans); display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }

  /* Error monitoring */
  .error-list { display: flex; flex-direction: column; gap: 14px; }
  .error-block { border: 1px solid var(--divider); border-radius: var(--radius); overflow: hidden; }
  .error-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 12px; background: var(--off-white);
    border-bottom: 1px solid var(--divider);
  }
  .error-type { font-size: 13px; font-weight: 600; color: var(--text-black); font-family: var(--sans); }
  .error-count {
    font-size: 12px; font-weight: 700; background: var(--red-light);
    color: var(--red); padding: 2px 8px; border-radius: 100px; font-family: var(--sans);
  }
  .error-item { display: flex; gap: 8px; align-items: flex-start; padding: 7px 12px; border-bottom: 1px solid var(--divider); }
  .error-item:last-child { border-bottom: none; }
  .error-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); flex-shrink: 0; margin-top: 4px; }
  .error-text { font-size: 12px; color: var(--text-body); font-family: var(--sans); line-height: 1.4; }

  /* Table */
  .table-scroll { overflow-x: auto; }
  .rh-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: var(--sans); }
  .rh-table th {
    text-align: left; padding: 8px 12px;
    font-size: 11px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.4px;
    border-bottom: 2px solid var(--divider);
  }
  .rh-table th.num { text-align: right; }
  .rh-table td { padding: 11px 12px; border-bottom: 1px solid var(--divider); color: var(--text-body); vertical-align: middle; }
  .rh-table tr:last-child td { border-bottom: none; }
  .rh-table tr:hover td { background: var(--off-white); }
  .rh-table .num { text-align: right; font-variant-numeric: tabular-nums; }
  .rh-table .pub { font-weight: 500; color: var(--text-black); }
  .td-mono  { font-family: monospace; font-size: 12px; color: var(--text-muted); }
  .td-muted { color: var(--text-muted); }
  .score-chip { display:inline-block; padding:2px 8px; border-radius:100px; font-size:12px; font-weight:700; background:var(--green-light); color:var(--green-dark); }
  .run-row { cursor: pointer; }
  .run-row:hover td { background: var(--off-white); }
  .run-row:hover td:first-child { border-left: 2px solid var(--text-black); padding-left: 14px; }
  .expanded-row td { background: var(--off-white); padding: 0; }
  .expanded-inner { display: flex; gap: 32px; padding: 16px; border-bottom: 1px solid var(--divider); }
  .exp-item { display: flex; flex-direction: column; gap: 3px; }
  .exp-label { font-size: 11px; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; }
  .exp-item span:last-child { font-size: 13px; color: var(--text-body); }

  .skel-wrap { display: flex; flex-direction: column; gap: 0; }
  .skel-row { display: flex; gap: 24px; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--divider); }

  @media (max-width: 768px) {
    .rh-stats { grid-template-columns: repeat(2,1fr); }
    .rh-grid  { grid-template-columns: 1fr; }
  }
</style>
