<script>
  import { login, signup, appMode } from '../stores/store.js';

  // 'email-signin' | 'email-signup' | 'forgot'
  export let initialMode = 'signin';
  let mode = initialMode === 'signup' ? 'email-signup' : 'email-signin';

  let name = '', email = '', password = '';
  let error = '', success = '', loading = false;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function submit() {
    error = ''; success = '';
    if (mode === 'forgot') {
      if (!email.trim() || !EMAIL_RE.test(email.trim())) { error = 'Enter a valid email.'; return; }
      loading = true;
      await new Promise(r => setTimeout(r, 700));
      success = 'If this email is registered, a reset link has been sent.';
      loading = false;
      return;
    }
    if (mode === 'email-signup' && !name.trim()) { error = 'Your name is required.'; return; }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) { error = 'Enter a valid email address.'; return; }
    if (!password || password.length < 6) { error = 'Password must be at least 6 characters.'; return; }
    loading = true;
    await new Promise(r => setTimeout(r, 600));
    const result = mode === 'email-signin'
      ? await login(email.trim(), password)
      : await signup(name.trim(), email.trim(), password);
    if (!result.ok) error = result.error;
    loading = false;
  }

  function sw(m) { mode = m; error = ''; success = ''; name = ''; password = ''; }
</script>

