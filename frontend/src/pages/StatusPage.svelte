<script>
  export let onNav = (page) => {};

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const monthName = today.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const todayDate = today.getDate();
  const days = ['M','T','W','T','F','S','S'];

  const webComponents = [
    { name: 'API', uptime: '100%' },
    { name: 'Web App', uptime: '100%' },
    { name: 'CDN', uptime: '100%' },
  ];
  const mobileComponents = [
    { name: 'iOS App', uptime: '100%' },
    { name: 'Android App', uptime: '100%' },
  ];
</script>

<div class="status-page">
  <header class="status-header">
    <div class="status-header-inner">
      <button class="status-logo" on:click={() => onNav('home')}>
        <svg width="28" height="28" viewBox="0 0 195 195" fill="none"><rect width="195" height="195" rx="4" fill="#000"/><path d="M45 65l30 65 30-65 30 65 15-32.5" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>BlogCurate</span>
      </button>
      <div class="status-header-actions">
        <a href="#" class="status-action-link">Report a problem</a>
        <a href="#" class="status-action-link">Subscribe to updates</a>
      </div>
    </div>
  </header>

  <div class="status-body">
    <!-- Operational banner -->
    <div class="status-banner operational">
      <div class="status-banner-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#059669"/><path d="M7 12l3.5 3.5L17 9" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <div class="status-banner-title">We're fully operational</div>
        <div class="status-banner-sub">We're not aware of any issues affecting our systems.</div>
      </div>
    </div>

    <!-- System Status -->
    <div class="status-section">
      <h2 class="status-section-title">System status</h2>

      <!-- Web Services -->
      <div class="status-group">
        <div class="status-group-header">
          <span class="status-group-name">Web Services</span>
          <span class="status-group-meta">{webComponents.length} components</span>
          <span class="status-uptime-badge">100% uptime</span>
        </div>
        {#each webComponents as c}
          <div class="status-component-row">
            <span class="status-dot operational-dot"></span>
            <span class="status-component-name">{c.name}</span>
            <span class="status-component-uptime">{c.uptime} uptime</span>
            <span class="status-component-ok">Operational</span>
          </div>
        {/each}
      </div>

      <!-- Mobile Apps -->
      <div class="status-group">
        <div class="status-group-header">
          <span class="status-group-name">Mobile Apps</span>
          <span class="status-group-meta">{mobileComponents.length} components</span>
          <span class="status-uptime-badge">100% uptime</span>
        </div>
        {#each mobileComponents as c}
          <div class="status-component-row">
            <span class="status-dot operational-dot"></span>
            <span class="status-component-name">{c.name}</span>
            <span class="status-component-uptime">{c.uptime} uptime</span>
            <span class="status-component-ok">Operational</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Calendar -->
    <div class="status-section">
      <h2 class="status-section-title">Calendar</h2>
      <div class="status-calendar">
        <div class="cal-header">{monthName}</div>
        <div class="cal-grid">
          {#each days as d}
            <div class="cal-day-label">{d}</div>
          {/each}
          {#each Array(firstDay) as _}
            <div class="cal-cell empty"></div>
          {/each}
          {#each Array(daysInMonth) as _, i}
            <div class="cal-cell" class:today={i + 1 === todayDate}>{i + 1}</div>
          {/each}
        </div>
      </div>
    </div>

    <div class="status-powered">
      Powered by <strong>BlogCurate</strong> ·
      <a href="#" on:click|preventDefault={() => onNav('privacy')}>Privacy policy</a> ·
      <a href="#" on:click|preventDefault={() => onNav('terms')}>Terms of service</a>
    </div>
  </div>

  <footer class="med-footer">
    {#each [['Help','help'],['Status','status'],['About','about'],['Careers','careers'],['Blog','blog'],['Privacy','privacy'],['Rules','rules'],['Terms','terms'],['Text to speech','tts']] as [label, key]}
      <a href="#" on:click|preventDefault={() => onNav(key)}>{label}</a>
    {/each}
  </footer>
</div>

<style>
.status-page { min-height: 100vh; background: var(--white); font-family: var(--sans); color: var(--text-body); display: flex; flex-direction: column; }
.status-header { border-bottom: 1px solid var(--divider); padding: 0 32px; }
.status-header-inner { max-width: 860px; margin: 0 auto; height: 57px; display: flex; align-items: center; justify-content: space-between; }
.status-logo { display: flex; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; font-size: 18px; font-weight: 700; color: var(--text-black); font-family: var(--serif); }
.status-header-actions { display: flex; gap: 20px; }
.status-action-link { font-size: 14px; color: var(--green); text-decoration: none; }
.status-action-link:hover { text-decoration: underline; }

.status-body { max-width: 860px; margin: 0 auto; padding: 40px 32px; flex: 1; width: 100%; }

.status-banner { display: flex; align-items: flex-start; gap: 16px; background: var(--green-light); border: 1px solid rgba(26,137,23,0.25); border-radius: 8px; padding: 20px 24px; margin-bottom: 40px; }
.status-banner-icon { flex-shrink: 0; margin-top: 2px; }
.status-banner-title { font-size: 17px; font-weight: 700; color: var(--text-black); margin-bottom: 4px; font-family: var(--serif); }
.status-banner-sub { font-size: 14px; color: var(--text-muted); }

.status-section { margin-bottom: 40px; }
.status-section-title { font-size: 22px; font-weight: 700; color: var(--text-black); margin-bottom: 20px; border-bottom: 1px solid var(--divider); padding-bottom: 12px; font-family: var(--serif); }

.status-group { border: 1px solid var(--divider); border-radius: 8px; overflow: hidden; margin-bottom: 16px; }
.status-group-header { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: var(--off-white); border-bottom: 1px solid var(--divider); }
.status-group-name { font-size: 15px; font-weight: 600; color: var(--text-black); flex: 1; }
.status-group-meta { font-size: 13px; color: var(--text-hint); }
.status-uptime-badge { font-size: 12px; font-weight: 600; color: var(--green); background: var(--green-light); border: 1px solid rgba(26,137,23,0.2); padding: 3px 10px; border-radius: 100px; }
.status-component-row { display: flex; align-items: center; gap: 10px; padding: 12px 20px; border-top: 1px solid var(--divider); }
.status-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.operational-dot { background: var(--green); }
.status-component-name { font-size: 14px; color: var(--text-body); flex: 1; }
.status-component-uptime { font-size: 13px; color: var(--text-hint); margin-right: 16px; }
.status-component-ok { font-size: 13px; color: var(--green); font-weight: 500; }

.status-calendar { border: 1px solid var(--divider); border-radius: 8px; padding: 20px; max-width: 360px; }
.cal-header { font-size: 15px; font-weight: 600; color: var(--text-black); margin-bottom: 14px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.cal-day-label { font-size: 12px; font-weight: 600; color: var(--text-hint); text-align: center; padding: 4px 0 8px; }
.cal-cell { font-size: 13px; color: var(--text-body); text-align: center; padding: 6px 4px; border-radius: 4px; }
.cal-cell.today { background: var(--text-black); color: var(--white); font-weight: 600; border-radius: 50%; }
.cal-cell.empty { }

.status-powered { font-size: 13px; color: var(--text-hint); text-align: center; padding: 24px 0 8px; }
.status-powered a { color: var(--text-muted); text-decoration: none; }
.status-powered a:hover { text-decoration: underline; }

.med-footer { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; padding: 16px 24px; border-top: 1px solid var(--divider); }
.med-footer a { font-size: 13px; color: var(--text-muted); text-decoration: none; padding: 4px 12px; border-right: 1px solid var(--divider); }
.med-footer a:last-child { border-right: none; }
.med-footer a:hover { color: var(--text-black); }
</style>
