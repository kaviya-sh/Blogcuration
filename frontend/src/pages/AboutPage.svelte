<script>
  export let onNav = (page) => {};
</script>

<div class="about-page">
  <nav class="about-nav">
    <div class="about-nav-inner">
      <div class="about-nav-left">
        <button class="about-nav-logo" on:click={() => onNav('home')}>
          <svg width="28" height="28" viewBox="0 0 195 195" fill="none"><rect width="195" height="195" rx="4" fill="#000"/><path d="M45 65l30 65 30-65 30 65 15-32.5" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="about-nav-right">
        <button class="about-nav-link" on:click={() => onNav('auth-signin')}>Sign in</button>
        <button class="about-nav-link" on:click={() => onNav('auth-signup')}>Sign up</button>
      </div>
    </div>
  </nav>

  <div class="about-body">
    <div class="about-inner">
      <h1 class="about-h1">Everyone has a story to tell</h1>

      <p class="about-p">BlogCurate is a home for human stories and ideas. Here, anyone can share knowledge and wisdom with the world — without having to build a mailing list or a following first. The internet is noisy and chaotic; BlogCurate is quiet yet full of insight. It's simple, beautiful, collaborative, and helps you find the right readers for whatever you have to say.</p>

      <p class="about-p about-p-large">Ultimately, our goal is to deepen our collective understanding of the world through the power of writing.</p>

      <p class="about-p">We believe that what you read and write matters. Words can divide or empower us, inspire or discourage us. In a world where the most sensational and surface-level stories often win, we're building a system that rewards depth, nuance, and time well spent. A space for thoughtful conversation more than drive-by takes, and substance over packaging.</p>

      <p class="about-p">Over 100 million people connect and share their wisdom on BlogCurate every month. They're software developers, amateur novelists, product designers, CEOs, and anyone burning with a story they need to get out into the world. They write about what they're working on, what's keeping them up at night, what they've lived through, and what they've learned that the rest of us might want to know too.</p>

      <p class="about-p">Instead of selling ads or selling your data, we're supported by a growing community of over a million BlogCurate members who believe in our mission. If you're new here, start reading. Dive deeper into whatever matters to you. Find a post that helps you learn something new, or reconsider something familiar — and then write your story.</p>

      <div class="about-ctas">
        <button class="about-cta-link" on:click={() => onNav('auth-signup')}>
          Start reading <span class="about-arrow">→</span>
        </button>
        <button class="about-cta-link" on:click={() => onNav('auth-signup')}>
          Start writing <span class="about-arrow">→</span>
        </button>
        <button class="about-cta-link" on:click={() => onNav('membership')}>
          Become a member <span class="about-arrow">→</span>
        </button>
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
.about-page { min-height: 100vh; background: var(--white); font-family: var(--sans); color: var(--text-body); display: flex; flex-direction: column; }

.about-nav { border-bottom: 1px solid var(--divider); padding: 0 24px; }
.about-nav-inner { max-width: 1192px; margin: 0 auto; height: 57px; display: flex; align-items: center; justify-content: space-between; }
.about-nav-left { display: flex; align-items: center; gap: 24px; }
.about-nav-logo { background: none; border: none; cursor: pointer; display: flex; align-items: center; }
.about-nav-right { display: flex; align-items: center; gap: 8px; }
.about-nav-link { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); font-family: var(--sans); padding: 7px 14px; border-radius: 100px; transition: color 0.15s, background 0.15s; }
.about-nav-link:hover { color: var(--text-black); background: var(--off-white); }

.about-body { flex: 1; padding: 80px 24px; }
.about-inner { max-width: 680px; margin: 0 auto; }

.about-h1 { font-family: var(--serif); font-size: 46px; font-weight: 700; color: var(--text-black); line-height: 1.15; letter-spacing: -1px; margin-bottom: 32px; }
.about-p { font-size: 18px; color: var(--text-body); line-height: 1.75; margin-bottom: 28px; font-family: var(--serif); }
.about-p-large { font-size: 22px; font-weight: 500; color: var(--text-black); line-height: 1.5; }

.about-ctas { display: flex; flex-direction: column; gap: 12px; margin-top: 40px; }
.about-cta-link { background: none; border: none; cursor: pointer; font-size: 18px; color: var(--text-black); font-family: var(--sans); text-align: left; padding: 0; display: flex; align-items: center; gap: 8px; font-weight: 500; width: fit-content; }
.about-cta-link:hover { text-decoration: underline; }
.about-arrow { font-size: 20px; }

.med-footer { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; padding: 14px 24px; border-top: 1px solid var(--divider); }
.med-footer a { font-size: 13px; color: var(--text-muted); text-decoration: none; padding: 4px 12px; border-right: 1px solid var(--divider); }
.med-footer a:last-child { border-right: none; }
.med-footer a:hover { color: var(--text-black); }
</style>
