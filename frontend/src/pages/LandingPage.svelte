<script>
  import { appMode } from '../stores/store.js';
  import heroImg from '../assets/blog_header.png';

  let page = 'home';
  function go(p) { page = p; window.scrollTo(0, 0); }
  function openAuth(mode) { appMode.set(mode === 'write' ? 'auth-write' : 'auth-signin'); }
  function openSignup() { appMode.set('auth-signup'); }
</script>

<header class="nav">
  <button class="nav-logo" on:click={() => go('home')}>BlogCurate</button>
  <nav class="nav-links">
    <button class="nav-link" class:active={page === 'our-story'} on:click={() => go('our-story')}>Our story</button>
    <button class="nav-link" class:active={page === 'membership'} on:click={() => go('membership')}>Membership</button>
    <button class="nav-link" on:click={() => openAuth('write')}>Write</button>
    <button class="nav-link" on:click={() => openAuth('signin')}>Sign in</button>
    <button class="nav-link" on:click={() => appMode.set('admin')}>Admin</button>
    <button class="nav-cta" on:click={openSignup}>Get started</button>
  </nav>
</header>

{#if page === 'home'}
<main class="main">

  <section class="hero">
    <div class="hero-left">
      <h1 class="hero-h1">Read what<br/>matters.<br/>Every day.</h1>
      <p class="hero-sub">BlogCurate discovers, scores, and delivers the best articles every morning — so you don't have to.</p>
      <button class="btn-cta" on:click={openSignup}>Start reading</button>
    </div>
    <div class="hero-right">
      <div class="img-scene">
        <!-- Animated background rings -->
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
        <!-- Floating particles -->
        <div class="particle p1"></div>
        <div class="particle p2"></div>
        <div class="particle p3"></div>
        <div class="particle p4"></div>
        <div class="particle p5"></div>
        <!-- Glow blob behind image -->
        <div class="glow-blob"></div>
        <!-- The actual image -->
        <img src={heroImg} alt="BlogCurate AI curation illustration" class="hero-img" />
      </div>
    </div>
  </section>

  <div class="marquee-wrap">
    <div class="marquee-track">
      {#each Array(3) as _}
        <span>AI &nbsp;·&nbsp; Technology &nbsp;·&nbsp; Science &nbsp;·&nbsp; Health &nbsp;·&nbsp; Sustainability &nbsp;·&nbsp; Startups &nbsp;·&nbsp; Future of Work &nbsp;·&nbsp; Engineering &nbsp;·&nbsp; Design &nbsp;·&nbsp; Finance &nbsp;·&nbsp; Climate &nbsp;·&nbsp; </span>
      {/each}
    </div>
  </div>

  <section class="secondary">
    <div class="sec-item" on:click={() => go('our-story')} role="button" tabindex="0" on:keydown={e => e.key==='Enter' && go('our-story')}>
      <div class="sec-img-wrap">
        <img src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&h=440&fit=crop" alt="" />
      </div>
      <div class="sec-body">
        <span class="sec-eyebrow">Our story</span>
        <h3 class="sec-title">Every great idea deserves to be read.</h3>
        <p class="sec-sub">How BlogCurate came to be — and why we believe in the power of ideas.</p>
        <span class="sec-cta">Read our story →</span>
      </div>
    </div>
    <div class="sec-item sec-item-delay" on:click={() => go('membership')} role="button" tabindex="0" on:keydown={e => e.key==='Enter' && go('membership')}>
      <div class="sec-img-wrap">
        <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=440&fit=crop" alt="" />
      </div>
      <div class="sec-body">
        <span class="sec-eyebrow">Membership</span>
        <h3 class="sec-title">Read without limits. Publish without friction.</h3>
        <p class="sec-sub">Unlock unlimited curation, AI blog generation, and a growing community.</p>
        <span class="sec-cta">View membership →</span>
      </div>
    </div>
  </section>

</main>

{:else if page === 'our-story'}
<main class="inner-page">
  <div class="inner-hero">
    <span class="eyebrow">Our story</span>
    <h1 class="inner-h1">Every great idea<br/>deserves to be read.</h1>
    <p class="inner-lead">We built BlogCurate on a simple belief: the internet produces more signal than any one person can read.</p>
  </div>
  <img class="inner-full-img" src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1400&h=600&fit=crop" alt=""/>
  <div class="inner-body">
    <div class="inner-prose">
      <h2>The problem we saw</h2>
      <p>Every morning, thousands of articles get published across TechCrunch, Nature, arXiv, Hacker News, and hundreds of niche publications. The best ideas are buried. Most people never find them.</p>
      <p>We were frustrated by the noise. Not enough time. Too many tabs. Summaries that missed the point. We wanted something that understood <em>context</em>, not just keywords.</p>
      <h2>What we built</h2>
      <p>Our pipeline wakes up at 02:00 every morning, scans thousands of sources, scores each article for relevance and innovation using Mistral AI, and delivers the best directly to your feed — ranked, formatted, and ready.</p>
      <blockquote>"Read less. Understand more."</blockquote>
      <h2>Who we are</h2>
      <p>A small team of engineers, readers, and writers who believe that access to great ideas should be effortless. BlogCurate is our answer to information overload.</p>
    </div>
    <div class="inner-aside">
      <img src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=300&fit=crop" alt=""/>
      <div class="stat-grid">
        {#each [['2 400+','Articles curated'],['12','Topic categories'],['02:00','Daily run IST'],['98%','Uptime']] as [n,l]}
          <div class="stat"><div class="stat-n">{n}</div><div class="stat-l">{l}</div></div>
        {/each}
      </div>
    </div>
  </div>
  <div class="inner-cta-row">
    <button class="btn-cta" on:click={openSignup}>Start reading for free</button>
    <button class="btn-ghost" on:click={() => go('membership')}>View membership →</button>
  </div>
</main>

{:else if page === 'membership'}
<main class="inner-page">
  <div class="inner-hero center">
    <span class="eyebrow">Membership</span>
    <h1 class="inner-h1">Read without limits.<br/>Publish without friction.</h1>
    <p class="inner-lead">Everything you need to stay informed, generate high-quality posts, and build an audience.</p>
  </div>
  <div class="plans">
    <div class="plan">
      <div class="plan-tier">Free</div>
      <div class="plan-price">$0 <span>/mo</span></div>
      <p class="plan-desc">For casual readers who want a daily dose of curated content.</p>
      <ul class="plan-list">
        {#each ['Browse full curated feed','Up to 5 interests / day','2 AI posts / month','Bookmarks','Search all topics'] as f}<li class="y">{f}</li>{/each}
        {#each ['Auto-publish scheduler','Priority curation','Bilingual feed'] as f}<li class="n">{f}</li>{/each}
      </ul>
      <button class="btn-ghost full" on:click={openSignup}>Get started free</button>
    </div>
    <div class="plan plan-featured">
      <div class="plan-popular">Most popular</div>
      <div class="plan-tier">Member</div>
      <div class="plan-price">$5 <span>/mo</span></div>
      <p class="plan-desc">For power readers who want to publish and grow.</p>
      <ul class="plan-list">
        {#each ['Everything in Free','Unlimited interests','Unlimited AI generation','Auto-publish scheduler','Bilingual EN + FR','Priority scoring','Email digest','Early access'] as f}<li class="y">{f}</li>{/each}
      </ul>
      <button class="btn-white full" on:click={openSignup}>Become a member</button>
    </div>
    <div class="plan">
      <div class="plan-tier">Team</div>
      <div class="plan-price">$12 <span>/mo per seat</span></div>
      <p class="plan-desc">For teams and publications that need shared curation workflows.</p>
      <ul class="plan-list">
        {#each ['Everything in Member','Shared curation queue','Admin analytics','Custom themes','Pipeline controls','Dedicated support','Audit log','SSO / custom domain'] as f}<li class="y">{f}</li>{/each}
      </ul>
      <button class="btn-ghost full" on:click={() => appMode.set('admin')}>Try Admin Panel</button>
    </div>
  </div>
  <div class="faq-section">
    <h2 class="faq-heading">Frequently asked</h2>
    {#each [
      ['Can I cancel anytime?','Yes. No contracts, no fees. Cancel any time from your settings page.'],
      ['Is there a free trial for Member?','You get a 14-day free trial on your first Member subscription.'],
      ['What payment methods do you accept?','Visa, Mastercard, American Express, and PayPal.'],
      ['Can I switch plans?','Absolutely — upgrade or downgrade at any time. Changes take effect immediately.'],
    ] as [q,a]}
      <details class="faq-item">
        <summary class="faq-q">{q}</summary>
        <p class="faq-a">{a}</p>
      </details>
    {/each}
  </div>
</main>
{/if}

<footer class="footer">
  {#each [['Help','help'],['Status','status'],['About','about'],['Careers','careers'],['Blog','blog'],['Privacy','privacy'],['Rules','rules'],['Terms','terms'],['Text to speech','tts']] as [label, key]}
    <a href="#" class="footer-link" on:click|preventDefault={() => appMode.set(key)}>{label}</a>
  {/each}
</footer>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 56px; height: 68px;
  background: #f7f4ee;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  position: sticky; top: 0; z-index: 200;
}
.nav-logo {
  font-family: var(--serif); font-size: 26px; font-weight: 700;
  color: #1a1a1a; background: none; border: none; cursor: pointer;
  letter-spacing: -0.6px;
}
.nav-links { display: flex; align-items: center; }
.nav-link {
  background: none; border: none; cursor: pointer;
  font-size: 14px; color: #1a1a1a; font-family: var(--sans);
  padding: 8px 16px; border-radius: 100px; transition: background 0.2s;
}
.nav-link:hover { background: rgba(0,0,0,0.06); }
.nav-link.active { font-weight: 600; }
.nav-cta {
  background: #1a1a1a; color: #fff; border: none;
  font-size: 14px; font-family: var(--sans); font-weight: 500;
  cursor: pointer; padding: 10px 24px; border-radius: 100px;
  margin-left: 10px; transition: background 0.2s;
}
.nav-cta:hover { background: #333; }

.main { background: #f7f4ee; }

/* HERO */
.hero {
  display: flex; align-items: center;
  min-height: calc(100vh - 68px);
  background: #f7f4ee;
  overflow: hidden;
}
.hero-left {
  flex: 0 0 50%;
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 56px 80px 80px;
}
.hero-h1 {
  font-family: var(--serif); font-size: 96px; font-weight: 700;
  color: #1a1a1a; line-height: 0.97; letter-spacing: -4px;
  margin-bottom: 28px;
}
.hero-sub {
  font-family: var(--serif); font-size: 20px; color: #444;
  line-height: 1.65; margin-bottom: 44px; max-width: 440px;
}
.btn-cta {
  display: inline-flex; align-items: center;
  background: #1a1a1a; color: #fff; border: none;
  font-size: 16px; font-family: var(--sans); font-weight: 500;
  cursor: pointer; padding: 15px 36px; border-radius: 100px;
  transition: background 0.2s; align-self: flex-start;
}
.btn-cta:hover { background: #333; }

.hero-right {
  flex: 0 0 50%;
  display: flex; align-items: center; justify-content: center;
  padding: 32px 40px 32px 16px;
  position: relative;
}

/* Scene wrapper */
.img-scene {
  position: relative;
  width: 100%;
  max-width: 540px;
  display: flex; align-items: center; justify-content: center;
}

/* Background blend — same as page bg */
.img-scene::before {
  content: '';
  position: absolute; inset: 0;
  background: #f7f4ee;
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
}

/* Pulsing rings */
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(26,137,23,0.18);
  animation: ringPulse 4s ease-in-out infinite;
  z-index: 1;
}
.ring-1 { width: 340px; height: 340px; animation-delay: 0s; }
.ring-2 { width: 460px; height: 460px; animation-delay: 0.8s; border-color: rgba(26,137,23,0.10); }
.ring-3 { width: 580px; height: 580px; animation-delay: 1.6s; border-color: rgba(26,137,23,0.05); }
@keyframes ringPulse {
  0%,100% { transform: scale(1);   opacity: 1; }
  50%     { transform: scale(1.04); opacity: 0.5; }
}

/* Green glow blob */
.glow-blob {
  position: absolute;
  width: 280px; height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(26,137,23,0.12) 0%, transparent 70%);
  animation: blobPulse 6s ease-in-out infinite;
  z-index: 1;
}
@keyframes blobPulse {
  0%,100% { transform: scale(1);    opacity: 0.8; }
  50%     { transform: scale(1.15); opacity: 1; }
}

/* Floating particles */
.particle {
  position: absolute;
  border-radius: 50%;
  z-index: 2;
  animation: particleDrift linear infinite;
}
.p1 { width: 8px;  height: 8px;  background: #1a8917; opacity: 0.5; top: 12%;  left: 8%;  animation-duration: 7s;  animation-delay: 0s; }
.p2 { width: 5px;  height: 5px;  background: #1a1a1a; opacity: 0.25; top: 20%;  right: 10%; animation-duration: 9s;  animation-delay: 1s; }
.p3 { width: 10px; height: 10px; background: #1a8917; opacity: 0.35; bottom: 18%; left: 12%; animation-duration: 8s;  animation-delay: 2s; }
.p4 { width: 6px;  height: 6px;  background: #1a1a1a; opacity: 0.2;  bottom: 22%; right: 8%;  animation-duration: 11s; animation-delay: 0.5s; }
.p5 { width: 7px;  height: 7px;  background: #1a8917; opacity: 0.4;  top: 50%;  left: 4%;  animation-duration: 10s; animation-delay: 3s; }
@keyframes particleDrift {
  0%   { transform: translateY(0)    rotate(0deg); }
  33%  { transform: translateY(-18px) rotate(120deg); }
  66%  { transform: translateY(10px)  rotate(240deg); }
  100% { transform: translateY(0)    rotate(360deg); }
}

/* The image */
.hero-img {
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  display: block;
  mix-blend-mode: multiply;
  animation:
    heroReveal 1s cubic-bezier(0.22,1,0.36,1) both,
    heroFloat 6s ease-in-out 1s infinite;
  filter: drop-shadow(0 20px 40px rgba(26,137,23,0.15)) drop-shadow(0 8px 16px rgba(0,0,0,0.08));
}
@keyframes heroReveal {
  from { opacity: 0; transform: translateY(40px) scale(0.92) rotate(-1deg); }
  to   { opacity: 1; transform: translateY(0)    scale(1)    rotate(0deg); }
}
@keyframes heroFloat {
  0%,100% { transform: translateY(0)     rotate(0deg); }
  25%     { transform: translateY(-12px)  rotate(0.4deg); }
  75%     { transform: translateY(6px)   rotate(-0.3deg); }
}

/* MARQUEE */
.marquee-wrap { overflow: hidden; background: #1a1a1a; padding: 15px 0; }
.marquee-track {
  display: flex; white-space: nowrap;
  animation: marquee 35s linear infinite;
  font-size: 11px; color: #fff; letter-spacing: 0.12em;
  font-weight: 600; text-transform: uppercase; font-family: var(--sans);
}
@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }

/* SECONDARY */
.secondary {
  display: flex; background: #f7f4ee;
  padding: 80px 80px 100px; gap: 60px;
}
.sec-item {
  flex: 1; cursor: pointer; display: flex; flex-direction: column; gap: 24px;
  animation: secReveal 0.9s cubic-bezier(0.22,1,0.36,1) both;
}
.sec-item-delay { animation-delay: 0.18s; }
@keyframes secReveal {
  from { opacity: 0; transform: translateY(36px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
.sec-img-wrap {
  overflow: hidden; border-radius: 4px;
  width: 100%; height: 260px;
}
.sec-img-wrap img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
}
.sec-item:hover .sec-img-wrap img { transform: scale(1.04); }
.sec-body { display: flex; flex-direction: column; gap: 10px; }
.sec-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #888; font-family: var(--sans); }
.sec-title { font-family: var(--serif); font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.25; }
.sec-sub { font-size: 16px; color: #666; line-height: 1.65; }
.sec-cta { font-size: 14px; font-weight: 600; color: #1a1a1a; font-family: var(--sans); }

/* INNER PAGES */
.inner-page { background: #f7f4ee; min-height: calc(100vh - 68px); }
.inner-hero { padding: 80px 120px 64px; max-width: 900px; }
.inner-hero.center { text-align: center; max-width: 100%; padding: 80px 80px 56px; }
.eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #888; font-family: var(--sans); display: block; margin-bottom: 20px; }
.inner-h1 { font-family: var(--serif); font-size: 62px; font-weight: 700; color: #1a1a1a; line-height: 1.08; letter-spacing: -2px; margin-bottom: 24px; }
.inner-lead { font-family: var(--serif); font-size: 20px; color: #555; line-height: 1.65; max-width: 640px; }
.inner-hero.center .inner-lead { margin: 0 auto; }
.inner-full-img { width: 100%; height: 460px; object-fit: cover; display: block; }
.inner-body { display: flex; gap: 80px; padding: 72px 120px; }
.inner-prose { flex: 1; }
.inner-prose h2 { font-family: var(--serif); font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 40px 0 16px; letter-spacing: -0.4px; }
.inner-prose h2:first-child { margin-top: 0; }
.inner-prose p { font-family: var(--serif); font-size: 18px; color: #333; line-height: 1.8; margin-bottom: 20px; }
.inner-prose em { font-style: italic; }
.inner-prose blockquote { font-family: var(--serif); font-size: 22px; font-style: italic; color: #1a1a1a; border-left: 3px solid #1a8917; padding: 16px 28px; margin: 36px 0; background: rgba(26,137,23,0.06); border-radius: 0 4px 4px 0; }
.inner-aside { flex: 0 0 280px; }
.inner-aside img { width: 100%; height: 200px; object-fit: cover; border-radius: 4px; margin-bottom: 28px; }
.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat { background: #fff; padding: 20px 16px; border-radius: 6px; }
.stat-n { font-family: var(--serif); font-size: 28px; font-weight: 700; color: #1a1a1a; }
.stat-l { font-size: 12px; color: #888; margin-top: 4px; font-family: var(--sans); }
.inner-cta-row { display: flex; gap: 16px; align-items: center; justify-content: center; padding: 64px 80px; }
.btn-ghost {
  background: none; border: 1.5px solid #1a1a1a; color: #1a1a1a;
  font-size: 15px; font-family: var(--sans); font-weight: 500;
  cursor: pointer; padding: 13px 30px; border-radius: 100px; transition: all 0.2s;
}
.btn-ghost:hover { background: #1a1a1a; color: #fff; }

/* PLANS */
.plans { display: flex; gap: 0; padding: 0 80px 80px; }
.plan { flex: 1; padding: 48px 40px; background: #fff; border-radius: 8px; margin: 0 10px; position: relative; }
.plan-featured { background: #1a1a1a; }
.plan-popular { position: absolute; top: 24px; right: 24px; background: #1a8917; color: #fff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 4px 12px; border-radius: 100px; font-family: var(--sans); }
.plan-tier { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 16px; font-family: var(--sans); }
.plan-featured .plan-tier { color: #666; }
.plan-price { font-family: var(--serif); font-size: 52px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
.plan-featured .plan-price { color: #fff; }
.plan-price span { font-family: var(--sans); font-size: 15px; font-weight: 400; color: #999; }
.plan-desc { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px; }
.plan-featured .plan-desc { color: #999; }
.plan-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 36px; }
.plan-list li { font-size: 14px; display: flex; align-items: center; gap: 8px; font-family: var(--sans); }
.plan-list li.y { color: #1a1a1a; }
.plan-list li.y::before { content: '✓'; color: #1a8917; font-weight: 700; }
.plan-list li.n { color: #bbb; }
.plan-list li.n::before { content: '—'; color: #ddd; }
.plan-featured .plan-list li.y { color: #fff; }
.plan-featured .plan-list li.n { color: #444; }
.btn-white { background: #fff; border: none; color: #1a1a1a; font-size: 14px; font-family: var(--sans); font-weight: 600; cursor: pointer; padding: 13px 0; border-radius: 100px; transition: background 0.2s; }
.btn-white:hover { background: #e8e4db; }
.full { width: 100%; }

/* FAQ */
.faq-section { padding: 0 80px 80px; }
.faq-heading { font-family: var(--serif); font-size: 32px; font-weight: 700; color: #1a1a1a; margin-bottom: 32px; }
.faq-item { border-bottom: 1px solid rgba(0,0,0,0.1); }
.faq-item:first-of-type { border-top: 1px solid rgba(0,0,0,0.1); }
.faq-q { font-size: 16px; font-weight: 500; color: #1a1a1a; padding: 20px 0; cursor: pointer; list-style: none; display: flex; justify-content: space-between; font-family: var(--sans); }
.faq-q::-webkit-details-marker { display: none; }
.faq-q::after { content: '+'; font-size: 20px; font-weight: 300; color: #888; }
details[open] .faq-q::after { content: '−'; }
.faq-a { font-size: 15px; color: #666; line-height: 1.7; padding: 0 0 20px; }

/* FOOTER */
.footer {
  background: #f7f4ee; border-top: 1px solid rgba(0,0,0,0.1);
  padding: 24px 56px; display: flex; flex-wrap: wrap;
  align-items: center; justify-content: center;
}
.footer-link {
  font-size: 13px; color: #999; text-decoration: none;
  padding: 4px 14px; border-right: 1px solid rgba(0,0,0,0.1);
  transition: color 0.15s; font-family: var(--sans); white-space: nowrap;
}
.footer-link:last-child { border-right: none; }
.footer-link:hover { color: #1a1a1a; }

/* RESPONSIVE */
@media (max-width: 1100px) {
  .hero-h1 { font-size: 72px; letter-spacing: -3px; }
  .hero-left { padding: 60px 48px; flex: 0 0 50%; }
  .hero-right { flex: 0 0 50%; padding: 40px 32px; }
  .secondary { padding: 0 48px; }
  .sec-item { padding: 48px 36px 56px 0; }
  .sec-item:last-child { padding: 48px 0 56px 36px; }
  .inner-body { padding: 56px 48px; gap: 48px; }
  .inner-hero { padding: 60px 48px 48px; }
}
@media (max-width: 900px) {
  .hero { flex-direction: column; min-height: unset; }
  .hero-left { flex: unset; padding: 60px 40px 32px; }
  .hero-right { flex: unset; width: 100%; padding: 0 40px 60px; }
  .hero-h1 { font-size: 60px; }
  .plans { flex-direction: column; padding: 0 40px 60px; }
  .plan { margin: 8px 0; }
  .inner-body { flex-direction: column; padding: 48px 40px; }
  .inner-aside { flex: unset; }
  .secondary { flex-direction: column; padding: 48px 40px 64px; }
  .nav { padding: 0 32px; }
}
@media (max-width: 640px) {
  .hero-h1 { font-size: 48px; letter-spacing: -2px; }
  .hero-left { padding: 48px 24px 24px; }
  .hero-right { padding: 0 24px 48px; }
  .nav { padding: 0 20px; }
  .nav-links .nav-link { display: none; }
  .nav-links .nav-link:last-of-type { display: block; }
  .inner-hero { padding: 48px 24px 36px; }
  .inner-h1 { font-size: 44px; }
  .plans { padding: 0 24px 48px; }
  .faq-section { padding: 0 24px 48px; }
  .secondary { padding: 40px 24px 56px; }
  .footer { padding: 20px 24px; }
}
</style>
