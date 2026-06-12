<script>
  export let onNav = (page) => {};

  const sections = [
    {
      title: 'Getting started',
      sub: 'Learn more about BlogCurate and set up your account',
      links: ['Sign in or sign up to BlogCurate', 'Using BlogCurate', 'BlogCurate membership', 'BlogCurate glossary'],
    },
    {
      title: 'Managing your account',
      sub: 'Everything you need to know about your account settings and profile page',
      links: ['Your profile page', 'Your profile page URL', 'Adjust email preferences', 'Manage your subscription', 'Connect social media accounts'],
    },
    {
      title: 'Reading',
      sub: 'Control your reading experience on BlogCurate',
      links: ['Your homepage', 'Create and manage lists', 'Control your recommendations', 'Mute an author or publication', 'About Audio'],
    },
    {
      title: 'Managing stories',
      sub: 'Manage your content',
      links: ['Stats', "Story's detailed stats page", 'Audience stats', 'About Friend Links', 'Email subscriptions'],
    },
    {
      title: 'Writing & editing',
      sub: 'Master the story editor',
      links: ['Writing and publishing your first story', 'Create, edit, or delete a story', 'Using the story editor', 'Using images', 'Using topics'],
    },
    {
      title: 'Distribution',
      sub: 'Learn more about distribution on BlogCurate',
      links: ['What happens to your story when you publish', "BlogCurate's Distribution guidelines: How curators review stories"],
    },
    {
      title: 'Partner Program',
      sub: 'Start earning for your content',
      links: ['Partner Program Guide', 'Make a story eligible to earn money', 'Partner Program earnings dashboard', 'Calculating earnings in the Partner Program'],
    },
    {
      title: 'Publications',
      sub: 'Learn how to set up and manage a BlogCurate publication',
      links: ['Getting started with a BlogCurate publication', 'How to submit a story to a publication', 'How to manage story submissions', 'Publication settings and layout'],
    },
    {
      title: 'Terms & Policies',
      sub: 'The fine print',
      links: ['Terms of Service', 'BlogCurate Rules', 'Privacy Policy', 'Partner Program Terms'],
    },
    {
      title: 'Content',
      sub: 'Content policies',
      links: ['COVID-19 Content Policy', 'Controversial, Suspect, and Extreme Content', 'Best practices for journalism on BlogCurate'],
    },
    {
      title: 'Safety',
      sub: "Learn about BlogCurate's safety tools",
      links: ['Block a user', 'Manage responses', 'Report posts & users', 'Report copyright infringement', 'User data protection'],
    },
  ];

  let search = '';
</script>

