<script>
  export let onNav = (page) => {};
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

      <h1 class="policy-title">BlogCurate Terms of Service</h1>
      <div class="policy-byline">
        <div class="policy-avatar">BC</div>
        <div>
          <span class="policy-author">BlogCurate</span>
          <span class="policy-date"> · 12 min read · Effective: September 1, 2020</span>
        </div>
      </div>

      <p class="policy-p">Thanks for using BlogCurate. Our mission is to deepen people's understanding of the world and spread ideas that matter.</p>
      <p class="policy-p">These Terms of Service ("Terms") apply to your access to and use of the websites, mobile applications and other online products and services provided by BlogCurate. By using our Services, you agree to these Terms.</p>

      {#each [
        { title: 'Your Account and Responsibilities', body: "You're responsible for your use of the Services and any content you provide, including compliance with applicable laws. You may need to register for an account to access some or all of our Services. To use our Services, you must be at least 13 years old." },
        { title: 'User Content on the Services', body: 'BlogCurate may review your conduct and content for compliance with these Terms and our Rules, and reserves the right to remove any violating content. BlogCurate reserves the right to delete or disable content alleged to be infringing the intellectual property rights of others.' },
        { title: 'Rights and Ownership', body: 'You retain your rights to any content you submit, post or display on or through the Services. Unless otherwise agreed in writing, by submitting content you grant BlogCurate a nonexclusive, royalty-free, worldwide, fully paid, and sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, publicly perform and display your content.' },
        { title: 'Termination', body: "You're free to stop using our Services at any time. We reserve the right to suspend or terminate your access to the Services with or without notice." },
        { title: 'Disclaimers — Service is "As Is"', body: 'Your use of our Services is at your sole risk. You understand that our Services and any content posted or shared by users on the Services are provided "as is" and "as available" without warranties of any kind, either express or implied.' },
        { title: 'Limitation of Liability', body: "We don't exclude or limit our liability to you where it would be illegal to do so. In countries where exclusions or limitations of liability are allowed, BlogCurate won't be liable for any indirect, consequential, exemplary, incidental, punitive, or special damages." },
        { title: 'Governing Law and Venue', body: 'These Terms and any dispute that arises between you and BlogCurate will be governed by applicable law. Any dispute between the parties that is not subject to arbitration will be resolved in the appropriate courts.' },
        { title: 'Amendments', body: 'We may make changes to these Terms from time to time. If we make changes, we will provide you with notice by sending an email to the email address associated with your account or by updating the date at the top of these Terms.' },
        { title: 'Severability', body: 'If any provision or part of a provision of these Terms is unlawful, void or unenforceable, that provision or part of the provision is deemed severable from these Terms and does not affect the validity and enforceability of any remaining provisions.' },
      ] as section}
        <h2 class="policy-h2">{section.title}</h2>
        <p class="policy-p">{section.body}</p>
      {/each}

      <h2 class="policy-h2">Other Terms and Policies that May Apply to You</h2>
      <ul class="terms-list">
        <li><button on:click={() => onNav('rules')}>BlogCurate Rules</button></li>
        <li><a href="#">Partner Program Terms</a></li>
        <li><a href="#">Membership Terms of Service</a></li>
        <li><a href="#">Username Policy</a></li>
      </ul>

      <div class="policy-related">
        <h3 class="policy-related-title">More from BlogCurate Policy</h3>
        <div class="policy-related-links">
          <button on:click={() => onNav('rules')}>BlogCurate Rules →</button>
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
.policy-h2 { font-size: 18px; font-weight: 700; color: var(--text-black); margin: 36px 0 12px; font-family: var(--serif); }
.terms-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.terms-list li button { background: none; border: none; cursor: pointer; font-size: 15px; color: var(--green); font-family: var(--sans); padding: 0; }
.terms-list li a { font-size: 15px; color: var(--green); text-decoration: none; }
.terms-list li button:hover, .terms-list li a:hover { text-decoration: underline; }
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
