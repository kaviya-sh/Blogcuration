<script>
  import { pipelineStatus, setFlag } from '../../stores/store.js';
  import { onMount, onDestroy } from 'svelte';

  let activeAnchor = 's-general';
  let runTime = '02:00';
  let tz        = 'Asia/Kolkata';
  let parallel  = true;
  let bilingual = false;

  let siteName = 'BlogCurate';
  let siteDesc = 'AI-powered blog curation platform';
  let siteTZ   = 'Asia/Kolkata';

  let aiModel          = 'gpt-4o';
  let qualityThreshold = 80;
  let dupSensitivity   = 'medium';
  let autoPublish      = false;
  const aiModels = ['gpt-4o','gpt-4-turbo','gpt-3.5-turbo','gemini-1.5-pro','claude-3-opus'];
  const dupOpts  = ['low','medium','high'];

  let minRelevance  = 7.0;
  let minInnovation = 6.5;

  // ── AI Behaviour ──
  const AI_BEHAVIOUR_KEY = 'admin_ai_behaviour';
  const toneOptions     = ['Professional','Conversational','Academic','Journalistic','Opinionated'];
  const styleOptions    = ['Concise','In-depth','Listicle','How-to Guide','Opinion Piece','Case Study'];
  const strategyOptions = ['Interest-based','Trending Topics','Evergreen','Balanced Mix'];
  const personaOptions  = ['Bookmarks','Reading History','Interested Articles','Equal Weight'];

  let aiBehaviour = {
    tone:              'Professional',
    writingStyle:      'Concise',
    contentStrategy:   'Interest-based',
    personaWeighting:  'Equal Weight',
    maxRegenerations:  5,
    useUserHistory:    true,
    useBookmarks:      true,
    useInterests:      true,
    diversifyTopics:   false,
    minVariantScore:   7.0,
    preferredLength:   'medium',   // short | medium | long
    introStyle:        'context',  // context | hook | stat | question
    bannedPatterns:    ['sponsored content','press release','product launch'],
    newPattern:        '',
  };

  // Load persisted AI behaviour on mount
  function loadAiBehaviour() {
    try {
      const stored = JSON.parse(localStorage.getItem(AI_BEHAVIOUR_KEY) || 'null');
      if (stored) aiBehaviour = { ...aiBehaviour, ...stored, newPattern: '' };
    } catch {}
  }
  function saveAiBehaviour() {
    const toSave = { ...aiBehaviour };
    delete toSave.newPattern;
    localStorage.setItem(AI_BEHAVIOUR_KEY, JSON.stringify(toSave));
  }
  function addPattern() {
    const p = aiBehaviour.newPattern.trim().toLowerCase();
    if (p && !aiBehaviour.bannedPatterns.includes(p)) {
      aiBehaviour.bannedPatterns = [...aiBehaviour.bannedPatterns, p];
    }
    aiBehaviour.newPattern = '';
  }
  function removePattern(p) {
    aiBehaviour.bannedPatterns = aiBehaviour.bannedPatterns.filter(b => b !== p);
  }
  function onPatternKey(e) { if (e.key === 'Enter') addPattern(); }

  let rssFeed   = 'https://techcrunch.com/feed/';
  let newsApiKey = 'na-••••••••••••••••';
  let mediumUser = '@yourusername';

  let cmsEndpoint = 'https://cms.example.com/api/v1';
  let cmsApiKey   = 'sk-••••••••••••••••••••••••••••••••';
  let cmsStatus   = 'connected';
  let showCmsKey  = false;
  function testCms() { cmsStatus='testing'; setTimeout(()=>cmsStatus='connected',1200); }
  function rotateCmsKey() { cmsApiKey='sk-'+Math.random().toString(36).slice(2,34); }

  let emailAlerts  = true;
  let failAlerts   = true;
  let weeklyReport = false;
  let notifs = [
    { label:'Pipeline run completed', hint:'Alert when a run finishes successfully', on:true  },
    { label:'Pipeline failure',       hint:'Immediate alert on any run error',       on:true  },
    { label:'New article published',  hint:'Alert when an article goes live',        on:false },
    { label:'Theme calibrated',       hint:'Alert after a theme recalibration',      on:false },
    { label:'Daily digest',           hint:'Summary email every morning at 08:00',   on:true  },
  ];

  const roles = [
    { name:'Super Admin', perms:'Full access',           users:1 },
    { name:'Editor',      perms:'Publish, edit, review', users:3 },
    { name:'Viewer',      perms:'Read-only access',      users:7 },
  ];

  let autoBackup = true;
  let backupFreq = 'daily';

  let openaiKey  = 'sk-••••••••••••••••••••••••••••••••';
  let geminiKey  = 'AIza••••••••••••••••••••••••••••••';
  let newsKey    = 'na-••••••••••••••••';
  let customKey  = '';
  let showOpenai = false;
  let showGemini = false;
  let showNews   = false;

  let twoFAEnabled   = false;
  let sessionTimeout = 60;
  let loginRestrict  = false;

  let dedupWindow = 30;
  let minWords    = 400;
  let maxWords    = 2000;
  let bannedTerms = ['sponsored','advertisement','click here','buy now'];
  let newTerm     = '';
  function addTerm()    { const t=newTerm.trim().toLowerCase(); if(t&&!bannedTerms.includes(t))bannedTerms=[...bannedTerms,t]; newTerm=''; }
  function removeTerm(t){ bannedTerms=bannedTerms.filter(b=>b!==t); }
  function onTermKey(e) { if(e.key==='Enter')addTerm(); }

  let confirmReset  = false;
  let confirmPause  = false;
  let confirmDelete = false;

  let lastSaved = null;
  let saving    = false;
  function save() { saving=true; saveAiBehaviour(); setTimeout(()=>{ saving=false; lastSaved=new Date(); },700); }
  function fmtSaved(d) { return d?.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); }

  $: flag = $pipelineStatus?.flag ?? 'ON';

  const anchors = [
    { id:'s-general',   label:'General'         },
    { id:'s-pipeline',  label:'Pipeline'        },
    { id:'s-ai',        label:'AI Config'       },
    { id:'s-aibehaviour', label:'AI Behaviour'  },
    { id:'s-quality',   label:'Quality'         },
    { id:'s-sources',   label:'Sources'         },
    { id:'s-cms',       label:'CMS'             },
    { id:'s-notifs',    label:'Notifications'   },
    { id:'s-users',     label:'Users'           },
    { id:'s-backup',    label:'Backup'          },
    { id:'s-apikeys',   label:'API Keys'        },
    { id:'s-security',  label:'Security'        },
    { id:'s-content',   label:'Content Filters' },
    { id:'s-danger',    label:'Danger Zone'     },
  ];

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  onMount(() => {
    loadAiBehaviour();
    const sectionIds = anchors.map(a => a.id);
    const observers = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) activeAnchor = id; },
        { rootMargin: '-50px 0px -60% 0px', threshold: [0, 0.5] }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  });
