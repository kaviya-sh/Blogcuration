<script>
  import { onMount, onDestroy } from 'svelte';
  import { pipelineStatus, fetchStatus, currentAdminPage, runHistory, fetchRuns, articles, fetchArticles, triggerRun } from '../../stores/store.js';

  let interval;
  let triggering = false;

  onMount(() => {
    fetchStatus();
    fetchRuns();
    fetchArticles();
    interval = setInterval(() => fetchStatus(), 30000);
  });
  onDestroy(() => clearInterval(interval));

  $: isRunning = $pipelineStatus?.status === 'RUNNING';

  async function handleTrigger() {
    triggering = true;
    await triggerRun();
    triggering = false;
    setTimeout(() => fetchStatus(), 5000);
  }

  $: recentArticles = $articles.slice(0, 7);
  $: totalPublished = $pipelineStatus?.published ?? 0;
  $: totalFailed    = $pipelineStatus?.failed ?? 0;
  $: lastRun        = $pipelineStatus?.lastRun;
  $: activeThemes   = [...new Set($articles.map(a => a.theme).filter(Boolean))];

  let chartFilter = 'Weekly';

  const chartData = {
    Daily:   [12,18,9,24,15,30,21],
    Weekly:  [48,72,55,90,63,110,85],
    Monthly: [190,240,185,310,275,390,330],
  };
  const labels = {
    Daily:   ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    Weekly:  ['W1','W2','W3','W4','W5','W6','W7'],
    Monthly: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
  };

  $: cData   = chartData[chartFilter];
  $: cLabels = labels[chartFilter];
  $: cMax    = Math.max(...cData) * 1.15;

  function cx(i, total, w) { return 48 + (i / (total - 1)) * (w - 64); }
  function cy(v, max, h)   { return (h - 40) - ((v / max) * (h - 60)); }
  const chartW = 520; const chartH = 200;
  $: pts      = cData.map((v,i) => `${cx(i,cData.length,chartW)},${cy(v,cMax,chartH)}`).join(' ');
  $: fillPts  = `${cx(0,cData.length,chartW)},${chartH-40} ` + cData.map((v,i)=>`${cx(i,cData.length,chartW)},${cy(v,cMax,chartH)}`).join(' ') + ` ${cx(cData.length-1,cData.length,chartW)},${chartH-40}`;

  // Donut
  const donutData = [
    { label: 'AI / Tech',     val: 34, color: '#1A8917' },
    { label: 'Data',          val: 22, color: '#3D3D3D' },
    { label: 'Remote Work',   val: 18, color: '#6B6B6B' },
    { label: 'Cybersecurity', val: 14, color: '#C94B4B' },
    { label: 'Startups',      val: 12, color: '#D97706' },
  ];
  const donutTotal = donutData.reduce((s,d) => s + d.val, 0);
  function polarToXY(pcx, pcy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: pcx + r * Math.cos(rad), y: pcy + r * Math.sin(rad) };
  }
  function donutSlice(pcx, pcy, r, startAngle, endAngle) {
    const s = polarToXY(pcx, pcy, r, startAngle);
    const e = polarToXY(pcx, pcy, r, endAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${pcx} ${pcy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
  }
  let donutSlices = [];
  let ang = 0;
  donutData.forEach(d => {
    const sweep = (d.val / donutTotal) * 360;
    donutSlices.push({ ...d, start: ang, end: ang + sweep });
    ang += sweep;
  });

  const barData   = [65,82,48,91,74,88,55];
  const barLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  const blogs = [
    { title: 'GPT-5 Is Changing How Developers Work',  source: 'TechCrunch',  score: 97, category: 'AI',      status: 'Published', date: '10 Jul 2025' },
    { title: 'The Rise of Agentic AI in Enterprise',   source: 'Wired',        score: 91, category: 'AI',      status: 'Published', date: '10 Jul 2025' },
    { title: 'Top 10 Data Analytics Tools 2025',       source: 'Medium',       score: 85, category: 'Data',    status: 'Scheduled', date: '11 Jul 2025' },
    { title: 'Remote Work is Not Dead — It Evolved',   source: 'Forbes',       score: 78, category: 'Work',    status: 'Review',    date: '09 Jul 2025' },
    { title: 'Zero Trust Security in 2025',            source: 'Dark Reading', score: 88, category: 'Cyber',   status: 'Published', date: '09 Jul 2025' },
    { title: 'Why Startup Valuations Are Rebounding',  source: 'Bloomberg',    score: 62, category: 'Finance', status: 'Rejected',  date: '08 Jul 2025' },
    { title: 'LLMs and the Future of Code Review',     source: 'Dev.to',       score: 93, category: 'AI',      status: 'Published', date: '08 Jul 2025' },
  ];

  const statusMeta = {
    Published: { cls: 'badge-complete', label: 'Published'     },
    Scheduled: { cls: 'badge-running',  label: 'Scheduled'     },
    Review:    { cls: 'badge-amber',    label: 'Review Needed' },
    Rejected:  { cls: 'badge-error',    label: 'Rejected'      },
  };

  const sources = [
    { name: 'RSS Feeds',           icon: '📡', count: 1240, sync: '2 min ago',  status: 'ok'   },
    { name: 'Medium Publications', icon: '📝', count:  380, sync: '8 min ago',  status: 'ok'   },
    { name: 'News APIs',           icon: '🌐', count:  904, sync: '1 min ago',  status: 'ok'   },
    { name: 'Custom Websites',     icon: '🔗', count:  210, sync: '15 min ago', status: 'warn' },
  ];

  const topics   = ['Artificial Intelligence','Data Analytics','Remote Work','Cybersecurity','Startup Growth'];
  const insights = [
    { icon: '💡', text: 'Create more AI tutorials — engagement up 41%' },
    { icon: '📈', text: 'Technology category engagement increased by 24%' },
    { icon: '🔥', text: 'Cybersecurity articles are trending this week' },
  ];
</script>

<div class="db-root">

  <!-- Welcome -->
  <div class="welcome-row">
    <div>
      <h1 class="welcome-title">Welcome Back, Admin 👋</h1>
      <p class="welcome-sub">Pipeline: <strong>{$pipelineStatus?.flag ?? '…'}</strong> · Last run: <strong>{lastRun ? new Date(lastRun).toLocaleString('en-GB', {dateStyle:'medium',timeStyle:'short'}) : 'Never'}</strong></p>
    </div>
    <div style="display:flex;gap:10px;align-items:center">
      {#if isRunning}
        <div class="running-pill"><span class="pulse-dot"></span> Pipeline Running</div>
      {:else}
        <button class="running-pill" style="cursor:pointer;border:none" on:click={handleTrigger} disabled={triggering}>
          {triggering ? '⏳ Triggering…' : '▶ Trigger Pipeline'}
        </button>
      {/if}
    </div>
  </div>

  <!-- Stat cards -->
  <div class="stat-grid">
    <div class="stat-card">
      <div class="stat-icon">📄</div>
      <div class="stat-val">{totalPublished}</div>
      <div class="stat-name">Total Published</div>
      <div class="stat-delta">From backend</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">❌</div>
      <div class="stat-val">{totalFailed}</div>
      <div class="stat-name">Total Failed</div>
      <div class="stat-delta">Pipeline failures</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">🚦</div>
      <div class="stat-val">{$pipelineStatus?.flag ?? '…'}</div>
      <div class="stat-name">Control Flag</div>
      <div class="stat-delta">ON · PAUSE · OFF</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📦</div>
      <div class="stat-val">{$runHistory.length}</div>
      <div class="stat-name">Total Runs</div>
      <div class="stat-delta">Pipeline executions</div>
    </div>
  </div>

  <!-- Main grid -->
  <div class="main-grid">

    <!-- Curation activity chart -->
    <div class="db-card chart-card">
      <div class="card-head">
        <div>
          <div class="card-title">AI Curation Activity</div>
          <div class="card-sub">Blogs curated over time</div>
        </div>
        <div class="filter-tabs">
          {#each ['Daily','Weekly','Monthly'] as f}
            <button class="ftab" class:ftab-active={chartFilter===f} on:click={()=>chartFilter=f}>{f}</button>
          {/each}
        </div>
      </div>

      <svg class="line-chart" viewBox="0 0 {chartW} {chartH}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#1A8917" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#1A8917" stop-opacity="0"/>
          </linearGradient>
        </defs>
        {#each [0,0.25,0.5,0.75,1] as t}
          <line x1="48" y1={cy(cMax*t,cMax,chartH)} x2={chartW-16} y2={cy(cMax*t,cMax,chartH)}
                stroke="#E6E6E6" stroke-width="1" stroke-dasharray="4 4"/>
          <text x="40" y={cy(cMax*t,cMax,chartH)+4} text-anchor="end" font-size="10" fill="#B3B3B3">
            {Math.round(cMax*t)}
          </text>
        {/each}
        <polygon points={fillPts} fill="url(#chartFill)"/>
        <polyline points={pts} fill="none" stroke="#1A8917" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        {#each cData as v, i}
          <circle cx={cx(i,cData.length,chartW)} cy={cy(v,cMax,chartH)} r="4" fill="#1A8917" stroke="#fff" stroke-width="2"/>
          <text x={cx(i,cData.length,chartW)} y={chartH-22} text-anchor="middle" font-size="10" fill="#B3B3B3">{cLabels[i]}</text>
        {/each}
      </svg>

      <div class="metric-pills">
        <span class="mpill mpill-green">Curated <b>48</b></span>
        <span class="mpill mpill-gray">Published <b>31</b></span>
        <span class="mpill mpill-red">Rejected <b>7</b></span>
        <span class="mpill mpill-amber">Pending <b>10</b></span>
      </div>
    </div>

    <!-- Quality card -->
    <div class="db-card quality-card">
      <div class="card-title">AI Content Quality</div>
      <div class="card-sub" style="margin-bottom:20px">Live quality metrics</div>

      <div class="circ-wrap">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="54" fill="none" stroke="#E6E6E6" stroke-width="10"/>
          <circle cx="65" cy="65" r="54" fill="none" stroke="#1A8917" stroke-width="10"
                  stroke-linecap="round"
                  stroke-dasharray="{2*Math.PI*54*0.947} {2*Math.PI*54}"
                  transform="rotate(-90 65 65)"/>
          <text x="65" y="62" text-anchor="middle" font-size="22" font-weight="700" fill="#242424">94.7%</text>
          <text x="65" y="79" text-anchor="middle" font-size="10" fill="#B3B3B3">Quality Score</text>
        </svg>
      </div>

      <div class="q-bars">
        {#each [
          { label: 'Duplicate Detection', val: 98 },
          { label: 'SEO Optimisation',    val: 91 },
          { label: 'Readability Score',   val: 89 },
        ] as q}
          <div class="qbar-row">
            <span class="qbar-lbl">{q.label}</span>
            <div class="qbar-track">
              <div class="qbar-fill" style="width:{q.val}%"></div>
            </div>
            <span class="qbar-val">{q.val}%</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="db-card table-card">
    <div class="card-head">
      <div>
        <div class="card-title">Recent Published Articles</div>
        <div class="card-sub">Latest articles from the pipeline</div>
      </div>
      <button class="view-all-btn" on:click={() => currentAdminPage.set('articles')}>View All →</button>
    </div>
    <div class="table-wrap">
      {#if recentArticles.length === 0}
        <p style="padding:20px;font-size:13px;color:var(--text-muted)">No articles yet. Trigger the pipeline to publish articles.</p>
      {:else}
        <table class="blogs-table">
          <thead>
            <tr>
              <th>Title</th><th>Theme</th><th>Relevance</th><th>Innovation</th><th>Status</th><th>Published</th>
            </tr>
          </thead>
          <tbody>
            {#each recentArticles as a}
              <tr>
                <td class="td-title">{a.title}</td>
                <td><span class="cat-tag">{a.theme}</span></td>
                <td><span class="score-pill">{a.relevanceScore?.toFixed(1)}</span></td>
                <td><span class="score-pill">{a.innovationScore?.toFixed(1)}</span></td>
                <td><span class="badge {a.status === 'published' ? 'badge-complete' : 'badge-error'}">{a.status}</span></td>
                <td class="td-date">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('en-GB',{dateStyle:'medium'}) : '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>

  <!-- Bottom grid -->
  <div class="bottom-grid">

    <!-- Sources -->
    <div class="db-card">
      <div class="card-title">Content Source Monitoring</div>
      <div class="card-sub" style="margin-bottom:16px">Live sync status</div>
      <div class="sources-list">
        {#each sources as s}
          <div class="source-row">
            <span class="source-icon">{s.icon}</span>
            <div class="source-info">
              <div class="source-name">{s.name}</div>
              <div class="source-meta">Last sync: {s.sync} · {s.count} articles</div>
            </div>
            <span class="source-dot {s.status === 'ok' ? 'dot-ok' : 'dot-warn'}"></span>
          </div>
        {/each}
      </div>
    </div>

    <!-- AI Insights -->
    <div class="db-card">
      <div class="card-title">🤖 AI Insights Panel</div>
      <div class="card-sub" style="margin-bottom:14px">Trending topics & recommendations</div>
      <div class="trending-label">Trending Topics Detected</div>
      <div class="topics-wrap">
        {#each topics as t}
          <span class="topic-chip">{t}</span>
        {/each}
      </div>
      <div class="insights-list">
        {#each insights as ins}
          <div class="insight-row">
            <span class="ins-icon">{ins.icon}</span>
            <span class="ins-text">{ins.text}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Analytics -->
    <div class="db-card">
      <div class="card-title">Analytics</div>
      <div class="card-sub" style="margin-bottom:16px">Category distribution & engagement</div>

      <div class="donut-wrap">
        <svg width="110" height="110" viewBox="0 0 110 110">
          {#each donutSlices as sl}
            <path d={donutSlice(55,55,44,sl.start,sl.end)} fill={sl.color} opacity="0.88"/>
          {/each}
          <circle cx="55" cy="55" r="26" fill="var(--white)"/>
          <text x="55" y="60" text-anchor="middle" font-size="11" font-weight="700" fill="#242424">Topics</text>
        </svg>
        <div class="donut-legend">
          {#each donutData as d}
            <div class="legend-row">
              <span class="legend-dot" style="background:{d.color}"></span>
              <span class="legend-lbl">{d.label}</span>
              <span class="legend-val">{d.val}%</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="bar-label">Engagement Rate (this week)</div>
      <div class="bar-chart">
        {#each barData as v, i}
          <div class="bar-col">
            <div class="bar-fill" style="height:{v}%"></div>
            <div class="bar-x">{barLabels[i]}</div>
          </div>
        {/each}
      </div>
    </div>

  </div>
</div>

<style>
  .db-root {
    background: var(--off-white);
    min-height: 100vh;
  }

  /* Welcome */
  .welcome-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 28px; gap: 16px; flex-wrap: wrap;
  }
  .welcome-title {
    font-family: var(--serif); font-size: 26px; font-weight: 700;
    color: var(--text-black); letter-spacing: -0.4px; margin-bottom: 4px;
  }
  .welcome-sub { font-size: 14px; color: var(--text-muted); font-family: var(--sans); }
  .welcome-sub strong { color: var(--green); }

  .running-pill {
    display: flex; align-items: center; gap: 8px;
    background: var(--green-light); border: 1px solid var(--green);
    color: var(--green-dark); font-size: 13px; font-weight: 500;
    padding: 6px 14px; border-radius: 100px; font-family: var(--sans);
  }
  .pulse-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green); animation: pulse 1.4s infinite; display: inline-block;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* Stat cards */
  .stat-grid {
    display: grid; grid-template-columns: repeat(4,1fr);
    gap: 1px; margin-bottom: 24px;
    border: 1px solid var(--divider); border-radius: var(--radius); overflow: hidden;
    background: var(--divider);
  }
  .stat-card {
    background: var(--white); padding: 24px 20px;
    transition: background 0.15s;
  }
  .stat-card:hover { background: var(--off-white); }
  .stat-icon { font-size: 18px; margin-bottom: 10px; }
  .stat-val  { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--text-black); line-height: 1; margin-bottom: 4px; }
  .stat-name { font-size: 13px; color: var(--text-muted); margin-bottom: 6px; font-family: var(--sans); }
  .stat-delta { font-size: 12px; color: var(--green); font-family: var(--sans); }

  /* Cards */
  .db-card {
    background: var(--white);
    border: 1px solid var(--divider);
    border-radius: var(--radius);
    padding: 24px;
  }
  .card-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; gap: 12px; flex-wrap: wrap; }
  .card-title { font-size: 15px; font-weight: 600; color: var(--text-black); margin-bottom: 2px; font-family: var(--sans); }
  .card-sub   { font-size: 12px; color: var(--text-hint); font-family: var(--sans); }

  /* Main grid */
  .main-grid { display: grid; grid-template-columns: 1fr 290px; gap: 16px; margin-bottom: 16px; }

  /* Chart */
  .filter-tabs { display: flex; gap: 2px; background: var(--off-white); border-radius: var(--radius); padding: 3px; border: 1px solid var(--divider); }
  .ftab {
    padding: 4px 11px; border-radius: var(--radius); font-size: 12px; font-weight: 500;
    border: none; cursor: pointer; background: none; color: var(--text-muted);
    font-family: var(--sans); transition: all 0.15s;
  }
  .ftab-active { background: var(--white); color: var(--text-black); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .line-chart { width: 100%; height: 200px; display: block; }

  .metric-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
  .mpill { padding: 4px 11px; border-radius: 100px; font-size: 12px; font-weight: 500; font-family: var(--sans); }
  .mpill b { font-weight: 700; }
  .mpill-green { background: var(--green-light); color: var(--green-dark); }
  .mpill-gray  { background: var(--off-white);   color: var(--text-body);  border: 1px solid var(--divider); }
  .mpill-red   { background: var(--red-light);   color: var(--red); }
  .mpill-amber { background: var(--amber-light); color: var(--amber); }

  /* Quality */
  .quality-card { display: flex; flex-direction: column; }
  .circ-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
  .q-bars { display: flex; flex-direction: column; gap: 12px; }
  .qbar-row { display: grid; grid-template-columns: 1fr 1fr 36px; align-items: center; gap: 8px; }
  .qbar-lbl { font-size: 11px; color: var(--text-muted); font-family: var(--sans); white-space: nowrap; }
  .qbar-track { height: 4px; background: var(--divider); border-radius: 2px; overflow: hidden; }
  .qbar-fill  { height: 100%; background: var(--green); border-radius: 2px; }
  .qbar-val   { font-size: 12px; font-weight: 600; color: var(--green); text-align: right; font-family: var(--sans); }

  /* Table */
  .table-card { margin-bottom: 16px; }
  .view-all-btn {
    background: none; border: 1px solid var(--divider); color: var(--text-muted);
    font-size: 13px; font-weight: 500; padding: 5px 12px;
    border-radius: var(--radius); cursor: pointer; font-family: var(--sans);
    transition: all 0.15s; white-space: nowrap;
  }
  .view-all-btn:hover { border-color: var(--text-black); color: var(--text-black); }

  .table-wrap { overflow-x: auto; }
  .blogs-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: var(--sans); }
  .blogs-table th {
    text-align: left; padding: 8px 12px;
    font-size: 11px; font-weight: 600; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.4px;
    border-bottom: 1px solid var(--divider);
  }
  .blogs-table td { padding: 11px 12px; border-bottom: 1px solid var(--divider); color: var(--text-body); vertical-align: middle; }
  .blogs-table tr:last-child td { border-bottom: none; }
  .blogs-table tr:hover td { background: var(--off-white); }
  .td-title  { font-weight: 500; color: var(--text-black); max-width: 260px; }
  .td-source { color: var(--text-muted); }
  .td-date   { color: var(--text-hint); white-space: nowrap; }

  .score-pill {
    display: inline-block; padding: 2px 9px; border-radius: 100px;
    font-size: 12px; font-weight: 700;
    background: var(--green-light); color: var(--green-dark);
  }
  .cat-tag {
    display: inline-block; padding: 2px 8px; border-radius: var(--radius);
    font-size: 11px; font-weight: 500;
    background: var(--off-white); color: var(--text-body);
    border: 1px solid var(--divider);
  }

  .act-row { display: flex; gap: 4px; }
  .act-btn {
    width: 27px; height: 27px; border-radius: var(--radius);
    border: 1px solid var(--divider); background: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--text-muted); transition: all 0.12s;
  }
  .act-btn:hover { background: var(--off-white); border-color: var(--text-black); color: var(--text-black); }
  .act-del:hover { background: var(--red-light); border-color: var(--red); color: var(--red); }

  /* Bottom grid */
  .bottom-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* Sources */
  .sources-list { display: flex; flex-direction: column; gap: 10px; }
  .source-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: var(--radius);
    border: 1px solid var(--divider); background: var(--off-white);
    transition: border-color 0.15s;
  }
  .source-row:hover { border-color: var(--divider-strong); }
  .source-icon { font-size: 18px; }
  .source-info { flex: 1; }
  .source-name { font-size: 13px; font-weight: 500; color: var(--text-black); font-family: var(--sans); }
  .source-meta { font-size: 11px; color: var(--text-hint); margin-top: 2px; font-family: var(--sans); }
  .source-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot-ok   { background: var(--green); box-shadow: 0 0 0 3px var(--green-light); }
  .dot-warn { background: var(--amber); box-shadow: 0 0 0 3px var(--amber-light); }

  /* Insights */
  .trending-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-family: var(--sans); }
  .topics-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .topic-chip {
    padding: 3px 10px; border-radius: 100px;
    font-size: 11px; font-weight: 500;
    background: var(--off-white); color: var(--text-body);
    border: 1px solid var(--divider); font-family: var(--sans);
    transition: border-color 0.12s;
  }
  .topic-chip:hover { border-color: var(--text-black); }
  .insights-list { display: flex; flex-direction: column; gap: 8px; }
  .insight-row {
    display: flex; gap: 10px; align-items: flex-start;
    padding: 9px 11px; border-radius: var(--radius);
    background: var(--off-white); border: 1px solid var(--divider);
    font-size: 12px; color: var(--text-body); font-family: var(--sans);
  }
  .ins-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .ins-text { line-height: 1.5; }

  /* Analytics */
  .donut-wrap { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .donut-legend { display: flex; flex-direction: column; gap: 5px; }
  .legend-row { display: flex; align-items: center; gap: 6px; font-size: 11px; font-family: var(--sans); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .legend-lbl { flex: 1; color: var(--text-muted); }
  .legend-val { font-weight: 600; color: var(--text-black); }

  .bar-label { font-size: 11px; font-weight: 600; color: var(--text-hint); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px; font-family: var(--sans); }
  .bar-chart  { display: flex; align-items: flex-end; gap: 5px; height: 60px; }
  .bar-col    { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end; gap: 3px; }
  .bar-fill   { width: 100%; border-radius: 2px 2px 0 0; min-height: 4px; background: var(--green); opacity: 0.85; }
  .bar-x      { font-size: 9px; color: var(--text-hint); font-family: var(--sans); }

  /* Dark mode */
  :global(.dark) .db-root { background: var(--off-white); }
  :global(.dark) .db-card { background: var(--white); border-color: var(--divider); }
  :global(.dark) .stat-card { background: var(--white); }
  :global(.dark) .stat-card:hover { background: var(--off-white); }
  :global(.dark) .source-row { background: var(--off-white); }
  :global(.dark) .insight-row { background: var(--off-white); }
  :global(.dark) .topic-chip { background: var(--off-white); }
  :global(.dark) .ftab-active { background: var(--off-white); color: var(--text-black); }

  /* Responsive */
  @media (max-width: 1100px) {
    .main-grid   { grid-template-columns: 1fr; }
    .bottom-grid { grid-template-columns: 1fr 1fr; }
    .stat-grid   { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 640px) {
    .db-root     { padding: 20px 16px 40px; }
    .stat-grid   { grid-template-columns: 1fr 1fr; }
    .bottom-grid { grid-template-columns: 1fr; }
  }
</style>
