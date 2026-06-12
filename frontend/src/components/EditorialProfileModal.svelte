<script>
  import { createEventDispatcher } from 'svelte';

  /**
   * @typedef {{ themeName: string, generatedAt: string, articlesAnalyzed: number, lastCalibrationQuality: number, acceptanceRate: number, editorialSpirit: string, dominantKeywords: Array<{keyword: string, frequency: number, sectors: string[]}>, coveredSectors: Array<{sector: string, articleCount: number, growthTrend: string}>, topSources: string[], topAuthors: string[], rejectionReasons: Record<string, number> }} Profile
   */

  /** @type {Profile | null} */
  export let profile = null;
  export let isOpen = false;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  /** @param {number} quality */
  function getQualityColor(quality) {
    if (quality >= 0.85) return '#10b981';
    if (quality >= 0.75) return '#f59e0b';
    return '#ef4444';
  }

  /** @param {number} quality */
  function getQualityLabel(quality) {
    if (quality >= 0.85) return 'Excellent';
    if (quality >= 0.75) return 'Good';
    return 'Fair';
  }
</script>

{#if isOpen && profile}
  <div
    class="modal-overlay"
    role="presentation"
    on:click={closeModal}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
  ></div>

  <div class="modal">
    <div class="modal-header">
      <div>
        <h2 class="modal-title">{profile.themeName}</h2>
        <p class="modal-subtitle">Editorial Profile</p>
      </div>
      <button class="btn-close" on:click={closeModal} aria-label="Close">✕</button>
    </div>

    <div class="modal-content">
      <!-- Generated Date & Metrics -->
      <div class="profile-meta">
        <div class="meta-item">
          <span class="meta-label">Generated</span>
          <span class="meta-value">
            {new Date(profile.generatedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}
          </span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Articles Analyzed</span>
          <span class="meta-value">{profile.articlesAnalyzed}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Calibration Quality</span>
          <div class="quality-badge" style="--color: {getQualityColor(profile.lastCalibrationQuality)}">
            {getQualityLabel(profile.lastCalibrationQuality)}
            <span class="quality-percent">({(profile.lastCalibrationQuality * 100).toFixed(0)}%)</span>
          </div>
        </div>
        <div class="meta-item">
          <span class="meta-label">Acceptance Rate</span>
          <span class="meta-value">{(profile.acceptanceRate * 100).toFixed(0)}%</span>
        </div>
      </div>

      <!-- Editorial Spirit -->
      <div class="section">
        <h3 class="section-title">Editorial Spirit</h3>
        <p class="editorial-spirit">{profile.editorialSpirit}</p>
        <p class="word-count">{profile.editorialSpirit.split(' ').length} words</p>
      </div>

      <!-- Dominant Keywords -->
      <div class="section">
        <h3 class="section-title">Dominant Keywords</h3>
        <div class="keywords-grid">
          {#each profile.dominantKeywords as { keyword, frequency, sectors } (keyword)}
            <div class="keyword-card">
              <div class="keyword-name">{keyword}</div>
              <div class="keyword-meta">
                <span class="frequency">Frequency: {frequency}</span>
              </div>
              <div class="keyword-sectors">
                {#each sectors as sector}
                  <span class="sector-badge">{sector}</span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Covered Sectors -->
      <div class="section">
        <h3 class="section-title">Covered Sectors</h3>
        <div class="sectors-list">
          {#each profile.coveredSectors as { sector, articleCount, growthTrend } (sector)}
            <div class="sector-row">
              <div class="sector-info">
                <div class="sector-name">{sector}</div>
                <div class="sector-meta">
                  {articleCount} articles
                  <span class="growth-badge growth-{growthTrend}">
                    {growthTrend === 'rising' ? '↑' : '→'} {growthTrend}
                  </span>
                </div>
              </div>
              <div class="sector-bar">
                <div class="bar-fill" style="width: {Math.min((articleCount / 25) * 100, 100)}%"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Top Sources -->
      <div class="section">
        <h3 class="section-title">Top Sources</h3>
        <div class="sources-list">
          {#each profile.topSources as source, i}
            <div class="source-item">
              <span class="source-rank">{i + 1}</span>
              <span class="source-name">{source}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Top Authors -->
      <div class="section">
        <h3 class="section-title">Top Authors</h3>
        <div class="authors-list">
          {#each profile.topAuthors as author, i}
            <div class="author-item">
              <span class="author-rank">{i + 1}</span>
              <span class="author-name">{author}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Rejection Reasons -->
      {#if Object.keys(profile.rejectionReasons).length > 0}
        <div class="section">
          <h3 class="section-title">Common Rejection Reasons</h3>
          <div class="rejection-reasons">
            {#each Object.entries(profile.rejectionReasons) as [reason, rate]}
              <div class="rejection-row">
                <div class="rejection-reason">{reason}</div>
                <div class="rejection-rate">
                  <span class="rate-value">{(rate * 100).toFixed(0)}%</span>
                  <div class="rate-bar">
                    <div class="rate-fill" style="width: {Math.min(rate * 100, 100)}%"></div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary" on:click={closeModal}>Close</button>
      <button class="btn btn-primary" on:click={() => dispatch('regenerate')}>Regenerate Profile</button>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-primary);
    border-radius: 12px;
    border: 1px solid var(--divider);
    width: 90%;
    max-width: 900px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    z-index: 1000;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
    color: var(--text-primary);
  }

  @keyframes slideUp {
    from {
      transform: translate(-50%, -45%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid var(--divider);
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .modal-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .modal-subtitle {
    margin: 4px 0 0 0;
    font-size: 12px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background-color 0.2s, color 0.2s;
  }

  .btn-close:hover {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
  }

  .modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .profile-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
    color: var(--text-primary);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .meta-label {
    font-size: 11px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .meta-value {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
  }

  .quality-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color);
    font-weight: 600;
    font-size: 13px;
  }

  .quality-percent {
    font-weight: 400;
    font-size: 12px;
    opacity: 0.7;
  }

  .section {
    margin-bottom: 32px;
    color: var(--text-primary);
  }

  .section-title {
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .editorial-spirit {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-primary);
    margin: 0 0 8px 0;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
  }

  .word-count {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 0;
    text-align: right;
  }

  .keywords-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .keyword-card {
    padding: 12px;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--divider);
    color: var(--text-primary);
  }

  .keyword-name {
    font-weight: 600;
    font-size: 13px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .keyword-meta {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .frequency {
    font-weight: 500;
  }

  .keyword-sectors {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .sector-badge {
    display: inline-block;
    padding: 2px 8px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .sectors-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--text-primary);
  }

  .sector-row {
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--text-primary);
  }

  .sector-info {
    flex: 1;
    min-width: 0;
    color: var(--text-primary);
  }

  .sector-name {
    font-weight: 600;
    font-size: 13px;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .sector-meta {
    font-size: 12px;
    color: var(--text-secondary);
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .growth-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
  }

  .growth-rising {
    background: #dcfce7;
    color: #166534;
  }

  .growth-stable {
    background: #fef3c7;
    color: #92400e;
  }

  .sector-bar {
    width: 120px;
    height: 20px;
    background: var(--bg-secondary);
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: #3b82f6;
    transition: width 0.3s ease-out;
  }

  .sources-list,
  .authors-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
  }

  .source-item,
  .author-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: var(--bg-secondary);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-primary);
  }

  .source-rank,
  .author-rank {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 11px;
    flex-shrink: 0;
  }

  .source-name,
  .author-name {
    font-weight: 500;
  }

  .rejection-reasons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    color: var(--text-primary);
  }

  .rejection-row {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-primary);
  }

  .rejection-reason {
    flex: 0 0 220px;
    font-size: 13px;
    color: var(--text-primary);
    font-weight: 500;
  }

  .rejection-rate {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rate-value {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 600;
    min-width: 35px;
    text-align: right;
  }

  .rate-bar {
    flex: 1;
    min-width: 80px;
    height: 16px;
    background: var(--bg-secondary);
    border-radius: 2px;
    overflow: hidden;
  }

  .rate-fill {
    height: 100%;
    background: #ef4444;
    transition: width 0.3s ease-out;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--divider);
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background-color 0.2s, color 0.2s;
  }

  .btn-secondary {
    background: var(--bg-primary);
    color: var(--text-primary);
    border-color: var(--divider);
  }

  .btn-secondary:hover {
    background: var(--bg-secondary);
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  @media (max-width: 600px) {
    .modal {
      width: 95%;
      max-height: 90vh;
    }

    .profile-meta {
      grid-template-columns: repeat(2, 1fr);
    }

    .keywords-grid {
      grid-template-columns: 1fr;
    }

    .sources-list,
    .authors-list {
      grid-template-columns: 1fr;
    }
  }
</style>
