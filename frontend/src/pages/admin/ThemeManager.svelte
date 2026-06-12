<script>
  import { onMount } from 'svelte';
  import { adminThemes, themesLoading, fetchThemes, calibrateTheme, calibratingId, currentAdminPage } from '../../stores/store.js';

  let showAddModal  = false;
  let newThemeName  = '';
  let newThemeLang  = 'EN';
  let newKeywords   = [];
  let kwInput       = '';

  // New customisation state
  let activeThemeId  = 'minimal';
  let primaryColor   = '#1A8917';
  let secondaryColor = '#242424';
  let fontChoice     = 'Source Serif 4';
  let darkMode       = false;
  let layoutChoice   = 'centered';
  let customCSS      = '/* Add custom CSS here */\n.hero { padding: 80px 0; }\n';
  let previewDevice  = 'desktop';
  let saving         = false;
  let saved          = false;

  onMount(fetchThemes);

  function addKw() {
    const k = kwInput.trim();
    if (k && !newKeywords.includes(k)) newKeywords = [...newKeywords, k];
    kwInput = '';
  }
  function removeKw(k) { newKeywords = newKeywords.filter(x => x !== k); }
  function onKwKey(e) { if (e.key === 'Enter') { e.preventDefault(); addKw(); } }
  function closeModal() { showAddModal = false; newThemeName = ''; newThemeLang = 'EN'; newKeywords = []; kwInput = ''; }

  function saveTheme() {
    saving = true;
    setTimeout(() => { saving = false; saved = true; setTimeout(() => saved = false, 2000); }, 700);
  }

  const themeGallery = [
    { id:'minimal',   name:'Minimal Blog',   desc:'Clean, distraction-free reading experience.',       emoji:'📄' },
    { id:'magazine',  name:'Magazine Style', desc:'Bold layouts for high-volume content publishers.',   emoji:'📰' },
    { id:'tech',      name:'Modern Tech',    desc:'Dark accents for developer-focused content.',        emoji:'⚙️' },
    { id:'news',      name:'News Portal',    desc:'Multi-column grid for breaking news coverage.',      emoji:'🗞️' },
    { id:'ai',        name:'AI Magazine',    desc:'Futuristic design built for AI & research content.', emoji:'🤖' },
  ];

  const fonts = ['Source Serif 4','Inter','Georgia','Roboto','Merriweather','Playfair Display'];
  const layouts = ['centered','wide','sidebar-left','sidebar-right','magazine'];

  const deviceSizes = { desktop:'100%', tablet:'768px', mobile:'390px' };
</script>

<button class="back-btn" on:click={() => currentAdminPage.set('dashboard')}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
  Dashboard
</button>
<h1 class="page-title">Themes</h1>
<div style="border-top:1px solid var(--divider);margin-bottom:20px"></div>

