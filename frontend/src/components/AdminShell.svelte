<script>
  import { currentAdminPage, isLoggedIn, adminLogout, appMode, pipelineStatus, setFlag, triggerRun, loginError, dark, toggleTheme } from '../stores/store.js';
  import AdminLogin      from '../pages/admin/AdminLogin.svelte';
  import AdminDashboard  from '../pages/admin/AdminDashboard.svelte';
  import RunHistory      from '../pages/admin/RunHistory.svelte';
  import ArticlesManager from '../pages/admin/ArticlesManager.svelte';
  import ThemeManager    from '../pages/admin/ThemeManager.svelte';
  import EditorialProfilesManager from '../pages/admin/EditorialProfilesManager.svelte';
  import AdminSettings   from '../pages/admin/AdminSettings.svelte';
  import { onMount } from 'svelte';

  let expanded = true;
  let triggering = false;

  async function handleTrigger() {
    triggering = true;
    await triggerRun();
    triggering = false;
  }

  onMount(() => {
    loginError.set('');
    if (!$isLoggedIn) currentAdminPage.set('login');
  });

  const nav = [
    { page: 'dashboard', label: 'Dashboard',
      icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
    { page: 'runs',      label: 'Run History',
      icon: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' },
    { page: 'articles',  label: 'Articles',
      icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
    { page: 'themes',    label: 'Themes',
      icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { page: 'profiles',  label: 'Profiles',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { page: 'settings',  label: 'Settings',
      icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
  ];

  // @ts-ignore
  $: flag = $pipelineStatus?.flag ?? 'ON';
  $: isRunning = $pipelineStatus?.status === 'RUNNING';
  $: dotClass = flag === 'ON' ? 'dot-on' : flag === 'PAUSE' ? 'dot-pause' : 'dot-off';
</script>

{#if !$isLoggedIn}
  <AdminLogin />
{:else}
<div class="shell" class:expanded class:dark={$dark}>

  <!-- ── LEFT SIDEBAR ── -->
  <aside class="sidebar">
    <nav class="sb-nav">
      {#each nav as n, i}
        <button
          class="sb-item"
          class:active={$currentAdminPage === n.page}
          on:click={() => currentAdminPage.set(n.page)}
          title={expanded ? '' : n.label}
        >
          <span class="sb-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d={n.icon}/>
            </svg>
          </span>
          <span class="sb-label">{n.label}</span>
        </button>
      {/each}
    </nav>

  </aside>

  <!-- ── TOP BAR ── -->
  <header class="topbar">
    <div class="topbar-left">
      <button class="toggle-btn" on:click={() => expanded = !expanded} aria-label="Toggle sidebar">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <button class="logo" on:click={() => currentAdminPage.set('dashboard')}>
        <span class="pipeline-dot {dotClass}"></span>
        BlogCurate <span class="admin-badge">Admin</span>
      </button>
    </div>

    <div class="topbar-right">
      <!-- Pipeline toggle -->
      <div class="pipe-toggle">
        {#each ['ON','PAUSE','OFF'] as f}
          <button
            class="pt-btn pt-{f.toLowerCase()}"
            class:pt-active={flag === f}
            on:click={() => setFlag(f)}
          >{f}</button>
        {/each}
      </div>
      <button class="trigger-btn" on:click={handleTrigger} disabled={triggering || isRunning}>
        {triggering ? 'Triggering…' : '▶ Trigger Run'}
      </button>

      <button class="tb-icon-btn" on:click={toggleTheme} title="Toggle theme">
        {#if $dark}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        {/if}
      </button>

      <!-- Avatar / user menu -->
      <button class="avatar-btn" on:click={adminLogout} title="Logout">
        <span class="avatar">A</span>
      </button>

      <button class="home-btn" on:click={() => appMode.set('landing')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Home
      </button>
    </div>
  </header>

  <!-- ── PAGE CONTENT ── -->
  <main class="page-area">
    <div class="page-inner">
      {#if $currentAdminPage === 'dashboard'}    <AdminDashboard />
      {:else if $currentAdminPage === 'runs'}     <RunHistory />
      {:else if $currentAdminPage === 'articles'} <ArticlesManager />
      {:else if $currentAdminPage === 'themes'}   <ThemeManager />
      {:else if $currentAdminPage === 'profiles'} <EditorialProfilesManager />
      {:else if $currentAdminPage === 'settings'} <AdminSettings />
      {/if}
    </div>
  </main>

</div>
{/if}

<style>
  .shell {
    display: flex;
    min-height: 100vh;
    background: var(--white);
  }

  /* ─── Sidebar ── */
  .sidebar {
    position: fixed; top: 57px; left: 0; bottom: 0;
    width: 0;
    display: flex; flex-direction: column;
    background: var(--white);
    border-right: 1px solid rgba(0,0,0,0.06);
    z-index: 300;
    overflow: hidden;
    transition: width 0.3s ease-in-out;
  }
  .shell.expanded .sidebar { width: 260px; }

  .sb-nav {
    flex: 1;
    display: flex; flex-direction: column;
    padding: 8px 0;
    overflow: hidden;
  }

  .sb-item {
    display: flex; align-items: center;
    height: 44px; padding: 0 16px; gap: 12px;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); font-family: var(--sans);
    white-space: nowrap; overflow: hidden;
    text-align: left;
    box-shadow: inset 3px 0 0 transparent;
    transition: color 0.15s, box-shadow 0.15s;
    flex-shrink: 0;
  }
  .sb-item:hover { color: var(--green, #1a8917); box-shadow: inset 3px 0 0 var(--green, #1a8917); }
  .sb-item.active { color: var(--green, #1a8917); box-shadow: inset 3px 0 0 var(--green, #1a8917); }
  .sb-item.active .sb-icon svg { stroke-width: 2.2; }

  .sb-icon {
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; width: 24px; height: 24px;
  }

  .sb-label {
    font-size: 14px; font-weight: 400;
    opacity: 0; transform: translateX(-15px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none; white-space: nowrap;
  }
  .sb-item.active .sb-label { font-weight: 500; }

  .shell.expanded .sb-nav .sb-item:nth-child(1) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 0ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(2) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 40ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(3) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 80ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(4) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 120ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(5) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 160ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(6) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 200ms; }


  /* ─── Top bar ── */
  .topbar {
    position: fixed; top: 0; left: 0; right: 0;
    height: 57px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    background: var(--white);
    border-bottom: 1px solid rgba(0,0,0,0.09);
    z-index: 400;
  }

  .topbar-left  { display: flex; align-items: center; gap: 20px; }
  .topbar-right { display: flex; align-items: center; gap: 8px; }

  .toggle-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); border-radius: 6px;
    transition: color 0.15s, background 0.15s; flex-shrink: 0;
  }
  .toggle-btn:hover { color: var(--text-black); background: rgba(0,0,0,0.05); }

  .logo {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--serif); font-size: 22px; font-weight: 700;
    letter-spacing: -0.5px; color: var(--text-black);
    background: none; border: none; cursor: pointer; padding: 0;
    white-space: nowrap; line-height: 1;
  }
  .pipeline-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .dot-on    { background: var(--green, #1a8917); box-shadow: 0 0 0 3px rgba(26,137,23,0.25); animation: pulse 2s infinite; }
  .dot-pause { background: var(--amber, #d97706); }
  .dot-off   { background: var(--red, #dc2626); }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .admin-badge {
    font-family: var(--sans); font-size: 11px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    background: var(--text-black); color: #fff;
    padding: 2px 8px; border-radius: 100px;
  }

  /* Pipeline toggle */
  .pipe-toggle {
    display: flex; gap: 2px;
    background: var(--off-white); border: 1px solid var(--divider);
    border-radius: 6px; padding: 3px;
  }
  .pt-btn {
    padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700;
    cursor: pointer; border: none; background: none; color: var(--text-muted);
    font-family: var(--sans); transition: all 0.12s;
  }
  .pt-btn:hover { color: var(--text-black); }
  .pt-btn.pt-on.pt-active    { background: rgba(26,137,23,0.12); color: #1a8917; }
  .pt-btn.pt-pause.pt-active { background: rgba(217,119,6,0.12);  color: #d97706; }
  .pt-btn.pt-off.pt-active   { background: rgba(220,38,38,0.12);  color: #dc2626; }

  .tb-icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 50%;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); transition: background 0.15s, color 0.15s;
  }
  .tb-icon-btn:hover { background: rgba(0,0,0,0.06); color: var(--text-black); }

  .avatar-btn {
    display: flex; background: none; border: none; cursor: pointer;
    padding: 4px; border-radius: 50%; transition: opacity 0.15s;
  }
  .avatar-btn:hover { opacity: 0.82; }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--text-black); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; font-family: var(--sans);
    user-select: none;
  }

  .home-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: 1px solid var(--divider); color: var(--text-muted);
    font-size: 13px; font-family: var(--sans); font-weight: 500;
    padding: 6px 14px; border-radius: 100px; cursor: pointer;
    transition: all 0.15s;
  }
  .home-btn:hover { border-color: var(--text-black); color: var(--text-black); }

  .trigger-btn {
    display: inline-flex; align-items: center;
    background: var(--green, #1a8917); color: #fff;
    border: none; border-radius: 6px;
    padding: 5px 12px; font-size: 12px; font-weight: 600;
    font-family: var(--sans); cursor: pointer;
    transition: background 0.15s;
  }
  .trigger-btn:hover:not(:disabled) { background: var(--green-dark, #156912); }
  .trigger-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* ─── Page area ── */
  .page-area {
    flex: 1;
    padding-top: 57px;
    min-height: 100vh;
    transition: padding-left 0.3s ease-in-out;
  }
  .shell.expanded .page-area { padding-left: 260px; }

  /* ─── Page content inner wrapper ── */
  .page-inner {
    padding: 28px 40px 60px;
    max-width: 1400px;
  }

  @media (max-width: 768px) {
    .topbar { padding: 0 16px; }
    .pipe-toggle { display: none; }
  }
</style>
