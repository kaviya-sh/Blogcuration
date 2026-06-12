<script>
  import { user, userAuthed, currentPage, notifications, unreadCount, markAllRead,
           logout, pipelineFlag, appMode, dark, toggleTheme,
           searchQuery, addRecentSearch } from '../stores/store.js';
  import HomePage        from '../pages/HomePage.svelte';
  import DiscoverPage    from '../pages/DiscoverPage.svelte';
  import PreviewPage     from '../pages/PreviewPage.svelte';
  import DashboardPage   from '../pages/DashboardPage.svelte';
  import SettingsPage    from '../pages/SettingsPage.svelte';
  import ScheduledPage   from '../pages/ScheduledPage.svelte';
  import PublishedPage   from '../pages/PublishedPage.svelte';
  import InterestedPage  from '../pages/InterestedPage.svelte';
  import RejectedPage    from '../pages/RejectedPage.svelte';
  import StoriesPage     from '../pages/StoriesPage.svelte';
  import StatsPage       from '../pages/StatsPage.svelte';
  import FollowingPage   from '../pages/FollowingPage.svelte';
  import BlogDetailPage  from '../pages/BlogDetailPage.svelte';
  import OnboardingModal from './OnboardingModal.svelte';

  let expanded     = true;
  let showNotif    = false;
  let showUserMenu = false;
  let showSearch   = false;
  let searchInput  = '';

  let showOnboarding = $user?.isNew ?? false;

  const nav = [
    { page: 'home',      label: 'Home',
      icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
    { page: 'discover',  label: 'Discover',
      icon: 'M21 21l-4.35-4.35M11 19A8 8 0 1011 3a8 8 0 000 16z' },
    { page: 'stories',   label: 'Stories',
      icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z' },
    { page: 'stats',     label: 'Stats',
      icon: 'M18 20V10M12 20V4M6 20v-6' },
    { page: 'following', label: 'Following',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { page: 'dashboard', label: 'Dashboard',
      icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
    { page: 'settings',  label: 'Settings',
      icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
  ];

  // Update staggered label delays for 7 items

  function navigate(page) {
    currentPage.set(page);
    showNotif = false; showUserMenu = false; showSearch = false;
  }
  function doSearch() {
    const t = searchInput.trim();
    if (t) { addRecentSearch(t); searchQuery.set(t); }
    navigate('discover');
    showSearch = false; searchInput = '';
  }
  function onSearchKey(e) {
    if (e.key === 'Enter') doSearch();
    if (e.key === 'Escape') { showSearch = false; searchInput = ''; }
  }
  function openNotif(e) {
    e.stopPropagation(); showNotif = !showNotif; showUserMenu = false;
    if (showNotif) markAllRead();
  }
  function openUserMenu(e) {
    e.stopPropagation(); showUserMenu = !showUserMenu; showNotif = false;
  }
  function closeAll() { showNotif = false; showUserMenu = false; }
</script>

<svelte:window on:click={closeAll} />

{#if $userAuthed}
<div class="shell" class:expanded>

  <!-- ── LEFT SIDEBAR ── -->
  <aside class="sidebar">
    <!-- Nav items -->
    <nav class="sb-nav">
      {#each nav as n}
        <button
          class="sb-item"
          class:active={$currentPage === n.page}
          on:click={() => navigate(n.page)}
          title={expanded ? '' : n.label}
        >
          <span class="sb-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d={n.icon}/>
            </svg>
          </span>
          <span class="sb-label">{n.label}</span>
        </button>
      {/each}
    </nav>

    <!-- Pipeline status dot -->
    {#if $pipelineFlag === 'OFF' || $pipelineFlag === 'PAUSE'}
      <div class="sb-status" class:status-off={$pipelineFlag==='OFF'} class:status-pause={$pipelineFlag==='PAUSE'}>
        <span class="sb-status-dot"></span>
        <span class="sb-label sb-status-label">Pipeline {$pipelineFlag}</span>
      </div>
    {/if}
  </aside>

  <!-- ── TOP BAR ── -->
  <header class="topbar">
    <!-- Left: logo + search -->
    <div class="topbar-left">
      <button class="toggle-btn" on:click={() => expanded = !expanded} aria-label="Toggle sidebar">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <button class="logo" on:click={() => navigate('home')}>BlogCurate</button>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="search-wrap" role="none" on:click|stopPropagation>
        {#if showSearch}
          <div class="search-open">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon-inner">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              class="search-input"
              bind:value={searchInput}
              placeholder="Search BlogCurate"
              on:keydown={onSearchKey}
              autofocus
            />
            <button class="search-esc" on:click={() => { showSearch = false; searchInput = ''; }}>✕</button>
          </div>
        {:else}
          <button class="search-pill" on:click={() => showSearch = true}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Search</span>
          </button>
        {/if}
      </div>
    </div>

    <!-- Right: write + theme + notif + avatar -->
    <div class="topbar-right">

      <button class="write-btn" on:click={() => navigate('interested')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        Write
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

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="tb-drop-wrap" role="none" on:click|stopPropagation>
        <button class="tb-icon-btn" on:click={openNotif} title="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {#if $unreadCount > 0}
            <span class="notif-dot">{$unreadCount > 9 ? '9+' : $unreadCount}</span>
          {/if}
        </button>
        {#if showNotif}
          <div class="drop-panel notif-panel">
            <div class="drop-head">
              <span class="drop-title">Notifications</span>
              <button class="drop-mark" on:click={markAllRead}>Mark all read</button>
            </div>
            {#if $notifications.length === 0}
              <p class="drop-empty">You're all caught up</p>
            {:else}
              {#each $notifications as n}
                <div class="notif-row" class:unread={!n.read}>
                  <span class="notif-row-dot" class:read={n.read}></span>
                  <div>
                    <div class="notif-row-text">{n.text}</div>
                    <div class="notif-row-time">{n.time}</div>
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="tb-drop-wrap" role="none" on:click|stopPropagation>
        <button class="avatar-btn" on:click={openUserMenu}>
          <span class="avatar">{($user?.name ?? 'U')[0].toUpperCase()}</span>
        </button>
        {#if showUserMenu}
          <div class="drop-panel user-panel">
            <div class="drop-profile">
              <span class="avatar avatar-lg">{($user?.name ?? 'U')[0].toUpperCase()}</span>
              <div>
                <div class="drop-name">{$user?.name}</div>
                <div class="drop-email">{$user?.email}</div>
              </div>
            </div>
            <div class="drop-divider"></div>
            <button class="drop-item" on:click={() => navigate('dashboard')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard
            </button>

            <button class="drop-item" on:click={() => appMode.set('landing')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              Landing Page
            </button>
            <div class="drop-divider"></div>
            <button class="drop-item danger" on:click={logout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Sign out
            </button>
          </div>
        {/if}
      </div>

    </div>
  </header>

  <!-- ── PAGE CONTENT ── -->
  <main class="page-area">
    {#if showOnboarding}
      <OnboardingModal on:close={() => { showOnboarding = false; }} />
    {/if}
    {#if $currentPage === 'home'}        <HomePage />
    {:else if $currentPage === 'discover'}   <DiscoverPage />
    {:else if $currentPage === 'preview'}    <PreviewPage />
    {:else if $currentPage === 'dashboard'}  <DashboardPage />
    {:else if $currentPage === 'settings'}   <SettingsPage />
    {:else if $currentPage === 'scheduled'}  <ScheduledPage />
    {:else if $currentPage === 'published'}  <PublishedPage />
    {:else if $currentPage === 'interested'} <InterestedPage />
    {:else if $currentPage === 'rejected'}   <RejectedPage />
    {:else if $currentPage === 'stories'}    <StoriesPage />
    {:else if $currentPage === 'stats'}      <StatsPage />
    {:else if $currentPage === 'following'}  <FollowingPage />
    {:else if $currentPage === 'bookmarks'}  <StoriesPage />
    {:else if $currentPage === 'article'}    <BlogDetailPage />
    {/if}
  </main>

</div>
{/if}

<style>
  /* ─── Shell ─────────────────────────────────────────────── */
  .shell {
    display: flex;
    min-height: 100vh;
    background: var(--white);
  }

  /* ─── Sidebar ────────────────────────────────────────────── */
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

  /* Nav */
  .sb-nav {
    flex: 1;
    display: flex; flex-direction: column;
    padding: 8px 0;
    overflow: hidden;
  }
  .sb-item {
    display: flex; align-items: center;
    height: 44px;
    padding: 0 16px;
    gap: 12px;
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
    opacity: 1;
  }

  .sb-label {
    font-size: 14px; font-weight: 400;
    opacity: 0;
    transform: translateX(-15px);
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    pointer-events: none;
    white-space: nowrap;
  }
  .sb-item.active .sb-label { font-weight: 500; }

  /* Staggered label fade-in — icons stay visible alongside labels */
  .shell.expanded .sb-nav .sb-item:nth-child(1) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 0ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(2) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 40ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(3) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 80ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(4) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 120ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(5) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 160ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(6) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 200ms; }
  .shell.expanded .sb-nav .sb-item:nth-child(7) .sb-label { opacity: 1; transform: translateX(0); transition-delay: 240ms; }

  /* Pipeline status */
  .sb-status {
    display: flex; align-items: center;
    height: 44px; padding: 0 16px; gap: 12px;
    flex-shrink: 0; overflow: hidden;
    box-shadow: inset 3px 0 0 transparent;
    transition: box-shadow 0.15s;
  }
  .sb-status:hover { box-shadow: inset 3px 0 0 currentColor; }
  .sb-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    flex-shrink: 0; background: currentColor;
  }
  .status-off   { color: var(--red,#dc2626); }
  .status-pause { color: var(--amber,#d97706); }
  .sb-status-label {
    font-size: 12px; font-weight: 600;
  }

  /* ─── Top bar ────────────────────────────────────────────── */
  .topbar {
    position: fixed; top: 0; left: 0; right: 0;
    height: 57px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px;
    background: var(--white);
    border-bottom: 1px solid rgba(0,0,0,0.09);
    z-index: 400;
  }

  .toggle-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted);
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    flex-shrink: 0;
  }
  .toggle-btn:hover { color: var(--text-black); background: rgba(0,0,0,0.05); }

  .topbar-left {
    display: flex; align-items: center; gap: 20px;
  }
  .topbar-right {
    display: flex; align-items: center; gap: 2px;
  }

  /* Logo — Medium uses GT Super / Sohne, we use Source Serif */
  .logo {
    font-family: var(--serif); font-size: 22px; font-weight: 700;
    letter-spacing: -0.5px; color: var(--text-black);
    background: none; border: none; cursor: pointer; padding: 0;
    white-space: nowrap; line-height: 1;
  }

  /* Search pill — Medium: light gray bg, no border, ~240px, 38px tall */
  .search-wrap { position: relative; }
  .search-pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: #f2f2f2; border: none; border-radius: 99px;
    height: 38px; padding: 0 18px;
    color: #6b6b6b; font-size: 14px; font-family: var(--sans);
    cursor: pointer; width: 242px;
    transition: background 0.15s;
  }
  .dark .search-pill { background: var(--off-white); }
  .search-pill:hover { background: #e8e8e8; }
  .dark .search-pill:hover { background: var(--divider); }
  .search-pill span { flex: 1; text-align: left; }

  .search-open {
    display: flex; align-items: center; gap: 8px;
    background: var(--white);
    border: 1.5px solid var(--text-black);
    border-radius: 99px; height: 38px; padding: 0 14px;
    width: 280px;
  }
  .search-icon-inner { color: var(--text-muted); flex-shrink: 0; }
  .search-input {
    flex: 1; border: none; background: transparent; outline: none;
    font-size: 14px; color: var(--text-black); font-family: var(--sans);
    padding: 0;
  }
  .search-input::placeholder { color: var(--text-hint); }
  .search-esc {
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); padding: 2px 4px;
    transition: color 0.12s; line-height: 1;
  }
  .search-esc:hover { color: var(--text-black); }

  /* Write button — Medium: green filled pill */
  .write-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--green, #1a8917); color: #fff;
    border: none; border-radius: 99px;
    height: 38px; padding: 0 20px;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    cursor: pointer; white-space: nowrap;
    transition: background 0.15s;
    margin-right: 4px;
  }
  .write-btn:hover { background: var(--green-dark, #156912); }

  /* Icon buttons in topbar — 40×40 circle */
  .tb-icon-btn {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 50%;
    background: none; border: none; cursor: pointer;
    color: var(--text-muted); position: relative;
    transition: background 0.15s, color 0.15s;
  }
  .tb-icon-btn:hover { background: rgba(0,0,0,0.06); color: var(--text-black); }
  .dark .tb-icon-btn:hover { background: rgba(255,255,255,0.08); }

  /* Notification red dot badge */
  .notif-dot {
    position: absolute; top: 6px; right: 5px;
    min-width: 15px; height: 15px; border-radius: 99px;
    background: #e53e3e; color: #fff;
    font-size: 9px; font-weight: 700; font-family: var(--sans);
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px; pointer-events: none;
    border: 2px solid var(--white);
  }

  /* Avatar button */
  .avatar-btn {
    display: flex; background: none; border: none; cursor: pointer;
    padding: 4px; border-radius: 50%;
    transition: opacity 0.15s;
  }
  .avatar-btn:hover { opacity: 0.82; }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--text-black); color: var(--white);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; font-family: var(--sans);
    user-select: none; flex-shrink: 0;
  }
  .avatar-lg { width: 38px; height: 38px; font-size: 15px; }

  /* Dropdown panels */
  .tb-drop-wrap { position: relative; }
  .drop-panel {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: var(--white); border: 1px solid rgba(0,0,0,0.09);
    border-radius: 4px; z-index: 600;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    overflow: hidden;
    animation: fadeDown 0.12s ease;
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .notif-panel { width: 336px; }
  .user-panel  { width: 224px; }

  .drop-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px 12px;
  }
  .drop-title { font-size: 14px; font-weight: 600; color: var(--text-black); }
  .drop-mark {
    font-size: 13px; color: var(--green,#1a8917); background: none;
    border: none; cursor: pointer; font-family: var(--sans); padding: 0;
  }
  .drop-mark:hover { text-decoration: underline; }
  .drop-empty {
    padding: 24px 20px; font-size: 14px; color: var(--text-muted); text-align: center;
  }
  .drop-divider { border-top: 1px solid rgba(0,0,0,0.09); margin: 4px 0; }

  .drop-profile {
    display: flex; align-items: center; gap: 12px; padding: 16px 20px 12px;
  }
  .drop-name  { font-size: 14px; font-weight: 600; color: var(--text-black); }
  .drop-email { font-size: 13px; color: var(--text-muted); margin-top: 1px; }

  .drop-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 20px;
    background: none; border: none; width: 100%; text-align: left;
    font-size: 14px; color: var(--text-body); font-family: var(--sans);
    cursor: pointer; transition: background 0.1s;
  }
  .drop-item:hover { background: var(--off-white); }
  .drop-item.danger { color: var(--red,#dc2626); }
  .drop-item svg { color: var(--text-muted); flex-shrink: 0; }

  .notif-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 20px; border-top: 1px solid rgba(0,0,0,0.06);
    transition: background 0.1s;
  }
  .notif-row.unread { background: #fafafa; }
  .dark .notif-row.unread { background: var(--off-white); }
  .notif-row:hover { background: var(--off-white); }
  .notif-row-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green,#1a8917); margin-top: 4px; flex-shrink: 0;
  }
  .notif-row-dot.read { background: var(--divider); }
  .notif-row-text { font-size: 13px; color: var(--text-body); line-height: 1.45; }
  .notif-row-time { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  /* ─── Page area ──────────────────────────────────────────── */
  .page-area {
    flex: 1;
    padding-top: 57px;
    min-height: 100vh;
    transition: padding-left 0.3s ease-in-out;
  }
  .shell.expanded .page-area { padding-left: 260px; }

  /* ─── Page content inner wrapper ── */
  .page-area > :global(*) {
    padding: 40px 48px;
    max-width: 1200px;
  }

  /* ─── Responsive ─────────────────────────────────────────── */
  @media (max-width: 904px) {
    .search-pill { width: 180px; }
  }
  @media (max-width: 728px) {
    .topbar { padding: 0 16px; }
    .search-pill { display: none; }
    .logo { font-size: 19px; }
  }
</style>