</script>

<div class="sp-root">

  <!-- Sticky anchor nav -->
  <aside class="sp-nav">
    <div class="sp-nav-title">Settings</div>
    {#each anchors as a}
      <button
        class="sp-anchor {a.id==='s-danger'?'sp-anchor-danger':''}"
        class:sp-anchor-active={activeAnchor === a.id}
        on:click={()=>scrollTo(a.id)}
      >
        {a.label}
      </button>
    {/each}
  </aside>

  <!-- All sections in one scroll -->
  <div class="sp-body">

    <!-- General -->
    <section class="s-card" id="s-general">
      <div class="s-head">
        <div class="s-title">General Settings</div>
        <div class="s-desc">Site identity and global configuration</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <label class="s-label" for="site-name">Site Name</label>
          <input id="site-name" bind:value={siteName} class="s-input"/>
        </div>
        <div class="s-row">
          <label class="s-label" for="site-desc">Description</label>
          <input id="site-desc" bind:value={siteDesc} class="s-input s-input-wide"/>
        </div>
        <div class="s-row">
          <label class="s-label" for="site-tz">Time Zone</label>
          <select id="site-tz" bind:value={siteTZ} class="s-select">
            <option value="Asia/Kolkata">IST — Asia/Kolkata</option>
            <option value="Europe/Paris">CET — Europe/Paris</option>
            <option value="America/New_York">EST — America/New_York</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div class="s-row">
          <label class="s-label">Logo</label>
          <input type="file" accept="image/*" class="s-file"/>
        </div>
      </div>
    </section>

    <!-- Pipeline -->
    <section class="s-card" id="s-pipeline">
      <div class="s-head">
        <div class="s-title">Pipeline Control</div>
        <div class="s-desc">Scheduling, timezone, and processing options</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <label class="s-label" for="run-time">Run Time</label>
          <input id="run-time" type="time" bind:value={runTime} class="s-select"/>
        </div>
        <div class="s-row">
          <label class="s-label" for="run-tz">Timezone</label>
          <select id="run-tz" bind:value={tz} class="s-select">
            <option value="Asia/Kolkata">IST — Asia/Kolkata</option>
            <option value="Europe/Paris">CET — Europe/Paris</option>
            <option value="America/New_York">EST — America/New_York</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Parallel Processing</div>
            <div class="s-hint">Run scoring and generation concurrently</div>
          </div>
          <button class="tog" class:tog-on={parallel} on:click={()=>parallel=!parallel} aria-label="toggle"></button>
        </div>
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Bilingual Mode</div>
            <div class="s-hint">Generate articles in French &amp; English</div>
          </div>
          <button class="tog" class:tog-on={bilingual} on:click={()=>bilingual=!bilingual} aria-label="toggle"></button>
        </div>
      </div>
    </section>

    <!-- AI Config -->
    <section class="s-card" id="s-ai">
      <div class="s-head">
        <div class="s-title">AI Configuration</div>
        <div class="s-desc">Model selection, thresholds, and publishing rules</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <label class="s-label" for="ai-model">AI Model</label>
          <select id="ai-model" bind:value={aiModel} class="s-select">
            {#each aiModels as m}<option value={m}>{m}</option>{/each}
          </select>
        </div>
        <div class="s-row">
          <label class="s-label" for="dup-sens">Duplicate Sensitivity</label>
          <select id="dup-sens" bind:value={dupSensitivity} class="s-select" style="text-transform:capitalize">
            {#each dupOpts as d}<option value={d} style="text-transform:capitalize">{d}</option>{/each}
          </select>
        </div>
        <div class="s-row s-row-slider">
          <div class="s-slider-top">
            <div>
              <div class="s-label">Content Quality Threshold</div>
              <div class="s-hint">Minimum AI score to allow publishing</div>
            </div>
            <span class="s-slider-val">{qualityThreshold}%</span>
          </div>
          <input type="range" min="50" max="100" bind:value={qualityThreshold} class="s-slider"/>
          <div class="s-slider-ends"><span>50%</span><span>100%</span></div>
        </div>
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Auto Publishing</div>
            <div class="s-hint">Automatically publish articles that pass all thresholds</div>
          </div>
          <button class="tog" class:tog-on={autoPublish} on:click={()=>autoPublish=!autoPublish} aria-label="toggle"></button>
        </div>
      </div>
    </section>

    <!-- AI Behaviour -->
    <section class="s-card" id="s-aibehaviour">
      <div class="s-head">
        <div class="s-title">AI Behaviour</div>
        <div class="s-desc">Control how the AI generates, personalises, and regenerates content for users</div>
      </div>
      <div class="s-fields">

        <div class="s-row">
          <label class="s-label" for="ai-tone">Writing Tone</label>
          <select id="ai-tone" bind:value={aiBehaviour.tone} class="s-select">
            {#each toneOptions as t}<option value={t}>{t}</option>{/each}
          </select>
        </div>

        <div class="s-row">
          <label class="s-label" for="ai-style">Writing Style</label>
          <select id="ai-style" bind:value={aiBehaviour.writingStyle} class="s-select">
            {#each styleOptions as s}<option value={s}>{s}</option>{/each}
          </select>
        </div>

        <div class="s-row">
          <label class="s-label" for="ai-strategy">Content Strategy</label>
          <select id="ai-strategy" bind:value={aiBehaviour.contentStrategy} class="s-select">
            {#each strategyOptions as s}<option value={s}>{s}</option>{/each}
          </select>
        </div>

        <div class="s-row">
          <label class="s-label" for="ai-persona">Personalisation Weighting</label>
          <select id="ai-persona" bind:value={aiBehaviour.personaWeighting} class="s-select">
            {#each personaOptions as p}<option value={p}>{p}</option>{/each}
          </select>
        </div>

        <div class="s-row">
          <label class="s-label" for="ai-intro">Intro Style</label>
          <select id="ai-intro" bind:value={aiBehaviour.introStyle} class="s-select">
            <option value="context">Context — set the scene</option>
            <option value="hook">Hook — bold opening statement</option>
            <option value="stat">Statistic — lead with data</option>
            <option value="question">Question — engage the reader</option>
          </select>
        </div>

        <div class="s-row">
          <label class="s-label" for="ai-length">Preferred Article Length</label>
          <select id="ai-length" bind:value={aiBehaviour.preferredLength} class="s-select">
            <option value="short">Short — 250–400 words</option>
            <option value="medium">Medium — 400–700 words</option>
            <option value="long">Long — 700–1200 words</option>
          </select>
        </div>

        <div class="s-row s-row-slider">
          <div class="s-slider-top">
            <div>
              <div class="s-label">Max Regenerations per User</div>
              <div class="s-hint">How many times a user can regenerate a blog</div>
            </div>
            <span class="s-slider-val">{aiBehaviour.maxRegenerations}</span>
          </div>
          <input type="range" min="1" max="20" bind:value={aiBehaviour.maxRegenerations} class="s-slider"/>
          <div class="s-slider-ends"><span>1</span><span>20</span></div>
        </div>

        <div class="s-row s-row-slider">
          <div class="s-slider-top">
            <div>
              <div class="s-label">Minimum Variant Quality Score</div>
              <div class="s-hint">Regenerated blogs below this score are discarded</div>
            </div>
            <span class="s-slider-val">{aiBehaviour.minVariantScore.toFixed(1)}</span>
          </div>
          <input type="range" min="1" max="10" step="0.1" bind:value={aiBehaviour.minVariantScore} class="s-slider"/>
          <div class="s-slider-ends"><span>1.0</span><span>10.0</span></div>
        </div>

        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Use Reading History</div>
            <div class="s-hint">Factor in articles users have read when generating content</div>
          </div>
          <button class="tog" class:tog-on={aiBehaviour.useUserHistory} on:click={()=>aiBehaviour.useUserHistory=!aiBehaviour.useUserHistory} aria-label="toggle"></button>
        </div>

        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Use Bookmarks</div>
            <div class="s-hint">Give higher weight to bookmarked article categories</div>
          </div>
          <button class="tog" class:tog-on={aiBehaviour.useBookmarks} on:click={()=>aiBehaviour.useBookmarks=!aiBehaviour.useBookmarks} aria-label="toggle"></button>
        </div>

        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Use Interested Articles</div>
            <div class="s-hint">Prioritise categories from articles marked as interested</div>
          </div>
          <button class="tog" class:tog-on={aiBehaviour.useInterests} on:click={()=>aiBehaviour.useInterests=!aiBehaviour.useInterests} aria-label="toggle"></button>
        </div>

        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Diversify Topics</div>
            <div class="s-hint">Avoid generating the same category twice in a row</div>
          </div>
          <button class="tog" class:tog-on={aiBehaviour.diversifyTopics} on:click={()=>aiBehaviour.diversifyTopics=!aiBehaviour.diversifyTopics} aria-label="toggle"></button>
        </div>

        <div class="s-row s-row-terms">
          <div class="s-label" style="margin-bottom:10px">Banned Content Patterns</div>
          <div class="terms-row">
            {#each aiBehaviour.bannedPatterns as p}
              <span class="term-pill">{p}<button on:click={()=>removePattern(p)}>×</button></span>
            {/each}
            <div class="s-inline">
              <input bind:value={aiBehaviour.newPattern} on:keydown={onPatternKey} placeholder="Add pattern…" style="width:150px"/>
              <button class="btn btn-secondary btn-sm" on:click={addPattern}>Add</button>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Quality Thresholds -->
    <section class="s-card" id="s-quality">
      <div class="s-head">
        <div class="s-title">Quality Thresholds</div>
        <div class="s-desc">Minimum scores required to pass the pipeline</div>
      </div>
      <div class="s-fields">
        <div class="s-row s-row-slider">
          <div class="s-slider-top">
            <div>
              <div class="s-label">Relevance Minimum</div>
              <div class="s-hint">Articles below this score are rejected</div>
            </div>
            <span class="s-slider-val">{minRelevance.toFixed(1)}</span>
          </div>
          <input type="range" min="1" max="10" step="0.1" bind:value={minRelevance} class="s-slider"/>
          <div class="s-slider-ends"><span>1.0</span><span>10.0</span></div>
        </div>
        <div class="s-row s-row-slider">
          <div class="s-slider-top">
            <div>
              <div class="s-label">Innovation Minimum</div>
              <div class="s-hint">Filters out low-originality content</div>
            </div>
            <span class="s-slider-val">{minInnovation.toFixed(1)}</span>
          </div>
          <input type="range" min="1" max="10" step="0.1" bind:value={minInnovation} class="s-slider"/>
          <div class="s-slider-ends"><span>1.0</span><span>10.0</span></div>
        </div>
      </div>
    </section>

    <!-- Sources -->
    <section class="s-card" id="s-sources">
      <div class="s-head">
        <div class="s-title">Source Management</div>
        <div class="s-desc">Configure RSS feeds, News APIs, Medium, and scrapers</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <label class="s-label" for="rss-feed">RSS Feed URL</label>
          <input id="rss-feed" bind:value={rssFeed} class="s-input s-input-wide s-mono"/>
        </div>
        <div class="s-row">
          <label class="s-label" for="news-api-src">News API Key</label>
          <div class="s-inline">
            <input id="news-api-src" type="password" bind:value={newsApiKey} class="s-input s-mono"/>
            <button class="btn btn-secondary btn-sm">Test</button>
          </div>
        </div>
        <div class="s-row">
          <label class="s-label" for="medium-user">Medium Username</label>
          <input id="medium-user" bind:value={mediumUser} class="s-input"/>
        </div>
        <div class="s-row">
          <label class="s-label">Website Scrapers</label>
          <button class="btn btn-secondary btn-sm">Manage →</button>
        </div>
      </div>
    </section>

    <!-- CMS -->
    <section class="s-card" id="s-cms">
      <div class="s-head">
        <div class="s-title">CMS Connection</div>
        <div class="s-desc">Endpoint URL, credentials, and connection health</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <label class="s-label" for="cms-ep">Endpoint URL</label>
          <div class="s-inline">
            <input id="cms-ep" bind:value={cmsEndpoint} class="s-input s-mono"/>
            <button class="btn btn-secondary btn-sm" on:click={testCms} disabled={cmsStatus==='testing'}>
              {cmsStatus==='testing'?'Testing…':'Test'}
            </button>
          </div>
        </div>
        <div class="s-row">
          <span class="s-label">Status</span>
          <span class="cms-pill {cmsStatus}">
            {#if cmsStatus==='connected'}✓ Connected{:else if cmsStatus==='testing'}⟳ Testing…{:else}✗ Error{/if}
          </span>
        </div>
        <div class="s-row">
          <label class="s-label" for="cms-k">API Key</label>
          <div class="s-inline">
            {#if showCmsKey}
              <input id="cms-k" type="text"     bind:value={cmsApiKey} class="s-input s-mono"/>
            {:else}
              <input id="cms-k" type="password" bind:value={cmsApiKey} class="s-input s-mono"/>
            {/if}
            <button class="btn btn-secondary btn-sm" on:click={()=>showCmsKey=!showCmsKey}>{showCmsKey?'Hide':'Show'}</button>
            <button class="btn btn-secondary btn-sm" on:click={rotateCmsKey}>Rotate</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Notifications -->
    <section class="s-card" id="s-notifs">
      <div class="s-head">
        <div class="s-title">Notifications</div>
        <div class="s-desc">Choose which events trigger alerts</div>
      </div>
      <div class="s-fields">
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Email Alerts</div>
            <div class="s-hint">Receive all notifications via email</div>
          </div>
          <button class="tog" class:tog-on={emailAlerts} on:click={()=>emailAlerts=!emailAlerts} aria-label="toggle"></button>
        </div>
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Runtime Failure Alerts</div>
            <div class="s-hint">Immediate notification on pipeline error</div>
          </div>
          <button class="tog" class:tog-on={failAlerts} on:click={()=>failAlerts=!failAlerts} aria-label="toggle"></button>
        </div>
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Weekly Reports</div>
            <div class="s-hint">Summary email every Monday morning</div>
          </div>
          <button class="tog" class:tog-on={weeklyReport} on:click={()=>weeklyReport=!weeklyReport} aria-label="toggle"></button>
        </div>
        {#each notifs as n}
          <div class="s-row s-row-toggle">
            <div>
              <div class="s-label">{n.label}</div>
              <div class="s-hint">{n.hint}</div>
            </div>
            <button class="tog" class:tog-on={n.on} on:click={()=>n.on=!n.on} aria-label="toggle"></button>
          </div>
        {/each}
      </div>
    </section>

    <!-- Users -->
    <section class="s-card" id="s-users">
      <div class="s-head">
        <div class="s-title">User Management</div>
        <div class="s-desc">Roles, permissions, and access levels</div>
      </div>
      <div class="roles-wrap">
        <table class="roles-table">
          <thead>
            <tr><th>Role</th><th>Permissions</th><th class="num">Users</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {#each roles as r}
              <tr>
                <td class="td-bold">{r.name}</td>
                <td class="td-muted">{r.perms}</td>
                <td class="num">{r.users}</td>
                <td>
                  <div class="act-row">
                    <button class="act-btn">Edit</button>
                    <button class="act-btn">View</button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:14px">+ Invite User</button>
    </section>

    <!-- Backup -->
    <section class="s-card" id="s-backup">
      <div class="s-head">
        <div class="s-title">Backup &amp; Recovery</div>
        <div class="s-desc">Automated and manual backup management</div>
      </div>
      <div class="s-fields">
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Automatic Backup</div>
            <div class="s-hint">Scheduled backups of all platform data</div>
          </div>
          <button class="tog" class:tog-on={autoBackup} on:click={()=>autoBackup=!autoBackup} aria-label="toggle"></button>
        </div>
        <div class="s-row">
          <label class="s-label" for="backup-freq">Frequency</label>
          <select id="backup-freq" bind:value={backupFreq} class="s-select">
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div class="s-row">
          <div>
            <div class="s-label">Manual Backup</div>
            <div class="s-hint">Download a full snapshot right now</div>
          </div>
          <button class="btn btn-secondary btn-sm">Download</button>
        </div>
        <div class="s-row">
          <div>
            <div class="s-label">Restore Data</div>
            <div class="s-hint">Upload a previous backup to restore</div>
          </div>
          <input type="file" class="s-file"/>
        </div>
      </div>
    </section>

    <!-- API Keys -->
    <section class="s-card" id="s-apikeys">
      <div class="s-head">
        <div class="s-title">API Keys</div>
        <div class="s-desc">Third-party service credentials</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <label class="s-label">OpenAI Key</label>
          <div class="s-inline">
            {#if showOpenai}
              <input type="text"     value={openaiKey} class="s-input s-mono"/>
            {:else}
              <input type="password" value={openaiKey} class="s-input s-mono"/>
            {/if}
            <button class="btn btn-secondary btn-sm" on:click={()=>showOpenai=!showOpenai}>{showOpenai?'Hide':'Show'}</button>
            <button class="btn btn-secondary btn-sm">Rotate</button>
          </div>
        </div>
        <div class="s-row">
          <label class="s-label">Gemini Key</label>
          <div class="s-inline">
            {#if showGemini}
              <input type="text"     value={geminiKey} class="s-input s-mono"/>
            {:else}
              <input type="password" value={geminiKey} class="s-input s-mono"/>
            {/if}
            <button class="btn btn-secondary btn-sm" on:click={()=>showGemini=!showGemini}>{showGemini?'Hide':'Show'}</button>
            <button class="btn btn-secondary btn-sm">Rotate</button>
          </div>
        </div>
        <div class="s-row">
          <label class="s-label">News API Key</label>
          <div class="s-inline">
            {#if showNews}
              <input type="text"     value={newsKey} class="s-input s-mono"/>
            {:else}
              <input type="password" value={newsKey} class="s-input s-mono"/>
            {/if}
            <button class="btn btn-secondary btn-sm" on:click={()=>showNews=!showNews}>{showNews?'Hide':'Show'}</button>
            <button class="btn btn-secondary btn-sm">Rotate</button>
          </div>
        </div>
        <div class="s-row">
          <label class="s-label">Custom Key</label>
          <div class="s-inline">
            <input type="text" bind:value={customKey} placeholder="Paste key…" class="s-input s-mono"/>
            <button class="btn btn-secondary btn-sm">Save</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Security -->
    <section class="s-card" id="s-security">
      <div class="s-head">
        <div class="s-title">Security</div>
        <div class="s-desc">Authentication and access control</div>
      </div>
      <div class="s-fields">
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Two-Factor Authentication</div>
            <div class="s-hint">Require 2FA for all admin logins</div>
          </div>
          <button class="tog" class:tog-on={twoFAEnabled} on:click={()=>twoFAEnabled=!twoFAEnabled} aria-label="toggle"></button>
        </div>
        <div class="s-row">
          <div>
            <div class="s-label">Session Timeout</div>
            <div class="s-hint">Minutes of inactivity before auto-logout</div>
          </div>
          <div class="s-inline" style="width:auto">
            <input type="number" bind:value={sessionTimeout} min="5" max="480" style="width:72px;text-align:right"/>
            <span class="s-hint">min</span>
          </div>
        </div>
        <div class="s-row s-row-toggle">
          <div>
            <div class="s-label">Login Restrictions</div>
            <div class="s-hint">Restrict logins to whitelisted IP addresses</div>
          </div>
          <button class="tog" class:tog-on={loginRestrict} on:click={()=>loginRestrict=!loginRestrict} aria-label="toggle"></button>
        </div>
      </div>
    </section>

    <!-- Content Filters -->
    <section class="s-card" id="s-content">
      <div class="s-head">
        <div class="s-title">Content Filters</div>
        <div class="s-desc">Deduplication, word counts, and banned terms</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <div>
            <div class="s-label">Deduplication Window</div>
            <div class="s-hint">Days to look back for duplicate content</div>
          </div>
          <div class="s-inline" style="width:auto">
            <input type="number" bind:value={dedupWindow} min="1" max="365" style="width:72px;text-align:right"/>
            <span class="s-hint">days</span>
          </div>
        </div>
        <div class="s-row">
          <div>
            <div class="s-label">Word Count Range</div>
            <div class="s-hint">Articles outside this range are rejected</div>
          </div>
          <div class="s-inline" style="width:auto;gap:6px">
            <span class="s-hint">Min</span>
            <input type="number" bind:value={minWords} min="100" max="5000" style="width:72px;text-align:right"/>
            <span class="s-hint">–</span>
            <span class="s-hint">Max</span>
            <input type="number" bind:value={maxWords} min="100" max="20000" style="width:80px;text-align:right"/>
          </div>
        </div>
        <div class="s-row s-row-terms">
          <div class="s-label" style="margin-bottom:10px">Banned Terms</div>
          <div class="terms-row">
            {#each bannedTerms as t}
              <span class="term-pill">{t}<button on:click={()=>removeTerm(t)}>×</button></span>
            {/each}
            <div class="s-inline">
              <input bind:value={newTerm} on:keydown={onTermKey} placeholder="Add term…" style="width:130px"/>
              <button class="btn btn-secondary btn-sm" on:click={addTerm}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Danger Zone -->
    <section class="s-card s-danger" id="s-danger">
      <div class="s-head">
        <div class="s-title" style="color:var(--red)">Danger Zone</div>
        <div class="s-desc">Irreversible actions — proceed with care</div>
      </div>
      <div class="s-fields">
        <div class="s-row">
          <div>
            <div class="s-label" style="color:var(--red)">Reset Deduplication Database</div>
            <div class="s-hint">Clears all stored content hashes. Next run re-processes everything.</div>
          </div>
          {#if confirmReset}
            <div class="s-inline"><button class="btn btn-danger btn-sm" on:click={()=>confirmReset=false}>Confirm</button><button class="btn btn-secondary btn-sm" on:click={()=>confirmReset=false}>Cancel</button></div>
          {:else}
            <button class="btn btn-danger btn-sm" on:click={()=>confirmReset=true}>Reset DB</button>
          {/if}
        </div>
        <div class="s-row">
          <div>
            <div class="s-label" style="color:var(--amber)">Pause Pipeline for 7 Days</div>
            <div class="s-hint">Sets flag to PAUSE and schedules auto-resume.</div>
          </div>
          {#if confirmPause}
            <div class="s-inline"><button class="btn btn-sm amber-btn" on:click={()=>{setFlag('PAUSE');confirmPause=false;}}>Confirm</button><button class="btn btn-secondary btn-sm" on:click={()=>confirmPause=false}>Cancel</button></div>
          {:else}
            <button class="btn btn-sm amber-btn-outline" on:click={()=>confirmPause=true}>Pause 7d</button>
          {/if}
        </div>
        <div class="s-row">
          <div>
            <div class="s-label" style="color:var(--red)">Delete All Theme Profiles</div>
            <div class="s-hint">Permanently removes all theme configurations. Cannot be undone.</div>
          </div>
          {#if confirmDelete}
            <div class="s-inline"><button class="btn btn-danger btn-sm" on:click={()=>confirmDelete=false}>Confirm</button><button class="btn btn-secondary btn-sm" on:click={()=>confirmDelete=false}>Cancel</button></div>
          {:else}
            <button class="btn btn-danger btn-sm" on:click={()=>confirmDelete=true}>Delete</button>
          {/if}
        </div>
      </div>
    </section>

  </div><!-- /sp-body -->
</div><!-- /sp-root -->

<!-- Sticky save bar -->
<div class="save-bar">
  <span class="save-ts">{lastSaved ? `Last saved ${fmtSaved(lastSaved)}` : 'Unsaved changes'}</span>
  <button class="btn btn-primary" on:click={save} disabled={saving}>
    {saving ? 'Saving…' : 'Save Settings'}
  </button>
</div>

<style>
  /* ── Layout ── */
  .sp-root {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 40px;
    align-items: start;
    padding-bottom: 100px;
  }

  /* ── Sticky side nav ── */
  .sp-nav {
    position: sticky;
    top: 80px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .sp-nav-title {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 700;
    color: var(--text-black);
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--divider);
  }
  .sp-anchor {
    text-align: left;
    padding: 6px 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    font-family: var(--sans);
    border-radius: var(--radius);
    border-left: 2px solid transparent;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .sp-anchor:hover { color: var(--text-black); background: var(--off-white); border-left-color: var(--divider-strong); }
  .sp-anchor-active { color: var(--text-black) !important; background: var(--off-white); border-left-color: var(--text-black) !important; font-weight: 600; }
  .sp-anchor-danger { color: var(--red); }
  .sp-anchor-danger:hover { background: var(--red-light); border-left-color: var(--red); color: var(--red); }
  .sp-anchor-danger.sp-anchor-active { background: var(--red-light); border-left-color: var(--red); color: var(--red) !important; }

  /* ── Body ── */
  .sp-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Section card ── */
  .s-card {
    background: var(--white);
    border: 1px solid var(--divider);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .s-danger { border-color: var(--red-light); }
  .s-danger .s-head { border-left: 3px solid var(--red); }

  .s-head {
    padding: 16px 20px 14px;
    border-bottom: 1px solid var(--divider);
    background: var(--off-white);
  }
  .s-title { font-size: 14px; font-weight: 600; color: var(--text-black); font-family: var(--sans); margin-bottom: 2px; }
  .s-desc  { font-size: 12px; color: var(--text-muted); font-family: var(--sans); }

  /* ── Fields ── */
  .s-fields { display: flex; flex-direction: column; }
  .s-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 13px 20px;
    border-bottom: 1px solid var(--divider);
    transition: background 0.12s;
  }
  .s-row:last-child { border-bottom: none; }
  .s-row:hover { background: var(--off-white); }
  .s-row-toggle { align-items: center; }
  .s-row-slider { flex-direction: column; align-items: stretch; gap: 10px; }
  .s-row-terms  { flex-direction: column; align-items: flex-start; gap: 0; }

  .s-label { font-size: 13px; font-weight: 500; color: var(--text-black); font-family: var(--sans); white-space: nowrap; }
  .s-hint  { font-size: 12px; color: var(--text-muted); font-family: var(--sans); margin-top: 2px; }

  /* ── Inputs ── */
  .s-input {
    width: 220px;
    font-size: 13px;
    padding: 7px 10px;
    border: 1px solid var(--divider);
    border-radius: var(--radius);
    background: var(--white);
    color: var(--text-black);
    font-family: var(--sans);
    outline: none;
    transition: border-color 0.15s;
  }
  .s-input:focus { border-color: var(--text-black); }
  .s-input-wide { width: 300px; }
  .s-mono { font-family: monospace; font-size: 12px; }
  .s-select {
    font-size: 13px;
    padding: 7px 10px;
    border: 1px solid var(--divider);
    border-radius: var(--radius);
    background: var(--white);
    color: var(--text-black);
    font-family: var(--sans);
    outline: none;
    cursor: pointer;
    min-width: 160px;
  }
  .s-file { font-size: 12px; color: var(--text-muted); font-family: var(--sans); }
  .s-inline { display: flex; align-items: center; gap: 8px; }

  /* ── Toggle ── */
  .tog {
    width: 40px; height: 22px; border-radius: 99px;
    background: var(--divider); cursor: pointer;
    position: relative; transition: background 0.2s;
    flex-shrink: 0; border: none;
  }
  .tog-on { background: var(--green); }
  .tog::after {
    content: ''; position: absolute;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; top: 3px; left: 3px;
    transition: transform 0.2s;
  }
  .tog-on::after { transform: translateX(18px); }

  /* ── Slider ── */
  .s-slider-top { display: flex; align-items: center; justify-content: space-between; }
  .s-slider-val { font-size: 18px; font-weight: 700; color: var(--green); font-variant-numeric: tabular-nums; font-family: var(--sans); }
  .s-slider {
    width: 100%; height: 4px; border-radius: 2px;
    appearance: none; background: var(--divider);
    border: none; padding: 0; cursor: pointer;
    accent-color: var(--green);
  }
  .s-slider-ends { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-hint); margin-top: 4px; font-family: var(--sans); }

  /* ── CMS pill ── */
  .cms-pill { font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 100px; font-family: var(--sans); }
  .cms-pill.connected { background: var(--green-light); color: var(--green); }
  .cms-pill.testing   { background: var(--amber-light); color: var(--amber); }
  .cms-pill.error     { background: var(--red-light);   color: var(--red); }

  /* ── Roles table ── */
  .roles-wrap { border-top: 1px solid var(--divider); }
  .roles-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: var(--sans); }
  .roles-table th { text-align: left; padding: 8px 20px; font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; border-bottom: 1px solid var(--divider); background: var(--off-white); }
  .roles-table th.num { text-align: right; }
  .roles-table td { padding: 11px 20px; border-bottom: 1px solid var(--divider); color: var(--text-body); vertical-align: middle; }
  .roles-table tr:last-child td { border-bottom: none; }
  .roles-table tr:hover td { background: var(--off-white); }
  .roles-table .num { text-align: right; }
  .td-bold { font-weight: 500; color: var(--text-black); }
  .td-muted { color: var(--text-muted); }
  .act-row { display: flex; gap: 4px; }
  .act-btn { padding: 3px 10px; border: 1px solid var(--divider); background: none; border-radius: var(--radius); font-size: 12px; font-weight: 500; cursor: pointer; color: var(--text-muted); font-family: var(--sans); transition: all 0.12s; }
  .act-btn:hover { border-color: var(--text-black); color: var(--text-black); }

  /* ── Banned terms ── */
  .terms-row { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }
  .term-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; padding: 3px 10px; border-radius: 100px; background: var(--off-white); color: var(--text-body); border: 1px solid var(--divider); font-family: var(--sans); }
  .term-pill button { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); padding: 0; line-height: 1; }
  .term-pill button:hover { color: var(--red); }

  /* ── Danger ── */
  .amber-btn { background: var(--amber); color: #fff; border: none; }
  .amber-btn:hover { background: #B45309; }
  .amber-btn-outline { background: var(--white); color: var(--amber); border: 1px solid var(--amber); }
  .amber-btn-outline:hover { background: var(--amber-light); }

  /* ── Save bar ── */
  .save-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    display: flex; align-items: center; justify-content: flex-end; gap: 16px;
    padding: 13px 32px;
    background: var(--white);
    border-top: 1px solid var(--divider);
    z-index: 90;
  }
  .save-ts { font-size: 13px; color: var(--text-muted); font-family: var(--sans); }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .sp-root { grid-template-columns: 1fr; }
    .sp-nav { position: static; flex-direction: row; flex-wrap: wrap; border-bottom: 1px solid var(--divider); padding-bottom: 12px; gap: 4px; }
    .sp-nav-title { display: none; }
    .s-input-wide { width: 100%; }
  }
</style>