<div class="auth-overlay" on:click|self={() => appMode.set('landing')} role="dialog" aria-modal="true">
  <div class="auth-modal">

    <button class="auth-close" on:click={() => appMode.set('landing')} aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>

    <div class="auth-logo">BlogCurate</div>

    {#if mode === 'email-signin' || mode === 'email-signup'}
      <h1 class="auth-title">
        {mode === 'email-signin' ? 'Welcome back.' : 'Join BlogCurate.'}
      </h1>

      <form class="auth-form" on:submit|preventDefault={submit}>
        {#if mode === 'email-signup'}
          <div class="form-field">
            <label for="auth-name">Your name</label>
            <input id="auth-name" bind:value={name} placeholder="Full name" autocomplete="name" />
          </div>
        {/if}
        <div class="form-field">
          <label for="auth-email">Email</label>
          <input id="auth-email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" />
        </div>
        <div class="form-field">
          <label for="auth-password">Password</label>
          <input id="auth-password" type="password" bind:value={password} placeholder="••••••••"
            autocomplete={mode === 'email-signin' ? 'current-password' : 'new-password'} />
          {#if mode === 'email-signin'}
            <button type="button" class="forgot-link" on:click={() => sw('forgot')}>Forgot password?</button>
          {/if}
        </div>

        {#if error}
          <p class="form-error">
            {error}
            {#if error.includes('already exists')}
              <button type="button" class="forgot-link" on:click={() => sw('forgot')}>Forgot password?</button>
            {/if}
          </p>
        {/if}

        <button class="submit-btn" disabled={loading}>
          {#if loading}<span class="mini-spinner"></span>{/if}
          {loading ? 'Please wait…' : mode === 'email-signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p class="auth-switch-txt">
        {#if mode === 'email-signin'}
          No account? <button class="auth-link" on:click={() => sw('email-signup')}>Create one</button>
        {:else}
          Have an account? <button class="auth-link" on:click={() => sw('email-signin')}>Sign in</button>
        {/if}
      </p>

      <p class="auth-terms">
        By continuing you agree to BlogCurate's <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
      </p>

    {:else if mode === 'forgot'}
      <h1 class="auth-title">Reset your password.</h1>
      <p class="auth-subtitle">Enter the email you used to sign up and we'll send a reset link.</p>

      <form class="auth-form" on:submit|preventDefault={submit}>
        <div class="form-field">
          <label for="forgot-email">Email</label>
          <input id="forgot-email" type="email" bind:value={email} placeholder="you@example.com" autocomplete="email" />
        </div>
        {#if error}<p class="form-error">{error}</p>{/if}
        {#if success}<p class="form-success">{success}</p>{/if}
        <button class="submit-btn" disabled={loading}>
          {#if loading}<span class="mini-spinner"></span>{/if}
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p class="auth-switch-txt">
        <button class="auth-link" on:click={() => sw('email-signin')}>← Back to sign in</button>
      </p>
    {/if}

  </div>
</div>

<style>
  .auth-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
  }
  .auth-modal {
    background: #fff; border: 1px solid #e8e4db; border-radius: 4px;
    width: 100%; max-width: 420px; padding: 48px 40px 40px;
    position: relative; box-shadow: 0 4px 40px rgba(0,0,0,0.10);
  }
  .auth-close {
    position: absolute; top: 16px; right: 16px;
    background: none; border: none; cursor: pointer;
    color: #6b6b6b; padding: 4px; transition: color 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .auth-close:hover { color: #1a1a1a; }

  .auth-logo {
    font-family: var(--serif); font-size: 22px; font-weight: 700;
    color: #1a1a1a; text-align: center; margin-bottom: 28px; letter-spacing: -0.4px;
  }
  .auth-title {
    font-family: var(--serif); font-size: 28px; font-weight: 700;
    color: #1a1a1a; text-align: center; line-height: 1.2;
    letter-spacing: -0.5px; margin-bottom: 28px;
  }
  .auth-subtitle {
    font-size: 15px; color: #6b6b6b; text-align: center;
    line-height: 1.6; margin-bottom: 24px; margin-top: -16px;
  }

  .auth-form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-field label { font-size: 13px; font-weight: 500; color: #6b6b6b; }
  .form-field input {
    border: 1.5px solid #e8e4db; border-radius: 4px;
    padding: 11px 14px; font-size: 15px; color: #1a1a1a;
    font-family: var(--sans); background: #fff;
    transition: border-color 0.15s; outline: none; width: 100%;
    box-sizing: border-box;
  }
  .form-field input:focus { border-color: #1a1a1a; }
  .form-field input::placeholder { color: #bbb; }

  .forgot-link {
    background: none; border: none; cursor: pointer;
    font-size: 12px; color: #9b9b9b; font-family: var(--sans);
    padding: 2px 0; text-align: right; align-self: flex-end; transition: color 0.15s;
  }
  .forgot-link:hover { color: #1a1a1a; }

  .form-error { font-size: 13px; color: #c94b4b; margin-top: -6px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .form-error .forgot-link { color: #c94b4b; text-decoration: underline; font-size: 13px; }
  .form-success {
    font-size: 13px; color: #156912; background: #e6f4e6;
    border: 1px solid #a8d5a8; border-radius: 6px; padding: 10px 14px; line-height: 1.5;
  }

  .submit-btn {
    background: #1a1a1a; color: #fff; border: none; border-radius: 100px; padding: 13px 0;
    font-size: 15px; font-family: var(--sans); font-weight: 500; cursor: pointer;
    transition: background 0.15s; display: flex; align-items: center; justify-content: center;
    gap: 8px; width: 100%;
  }
  .submit-btn:hover:not(:disabled) { background: #333; }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .mini-spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
    animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg) } }

  .auth-switch-txt { text-align: center; font-size: 14px; color: #6b6b6b; margin-top: 16px; }
  .auth-link {
    background: none; border: none; cursor: pointer;
    font-size: 14px; color: #1a1a1a; font-family: var(--sans);
    text-decoration: underline; padding: 0; transition: color 0.15s;
  }
  .auth-link:hover { color: #555; }

  .auth-terms {
    font-size: 12px; color: #9b9b9b; text-align: center; line-height: 1.6;
    margin-top: 20px; border-top: 1px solid #e8e4db; padding-top: 16px;
  }
  .auth-terms a { color: #6b6b6b; }
  .auth-terms a:hover { color: #1a1a1a; }
</style>
