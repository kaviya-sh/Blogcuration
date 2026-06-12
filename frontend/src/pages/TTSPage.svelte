<script>
  export let onNav = (page) => {};
</script>

<div class="tts-page">
  <nav class="top-nav">
    <div class="top-nav-inner">
      <button class="nav-logo" on:click={() => onNav('home')}>
        <svg width="28" height="28" viewBox="0 0 195 195" fill="none"><rect width="195" height="195" rx="4" fill="#000"/><path d="M45 65l30 65 30-65 30 65 15-32.5" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="nav-right">
        <button class="nav-link" on:click={() => onNav('auth-signin')}>Sign in</button>
        <button class="nav-pill" on:click={() => onNav('auth-signup')}>Get started</button>
      </div>
    </div>
  </nav>

  <div class="tts-body">
    <div class="tts-inner">
      <!-- Hero -->
      <div class="tts-hero">
        <div class="tts-mic-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#292929" stroke-width="1.5">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <h1 class="tts-title">Listen to BlogCurate with Text to Speech</h1>
        <p class="tts-lead">BlogCurate members can listen to any story with the Listen button. Powered by AI text-to-speech, you can hear articles read aloud while you commute, work out, or multitask.</p>
        <button class="tts-cta" on:click={() => onNav('auth-signup')}>Become a member to listen</button>
      </div>

      <!-- How it works -->
      <div class="tts-section">
        <h2 class="tts-h2">How to listen on BlogCurate</h2>
        <div class="tts-steps">
          <div class="tts-step">
            <div class="tts-step-num">1</div>
            <div>
              <h3 class="tts-step-title">Open any story</h3>
              <p class="tts-step-body">Navigate to any BlogCurate story as a logged-in member.</p>
            </div>
          </div>
          <div class="tts-step">
            <div class="tts-step-num">2</div>
            <div>
              <h3 class="tts-step-title">Click the Listen button</h3>
              <p class="tts-step-body">Find the "Listen" button at the top of the story. Click it to start audio playback.</p>
            </div>
          </div>
          <div class="tts-step">
            <div class="tts-step-num">3</div>
            <div>
              <h3 class="tts-step-title">Choose your voice & speed</h3>
              <p class="tts-step-body">Select from multiple narrator voices. Adjust playback speed from 0.5× to 4.5×.</p>
            </div>
          </div>
          <div class="tts-step">
            <div class="tts-step-num">4</div>
            <div>
              <h3 class="tts-step-title">Follow along</h3>
              <p class="tts-step-body">Words are highlighted as they're read aloud, so you can read and listen simultaneously.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Benefits -->
      <div class="tts-section">
        <h2 class="tts-h2">Why members love it</h2>
        <div class="tts-benefits">
          {#each [
            { icon: '🚶', title: 'Listen on the go', body: 'Consume articles while commuting, exercising, or doing chores. Members listen to up to 3× more stories.' },
            { icon: '⚡', title: 'Speed listening', body: 'Speed through your reading list at 2–4.5× speed. A productivity hack for curious minds.' },
            { icon: '✍️', title: 'Proofread your drafts', body: 'Writers use Listen to catch awkward sentences. Hear your story the way readers will experience it.' },
            { icon: '♿', title: 'Accessible reading', body: 'An estimated 1 in 5 people faces dyslexia or visual impairment. Audio lowers the barrier to great ideas.' },
          ] as b}
            <div class="tts-benefit">
              <span class="tts-benefit-icon">{b.icon}</span>
              <h3 class="tts-benefit-title">{b.title}</h3>
              <p class="tts-benefit-body">{b.body}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Testimonial -->
      <div class="tts-quote">
        <blockquote>"When working out, I used to read on my phone between sets. Now, it's so much easier with audio — I can listen to many more articles than I could read before."</blockquote>
        <cite>— Jess, BlogCurate listener</cite>
      </div>

      <!-- CTA -->
      <div class="tts-bottom-cta">
        <h2 class="tts-h2">Start listening today</h2>
        <p>Become a BlogCurate member to unlock audio for every story.</p>
        <button class="tts-cta" on:click={() => onNav('auth-signup')}>Get started — it's free</button>
      </div>
    </div>
  </div>

  <footer class="med-footer">
    {#each [['Help','help'],['Status','status'],['About','about'],['Careers','careers'],['Blog','blog'],['Privacy','privacy'],['Rules','rules'],['Terms','terms'],['Text to speech','tts']] as [label, key]}
      <a href="#" on:click|preventDefault={() => onNav(key)}>{label}</a>
    {/each}
  </footer>
</div>

<style>
.tts-page { min-height: 100vh; background: var(--white); font-family: var(--sans); color: var(--text-body); display: flex; flex-direction: column; }
.top-nav { border-bottom: 1px solid var(--divider); padding: 0 24px; }
.top-nav-inner { max-width: 1192px; margin: 0 auto; height: 57px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { background: none; border: none; cursor: pointer; display: flex; }
.nav-right { display: flex; align-items: center; gap: 8px; }
.nav-link { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); font-family: var(--sans); padding: 7px 14px; border-radius: 100px; }
.nav-link:hover { color: var(--text-black); background: var(--off-white); }
.nav-pill { background: var(--text-black); color: var(--white); border: none; cursor: pointer; font-size: 14px; font-family: var(--sans); padding: 8px 20px; border-radius: 100px; transition: opacity 0.15s; }
.nav-pill:hover { opacity: 0.8; }

.tts-body { flex: 1; padding: 56px 24px; }
.tts-inner { max-width: 740px; margin: 0 auto; }

.tts-hero { text-align: center; margin-bottom: 64px; }
.tts-mic-icon { width: 80px; height: 80px; border-radius: 50%; background: var(--off-white); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
.tts-title { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--text-black); line-height: 1.2; margin-bottom: 16px; }
.tts-lead { font-size: 18px; color: var(--text-muted); line-height: 1.7; max-width: 560px; margin: 0 auto 28px; font-family: var(--serif); }
.tts-cta { background: var(--text-black); color: var(--white); border: none; cursor: pointer; font-size: 15px; font-family: var(--sans); font-weight: 500; padding: 12px 28px; border-radius: 100px; transition: opacity 0.15s; }
.tts-cta:hover { opacity: 0.8; }

.tts-section { margin-bottom: 56px; }
.tts-h2 { font-family: var(--serif); font-size: 26px; font-weight: 700; color: var(--text-black); margin-bottom: 28px; }

.tts-steps { display: flex; flex-direction: column; gap: 24px; }
.tts-step { display: flex; align-items: flex-start; gap: 20px; }
.tts-step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--text-black); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; flex-shrink: 0; }
.tts-step-title { font-size: 16px; font-weight: 700; color: var(--text-black); margin-bottom: 4px; }
.tts-step-body { font-size: 15px; color: var(--text-muted); line-height: 1.6; }