<div class="hc-page">
  <!-- Top bar -->
  <header class="hc-header">
    <div class="hc-header-inner">
      <button class="hc-logo" on:click={() => onNav('home')}>
        <svg width="26" height="26" viewBox="0 0 195 195" fill="none"><rect width="195" height="195" rx="4" fill="#000"/><path d="M45 65l30 65 30-65 30 65 15-32.5" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Help Center</span>
      </button>
      <a href="#" class="hc-back" on:click|preventDefault={() => onNav('home')}>Back to blogcurate.com</a>
    </div>
  </header>

  <!-- Hero search -->
  <div class="hc-hero">
    <h1>How can we help?</h1>
    <div class="hc-search-wrap">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input bind:value={search} placeholder="Search..." class="hc-search" />
    </div>
    <div class="hc-popular">
      <span>Popular:</span>
      <a href="#">Membership</a>
      <a href="#">Partner Program</a>
      <a href="#">Sign in</a>
    </div>

  </div>

  <!-- Sections grid -->
  <div class="hc-grid">
    {#each sections as sec}
      <div class="hc-section">
        <h2 class="hc-sec-title">{sec.title}</h2>
        <p class="hc-sec-sub">{sec.sub}</p>
        <ul class="hc-links">
          {#each sec.links as link}
            <li><a href="#">{link}</a></li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="hc-notfound">
    <p>Can't find what you're looking for?</p>
  </div>

  <!-- Footer -->
  <footer class="hc-footer">
    <a href="#" on:click|preventDefault={() => onNav('status')}>Status</a>
    <a href="#" on:click|preventDefault={() => onNav('blog')}>Writers Blog</a>
    <a href="#" on:click|preventDefault={() => onNav('careers')}>Careers</a>
    <a href="#" on:click|preventDefault={() => onNav('privacy')}>Privacy</a>
    <a href="#" on:click|preventDefault={() => onNav('terms')}>Terms</a>
    <a href="#" on:click|preventDefault={() => onNav('about')}>About</a>
    <a href="#" on:click|preventDefault={() => onNav('home')}>Return to top ↑</a>
  </footer>
</div>

<style>
.hc-page { min-height: 100vh; background: var(--white); font-family: var(--sans); color: var(--text-body); }

.hc-header { border-bottom: 1px solid var(--divider); padding: 0 24px; }
.hc-header-inner { max-width: 1192px; margin: 0 auto; height: 57px; display: flex; align-items: center; justify-content: space-between; }
.hc-logo { display: flex; align-items: center; gap: 10px; background: none; border: none; cursor: pointer; font-size: 17px; font-weight: 600; color: var(--text-black); font-family: var(--sans); }
.hc-logo span { font-size: 17px; font-weight: 700; }
.hc-back { font-size: 13px; color: var(--text-muted); text-decoration: none; }
.hc-back:hover { text-decoration: underline; }

.hc-hero { background: #ffc017; padding: 56px 24px 48px; text-align: center; }
.hc-hero h1 { font-size: 36px; font-weight: 700; color: var(--text-black); margin-bottom: 24px; font-family: var(--serif); }
.hc-search-wrap { display: flex; align-items: center; gap: 10px; background: var(--white); border-radius: var(--radius); padding: 12px 16px; max-width: 560px; margin: 0 auto 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.hc-search { border: none; outline: none; font-size: 16px; color: var(--text-black); flex: 1; font-family: var(--sans); background: transparent; }
.hc-search::placeholder { color: var(--text-hint); }
.hc-popular { font-size: 14px; color: var(--text-black); display: flex; align-items: center; gap: 10px; justify-content: center; flex-wrap: wrap; }
.hc-popular span { font-weight: 500; font-family: var(--serif); font-style: italic; }
.hc-popular a {
  font-family: var(--serif); font-size: 14px; color: rgba(0,0,0,0.75);
  text-decoration: none; background: rgba(0,0,0,0.08);
  padding: 5px 14px; border-radius: 100px;
  transition: background 0.15s;
}
.hc-popular a:hover { background: rgba(0,0,0,0.15); }

.hc-grid { max-width: 1192px; margin: 0 auto; padding: 48px 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 48px; }
.hc-sec-title { font-size: 17px; font-weight: 700; color: var(--text-black); margin-bottom: 6px; font-family: var(--serif); }
.hc-sec-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.5; }
.hc-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.hc-links li a { font-size: 14px; color: var(--green); text-decoration: none; }
.hc-links li a:hover { text-decoration: underline; }

.hc-notfound { text-align: center; padding: 24px; font-size: 15px; color: var(--text-muted); border-top: 1px solid var(--divider); }

.hc-footer { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 4px; padding: 20px 24px; border-top: 1px solid var(--divider); }
.hc-footer a { font-size: 13px; color: var(--text-muted); text-decoration: none; padding: 4px 10px; border-right: 1px solid var(--divider); }
.hc-footer a:last-child { border-right: none; }
.hc-footer a:hover { color: var(--text-black); }

@media (max-width: 768px) { .hc-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 480px) { .hc-grid { grid-template-columns: 1fr; } .hc-hero h1 { font-size: 26px; } }
</style>
