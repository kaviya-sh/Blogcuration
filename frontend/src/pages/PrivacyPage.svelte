<script>
  export let onNav = (page) => {};

  const sections = [
    { id: 'collection', title: 'Collection of Information' },
    { id: 'use', title: 'Use of Information' },
    { id: 'sharing', title: 'Sharing of Information' },
    { id: 'embeds', title: 'Third-Party Embeds' },
    { id: 'transfer', title: 'Transfer of Information' },
    { id: 'choices', title: 'Your Choices' },
    { id: 'california', title: 'Your California Privacy Rights' },
    { id: 'europe', title: 'Additional Disclosures for Individuals in Europe' },
    { id: 'contact', title: 'Contact Us' },
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

      <h1 class="policy-title">BlogCurate Privacy Policy</h1>
      <div class="policy-byline">
        <div class="policy-avatar">BC</div>
        <div>
          <span class="policy-author">BlogCurate</span>
          <span class="policy-date"> · 12 min read · Sep 2, 2020</span>
        </div>
      </div>

      <p class="policy-effective">Effective date: March 24, 2022</p>

      <p class="policy-p">This Privacy Policy explains how BlogCurate ("we," or "us") collects, uses, and discloses information about you. This Privacy Policy applies when you use our websites, mobile applications, and other online products and services, contact our customer service team, engage with us on social media, or otherwise interact with us.</p>

      <div class="policy-contents">
        <strong>CONTENTS</strong>
        <ul>
          {#each sections as s}
            <li><a href="#{s.id}">{s.title}</a></li>
          {/each}
        </ul>
      </div>

      <h2 id="collection" class="policy-h2">COLLECTION OF INFORMATION</h2>
      <h3 class="policy-h3">Information You Provide to Us</h3>
      <p class="policy-p">We collect information you provide directly to us. For example, you share information directly with us when you create an account, fill out a form, submit or post content through our Services, purchase a membership, communicate with us via third-party platforms, request customer support, or otherwise communicate with us. The types of personal information we may collect include your name, display name, username, bio, email address, business information, your content including your avatar image, photos, posts, responses, and any other information you choose to provide.</p>

      <h3 class="policy-h3">Information We Collect Automatically</h3>
      <p class="policy-p">In some instances, we automatically collect certain information, including activity information, transactional information, device and usage information, and information collected by cookies and similar tracking technologies.</p>

      <h2 id="use" class="policy-h2">USE OF INFORMATION</h2>
      <p class="policy-p">We use the information we collect to provide, maintain, and improve our Services, which includes publishing and distributing user-generated content, personalizing the posts you see, and operating our metered paywall.</p>

      <h2 id="sharing" class="policy-h2">SHARING OF INFORMATION</h2>
      <p class="policy-p">We share personal information with other users of the Services, with vendors and service providers, and in certain legal circumstances. We also share aggregated or de-identified information that cannot reasonably be used to identify you.</p>

      <h2 id="embeds" class="policy-h2">THIRD-PARTY EMBEDS</h2>
      <p class="policy-p">BlogCurate does not host some of the content displayed on our Services. Users have the ability to post content that is actually hosted by a third party, but is embedded in our pages. When you interact with an Embed, it can send information about your interaction to the hosting third party just as if you were visiting the third party's site directly.</p>

      <h2 id="transfer" class="policy-h2">TRANSFER OF INFORMATION</h2>
      <p class="policy-p">BlogCurate is headquartered in the United States, and we have operations and service providers in the United States and other countries. Therefore, we and our service providers may transfer your personal information to, or store or access it in, jurisdictions that may not provide equivalent data protection levels.</p>

      <h2 id="choices" class="policy-h2">YOUR CHOICES</h2>
      <p class="policy-p">You may access, correct, delete and export your account information at any time by logging into the Services and navigating to the Settings page. You may opt out of receiving certain communications from us by following the instructions in those communications or through your account's Settings page.</p>

      <h2 id="california" class="policy-h2">YOUR CALIFORNIA PRIVACY RIGHTS</h2>
      <p class="policy-p">If you are a California resident, you have certain rights under the CCPA with respect to your personal information, including the right to know, the right to delete, and the right not to be discriminated against for exercising these rights.</p>

      <h2 id="europe" class="policy-h2">ADDITIONAL DISCLOSURES FOR INDIVIDUALS IN EUROPE</h2>
      <p class="policy-p">If you are located in the European Economic Area, the United Kingdom, or Switzerland, you have certain rights and protections under applicable law regarding the processing of your personal data.</p>

      <h2 id="contact" class="policy-h2">CONTACT US</h2>
      <p class="policy-p">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@blogcurate.app">privacy@blogcurate.app</a>.</p>

      <div class="policy-related">
        <h3 class="policy-related-title">More from BlogCurate Policy</h3>
        <div class="policy-related-links">
          <button on:click={() => onNav('terms')}>BlogCurate Terms of Service →</button>
          <button on:click={() => onNav('rules')}>BlogCurate Rules →</button>
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

.policy-title { font-family: var(--serif); font-size: 36px; font-weight: 700; color: var(--text-black); line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 16px; }
.policy-byline { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.policy-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--text-black); color: var(--white); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.policy-author { font-size: 14px; font-weight: 500; color: var(--text-black); }
.policy-date { font-size: 13px; color: var(--text-hint); }
.policy-effective { font-size: 14px; color: var(--text-hint); margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--divider); }
.policy-p { font-size: 16px; color: var(--text-body); line-height: 1.75; margin-bottom: 20px; font-family: var(--serif); }
.policy-p a { color: var(--green); }

.policy-contents { background: var(--off-white); border: 1px solid var(--divider); border-radius: var(--radius); padding: 20px 24px; margin: 24px 0; }
.policy-contents strong { font-size: 14px; font-weight: 700; display: block; margin-bottom: 12px; color: var(--text-black); }
.policy-contents ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.policy-contents li a { font-size: 14px; color: var(--green); text-decoration: none; }
.policy-contents li a:hover { text-decoration: underline; }

.policy-h2 { font-size: 16px; font-weight: 700; color: var(--text-black); margin: 36px 0 12px; letter-spacing: 0.04em; }
.policy-h3 { font-size: 15px; font-weight: 600; color: var(--text-black); margin: 20px 0 10px; }

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
