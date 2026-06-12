<script>
  import { adminLogin, loginError, loginLoading, appMode } from '../../stores/store.js';
  let key = '';
</script>

<div class="login-page">
  <div class="login-box">
    <!-- Back button -->
    <button class="back-btn" on:click={() => appMode.set('landing')}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
      Back to Home
    </button>

    <div class="login-logo">ACS</div>
    <div class="login-sub">Automated Curation Admin</div>

    <div style="border-top:1px solid var(--divider);margin:24px 0"></div>

    <form on:submit|preventDefault={() => adminLogin(key)}>
      <div class="form-group">
        <label class="form-label" for="admin-key">API Key</label>
        <input
          id="admin-key"
          type="password"
          bind:value={key}
          placeholder="Enter your API key"
          autocomplete="current-password"
          autofocus
        />
      </div>
      {#if $loginError}
        <div class="form-error">{$loginError}</div>
      {/if}
      <button class="btn btn-primary btn-full" style="margin-top:12px" disabled={$loginLoading || !key.trim()}>
        {$loginLoading ? 'Verifying…' : 'Sign in'}
      </button>
    </form>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh; display: flex;
    align-items: center; justify-content: center;
    background: var(--off-white); padding: 24px;
  }
  .login-box {
    background: var(--white); width: 100%; max-width: 400px; padding: 40px;
    border-radius: 8px; border: 1px solid var(--divider);
  }
  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 13px; color: var(--text-muted); font-family: var(--sans);
    padding: 0; margin-bottom: 28px; transition: color 0.15s;
  }
  .back-btn:hover { color: var(--text-black); }
  .login-logo {
    font-family: var(--serif); font-size: 28px; font-weight: 700;
    color: var(--text-black); margin-bottom: 4px;
  }
  .login-sub { font-size: 14px; color: var(--text-muted); }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 13px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; }
  .form-error { font-size: 13px; color: var(--red); margin-top: 8px; }
</style>
