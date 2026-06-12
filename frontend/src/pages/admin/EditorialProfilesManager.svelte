<script>
  import { onMount } from 'svelte';
  import EditorialProfileModal from '../../components/EditorialProfileModal.svelte';
  import { mockEditorialProfiles } from '../../data/editorialProfiles.js';
  import { currentAdminPage } from '../../stores/store.js';

  let profiles = [];
  let selectedProfile = null;
  let showProfileModal = false;
  let isRegenerating = new Set();

  // Profile state
  let fullName     = 'Admin User';
  let email        = 'admin@blogcurate.io';
  let phone        = '+1 (555) 000-1234';
  let org          = 'BlogCurate Inc.';
  let currentPwd   = '';
  let newPwd       = '';
  let confirmPwd   = '';
  let twoFA        = false;
  let savingProfile = false;
  let profileSaved  = false;
  let activeTab     = 'profiles';

  const tabs = [
    { id:'profiles', label:'Editorial Profiles' },
    { id:'account',  label:'Account & Profile'  },
  ];

  onMount(() => { profiles = mockEditorialProfiles; });

  function openProfile(profile) { selectedProfile = profile; showProfileModal = true; }
  function closeModal() { showProfileModal = false; selectedProfile = null; }

  function regenerateProfile(profileId) {
    isRegenerating = new Set([...isRegenerating, profileId]);
    setTimeout(() => {
      const idx = profiles.findIndex(p => p.id === profileId);
      if (idx >= 0) {
        profiles[idx] = { ...profiles[idx], generatedAt: new Date().toISOString(), lastCalibrationQuality: Math.random()*0.15+0.80 };
      }
      isRegenerating.delete(profileId);
      isRegenerating = isRegenerating;
    }, 1500);
  }

  function getQualityColor(q) { return q>=0.85?'var(--green)':q>=0.75?'var(--amber)':'var(--red)'; }
  function getQualityLabel(q) { return q>=0.85?'Excellent':q>=0.75?'Good':'Fair'; }
  function getDaysAgo(dateString) {
    const days = Math.floor((new Date() - new Date(dateString)) / 86400000);
    return days===0?'Today':days===1?'Yesterday':`${days} days ago`;
  }

  function saveProfile() {
    savingProfile = true;
    setTimeout(() => { savingProfile = false; profileSaved = true; setTimeout(()=>profileSaved=false,2000); }, 700);
  }

  const connectedAccounts = [
    { name:'Google', icon:'🔵', connected:true  },
    { name:'GitHub', icon:'⚫', connected:true  },
    { name:'Medium', icon:'⬛', connected:false },
  ];

  const loginActivity = [
    { device:'Chrome on macOS',  location:'Mumbai, IN',     time:'Today, 09:12'   },
    { device:'Safari on iPhone', location:'Mumbai, IN',     time:'Yesterday, 22:04'},
    { device:'Firefox on Linux', location:'Paris, FR',      time:'3 days ago'      },
  ];
</script>