<!-- ── Theme Gallery ── -->
<div class="section-label">Theme Gallery</div>
<div class="theme-gallery">
  {#each themeGallery as tg}
    <div class="tg-card" class:tg-active={activeThemeId===tg.id} on:click={()=>activeThemeId=tg.id} role="button" tabindex="0" on:keydown={e=>e.key==='Enter'&&(activeThemeId=tg.id)}>
      <div class="tg-preview">{tg.emoji}</div>
      <div class="tg-name">{tg.name}</div>
      <div class="tg-desc">{tg.desc}</div>
      <button
        class="btn btn-sm {activeThemeId===tg.id ? 'btn-primary' : 'btn-secondary'}"
        style="margin-top:10px;width:100%"
        on:click|stopPropagation={()=>activeThemeId=tg.id}
      >{activeThemeId===tg.id ? '✓ Active' : 'Activate'}</button>
    </div>
  {/each}
</div>

<!-- ── Customisation + Preview ── -->
<div class="custom-grid">

  <!-- Customisation panel -->
  <div class="custom-panel">
    <div class="section-label">Theme Customisation</div>

    <div class="custom-section">
      <div class="cs-row">
        <label class="cs-label" for="primary-color">Primary Colour</label>
        <div class="color-row">
          <input id="primary-color" type="color" bind:value={primaryColor} class="color-swatch"/>
          <span class="color-hex">{primaryColor}</span>
        </div>
      </div>
      <div class="cs-row">
        <label class="cs-label" for="secondary-color">Secondary Colour</label>
        <div class="color-row">
          <input id="secondary-color" type="color" bind:value={secondaryColor} class="color-swatch"/>
          <span class="color-hex">{secondaryColor}</span>
        </div>
      </div>
      <div class="cs-row">
        <label class="cs-label" for="font-choice">Font</label>
        <select id="font-choice" bind:value={fontChoice} style="width:auto">
          {#each fonts as f}<option value={f}>{f}</option>{/each}
        </select>
      </div>
      <div class="cs-row">
        <label class="cs-label" for="layout-choice">Layout</label>
        <select id="layout-choice" bind:value={layoutChoice} style="width:auto;text-transform:capitalize">
          {#each layouts as l}<option value={l} style="text-transform:capitalize">{l.replace('-',' ')}</option>{/each}
        </select>
      </div>
      <div class="cs-row">
        <div>
          <div class="cs-label">Dark Mode</div>
          <div class="cs-hint">Enable dark theme for blog visitors</div>
        </div>
        <button class="toggle" class:on={darkMode} on:click={()=>darkMode=!darkMode}></button>
      </div>
    </div>

    <!-- Custom CSS editor -->
    <div class="section-label" style="margin-top:20px">Custom CSS</div>
    <textarea class="css-editor" bind:value={customCSS} rows="8" spellcheck="false"></textarea>

    <button class="btn btn-primary" style="margin-top:16px;width:100%" on:click={saveTheme} disabled={saving}>
      {#if saved}✓ Saved!{:else if saving}Saving…{:else}Save & Publish{/if}
    </button>
  </div>

  <!-- Live preview -->
  <div class="preview-panel">
    <div class="section-label">Live Preview</div>
    <div class="device-tabs">
      {#each ['desktop','tablet','mobile'] as d}
        <button class="dtab" class:dtab-active={previewDevice===d} on:click={()=>previewDevice=d}>
          {d === 'desktop' ? '🖥' : d === 'tablet' ? '📱' : '📲'} {d}
        </button>
      {/each}
    </div>
    <div class="preview-frame-wrap">
      <div class="preview-frame" style="max-width:{deviceSizes[previewDevice]}; background:{darkMode?'#1a1a1a':'#fff'}">
        <!-- Mock blog preview -->
        <div class="pv-topbar" style="background:{primaryColor}">
          <span class="pv-logo" style="color:#fff;font-weight:700">BlogCurate</span>
          <div class="pv-nav">
            <span style="color:rgba(255,255,255,0.8);font-size:11px">Home</span>
            <span style="color:rgba(255,255,255,0.8);font-size:11px">AI</span>
            <span style="color:rgba(255,255,255,0.8);font-size:11px">Tech</span>
          </div>
        </div>
        <div class="pv-body" style="padding:16px;color:{darkMode?'#f0f0f0':'#242424'}">
          <div style="font-size:11px;color:{darkMode?'#9a9a9a':'#6b6b6b'};margin-bottom:6px;font-family:var(--sans)">AI · 3 min read</div>
          <div style="font-family:{fontChoice};font-size:15px;font-weight:700;line-height:1.3;margin-bottom:8px">
            GPT-5 Is Changing How Developers Work
          </div>
          <div style="font-size:12px;color:{darkMode?'#b3b3b3':'#6b6b6b'};line-height:1.6;font-family:var(--sans)">
            AI-assisted development has accelerated code review cycles by 40%, reshaping how engineering teams collaborate…
          </div>
          <div style="margin-top:10px;display:flex;gap:6px">
            <span style="background:{primaryColor};color:#fff;padding:2px 8px;border-radius:4px;font-size:10px">Read more</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ── Existing live themes list ── -->
<div style="margin-top:32px; padding-top:24px; border-top:1px solid var(--divider)">
  <div class="section-label">Configured Themes</div>

  {#if $themesLoading}
    <div class="skel-list">
      {#each Array(4) as _}
        <div class="skel-row">
          <div style="flex:1;display:flex;flex-direction:column;gap:8px">
            <div class="skeleton" style="width:180px;height:16px"></div>
            <div class="skeleton" style="width:280px;height:12px"></div>
          </div>
          <div class="skeleton" style="width:110px;height:34px;border-radius:100px"></div>
        </div>
      {/each}
    </div>
  {:else if $adminThemes.length === 0}
    <div class="empty-state">
      <h3>No themes configured.</h3>
      <p>Add a theme to start curating articles.</p>
    </div>
  {:else}
    <div class="theme-list">
      {#each $adminThemes as theme}
        {@const calibrating = $calibratingId === theme.id}
        <div class="theme-row">
          <div class="theme-body">
            <div class="theme-name">{theme.name}</div>
            <div class="theme-meta">
              Last calibrated:
              <span>{theme.lastCalibrated
                ? new Date(theme.lastCalibrated).toLocaleDateString('en-GB',{dateStyle:'long'})
                : 'Never'}</span>
              {#if theme.articles7d !== undefined}· Articles (7d): <span>{theme.articles7d}</span>{/if}
              {#if theme.lang}· <span class="badge badge-{theme.lang==='FR'?'fr':'en'}">{theme.lang}</span>{/if}
            </div>
            {#if theme.keywords?.length}
              <div class="theme-keywords">
                {#each theme.keywords.slice(0,5) as kw}<span class="badge badge-theme">{kw}</span>{/each}
                {#if theme.keywords.length > 5}<span class="badge badge-gray">+{theme.keywords.length-5} more</span>{/if}
              </div>
            {/if}
          </div>
          <button class="btn btn-secondary btn-sm" on:click={()=>calibrateTheme(theme.id)} disabled={calibrating||!!$calibratingId}>
            {calibrating ? 'Calibrating…' : 'Calibrate now'}
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<button class="add-theme-link" on:click={() => showAddModal = true}>+ Add a theme</button>

<!-- Add theme modal (unchanged) -->
{#if showAddModal}
  <div class="modal-overlay" role="button" tabindex="0" aria-label="Close modal"
    on:click={closeModal} on:keydown={e=>(e.key==='Enter'||e.key==='Escape')&&closeModal()}>
    <div class="modal" role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="modal-title"
      on:click|stopPropagation on:keydown|stopPropagation>
      <h2 class="modal-title" id="modal-title">Add new theme</h2>
      <div class="form-group">
        <label class="form-label" for="theme-name">Theme name</label>
        <input id="theme-name" bind:value={newThemeName} placeholder="e.g. tech-innovation" />
      </div>
      <div class="form-group">
        <label class="form-label" for="theme-lang">Language</label>
        <select id="theme-lang" bind:value={newThemeLang} style="width:auto">
          <option value="EN">EN</option>
          <option value="FR">FR</option>
          <option value="Both">Both</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="kw-input">Keywords</label>
        <div class="kw-input-row">
          <input id="kw-input" bind:value={kwInput} on:keydown={onKwKey} placeholder="Type keyword and press Enter" />
          <button class="btn btn-secondary btn-sm" on:click={addKw}>Add</button>
        </div>
        {#if newKeywords.length}
          <div class="kw-pills">
            {#each newKeywords as k}
              <span class="kw-pill">{k}<button on:click={()=>removeKw(k)}>×</button></span>
            {/each}
          </div>
        {/if}
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" on:click={closeModal}>Cancel</button>
        <button class="btn btn-primary" disabled={!newThemeName.trim()}>Add theme</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .back-btn { display:inline-flex;align-items:center;gap:5px;background:none;border:none;cursor:pointer;font-size:13px;color:var(--text-muted);font-family:var(--sans);padding:0;margin-bottom:12px;transition:color 0.15s; }
  .back-btn:hover { color: var(--text-black); }
  .page-title { font-family:var(--serif);font-size:28px;font-weight:700;color:var(--text-black);margin:0 0 24px 0; }
  .section-label { font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;font-family:var(--sans); }

  .theme-gallery { display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px; }
  /* Gallery */
  .tg-card {
    border:1px solid var(--divider);border-radius:var(--radius);padding:16px;
    cursor:pointer;background:var(--white);transition:all 0.15s;text-align:center;
  }
  .tg-card:hover { border-color:var(--text-black);box-shadow:0 2px 10px rgba(0,0,0,0.07); }
  .tg-active { border-color:var(--text-black);box-shadow:inset 0 0 0 1px var(--text-black); }
  .tg-preview { font-size:32px;margin-bottom:8px; }
  .tg-name { font-size:13px;font-weight:600;color:var(--text-black);font-family:var(--sans);margin-bottom:4px; }
  .tg-desc { font-size:11px;color:var(--text-muted);font-family:var(--sans);line-height:1.4; }

  /* Custom grid */
  .custom-grid { display:grid;grid-template-columns:320px 1fr;gap:20px;margin-bottom:20px; }

  /* Custom panel */
  .custom-panel { }
  .custom-section { border:1px solid var(--divider);border-radius:var(--radius);overflow:hidden;margin-bottom:0; }
  .cs-row {
    display:flex;align-items:center;justify-content:space-between;gap:16px;
    padding:12px 14px;border-bottom:1px solid var(--divider);
    background:var(--white);transition:background 0.15s;
  }
  .cs-row:last-child { border-bottom:none; }
  .cs-row:hover { background:var(--off-white); }
  .cs-label { font-size:13px;font-weight:500;color:var(--text-black);font-family:var(--sans); }
  .cs-hint  { font-size:11px;color:var(--text-muted);margin-top:2px;font-family:var(--sans); }
  .color-row { display:flex;align-items:center;gap:8px; }
  .color-swatch { width:32px;height:32px;border:1px solid var(--divider);border-radius:var(--radius);cursor:pointer;padding:2px; }
  .color-hex { font-size:12px;color:var(--text-muted);font-family:monospace; }

  /* Toggle */
  .toggle { width:40px;height:22px;border-radius:99px;background:var(--divider);cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0;border:none; }
  .toggle.on { background:var(--green); }
  .toggle::after { content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform 0.2s; }
  .toggle.on::after { transform:translateX(18px); }

  /* CSS editor */
  .css-editor {
    width:100%;font-family:monospace;font-size:12px;
    background:var(--off-white);border:1px solid var(--divider);
    border-radius:var(--radius);padding:12px;color:var(--text-body);
    resize:vertical;outline:none;line-height:1.6;
  }
  .css-editor:focus { border-color:var(--text-black); }

  /* Preview */
  .preview-panel { }
  .device-tabs { display:flex;gap:4px;margin-bottom:12px; }
  .dtab { padding:5px 12px;border-radius:var(--radius);font-size:12px;font-weight:500;border:1px solid var(--divider);background:var(--white);color:var(--text-muted);cursor:pointer;font-family:var(--sans);transition:all 0.15s;text-transform:capitalize; }
  .dtab:hover { border-color:var(--text-black);color:var(--text-black); }
  .dtab-active { background:var(--text-black);color:var(--white);border-color:var(--text-black); }
  .preview-frame-wrap { border:1px solid var(--divider);border-radius:var(--radius);overflow:hidden;background:var(--off-white);padding:12px;display:flex;justify-content:center; }
  .preview-frame { width:100%;border-radius:var(--radius);overflow:hidden;border:1px solid var(--divider);transition:max-width 0.3s; }
  .pv-topbar { display:flex;align-items:center;justify-content:space-between;padding:10px 14px; }
  .pv-logo { font-size:13px;font-family:var(--serif); }
  .pv-nav { display:flex;gap:12px; }
  .pv-body { }

  /* Existing theme list */
  .skel-list { display:flex;flex-direction:column; }
  .skel-row { display:flex;align-items:center;justify-content:space-between;gap:16px;padding:24px 0;border-bottom:1px solid var(--divider); }
  .theme-list { display:flex;flex-direction:column; }
  .theme-row { display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 16px;border-bottom:1px solid var(--divider);border-radius:8px;margin:0 -16px;transition:background 0.15s,box-shadow 0.15s; }
  .theme-row:hover { background:var(--off-white);box-shadow:inset 2px 0 0 var(--text-black); }
  .theme-body { flex:1;min-width:0; }
  .theme-name { font-size:16px;font-weight:500;color:var(--text-black);margin-bottom:6px; }
  .theme-meta { font-size:13px;color:var(--text-muted);margin-bottom:10px; }
  .theme-meta span { color:var(--text-body); }
  .theme-keywords { display:flex;flex-wrap:wrap;gap:6px; }
  .add-theme-link { background:none;border:none;cursor:pointer;font-size:14px;color:var(--text-muted);font-family:var(--sans);padding:20px 0;display:block;transition:color 0.15s; }
  .add-theme-link:hover { color:var(--text-black); }

  /* Modal */
  .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:500;padding:24px; }
  .modal { background:var(--white);border:1px solid var(--divider);border-radius:var(--radius);padding:32px;width:100%;max-width:480px; }
  .modal-title { font-size:18px;font-weight:500;color:var(--text-black);margin-bottom:24px; }
  .form-group { margin-bottom:16px; }
  .form-label { display:block;font-size:13px;font-weight:500;color:var(--text-muted);margin-bottom:6px; }
  .kw-input-row { display:flex;gap:8px; }
  .kw-input-row input { flex:1; }
  .kw-pills { display:flex;flex-wrap:wrap;gap:6px;margin-top:10px; }
  .kw-pill { display:inline-flex;align-items:center;gap:5px;font-size:13px;padding:4px 10px;border-radius:100px;background:#F2F2F2;color:var(--text-body); }
  .kw-pill button { background:none;border:none;cursor:pointer;font-size:14px;color:var(--text-muted);padding:0;line-height:1; }
  .kw-pill button:hover { color:var(--red); }
  .modal-actions { display:flex;gap:10px;justify-content:flex-end;margin-top:24px; }

  @media (max-width:900px) {
    .theme-gallery { grid-template-columns:repeat(3,1fr); }
    .custom-grid   { grid-template-columns:1fr; }
  }
  @media (max-width:600px) {
    .theme-gallery { grid-template-columns:repeat(2,1fr); }
  }
</style>
