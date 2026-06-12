<script>
  import { weeklyActivity, pipelineStats, interestedBlogs } from '../stores/store.js';

  $: maxVal = Math.max(...$weeklyActivity.map(d => d.count), 1);
  const BAR_H = 80;
  // @ts-ignore
  function barH(v) { return Math.max(4, Math.round((v / maxVal) * BAR_H)); }
  $: hasActivity = $weeklyActivity.some(d => d.count > 0);

  $: topTopics = (() => {
    /** @type {Record<string, number>} */
    const counts = {};
    $interestedBlogs.forEach(b => {
      if (!b.category) return;
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  })();
  $: maxTopic = topTopics.length ? topTopics[0][1] : 1;
</script>

<div class="chart-inner">
  <div class="chart-head">
    <span class="chart-heading">Weekly Activity</span>
    {#if hasActivity}
      <span class="chart-summary">{$pipelineStats.total} total · {$pipelineStats.published} published · {$pipelineStats.scheduled} scheduled</span>
    {/if}
  </div>

  {#if !hasActivity}
    <div class="empty-chart">
      <p class="empty-title">No activity yet</p>
      <p class="empty-sub">Start curating blogs to see your weekly progress.</p>
    </div>
  {:else}
    <div class="bar-chart">
      {#each $weeklyActivity as d}
        <div class="bar-group">
          <div class="bar-wrap">
            <div class="bar" style="height:{barH(d.count)}px" title="{d.count} blog{d.count !== 1 ? 's' : ''}">
              {#if d.count > 0}<span class="bar-val">{d.count}</span>{/if}
            </div>
          </div>
          <div class="bar-label">{d.day}</div>
        </div>
      {/each}
    </div>
  {/if}

  {#if topTopics.length > 0}
    <div class="divider"></div>
    <div class="chart-head" style="margin-top:20px">
      <span class="chart-heading">Top Interest Categories</span>
      <span class="chart-summary">{$interestedBlogs.length} total interested</span>
    </div>
    <div class="topic-bars">
      {#each topTopics as [cat, count]}
        <div class="topic-row">
          <span class="topic-label">{cat}</span>
          <div class="topic-track">
            <div class="topic-fill" style="width:{Math.round((count / maxTopic) * 100)}%"></div>
          </div>
          <span class="topic-count">{count}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .chart-inner { width: 100%; }
  .chart-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .chart-heading {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted);
  }
  .chart-summary { font-size: 12px; color: var(--text-muted); }

  .empty-chart { padding: 24px 0; text-align: center; }
  .empty-title { font-size: 14px; font-weight: 500; color: var(--text-black); margin-bottom: 4px; }
  .empty-sub   { font-size: 13px; color: var(--text-muted); }

  .bar-chart {
    display: flex; align-items: flex-end; gap: 8px;
    height: 100px; padding-bottom: 24px;
  }
  .bar-group { display: flex; flex-direction: column; align-items: center; flex: 1; }
  .bar-wrap   { display: flex; align-items: flex-end; height: 80px; }
  .bar {
    width: 100%; min-height: 4px; border-radius: 3px 3px 0 0;
    background: var(--text-black); opacity: 0.15;
    position: relative; transition: opacity 0.15s;
  }
  .bar:hover { opacity: 0.35; }
  .bar-val {
    position: absolute; top: -18px; left: 50%; transform: translateX(-50%);
    font-size: 11px; color: var(--text-muted); white-space: nowrap;
  }
  .bar-label { font-size: 11px; color: var(--text-muted); margin-top: 6px; }

  .divider { border: none; border-top: 1px solid var(--divider); margin: 4px 0; }

  /* Topic bars */
  .topic-bars { display: flex; flex-direction: column; gap: 10px; }
  .topic-row  { display: flex; align-items: center; gap: 10px; }
  .topic-label { font-size: 12px; color: var(--text-body); font-weight: 500; width: 110px; flex-shrink: 0; }
  .topic-track { flex: 1; height: 5px; background: var(--divider); border-radius: 99px; overflow: hidden; }
  .topic-fill  { height: 100%; background: var(--green); border-radius: 99px; transition: width 0.5s ease; }
  .topic-count { font-size: 11px; color: var(--text-muted); font-weight: 600; width: 16px; text-align: right; flex-shrink: 0; }
</style>
