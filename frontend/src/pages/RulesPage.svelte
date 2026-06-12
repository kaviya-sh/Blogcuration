<script>
  export let onNav = (page) => {};

  const rules = [
    { title: 'Threats of violence and incitement', body: 'We do not allow content or actions that threaten, encourage, or incite violence against anyone, directly or indirectly.' },
    { title: 'Hateful content', body: 'We do not allow content that constitutes or promotes violence, harassment, or hatred against people based on characteristics like race, ethnicity, national origin, religion, caste, disability, disease, age, sexual orientation, gender, or gender identity.' },
    { title: 'Harassment', body: 'BlogCurate exists to share and discuss ideas. We don\'t tolerate harassment, which includes bullying, threatening, mocking, or shaming someone, or posting things likely to encourage others to do so.' },
    { title: 'Privacy and Reputation', body: 'We do not allow posting images of, transcripts of, copies of, or links to private communications between private individuals without the explicit consent of all parties to the communication.' },
    { title: 'Restricted categories', body: 'We do not allow posts or accounts that engage in the following restricted categories of activity: promotion of controversial or extreme content, facilitation of gambling, facilitation of sexual services, or facilitation of copyright violation.' },
    { title: 'Graphic content', body: 'We do not allow posting, linking to, or otherwise promoting pornographic images or videos. We do not allow gratuitously graphic or disturbing media, regardless of subject matter.' },
    { title: 'Exploitation of minors', body: 'We do not allow content promoting the sexual, violent, or other exploitation of minors, including the sexualization of fictional minors.' },
    { title: 'Promotion and glorification of self-harm', body: 'We do not allow content or activities that encourage, promote or glorify acts of self-harm, such as cutting, eating disorders, and suicide.' },
    { title: 'Duplicate Content', body: 'We do not allow posting duplicate copies of the same content to BlogCurate, whether from a single account or across multiple accounts, either publicly or as an unlisted story.' },
    { title: 'Spam or Site Misuse', body: 'We do not allow spam or misuse of BlogCurate. All spam or misuse will be immediately removed without notification.' },
    { title: 'Copyright and trademark infringement', body: 'Respect the copyrights and trademarks of others. We require users to have permission to post the content they publish on BlogCurate.' },
    { title: 'Deceptive conduct', body: 'We do not allow deceptive conduct on BlogCurate, including posting content or impersonating a person or organization in a way likely to deceive people.' },
    { title: 'Paid, automatic, bulk, or non-genuine interactions', body: 'BlogCurate depends on various user behaviors to determine what content to feature. We don\'t allow artificial behaviors that skew this system.' },
  ];
</script>

