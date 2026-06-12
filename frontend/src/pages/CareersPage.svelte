<script>
  export let onNav = (page) => {};
</script>

<div class="careers-page">
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

  <div class="careers-hero">
    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop" alt="Office" class="careers-hero-img" />
    <div class="careers-hero-overlay">
      <h1>Careers at BlogCurate</h1>
      <p>Help us build the best place to read and write on the internet.</p>
    </div>
  </div>

  <div class="careers-body">
    <div class="careers-inner">
      <div class="careers-note">
        <strong>IMPORTANT NOTE:</strong> BlogCurate has been made aware of scams involving fake job offers. Please do not engage with offers that look suspicious. All our open positions are available here.
      </div>

      <a href="#" class="careers-view-btn">View all open positions</a>

      <p class="careers-p">At BlogCurate, we believe in the power of words — and we're on a mission to bring the world's expertise to life through memorable storytelling. Our platform rewards great writing and puts power back in the hands of readers. BlogCurate's subscription model means we rely on our members, not ads.</p>

      <p class="careers-p">We're looking for teammates who are inspired by our mission, deeply thoughtful and empathetic, and passionate about the future of online publishing.</p>

      <h2 class="careers-h2">Why work at BlogCurate</h2>

      <div class="careers-reasons">
        <div class="careers-reason">
          <h3>A meaningful mission</h3>
          <p>Employees at BlogCurate are driven by passion, vision, and purpose. We believe in building a high-quality, open platform for sharing ideas — free from harassment, hate speech, and other harmful content.</p>
        </div>
        <div class="careers-reason">
          <h3>Remote-first culture</h3>
          <p>BlogCurate is a 100% remote workplace. We'll provide you with what you need to do your best work, including a stipend for home office expenses, Wi-Fi reimbursement, and a local co-working space membership.</p>
        </div>
        <div class="careers-reason">
          <h3>A creative environment</h3>
          <p>We're building a culture, not just a product. We believe in experimentation, innovation, and collaboration. We question ideas in product workshops, learn from the expertise of our colleagues, and create new things together.</p>
        </div>
        <div class="careers-reason">
          <h3>Generous benefits</h3>
          <p>Comprehensive health insurance, retirement plans, parental leave, and unlimited paid time off are just the start. We provide support for wellbeing, education, professional development, and mental health.</p>
        </div>
      </div>

      <a href="#" class="careers-view-btn">View all open positions</a>
    </div>
  </div>

  <footer class="med-footer">
    {#each [['Help','help'],['Status','status'],['About','about'],['Careers','careers'],['Blog','blog'],['Privacy','privacy'],['Rules','rules'],['Terms','terms'],['Text to speech','tts']] as [label, key]}
      <a href="#" on:click|preventDefault={() => onNav(key)}>{label}</a>
    {/each}
  </footer>
</div>

<style>
.careers-page { min-height: 100vh; background: var(--white); font-family: var(--sans); color: var(--text-body); display: flex; flex-direction: column; }
.top-nav { border-bottom: 1px solid var(--divider); padding: 0 24px; }
.top-nav-inner { max-width: 1192px; margin: 0 auto; height: 57px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { background: none; border: none; cursor: pointer; display: flex; }
.nav-right { display: flex; align-items: center; gap: 8px; }
.nav-link { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); font-family: var(--sans); padding: 7px 14px; border-radius: 100px; }
.nav-link:hover { color: var(--text-black); background: var(--off-white); }
.nav-pill { background: var(--text-black); color: var(--white); border: none; cursor: pointer; font-size: 14px; font-family: var(--sans); padding: 8px 20px; border-radius: 100px; transition: opacity 0.15s; }
.nav-pill:hover { opacity: 0.8; }

.careers-hero { position: relative; height: 320px; overflow: hidden; }
.careers-hero-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.55); }
.careers-hero-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px; }
.careers-hero-overlay h1 { font-family: var(--serif); font-size: 42px; font-weight: 700; color: #fff; margin-bottom: 12px; }
.careers-hero-overlay p { font-size: 18px; color: rgba(255,255,255,0.85); font-family: var(--serif); }

.careers-body { flex: 1; padding: 56px 24px; }
.careers-inner { max-width: 680px; margin: 0 auto; }
.careers-note { background: var(--amber-light); border: 1px solid var(--amber); border-radius: var(--radius); padding: 14px 18px; font-size: 14px; color: var(--text-body); line-height: 1.6; margin-bottom: 28px; }
.careers-view-btn { display: inline-block; background: var(--text-black); color: var(--white); text-decoration: none; padding: 12px 28px; border-radius: 100px; font-size: 15px; font-weight: 500; margin: 16px 0 32px; transition: opacity 0.15s; }
.careers-view-btn:hover { opacity: 0.8; }
.careers-p { font-size: 17px; color: var(--text-body); line-height: 1.75; margin-bottom: 20px; font-family: var(--serif); }
.careers-h2 { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); margin: 40px 0 24px; }
.careers-reasons { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
.careers-reason h3 { font-size: 17px; font-weight: 700; color: var(--text-black); margin-bottom: 10px; font-family: var(--serif); }
.careers-reason p { font-size: 15px; color: var(--text-muted); line-height: 1.65; }

.med-footer { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; padding: 16px 24px; border-top: 1px solid var(--divider); }
.med-footer a { font-size: 13px; color: var(--text-muted); text-decoration: none; padding: 4px 12px; border-right: 1px solid var(--divider); }
.med-footer a:last-child { border-right: none; }
.med-footer a:hover { color: var(--text-black); }
@media (max-width: 600px) { .careers-reasons { grid-template-columns: 1fr; } }
</style>
