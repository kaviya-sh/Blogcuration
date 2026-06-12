<script>
  import { appMode, dark, userAuthed } from './stores/store.js';
  import LandingPage  from './pages/LandingPage.svelte';
  import AuthPage     from './pages/AuthPage.svelte';
  import UserShell    from './components/UserShell.svelte';
  import AdminShell   from './components/AdminShell.svelte';
  import Toast        from './components/Toast.svelte';
  import AboutPage    from './pages/AboutPage.svelte';
  import HelpPage     from './pages/HelpPage.svelte';
  import TermsPage    from './pages/TermsPage.svelte';
  import PrivacyPage  from './pages/PrivacyPage.svelte';
  import RulesPage    from './pages/RulesPage.svelte';
  import StatusPage   from './pages/StatusPage.svelte';
  import CareersPage  from './pages/CareersPage.svelte';
  import BlogPage     from './pages/BlogPage.svelte';
  import TTSPage      from './pages/TTSPage.svelte';

  $: authMode =
    $appMode === 'auth-signin' ? 'signin'  :
    $appMode === 'auth-signup' ? 'signup'  :
    $appMode === 'auth-write'  ? 'signup'  : 'signin';

  $: isAuth = $appMode === 'auth-signin' || $appMode === 'auth-signup' || $appMode === 'auth-write';

  const publicPages = ['about','help','terms','privacy','rules','status','careers','blog','tts'];

  /** @param {string} page */
  function onNav(page) {
    if (page === 'home') { appMode.set('landing'); }
    else if (page === 'auth-signin') { appMode.set('auth-signin'); }
    else if (page === 'auth-signup') { appMode.set('auth-signup'); }
    else if (publicPages.includes(page)) { appMode.set(/** @type {any} */ (page)); }
  }
</script>

<div class="app" class:dark={$dark}>
  {#if $appMode === 'user' && $userAuthed}
    <UserShell />
  {:else if $appMode === 'admin'}
    <AdminShell />
  {:else if $appMode === 'about'}
    <AboutPage {onNav} />
  {:else if $appMode === 'help'}
    <HelpPage {onNav} />
  {:else if $appMode === 'terms'}
    <TermsPage {onNav} />
  {:else if $appMode === 'privacy'}
    <PrivacyPage {onNav} />
  {:else if $appMode === 'rules'}
    <RulesPage {onNav} />
  {:else if $appMode === 'status'}
    <StatusPage {onNav} />
  {:else if $appMode === 'careers'}
    <CareersPage {onNav} />
  {:else if $appMode === 'blog'}
    <BlogPage {onNav} />
  {:else if $appMode === 'tts'}
    <TTSPage {onNav} />
  {:else}
    <LandingPage />
    {#if isAuth}
      <AuthPage initialMode={authMode} />
    {/if}
  {/if}
  <Toast />
</div>
