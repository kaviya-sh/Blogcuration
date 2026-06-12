<script>
  import { user, logout, dark, toggleTheme, publishTime, timezone, autoPublish, bilingual, emailNotif, pipelineFlag, setPipelineFlag, currentPage, updateUser } from '../stores/store.js';
  import OnboardingModal from '../components/OnboardingModal.svelte';

  let saved = false;
  let saveError = '';
  let showTour = false;

  let displayName = $user?.name ?? '';
  let displayEmail = $user?.email ?? '';

  $: displayName = $user?.name ?? '';
  $: displayEmail = $user?.email ?? '';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Preferred categories — persisted per user via store
  const ALL_CATEGORIES = ['AI', 'Engineering', 'Startups', 'Healthcare', 'Sustainability', 'Security', 'Web Dev', 'Future of Work'];

  function loadPref(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
  }
  function savePref(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  let prefCategories = [];
  let pubFrequency   = 'daily';

  $: if ($user?.email) {
    prefCategories = loadPref(`bca_${$user.email}_prefcats`, []);
    pubFrequency   = loadPref(`bca_${$user.email}_pubfreq`, 'daily');
  }

  function toggleCat(cat) {
    prefCategories = prefCategories.includes(cat)
      ? prefCategories.filter(c => c !== cat)
      : [...prefCategories, cat];
  }

  function replayTour() { showTour = true; }

  function save() {
    saveError = '';
    if (!displayName.trim()) { saveError = 'Display name cannot be empty.'; return; }
    if (!EMAIL_RE.test(displayEmail.trim())) { saveError = 'Please enter a valid email address.'; return; }
    const newEmail = displayEmail.trim();
    updateUser(displayName.trim(), newEmail);
    savePref(`bca_${newEmail}_prefcats`, prefCategories);
    savePref(`bca_${newEmail}_pubfreq`, pubFrequency);
    saved = true;
    setTimeout(() => saved = false, 2000);
  }
</script>

<div class="settings-wrap">
  <!-- Page header -->
  <div class="settings-header">
    <div>
      <h1 class="settings-title">Settings</h1>
      <p class="settings-sub">Manage your account, preferences, and pipeline configuration.</p>
    </div>
    <button class="save-btn" on:click={save}>
      {#if saved}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        Saved
      {:else}
        Save changes
      {/if}
    </button>
  </div>
  {#if saveError}
    <div class="save-error">{saveError}</div>
  {/if}

  <div class="settings-layout">
    <!-- LEFT COLUMN -->
    <div class="settings-col">

      <!-- Profile -->
      <section class="settings-card">
        <h2 class="card-heading">Profile</h2>
        <div class="profile-row">
          <div class="profile-avatar">{($user?.name ?? 'U')[0].toUpperCase()}</div>
          <div class="profile-info">
            <div class="profile-name">{$user?.name}</div>
            <div class="profile-email">{$user?.email}</div>
            {#if $user?.isNew}
              <span class="status-pill new">New Account</span>
            {/if}
          </div>
        </div>
        <div class="field-group">
          <label class="field-label" for="display-name">Display Name</label>
          <input id="display-name" bind:value={displayName} placeholder="Your name" />
        </div>
        <div class="field-group">
          <label class="field-label" for="display-email">Email</label>
          <input id="display-email" type="email" bind:value={displayEmail} placeholder="you@example.com" />
        </div>
      </section>

      <!-- Publish Schedule -->
      <section class="settings-card">
        <h2 class="card-heading">Publish Schedule</h2>
        <div class="field-group">
          <label class="field-label" for="publish-time">Default Publish Time</label>
          <input id="publish-time" type="time" bind:value={$publishTime} />
        </div>
        <div class="field-group">
          <label class="field-label" for="publish-tz">Timezone</label>
          <select id="publish-tz" bind:value={$timezone}>
            <option value="Asia/Kolkata">IST — Asia/Kolkata</option>
            <option value="Europe/Paris">CET — Europe/Paris</option>
            <option value="America/New_York">EST — America/New_York</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label" for="pub-freq">Publishing Frequency</label>
          <select id="pub-freq" bind:value={pubFrequency}>
            <option value="daily">Daily — every day at publish time</option>
            <option value="weekdays">Weekdays only — Mon–Fri</option>
            <option value="weekly">Weekly — once per week</option>
            <option value="manual">Manual — only when I schedule</option>
          </select>
        </div>
        <div class="toggle-row">
          <div class="toggle-info">
            <div class="toggle-label">Auto Publish</div>
            <div class="toggle-desc">Publish without manual confirmation</div>
          </div>
          <button class="toggle" class:on={$autoPublish} aria-label="Toggle auto publish" on:click={() => autoPublish.update(v => !v)}></button>
        </div>
      </section>

      <!-- Preferred Categories -->
      <section class="settings-card">
        <h2 class="card-heading">Preferred Categories</h2>
        <p class="card-desc">Select topics you want to prioritise in your feed and AI generation.</p>
        <div class="cat-chips">
          {#each ALL_CATEGORIES as cat}
            <button
              class="cat-chip"
              class:selected={prefCategories.includes(cat)}
              on:click={() => toggleCat(cat)}
            >
              {#if prefCategories.includes(cat)}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
              {/if}
              {cat}
            </button>
          {/each}
        </div>
        {#if prefCategories.length > 0}
          <p class="cat-hint">{prefCategories.length} categor{prefCategories.length === 1 ? 'y' : 'ies'} selected</p>
        {/if}
      </section>

    </div>

    <!-- RIGHT COLUMN -->
    <div class="settings-col">

      <!-- AI Configuration -->
      <section class="settings-card">
        <h2 class="card-heading">AI Configuration</h2>
        <div class="toggle-row">
          <div class="toggle-info">
            <div class="toggle-label">AI Model</div>
            <div class="toggle-desc">Mistral 7B via Ollama (local, free)</div>
          </div>
          <span class="status-pill active">Active</span>
        </div>
        <div class="toggle-row">
          <div class="toggle-info">
            <div class="toggle-label">Bilingual Mode</div>
            <div class="toggle-desc">Generate content in French &amp; English</div>
          </div>
          <button class="toggle" class:on={$bilingual} aria-label="Toggle bilingual mode" on:click={() => bilingual.update(v => !v)}></button>
        </div>
        <div class="field-group" style="margin-top:16px">
          <label class="field-label" for="ollama-endpoint">Ollama Endpoint</label>
          <input id="ollama-endpoint" value="http://localhost:11434" />
        </div>
      </section>

      <!-- Notifications & Appearance -->
      <section class="settings-card">
        <h2 class="card-heading">Notifications &amp; Appearance</h2>
        <div class="toggle-row">
          <div class="toggle-info">
            <div class="toggle-label">Email Notifications</div>
            <div class="toggle-desc">Get notified when blogs are published</div>
          </div>
          <button class="toggle" class:on={$emailNotif} aria-label="Toggle email notifications" on:click={() => emailNotif.update(v => !v)}></button>
        </div>
        <div class="toggle-row">
          <div class="toggle-info">
            <div class="toggle-label">Dark Mode</div>
            <div class="toggle-desc">Toggle dark / light theme</div>
          </div>
          <button class="toggle" class:on={$dark} aria-label="Toggle dark mode" on:click={toggleTheme}></button>
        </div>
      </section>

      <!-- Account actions -->
      <section class="settings-card">
        <h2 class="card-heading">Account</h2>
        <div class="account-actions">
          <button class="account-btn" on:click={replayTour}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            Replay App Tour
          </button>
          <button class="account-btn danger" on:click={logout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Sign Out
          </button>
        </div>
      </section>

    </div>
  </div>

  <!-- Pipeline Control — full width -->
  <section class="settings-card pipeline-card">
    <h2 class="card-heading">Pipeline Control</h2>
    <div class="pipeline-top">
      <div class="pipeline-status-info">
        <div class="toggle-label">Current Status</div>
        <div class="toggle-desc">Controls whether the nightly pipeline runs, pauses silently, or halts with an admin alert.</div>
      </div>
      <div class="flag-btns">
        <button class="flag-btn" class:flag-on={$pipelineFlag==='ON'} on:click={() => setPipelineFlag('ON')}>▶ ON</button>
        <button class="flag-btn" class:flag-pause={$pipelineFlag==='PAUSE'} on:click={() => setPipelineFlag('PAUSE')}>⏸ PAUSE</button>
        <button class="flag-btn" class:flag-off={$pipelineFlag==='OFF'} on:click={() => setPipelineFlag('OFF')}>⏹ OFF</button>
      </div>
    </div>
    <div class="pipeline-states">
      <div class="pipeline-state">
        <div class="ps-label on">▶ ON</div>
        <div class="ps-desc">Normal nightly operation at {$publishTime} {$timezone}</div>
      </div>
      <div class="pipeline-state">
        <div class="ps-label pause">⏸ PAUSE</div>
        <div class="ps-desc">Pipeline skips execution silently — no alerts sent</div>
      </div>
      <div class="pipeline-state">
        <div class="ps-label off">⏹ OFF</div>
        <div class="ps-desc">Pipeline halts and sends immediate alert to administrator</div>
      </div>
    </div>
  </section>
</div>

{#if showTour}
  <OnboardingModal on:close={() => showTour = false} />
{/if}

<style>
  .settings-wrap {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 32px 80px;
  }

  /* Header */
  .settings-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; padding-bottom: 28px; margin-bottom: 32px;
    border-bottom: 1px solid var(--divider);
  }
  .settings-title {
    font-family: var(--serif); font-size: 28px; font-weight: 700;
    color: var(--text-black); letter-spacing: -0.3px; margin-bottom: 6px;
  }
  .settings-sub { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

  .save-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--text-black); color: var(--white); border: none; cursor: pointer;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 20px; border-radius: 100px; white-space: nowrap;
    transition: background 0.15s; flex-shrink: 0;
  }
  .save-btn:hover { background: var(--divider-strong); }

  .save-error {
    font-size: 13px; color: var(--red);
    margin-bottom: 20px; margin-top: -12px;
  }

  /* Two-column layout */
  .settings-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  .settings-col { display: flex; flex-direction: column; gap: 20px; }

  /* Cards */
  .settings-card {
    background: var(--white);
    border: 1px solid var(--divider);
    border-radius: 8px;
    padding: 24px;
  }
  .card-heading {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted);
    margin-bottom: 20px;
  }

  /* Profile block */
  .profile-row {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 20px; padding-bottom: 20px;
    border-bottom: 1px solid var(--divider);
  }
  .profile-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--text-black); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 600; flex-shrink: 0;
  }
  .profile-name { font-size: 15px; font-weight: 600; color: var(--text-black); }
  .profile-email { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

  /* Card description */
  .card-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; margin-top: -8px; line-height: 1.5; }

  /* Category chips */
  .cat-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
  .cat-chip {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px; border-radius: 100px;
    font-size: 13px; font-weight: 500; font-family: var(--sans);
    border: 1px solid var(--divider); background: var(--white);
    color: var(--text-muted); cursor: pointer; transition: all 0.15s;
  }
  .cat-chip:hover { border-color: var(--divider-strong); color: var(--text-black); }
  .cat-chip.selected { background: var(--text-black); color: #fff; border-color: var(--text-black); }
  .cat-hint { font-size: 12px; color: var(--green-dark); font-weight: 500; }

  /* Status pills */
  .status-pill {
    display: inline-block; font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 100px; margin-top: 6px;
    letter-spacing: 0.02em;
  }
  .status-pill.new    { background: var(--off-white); color: var(--text-muted); border: 1px solid var(--divider-strong); }
  .status-pill.active { background: var(--green-light); color: var(--green-dark); }

  /* Form fields */
  .field-group { margin-bottom: 14px; }
  .field-group:last-child { margin-bottom: 0; }
  .field-label {
    display: block; font-size: 12px; font-weight: 500;
    color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.01em;
  }

  /* Toggle rows */
  .toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--divider);
  }
  .toggle-row:last-of-type { border-bottom: none; padding-bottom: 0; }
  .toggle-row:first-of-type { padding-top: 0; }
  .toggle-info { flex: 1; }
  .toggle-label { font-size: 14px; font-weight: 500; color: var(--text-black); margin-bottom: 2px; }
  .toggle-desc  { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

  /* Account actions */
  .account-actions { display: flex; flex-direction: column; gap: 8px; }
  .account-btn {
    display: flex; align-items: center; gap: 9px;
    background: var(--off-white); border: 1px solid var(--divider);
    color: var(--text-body); font-size: 14px; font-family: var(--sans);
    padding: 10px 16px; border-radius: 8px; cursor: pointer;
    transition: background 0.15s, border-color 0.15s; text-align: left;
    width: 100%;
  }
  .account-btn:hover { background: var(--divider); border-color: var(--divider-strong); }
  .account-btn.danger { color: var(--red); }
  .account-btn.danger:hover { background: var(--red-light); border-color: var(--red); }
  .account-btn svg { color: var(--text-muted); flex-shrink: 0; }
  .account-btn.danger svg { color: var(--red); }

  /* Pipeline card */
  .pipeline-card { margin-top: 0; }
  .pipeline-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .pipeline-status-info { flex: 1; }
  .flag-btns { display: flex; gap: 6px; flex-shrink: 0; }
  .flag-btn {
    padding: 7px 16px; border-radius: 100px; font-size: 13px; font-weight: 500;
    cursor: pointer; border: 1px solid var(--divider); background: var(--off-white);
    color: var(--text-muted); font-family: var(--sans); transition: all 0.15s;
  }
  .flag-btn:hover { border-color: var(--divider-strong); color: var(--text-black); }
  .flag-btn.flag-on    { background: var(--green-light);  color: var(--green-dark); border-color: var(--green); }
  .flag-btn.flag-pause { background: var(--amber-light);  color: var(--amber);      border-color: var(--amber); }
  .flag-btn.flag-off   { background: var(--red-light);    color: var(--red);        border-color: var(--red); }

  .pipeline-states {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 12px; padding-top: 16px; border-top: 1px solid var(--divider);
  }
  .pipeline-state {
    padding: 14px; background: var(--off-white);
    border-radius: 6px; border: 1px solid var(--divider);
  }
  .ps-label {
    font-size: 12px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.02em;
  }
  .ps-label.on    { color: var(--green); }
  .ps-label.pause { color: var(--amber); }
  .ps-label.off   { color: var(--red); }
  .ps-desc { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

  @media (max-width: 768px) {
    .settings-wrap { padding: 24px 16px 60px; }
    .settings-layout { grid-template-columns: 1fr; }
    .settings-header { flex-direction: column; }
    .pipeline-states { grid-template-columns: 1fr; }
    .pipeline-top { flex-direction: column; }
  }
</style>