<div class="policy-page">
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

  <div class="policy-body">
    <div class="policy-inner">
      <div class="policy-pub-tag">
        <span class="pub-name">BlogCurate Policy</span>
        <span class="pub-sub">Terms of Service, Rules, and Policies</span>
      </div>

      <h1 class="policy-title">BlogCurate Rules</h1>
      <div class="policy-byline">
        <div class="policy-avatar">BC</div>
        <div>
          <span class="policy-author">BlogCurate</span>
          <span class="policy-date"> · 11 min read · Updated June 2023</span>
        </div>
      </div>

      <p class="policy-p">BlogCurate is an open platform that exists to share ideas and perspectives from the world's most insightful writers, thinkers, and storytellers.</p>
      <p class="policy-p">We welcome thoughtful and civil discussion from a broad spectrum of viewpoints. To maintain a safe, respectful, and welcoming environment, we prohibit certain conduct.</p>

      <div class="rules-report-box">
        <strong>To report a violation:</strong>
        <p>If you find a post or account on BlogCurate that you believe violates these rules, please report it. You can find the report button in the 3-dot menu on every post, response, and account page.</p>
      </div>

      <h2 class="policy-h2">Rules</h2>
      {#each rules as rule}
        <div class="rule-item">
          <h3 class="rule-title">{rule.title}</h3>
          <p class="policy-p">{rule.body}</p>
        </div>
      {/each}

      <div class="rules-appeals">
        <h2 class="policy-h2">Appeals</h2>
        <p class="policy-p">If you believe your content or account has been restricted or disabled in error, or believe there is relevant context we were not aware of in reaching our determination, you can write to us at trust@blogcurate.app.</p>
      </div>

      <div class="policy-related">
        <h3 class="policy-related-title">More from BlogCurate Policy</h3>
        <div class="policy-related-links">
          <button on:click={() => onNav('terms')}>BlogCurate Terms of Service →</button>
          <button on:click={() => onNav('privacy')}>BlogCurate Privacy Policy →</button>
        </div>
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
.policy-page { min-height: 100vh; background: var(--white); font-family: var(--sans); color: var(--text-body); display: flex; flex-direction: column; }
.top-nav { border-bottom: 1px solid var(--divider); padding: 0 24px; }
.top-nav-inner { max-width: 1192px; margin: 0 auto; height: 57px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { background: none; border: none; cursor: pointer; display: flex; }
.nav-right { display: flex; align-items: center; gap: 8px; }
.nav-link { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); font-family: var(--sans); padding: 7px 14px; border-radius: 100px; }
.nav-link:hover { color: var(--text-black); background: var(--off-white); }
.nav-pill { background: var(--text-black); color: var(--white); border: none; cursor: pointer; font-size: 14px; font-family: var(--sans); padding: 8px 20px; border-radius: 100px; transition: opacity 0.15s; }
.nav-pill:hover { opacity: 0.8; }
.policy-body { flex: 1; padding: 48px 24px; }
.policy-inner { max-width: 680px; margin: 0 auto; }
.policy-pub-tag { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.pub-name { font-size: 14px; font-weight: 600; color: var(--text-black); }
.pub-sub { font-size: 13px; color: var(--text-hint); }
.policy-title { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--text-black); line-height: 1.2; margin-bottom: 16px; }
.policy-byline { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--divider); }
.policy-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--text-black); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.policy-author { font-size: 14px; font-weight: 500; color: var(--text-black); }
.policy-date { font-size: 13px; color: var(--text-hint); }
.policy-p { font-size: 16px; color: var(--text-body); line-height: 1.75; margin-bottom: 20px; font-family: var(--serif); }
.policy-h2 { font-size: 16px; font-weight: 700; color: var(--text-black); margin: 36px 0 16px; letter-spacing: 0.04em; text-transform: uppercase; }
.rules-report-box { background: var(--off-white); border: 1px solid var(--divider); border-radius: var(--radius); padding: 18px 20px; margin: 24px 0; }
.rules-report-box strong { font-size: 14px; display: block; margin-bottom: 8px; color: var(--text-black); }
.rules-report-box p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin: 0; }
.rule-item { padding: 20px 0; border-bottom: 1px solid var(--divider); }
.rule-title { font-size: 17px; font-weight: 700; color: var(--text-black); margin-bottom: 10px; font-family: var(--serif); }
.rule-item .policy-p { margin-bottom: 0; }
.rules-appeals { margin-top: 32px; }
.policy-related { border-top: 1px solid var(--divider); margin-top: 48px; padding-top: 32px; }
.policy-related-title { font-size: 15px; font-weight: 700; color: var(--text-black); margin-bottom: 16px; }
.policy-related-links { display: flex; flex-direction: column; gap: 10px; }
.policy-related-links button { background: none; border: none; cursor: pointer; font-size: 15px; color: var(--green); font-family: var(--sans); text-align: left; padding: 0; }
.policy-related-links button:hover { text-decoration: underline; }
.med-footer { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; padding: 16px 24px; border-top: 1px solid var(--divider); }
.med-footer a { font-size: 13px; color: var(--text-muted); text-decoration: none; padding: 4px 12px; border-right: 1px solid var(--divider); }
.med-footer a:last-child { border-right: none; }
.med-footer a:hover { color: var(--text-black); }
</style>