<!-- Tab bar -->
<div class="ep-tabs">
  {#each tabs as t}
    <button class="ep-tab" class:ep-tab-active={activeTab===t.id} on:click={()=>activeTab=t.id}>{t.label}</button>
  {/each}
</div>

<!-- ═══════════════ Editorial Profiles tab ═══════════════ -->
{#if activeTab==='profiles'}
<div class="page">
  <div class="header">
    <div>
      <h1 class="page-title">Editorial Profiles</h1>
      <p class="page-subtitle">AI-analyzed summaries of theme editorial characteristics, updated weekly</p>
    </div>
  </div>

  <div style="border-top:1px solid var(--divider);margin-bottom:20px"></div>

  {#if profiles.length === 0}
    <div class="empty-state">
      <h3>No editorial profiles yet</h3>
      <p>Profiles will be generated automatically when themes are calibrated.</p>
    </div>
  {:else}
    <div class="profiles-grid">
      {#each profiles as profile (profile.id)}
        {@const regenerating = isRegenerating.has(profile.id)}
        <div class="profile-card">
          <div class="card-header">
            <div>
              <h3 class="card-title">{profile.themeName}</h3>
              <p class="card-date">Generated {getDaysAgo(profile.generatedAt)}</p>
            </div>
          </div>
          <div class="card-content">
            <div class="stats-row">
              <div class="stat">
                <span class="stat-label">Articles</span>
                <span class="stat-value">{profile.articlesAnalyzed}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Acceptance</span>
                <span class="stat-value">{(profile.acceptanceRate*100).toFixed(0)}%</span>
              </div>
              <div class="stat">
                <span class="stat-label">Quality</span>
                <div class="quality-indicator" style="--color:{getQualityColor(profile.lastCalibrationQuality)}">
                  {getQualityLabel(profile.lastCalibrationQuality)}
                </div>
              </div>
            </div>
            <div class="spirit-section">
              <p class="spirit-label">Editorial Spirit</p>
              <p class="spirit-text">{profile.editorialSpirit.substring(0,120)}...</p>
            </div>
            <div class="keywords-section">
              <p class="keywords-label">Top Keywords</p>
              <div class="keywords-preview">
                {#each profile.dominantKeywords.slice(0,3) as {keyword}}
                  <span class="keyword-badge">{keyword}</span>
                {/each}
                {#if profile.dominantKeywords.length>3}
                  <span class="keyword-badge keyword-more">+{profile.dominantKeywords.length-3} more</span>
                {/if}
              </div>
            </div>
            <div class="sectors-section">
              <p class="sectors-label">Sectors Covered</p>
              <div class="sectors-preview">
                {#each profile.coveredSectors.slice(0,2) as {sector,articleCount}}
                  <div class="sector-mini">
                    <span class="sector-name">{sector}</span>
                    <span class="sector-count">{articleCount} articles</span>
                  </div>
                {/each}
                {#if profile.coveredSectors.length>2}
                  <div class="sector-mini sector-more">+{profile.coveredSectors.length-2} sectors</div>
                {/if}
              </div>
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-secondary btn-sm" on:click={()=>regenerateProfile(profile.id)} disabled={regenerating}>
              {regenerating?'Regenerating...':'Regenerate'}
            </button>
            <button class="btn btn-primary btn-sm" on:click={()=>openProfile(profile)}>View Profile</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div class="info-box">
    <h4>How Editorial Profiles Work</h4>
    <ul>
      <li><strong>Weekly Analysis:</strong> Every Monday at 9 AM UTC, the AI analyzes the 50 most recent published articles for each theme</li>
      <li><strong>Keyword Extraction:</strong> Identifies dominant keywords and maps them to sectors</li>
      <li><strong>Editorial Spirit:</strong> Generates a 50-word statement defining what makes an article worth publishing vs generic</li>
      <li><strong>Downstream Impact:</strong> Profiles guide article scoring, recommendation algorithms, and editorial feedback</li>
      <li><strong>Metrics:</strong> Calibration quality reflects how well the profile matches actual editorial decisions</li>
    </ul>
  </div>
</div>

<!-- ═══════════════ Account & Profile tab ═══════════════ -->
{:else}
<div class="page">
  <h1 class="page-title">Account & Profile</h1>
  <div style="border-top:1px solid var(--divider);margin-bottom:20px"></div>

  <!-- Profile header card -->
  <div class="prof-header-card">
    <div class="prof-avatar">A</div>
    <div class="prof-hinfo">
      <div class="prof-name">{fullName}</div>
      <div class="prof-role">Super Admin</div>
      <div class="prof-email">{email}</div>
      <div class="prof-login">Last login: Today, 09:12 AM</div>
    </div>
  </div>

  <!-- Activity overview -->
  <div class="act-grid">
    {#each [
      { label:'Blogs Published',    val:'1,254' },
      { label:'Reviews Completed',  val:'387'   },
      { label:'AI Tasks Managed',   val:'2,841' },
    ] as a}
      <div class="act-card">
        <div class="act-val">{a.val}</div>
        <div class="act-lbl">{a.label}</div>
      </div>
    {/each}
  </div>

  <div class="two-col">
    <!-- Personal information -->
    <div class="info-section">
      <div class="sec-title">Personal Information</div>
      <div class="fields">
        <div class="field-row">
          <label class="field-label" for="full-name">Full Name</label>
          <input id="full-name" bind:value={fullName} style="max-width:280px"/>
        </div>
        <div class="field-row">
          <label class="field-label" for="p-email">Email</label>
          <input id="p-email" type="email" bind:value={email} style="max-width:280px"/>
        </div>
        <div class="field-row">
          <label class="field-label" for="p-phone">Phone Number</label>
          <input id="p-phone" bind:value={phone} style="max-width:200px"/>
        </div>
        <div class="field-row">
          <label class="field-label" for="p-org">Organisation</label>
          <input id="p-org" bind:value={org} style="max-width:280px"/>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" style="margin-top:16px" on:click={saveProfile} disabled={savingProfile}>
        {#if profileSaved}✓ Saved{:else if savingProfile}Saving…{:else}Save Changes{/if}
      </button>
    </div>

    <!-- Security -->
    <div class="info-section">
      <div class="sec-title">Security</div>
      <div class="fields">
        <div class="field-row">
          <label class="field-label" for="cur-pwd">Current Password</label>
          <input id="cur-pwd" type="password" bind:value={currentPwd} style="max-width:200px" placeholder="••••••••"/>
        </div>
        <div class="field-row">
          <label class="field-label" for="new-pwd">New Password</label>
          <input id="new-pwd" type="password" bind:value={newPwd} style="max-width:200px" placeholder="••••••••"/>
        </div>
        <div class="field-row">
          <label class="field-label" for="conf-pwd">Confirm Password</label>
          <input id="conf-pwd" type="password" bind:value={confirmPwd} style="max-width:200px" placeholder="••••••••"/>
        </div>
        <div class="field-row">
          <div>
            <div class="field-label">Two-Factor Authentication</div>
            <div class="field-hint">Adds an extra layer of login security</div>
          </div>
          <button class="toggle" class:on={twoFA} on:click={()=>twoFA=!twoFA}></button>
        </div>
      </div>

      <!-- Login activity -->
      <div class="sec-title" style="margin-top:20px;margin-bottom:10px">Login Activity</div>
      <div class="login-list">
        {#each loginActivity as l}
          <div class="login-row">
            <div class="login-device">{l.device}</div>
            <div class="login-loc">{l.location} · {l.time}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Connected accounts -->
  <div class="info-section" style="margin-top:20px">
    <div class="sec-title">Connected Accounts</div>
    <div class="connected-list">
      {#each connectedAccounts as c}
        <div class="connected-row">
          <span class="connected-icon">{c.icon}</span>
          <span class="connected-name">{c.name}</span>
          {#if c.connected}
            <span class="badge badge-complete" style="margin-left:auto">Connected</span>
            <button class="btn btn-danger btn-sm" style="margin-left:8px">Disconnect</button>
          {:else}
            <span class="badge badge-gray" style="margin-left:auto">Not connected</span>
            <button class="btn btn-secondary btn-sm" style="margin-left:8px">Connect</button>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
{/if}

<EditorialProfileModal profile={selectedProfile} isOpen={showProfileModal} on:close={closeModal}/>

<style>
  /* Tab bar */
  .ep-tabs { display:flex;gap:2px;border-bottom:1px solid var(--divider);margin-bottom:28px; }
  .ep-tab { padding:8px 16px;font-size:14px;font-weight:500;border:none;background:none;cursor:pointer;color:var(--text-muted);font-family:var(--sans);border-bottom:2px solid transparent;margin-bottom:-1px;transition:all 0.15s; }
  .ep-tab:hover { color:var(--text-black); }
  .ep-tab-active { color:var(--text-black);border-bottom-color:var(--text-black); }

  .page { padding:0; color:var(--text-primary); margin:0; }
  .header { padding:0 0 8px; background:var(--bg-primary); }
  .page-title { margin:0 0 8px;font-family:var(--serif);font-size:28px;font-weight:700;color:var(--text-black);letter-spacing:-0.3px; }
  .page-subtitle { margin:0;font-size:14px;font-family:var(--sans);color:var(--text-muted); }

  /* Profile header card */
  .prof-header-card {
    display:flex;align-items:center;gap:20px;
    padding:20px;border:1px solid var(--divider);border-radius:var(--radius);
    background:var(--white);margin-bottom:20px;
  }
  .prof-avatar {
    width:64px;height:64px;border-radius:50%;
    background:var(--text-black);color:var(--white);
    display:flex;align-items:center;justify-content:center;
    font-size:24px;font-weight:700;font-family:var(--sans);flex-shrink:0;
  }
  .prof-name { font-size:18px;font-weight:700;color:var(--text-black);font-family:var(--serif);margin-bottom:2px; }
  .prof-role { font-size:12px;font-weight:600;color:var(--green);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;font-family:var(--sans); }
  .prof-email { font-size:13px;color:var(--text-muted);font-family:var(--sans);margin-bottom:2px; }
  .prof-login { font-size:12px;color:var(--text-hint);font-family:var(--sans); }

  /* Activity */
  .act-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:1px;border:1px solid var(--divider);border-radius:var(--radius);overflow:hidden;background:var(--divider);margin-bottom:20px; }
  .act-card { background:var(--white);padding:16px 18px;text-align:center;transition:background 0.15s; }
  .act-card:hover { background:var(--off-white); }
  .act-val { font-family:var(--serif);font-size:26px;font-weight:700;color:var(--text-black);line-height:1;margin-bottom:4px; }
  .act-lbl { font-size:12px;color:var(--text-muted);font-family:var(--sans); }

  /* Two-col */
  .two-col { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
  .info-section { border:1px solid var(--divider);border-radius:var(--radius);padding:20px;background:var(--white); }
  .sec-title { font-size:14px;font-weight:600;color:var(--text-black);font-family:var(--sans);margin-bottom:14px; }

  .fields { display:flex;flex-direction:column; }
  .field-row { display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid var(--divider); }
  .field-row:last-child { border-bottom:none; }
  .field-label { font-size:13px;font-weight:500;color:var(--text-black);font-family:var(--sans);white-space:nowrap; }
  .field-hint  { font-size:12px;color:var(--text-muted);margin-top:2px;font-family:var(--sans); }

  /* Toggle */
  .toggle { width:40px;height:22px;border-radius:99px;background:var(--divider);cursor:pointer;position:relative;transition:background 0.2s;flex-shrink:0;border:none; }
  .toggle.on { background:var(--green); }
  .toggle::after { content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;left:3px;transition:transform 0.2s; }
  .toggle.on::after { transform:translateX(18px); }

  /* Login activity */
  .login-list { display:flex;flex-direction:column;gap:0;border:1px solid var(--divider);border-radius:var(--radius);overflow:hidden; }
  .login-row { padding:10px 12px;border-bottom:1px solid var(--divider); }
  .login-row:last-child { border-bottom:none; }
  .login-device { font-size:13px;font-weight:500;color:var(--text-black);font-family:var(--sans);margin-bottom:2px; }
  .login-loc { font-size:11px;color:var(--text-muted);font-family:var(--sans); }

  /* Connected accounts */
  .connected-list { display:flex;flex-direction:column;gap:0;border:1px solid var(--divider);border-radius:var(--radius);overflow:hidden; }
  .connected-row { display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--divider);background:var(--white); }
  .connected-row:last-child { border-bottom:none; }
  .connected-icon { font-size:18px; }
  .connected-name { font-size:14px;font-weight:500;color:var(--text-black);font-family:var(--sans); }

  /* Profiles grid (existing) */
  .empty-state { padding:60px 32px;text-align:center; }
  .empty-state h3 { margin:0 0 8px;font-size:18px;color:var(--text-black); }
  .empty-state p { margin:0;color:var(--text-muted); }
  .profiles-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;margin-bottom:28px;padding:0; }
  .profile-card { display:flex;flex-direction:column;background:var(--off-white);border:1px solid var(--divider);border-radius:var(--radius);overflow:hidden;transition:box-shadow 0.18s,border-color 0.18s,transform 0.18s; }
  .profile-card:hover { border-color:var(--text-black);box-shadow:0 4px 16px rgba(0,0,0,0.08);transform:translateY(-2px); }
  .card-header { padding:16px;border-bottom:1px solid var(--divider);background:var(--white); }
  .card-title { margin:0 0 4px;font-family:var(--sans);font-size:16px;font-weight:600;color:var(--text-black); }
  .card-date { margin:0;font-family:var(--sans);font-size:12px;color:var(--text-muted); }
  .card-content { flex:1;padding:16px;display:flex;flex-direction:column;gap:16px; }
  .stats-row { display:grid;grid-template-columns:repeat(3,1fr);gap:12px; }
  .stat { display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;background:var(--white);border-radius:var(--radius);border:1px solid var(--divider); }
  .stat-label { font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.3px;font-weight:600;font-family:var(--sans); }
  .stat-value { font-family:var(--serif);font-size:16px;font-weight:700;color:var(--text-black); }
  .quality-indicator { font-size:12px;font-weight:600;color:var(--color); }
  .spirit-section,.keywords-section,.sectors-section { display:flex;flex-direction:column;gap:6px; }
  .spirit-label,.keywords-label,.sectors-label { font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.3px;font-weight:600;margin:0;font-family:var(--sans); }
  .spirit-text { margin:0;font-family:var(--sans);font-size:13px;line-height:1.5;color:var(--text-body);padding:8px;background:var(--white);border-radius:var(--radius);border-left:3px solid var(--text-black); }
  .keywords-preview { display:flex;flex-wrap:wrap;gap:6px; }
  .keyword-badge { display:inline-block;padding:4px 8px;background:var(--white);color:var(--text-body);border:1px solid var(--divider);border-radius:100px;font-family:var(--sans);font-size:11px;font-weight:500; }
  .keyword-more { background:var(--off-white);color:var(--text-muted); }
  .sectors-preview { display:flex;flex-direction:column;gap:6px; }
  .sector-mini { display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:var(--white);border-radius:var(--radius);border:1px solid var(--divider);font-size:12px; }
  .sector-name { font-weight:500;color:var(--text-black); }
  .sector-count { font-size:11px;color:var(--text-muted); }
  .sector-more { color:var(--text-muted);font-size:11px;justify-content:center; }
  .card-footer { display:flex;gap:8px;padding:12px 16px;background:var(--white);border-top:1px solid var(--divider); }
  .info-box { margin:0 0 20px;padding:20px;background:var(--off-white);border-radius:var(--radius);border-left:4px solid var(--text-black);color:var(--text-body); }
  .info-box h4 { margin:0 0 12px;font-family:var(--sans);font-size:14px;font-weight:600;color:var(--text-black); }
  .info-box ul { margin:0;padding:0 0 0 20px;list-style:disc; }
  .info-box li { margin:6px 0;font-family:var(--sans);font-size:13px;color:var(--text-muted);line-height:1.5; }
  .info-box strong { font-weight:600;color:var(--text-body); }

  @media (max-width:768px) {
    .profiles-grid { grid-template-columns:1fr; }
    .two-col { grid-template-columns:1fr; }
    .act-grid { grid-template-columns:repeat(3,1fr); }
  }
</style>
