<script>
  import { createEventDispatcher } from 'svelte';
  import { user, currentPage } from '../stores/store.js';

  const dispatch = createEventDispatcher();
  let step = 0;

  const steps = [
    {
      icon: '👋',
      title: 'Welcome, {name}!',
      subtitle: 'Your AI-powered blog curation workspace',
      desc: 'This quick tour will show you how to use the app in under 2 minutes. You can always revisit it from Settings.',
    },
    {
      icon: '🔍',
      title: 'Step 1 — Search a Topic',
      subtitle: 'Tell the AI what you want to write about',
      desc: 'Go to Home and type any topic — like "Mistral AI" or "startup funding". The AI will return the most relevant articles for you.',
      tip: 'Use the Trending Topics chips for quick searches, or pick from your Recent Searches.',
    },
    {
      icon: '👍',
      title: 'Step 2 — Pick What You Like',
      subtitle: 'You decide what gets published',
      desc: 'On the Discover page, review AI-scored articles and mark them:',
      items: [
        { label: 'Interested',     desc: 'Adds the article to your generation queue' },
        { label: 'Not Interested', desc: 'Removes it from your feed' },
        { label: 'Bookmark',       desc: 'Saves it to your Dashboard for later' },
      ],
      tip: 'Once you mark an article as Interested, a Generate Blog button appears.',
    },
    {
      icon: '🤖',
      title: 'Step 3 — AI Generates Your Blog',
      subtitle: 'Mistral AI writes a polished post for you',
      desc: 'Mistral (running locally via Ollama) reads your selected articles and writes a 400–500 word editorial post automatically.',
      items: [
        { label: 'Edit',       desc: 'Make manual changes to the generated content' },
        { label: 'Regenerate', desc: 'Ask the AI to rewrite from scratch' },
        { label: 'Discard',    desc: 'Reject and go back to Discover' },
      ],
    },
    {
      icon: '⏰',
      title: 'Step 4 — Schedule & Publish',
      subtitle: 'Set your time, the system does the rest',
      desc: 'Set your preferred publish time and timezone. The blog will be automatically published — no manual action needed.',
      tip: 'You can change your default publish time anytime in Settings.',
    },
    {
      icon: '🎉',
      title: "You're all set!",
      subtitle: 'Start curating your first blog',
      desc: "That's everything you need to know. Head to Home, search a topic, and let the AI do the heavy lifting.",
      cta: true,
    },
  ];

  $: current = steps[step];
  $: title   = step === 0 ? current.title.replace('{name}', $user?.name?.split(' ')[0] || 'there') : current.title;
  $: isLast  = step === steps.length - 1;
  $: isFirst = step === 0;
  $: progress = (step / (steps.length - 1)) * 100;

  function next()   { if (!isLast)  step++; }
  function prev()   { if (!isFirst) step--; }

  function finish() {
    user.update(u => {
      if (!u) return u;
      const updated = { ...u, isNew: false };
      localStorage.setItem('bca_user', JSON.stringify(updated));
      return updated;
    });
    dispatch('close');
  }

  /** @param {'home' | 'discover' | 'dashboard' | 'interested' | 'rejected' | 'scheduled' | 'published' | 'preview' | 'settings'} page */
  function goTo(page) { currentPage.set(page); finish(); }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="backdrop" on:click={() => dispatch('close')}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" on:click|stopPropagation>
    <!-- Progress bar -->
    <div class="progress-track">
      <div class="progress-fill" style="width:{progress}%"></div>
    </div>

    <!-- Dot indicators -->
    <div class="dots">
      {#each steps as _, i}
        <button class="dot" class:active={i === step} class:done={i < step} on:click={() => step = i} aria-label="Go to step {i + 1}"></button>
      {/each}
    </div>

    <!-- Body -->
    <div class="body">
      <div class="step-icon">{current.icon}</div>
      <h2 class="step-title">{title}</h2>
      <p class="step-subtitle">{current.subtitle}</p>
      <p class="step-desc">{current.desc}</p>

      {#if current.items}
        <div class="items-list">
          {#each current.items as item}
            <div class="item-row">
              <span class="item-dot"></span>
              <div class="item-text">
                <span class="item-label">{item.label}</span>
                <span class="item-sep"> — </span>
                <span class="item-desc">{item.desc}</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if current.tip}
        <div class="tip-box">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;margin-top:1px">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
          </svg>
          {current.tip}
        </div>
      {/if}

      {#if current.cta}
        <div class="cta-row">
          <button class="cta-btn primary" on:click={() => goTo('home')}>Start Searching</button>
          <button class="cta-btn outline" on:click={() => goTo('dashboard')}>View Dashboard</button>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="footer">
      <button class="skip-btn" on:click={finish}>Skip tour</button>
      <div class="nav-btns">
        {#if !isFirst}
          <button class="nav-btn outline" on:click={prev}>← Back</button>
        {/if}
        {#if !isLast}
          <button class="nav-btn primary" on:click={next}>Next →</button>
        {:else}
          <button class="nav-btn primary" on:click={finish}>Done</button>
        {/if}
      </div>
    </div>

  </div>
</div>

<style>
  .backdrop {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    background: var(--white);
    border: 1px solid var(--divider);
    border-radius: 12px;
    width: 100%; max-width: 480px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp {
    from { transform: translateY(16px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  /* Progress */
  .progress-track {
    height: 2px; background: var(--divider);
  }
  .progress-fill {
    height: 100%; background: var(--text-black);
    transition: width 0.3s ease;
  }

  /* Dots */
  .dots {
    display: flex; align-items: center; justify-content: center;
    gap: 6px; padding: 16px 24px 0;
  }
  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--divider); border: none; cursor: pointer;
    transition: all 0.2s; padding: 0;
  }
  .dot.active { background: var(--text-black); transform: scale(1.4); }
  .dot.done   { background: var(--text-muted); }

  /* Body */
  .body {
    padding: 24px 32px 28px;
    text-align: center;
  }

  .step-icon {
    font-size: 40px; margin-bottom: 16px;
    animation: pop 0.3s ease;

  }
  @keyframes pop {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  .step-title {
    font-family: var(--serif); font-size: 22px; font-weight: 700;
    color: var(--text-black); line-height: 1.25; margin-bottom: 6px;
    letter-spacing: -0.2px;
  }
  .step-subtitle {
    font-size: 13px; font-weight: 500; color: var(--green);
    margin-bottom: 12px; letter-spacing: 0.01em;
  }
  .step-desc {
    font-size: 14px; color: var(--text-muted); line-height: 1.7;
    margin-bottom: 16px;
  }

  /* Items list */
  .items-list {
    display: flex; flex-direction: column; gap: 8px;
    text-align: left; margin-bottom: 16px;
    background: var(--off-white); border: 1px solid var(--divider);
    border-radius: 8px; padding: 14px 16px;
  }
  .item-row {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13px;
  }
  .item-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--text-muted); flex-shrink: 0; margin-top: 6px;
  }
  .item-label { font-weight: 600; color: var(--text-black); }
  .item-sep   { color: var(--text-hint); }
  .item-desc  { color: var(--text-muted); }

  /* Tip */
  .tip-box {
    display: flex; align-items: flex-start; gap: 8px;
    background: var(--off-white); border: 1px solid var(--divider);
    border-left: 3px solid var(--text-black);
    border-radius: 6px; padding: 10px 14px;
    font-size: 13px; color: var(--text-body);
    text-align: left; margin-bottom: 4px;
    line-height: 1.6;
  }

  /* CTA */
  .cta-row {
    display: flex; gap: 10px; justify-content: center;
    margin-top: 12px;
  }
  .cta-btn {
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 500; font-family: var(--sans);
    padding: 10px 22px; border-radius: 100px; cursor: pointer;
    transition: all 0.15s;
  }
  .cta-btn.primary { background: var(--text-black); color: #fff; border: none; }
  .cta-btn.primary:hover { background: #333; }
  .cta-btn.outline { background: var(--white); color: var(--text-black); border: 1px solid var(--divider-strong); }
  .cta-btn.outline:hover { background: var(--off-white); }

  /* Footer */
  .footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px;
    border-top: 1px solid var(--divider);
    background: var(--off-white);
  }
  .skip-btn {
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; transition: color 0.15s;
  }
  .skip-btn:hover { color: var(--text-black); }

  .nav-btns { display: flex; gap: 8px; }
  .nav-btn {
    display: inline-flex; align-items: center;
    font-size: 13px; font-weight: 500; font-family: var(--sans);
    padding: 8px 18px; border-radius: 100px; cursor: pointer;
    transition: all 0.15s;
  }
  .nav-btn.primary { background: var(--text-black); color: #fff; border: none; }
  .nav-btn.primary:hover { background: #333; }
  .nav-btn.outline { background: var(--white); color: var(--text-black); border: 1px solid var(--divider-strong); }
  .nav-btn.outline:hover { background: var(--off-white); }
</style>