.tts-benefits { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.tts-benefit { padding: 24px; border: 1px solid var(--divider); border-radius: 8px; }
.tts-benefit-icon { font-size: 28px; display: block; margin-bottom: 12px; }
.tts-benefit-title { font-size: 16px; font-weight: 700; color: var(--text-black); margin-bottom: 8px; }
.tts-benefit-body { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

.tts-quote { border-left: 3px solid var(--green); padding: 16px 24px; margin: 40px 0; background: var(--green-light); border-radius: 0 var(--radius) var(--radius) 0; }
.tts-quote blockquote { font-family: var(--serif); font-size: 18px; font-style: italic; color: var(--text-black); line-height: 1.6; margin-bottom: 10px; }
.tts-quote cite { font-size: 14px; color: var(--text-hint); }

.tts-bottom-cta { text-align: center; padding: 48px 0; border-top: 1px solid var(--divider); }
.tts-bottom-cta p { font-size: 16px; color: var(--text-muted); margin-bottom: 20px; }

.med-footer { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; padding: 16px 24px; border-top: 1px solid var(--divider); }
.med-footer a { font-size: 13px; color: var(--text-muted); text-decoration: none; padding: 4px 12px; border-right: 1px solid var(--divider); }
.med-footer a:last-child { border-right: none; }
.med-footer a:hover { color: var(--text-black); }
@media (max-width: 540px) { .tts-benefits { grid-template-columns: 1fr; } .tts-title { font-size: 26px; } }
</style>
