import { writable, derived } from 'svelte/store';

/**
 * @typedef {'ON' | 'PAUSE' | 'OFF'} PipelineFlag
 * @typedef {'IDLE' | 'RUNNING' | 'COMPLETE'} PipelineState
 * @typedef {{
 *   flag: PipelineFlag,
 *   status: PipelineState,
 *   lastRun: string | null,
 *   nextRun: string | null,
 *   published: number,
 *   failed: number
 * }} PipelineStatus
 * @typedef {{
 *   id: number,
 *   startedAt: string,
 *   completedAt: string,
 *   discovered: number,
 *   scored: number,
 *   rejected: number,
 *   published: number,
 *   status: string
 * }} RunRecord
 * @typedef {{
 *   id: number,
 *   title: string,
 *   theme: string,
 *   category?: string,
 *   relevanceScore?: number,
 *   innovationScore?: number,
 *   featured?: boolean,
 *   status?: string,
 *   publishedAt?: string,
 *   scheduledAt?: string,
 *   image?: string,
 *   imageUrl?: string,
 *   source?: string,
 *   readTime?: string,
 *   sourceUrl?: string,
 *   summary?: string
 * }} BlogItem
 * @typedef {{
 *   id: string,
 *   name: string,
 *   lastCalibrated: string,
 *   keywords: string[]
 * }} Theme
 * @typedef {{
 *   id: string,
 *   themeId: string,
 *   themeName: string,
 *   generatedAt: string,
 *   articlesAnalyzed: number,
 *   dominantKeywords: { keyword: string, frequency: number, sectors: string[] }[],
 *   coveredSectors: { sector: string, articleCount: number, growthTrend: string }[],
 *   acceptanceRate: number,
 *   lastCalibrationQuality: number,
 *   editorialSpirit: string,
 *   strongestAngles?: string[],
 *   weakSignals?: string[],
 *   contentGaps?: string[],
 *   recommendations?: string[],
 *   rejectionReasons: Record<string, number>
 * }} EditorialProfile
 * @typedef {{
 *   id: number,
 *   text: string,
 *   type: string
 * }} ToastItem
 * @typedef {{
 *   name: string,
 *   email: string,
 *   avatar: string,
 *   isNew: boolean
 * }} UserProfile
 */

/* Config */
export const API_BASE = 'http://localhost:8080/api/pipeline';
const ARTICLES_BASE = 'http://localhost:8080/api/articles';
const API_KEY = import.meta.env.VITE_ADMIN_KEY ?? '';

/** @param {string} url @param {RequestInit} [opts] */
async function apiFetch(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/** @param {string} url @param {RequestInit} [opts] */
async function adminFetch(url, opts = {}) {
  return apiFetch(url, { ...opts, headers: { ...(opts.headers || {}), 'X-API-Key': API_KEY } });
}

/* App mode */
export const appMode = writable(/** @type {'landing' | 'admin' | 'user' | 'auth-signin' | 'auth-signup' | 'auth-write' | 'about' | 'help' | 'terms' | 'privacy' | 'rules' | 'status' | 'careers' | 'blog' | 'tts'} */ ('landing'));

/* Theme */
const _savedDark = localStorage.getItem('dark');
if (_savedDark === 'false') localStorage.removeItem('dark');
export const dark = writable(_savedDark === 'true');
export const toggleTheme = () => dark.update((d) => {
  const next = !d;
  localStorage.setItem('dark', String(next));
  return next;
});

/* Helpers */
/**
 * @param {string} email
 * @param {string} suffix
 */
function ukey(email, suffix) {
  return `bca_${email.trim().toLowerCase()}_${suffix}`;
}

/**
 * @param {string} password
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password)
  );
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* Per-user stores */
export const rejectedIds = writable(/** @type {number[]} */ ([]));
export const interestedBlogs = writable(/** @type {BlogItem[]} */ ([]));
export const bookmarks = writable(/** @type {number[]} */ ([]));
export const scheduledPosts = writable(/** @type {BlogItem[]} */ ([]));
export const recentSearches = writable(/** @type {string[]} */ ([]));
export const activityLog = writable(/** @type {{ icon: string, text: string, sub: string, time: number }[]} */ ([]));
export const readingHistory = writable(/** @type {any[]} */ ([]));
export const publishTime = writable('02:00');
export const timezone = writable('Asia/Kolkata');
export const autoPublish = writable(true);
export const bilingual = writable(false);
export const emailNotif = writable(true);

/** @type {string | null} */
let _currentEmail = null;

/**
 * @param {{ subscribe: Function }} store
 * @param {string} suffix
 */
function persist(store, suffix) {
  store.subscribe((/** @type {any} */ value) => {
    if (_currentEmail) localStorage.setItem(ukey(_currentEmail, suffix), JSON.stringify(value));
  });
}

persist(rejectedIds, 'rejected');
persist(interestedBlogs, 'interested');
persist(bookmarks, 'bookmarks');
persist(scheduledPosts, 'posts');
persist(recentSearches, 'recent');

/**
 * @param {string} icon
 * @param {string} text
 * @param {string} [sub]
 */
function logActivity(icon, text, sub = '') {
  activityLog.update(log => {
    const filtered = log.filter(e => !(e.icon === icon && e.text === text));
    return [{ icon, text, sub, time: Date.now() }, ...filtered].slice(0, 20);
  });
}

publishTime.subscribe((v) => { if (_currentEmail) localStorage.setItem(ukey(_currentEmail, 'time'), v); });
timezone.subscribe((v) => { if (_currentEmail) localStorage.setItem(ukey(_currentEmail, 'tz'), v); });
autoPublish.subscribe((v) => { if (_currentEmail) localStorage.setItem(ukey(_currentEmail, 'autopublish'), String(v)); });
bilingual.subscribe((v) => { if (_currentEmail) localStorage.setItem(ukey(_currentEmail, 'bilingual'), String(v)); });
emailNotif.subscribe((v) => { if (_currentEmail) localStorage.setItem(ukey(_currentEmail, 'emailnotif'), String(v)); });

/** @param {string} email */
function loadUserData(email) {
  const key = email.trim().toLowerCase();
  _currentEmail = key;
  rejectedIds.set(JSON.parse(localStorage.getItem(ukey(key, 'rejected')) || '[]'));
  interestedBlogs.set(JSON.parse(localStorage.getItem(ukey(key, 'interested')) || '[]'));
  bookmarks.set((JSON.parse(localStorage.getItem(ukey(key, 'bookmarks')) || '[]')).map(Number));
  scheduledPosts.set(JSON.parse(localStorage.getItem(ukey(key, 'posts')) || '[]'));
  recentSearches.set(JSON.parse(localStorage.getItem(ukey(key, 'recent')) || '[]'));
  publishTime.set(localStorage.getItem(ukey(key, 'time')) || '02:00');
  timezone.set(localStorage.getItem(ukey(key, 'tz')) || 'Asia/Kolkata');
  autoPublish.set(localStorage.getItem(ukey(key, 'autopublish')) !== 'false');
  bilingual.set(localStorage.getItem(ukey(key, 'bilingual')) === 'true');
  emailNotif.set(localStorage.getItem(ukey(key, 'emailnotif')) !== 'false');
  activityLog.set([]);
}

function clearUserData() {
  _currentEmail = null;
  rejectedIds.set([]);
  interestedBlogs.set([]);
  bookmarks.set([]);
  scheduledPosts.set([]);
  recentSearches.set([]);
  activityLog.set([]);
  publishTime.set('02:00');
  timezone.set('Asia/Kolkata');
  autoPublish.set(true);
  bilingual.set(false);
  emailNotif.set(true);
}

/* User auth */
const storedUser = JSON.parse(localStorage.getItem('bca_user') || 'null');
export const user = writable(/** @type {UserProfile | null} */ (storedUser));
export const userAuthed = writable(!!storedUser);

if (storedUser?.email) loadUserData(storedUser.email);

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function login(email, password) {
  const stored = JSON.parse(localStorage.getItem('bca_accounts') || '{}');
  const key = email.trim().toLowerCase();
  const account = stored[key] ?? Object.values(stored).find(a => (a.email ?? '').toLowerCase() === key);
  const hash = await hashPassword(password);
  if (!account || account.passwordHash !== hash) return { ok: false, error: 'Invalid email or password.' };

  const u = { name: account.name, email: account.email, avatar: '🧑', isNew: false };
  localStorage.setItem('bca_user', JSON.stringify(u));
  user.set(u);
  userAuthed.set(true);
  loadUserData(u.email);
  appMode.set('user');
  currentPage.set('home');
  return { ok: true };
}

/**
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function signup(name, email, password) {
  const stored = JSON.parse(localStorage.getItem('bca_accounts') || '{}');
  const key = email.trim().toLowerCase();
  if (stored[key]) return { ok: false, error: 'An account with this email already exists.' };

  const passwordHash = await hashPassword(password);
  stored[key] = { name, email: key, passwordHash };
  localStorage.setItem('bca_accounts', JSON.stringify(stored));

  const u = { name, email: key, avatar: '🧑', isNew: true };
  localStorage.setItem('bca_user', JSON.stringify(u));
  user.set(u);
  userAuthed.set(true);
  loadUserData(u.email);
  appMode.set('user');
  currentPage.set('home');
  return { ok: true };
}

export function logout() {
  localStorage.removeItem('bca_user');
  user.set(null);
  userAuthed.set(false);
  clearUserData();
  currentPage.set('home');
  appMode.set('landing');
}

/**
 * @param {string} name
 * @param {string} email
 */
export function updateUser(name, email) {
  const newEmail = email?.trim().toLowerCase();
  user.update((u) => {
    if (!u) return u;
    const updated = { ...u, name, email: newEmail || u.email };
    localStorage.setItem('bca_user', JSON.stringify(updated));
    return updated;
  });
  if (newEmail && newEmail !== _currentEmail) {
    _currentEmail = newEmail;
    loadUserData(newEmail);
  }
  showToast('Profile saved', 'success');
}

/* Navigation */
export const currentPage = writable(/** @type {'home' | 'discover' | 'dashboard' | 'interested' | 'rejected' | 'scheduled' | 'published' | 'preview' | 'settings' | 'bookmarks' | 'article'} */ ('home'));

/* Toasts */
export const toasts = writable(/** @type {ToastItem[]} */ ([]));
let _toastId = 0;
/**
 * @param {string} text
 * @param {string} [type]
 * @param {number} [duration]
 */
export function showToast(text, type = 'success', duration = 3000) {
  const id = ++_toastId;
  toasts.update((ts) => [...ts, { id, text, type }]);
  setTimeout(() => toasts.update((ts) => ts.filter((t) => t.id !== id)), duration);
}

/* Notifications */
export const notifications = writable([
  { id: 1, text: 'Pipeline run completed successfully', time: '2 min ago', read: false },
  { id: 2, text: 'New blogs discovered: 12 articles', time: '1 hr ago', read: false },
]);
export const unreadCount = derived(notifications, ($n) => $n.filter((n) => !n.read).length);
export function markAllRead() {
  notifications.update((ns) => ns.map((n) => ({ ...n, read: true })));
}

/* Search & discovery */
export const searchQuery = writable('');
export const selectedBlogId = writable(/** @type {number | null} */ (null));
export const selectedBlog = writable(/** @type {any | null} */ (null));
export const articleFrom = writable(/** @type {string} */ ('discover'));

/** @param {string} term */
export function addRecentSearch(term) {
  recentSearches.update((rs) => [term, ...rs.filter((r) => r !== term)].slice(0, 8));
  logActivity('🔍', `Searched for "${term}"`, 'Search');
}

/** @param {any} blog */
export function logRead(blog) {
  readingHistory.update((h) => {
    const filtered = h.filter(b => b.id !== blog.id);
    return [{ ...blog, readAt: Date.now() }, ...filtered].slice(0, 20);
  });
}

/* Curation actions */
/** @param {number} id */
export function rejectBlog(id) {
  let title = '';
  interestedBlogs.update((bs) => { title = bs.find(b => b.id === id)?.title || ''; return bs.filter((b) => b.id !== id); });
  rejectedIds.update((ids) => [...ids, id]);
  logActivity('👎', `Not interested${title ? ': ' + title : ''}`, 'Discover');
  showToast('Marked as not interested', 'info');
}

/** @param {BlogItem} blog */
export function interestBlog(blog) {
  rejectedIds.update((ids) => ids.filter((id) => id !== blog.id));
  interestedBlogs.update((bs) => (bs.some((b) => b.id === blog.id) ? bs : [...bs, blog]));
  logActivity('👍', `Interested: ${blog.title}`, 'Discover');
  showToast('Added to interested', 'success');
}

/** @param {number} id */
export function toggleBookmark(id) {
  const numId = Number(id);
  let added = false;
  bookmarks.update((bs) => {
    added = !bs.includes(numId);
    return added ? [...bs, numId] : bs.filter((b) => b !== numId);
  });
  logActivity('🔖', added ? 'Article bookmarked' : 'Bookmark removed', 'Discover');
  showToast(added ? 'Bookmarked' : 'Bookmark removed', 'success');
}

/* Publish / schedule */
/** @param {BlogItem} post */
export function schedulePost(post) {
  scheduledPosts.update((ps) => [...ps, post]);
  logActivity('📅', `Scheduled: ${post.title}`, 'Scheduled');
  showToast('Blog scheduled successfully', 'success');
}

/* Pipeline stats */
export const pipelineStats = derived(
  [scheduledPosts, interestedBlogs, rejectedIds, bookmarks],
  ([$posts, $interested, $rejected, $bk]) => ({
    scheduled: $posts.filter((p) => p.status === 'scheduled').length,
    published: $posts.filter((p) => p.status === 'published').length,
    interested: $interested.length,
    rejected: $rejected.length,
    bookmarked: $bk.length,
    total: $posts.length,
  })
);

export const weeklyActivity = derived(scheduledPosts, ($posts) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  /** @type {number[]} */
  const counts = Array(7).fill(0);

  $posts.forEach((p) => {
    if (!p.scheduledAt) return;
    const d = new Date(p.scheduledAt);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      const idx = (d.getDay() + 6) % 7;
      counts[idx]++;
    }
  });

  return days.map((day, i) => ({ day, count: counts[i] }));
});

/* Admin auth */
export const adminKey = writable(localStorage.getItem('admin_key') || '');
export const isLoggedIn = writable(!!localStorage.getItem('admin_key'));
export const loginError = writable('');
export const loginLoading = writable(false);

/**
 * @param {string} a
 * @param {string} b
 */
function timingSafeEqual(a, b) {
  let mismatch = a.length !== b.length ? 1 : 0;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    mismatch |= (a.charCodeAt(i) ?? 0) ^ (b.charCodeAt(i) ?? 0);
  }
  return mismatch === 0;
}

/** @param {string} key */
export function adminLogin(key) {
  loginError.set('');
  if (timingSafeEqual(key, API_KEY)) {
    localStorage.setItem('admin_key', key);
    adminKey.set(key);
    isLoggedIn.set(true);
    currentAdminPage.set('dashboard');
  } else {
    loginError.set('Invalid API key. Please try again.');
  }
}

export function adminLogout() {
  localStorage.removeItem('admin_key');
  adminKey.set('');
  isLoggedIn.set(false);
  currentAdminPage.set('login');
  appMode.set('landing');
}

/* Admin navigation */
export const currentAdminPage = writable(
  localStorage.getItem('admin_key') ? 'dashboard' : 'login'
);

/* Public reader pages */
export const currentPublicPage = writable('home');
export const selectedArticle = writable(null);
export const publicThemeFilter = writable('All');

/* Pipeline status */
export const pipelineStatus = writable(/** @type {PipelineStatus | null} */ (null));
export const pipelineLoading = writable(false);
export const pipelineFlag = derived(pipelineStatus, ($s) => $s?.flag ?? 'ON');

/** @returns {PipelineStatus} */
function createDefaultPipelineStatus() {
  return /** @type {PipelineStatus} */ ({
    flag: /** @type {PipelineFlag} */ ('ON'),
    status: /** @type {import('./store.js').PipelineState} */ ('IDLE'),
    lastRun: null,
    nextRun: null,
    published: 0,
    failed: 0,
  });
}

export async function fetchStatus() {
  pipelineLoading.set(true);
  try {
    const data = await adminFetch(`${API_BASE}/status`);
    pipelineStatus.set({
      flag: data.controlFlag,
      status: data.lastRun?.status === 'RUNNING' ? 'RUNNING' : 'IDLE',
      lastRun: data.lastRun?.startedAt ?? null,
      nextRun: null,
      published: data.totalPublished,
      failed: data.totalFailed,
    });
  } catch (e) {
    pipelineStatus.set(createDefaultPipelineStatus());
  } finally {
    pipelineLoading.set(false);
  }
}

/** @param {PipelineFlag} flag */
export async function setFlag(flag) {
  try {
    await adminFetch(`${API_BASE}/flag/${flag}`, { method: 'PUT' });
    pipelineStatus.update((s) => (s ? { ...s, flag } : { ...createDefaultPipelineStatus(), flag }));
    showToast(`Pipeline flag set to ${flag}`, 'success');
  } catch (e) {
    showToast('Failed to update flag', 'error');
  }
}

export function setPipelineFlag(/** @type {PipelineFlag} */ flag) {
  setFlag(flag);
}

export async function triggerRun() {
  try {
    await adminFetch(`${API_BASE}/trigger`, { method: 'POST' });
    pipelineStatus.update((s) => (s ? { ...s, status: 'RUNNING' } : { ...createDefaultPipelineStatus(), status: 'RUNNING' }));
    showToast('Pipeline triggered successfully', 'success');
  } catch (e) {
    showToast('Failed to trigger pipeline', 'error');
  }
}

/* Run history */
export const runHistory = writable(/** @type {RunRecord[]} */ ([]));
export const runsLoading = writable(false);

function createMockRuns() {
  return [
    { id: 15, startedAt: '2026-05-28 09:00:00', completedAt: '2026-05-28 09:12:30', discovered: 127, scored: 98, rejected: 32, published: 15, status: 'Complete' },
    { id: 14, startedAt: '2026-05-27 09:00:00', completedAt: '2026-05-27 09:14:45', discovered: 134, scored: 104, rejected: 28, published: 18, status: 'Complete' },
    { id: 13, startedAt: '2026-05-26 09:00:00', completedAt: '2026-05-26 09:11:20', discovered: 119, scored: 92, rejected: 35, published: 12, status: 'Complete' },
    { id: 12, startedAt: '2026-05-25 09:00:00', completedAt: '2026-05-25 09:13:15', discovered: 141, scored: 108, rejected: 29, published: 19, status: 'Complete' },
    { id: 11, startedAt: '2026-05-24 09:00:00', completedAt: '2026-05-24 09:12:00', discovered: 125, scored: 99, rejected: 31, published: 16, status: 'Complete' },
    { id: 10, startedAt: '2026-05-23 09:00:00', completedAt: '2026-05-23 09:15:30', discovered: 138, scored: 106, rejected: 27, published: 20, status: 'Complete' },
    { id: 9, startedAt: '2026-05-22 09:00:00', completedAt: '2026-05-22 09:10:45', discovered: 115, scored: 88, rejected: 38, published: 10, status: 'Complete' },
    { id: 8, startedAt: '2026-05-21 09:00:00', completedAt: '2026-05-21 09:13:20', discovered: 130, scored: 101, rejected: 33, published: 17, status: 'Complete' },
  ];
}

export async function fetchRuns() {
  runsLoading.set(true);
  try {
    const data = await adminFetch(`${API_BASE}/runs`);
    runHistory.set(data.map((/** @type {any} */ r) => ({
      id: r.id,
      startedAt: r.startedAt,
      completedAt: r.completedAt,
      discovered: r.totalDiscovered,
      scored: r.totalScored,
      rejected: r.totalRejected,
      published: r.totalPublished,
      status: r.status,
    })));
  } catch (e) {
    runHistory.set(createMockRuns());
  } finally {
    runsLoading.set(false);
  }
}

/* Admin articles */
export const articles = writable(/** @type {BlogItem[]} */ ([]));
export const articlesLoading = writable(false);
export const articleThemeFilter = writable('');
export const articleStatusFilter = writable('');

export async function fetchArticles(themeId = '') {
  articlesLoading.set(true);
  try {
    const url = themeId ? `${API_BASE}/articles/${themeId}` : `${ARTICLES_BASE}?size=100`;
    const data = await adminFetch(url);
    const list = Array.isArray(data) ? data : (data.articles ?? []);
    articles.set(list.map((/** @type {any} */ a) => ({
      id: a.id,
      title: a.title,
      theme: a.themeId,
      relevanceScore: a.relevanceScore,
      innovationScore: a.innovationScore,
      featured: a.featured,
      status: a.status?.toLowerCase(),
      publishedAt: a.publishedAt,
      imageUrl: a.imageUrl,
      summary: a.editorialSummary,
      sourceUrl: a.sourceUrl,
    })));
  } catch (e) {
    articles.set([]);
  } finally {
    articlesLoading.set(false);
  }
}

/* Admin themes */
export const adminThemes = writable(/** @type {Theme[]} */ ([]));
export const themesLoading = writable(false);
export const calibratingId = writable(/** @type {string | null} */ (null));

export async function fetchThemes() {
  themesLoading.set(true);
  try {
    const data = await adminFetch(`${API_BASE}/themes`);
    adminThemes.set(data.map((/** @type {string} */ id) => ({
      id,
      name: id,
      lastCalibrated: '',
      keywords: [],
    })));
  } catch (e) {
    adminThemes.set([]);
  } finally {
    themesLoading.set(false);
  }
}

/** @param {string} themeId */
export async function calibrateTheme(themeId) {
  calibratingId.set(themeId);
  try {
    await adminFetch(`${API_BASE}/calibrate/${themeId}`, { method: 'POST' });
    adminThemes.update((ts) => ts.map((t) => (
      t.id === themeId ? { ...t, lastCalibrated: new Date().toISOString().slice(0, 10) } : t
    )));
    showToast(`Theme ${themeId} calibrated`, 'success');
  } catch (e) {
    showToast('Calibration failed', 'error');
  } finally {
    calibratingId.set(null);
  }
}

/* Editorial profiles */
export const editorialProfiles = writable(/** @type {EditorialProfile[]} */ ([]));
export const profilesLoading = writable(false);
export const regeneratingProfile = writable(/** @type {string | null} */ (null));

export function fetchEditorialProfiles() {
  import('../data/editorialProfiles.js').then((m) => {
    editorialProfiles.set(/** @type {EditorialProfile[]} */ (/** @type {unknown} */ (m.mockEditorialProfiles)));
  });
}

/**
 * @param {string} profileId
 * @param {string} themeName
 */
export async function regenerateProfile(profileId, themeName) {
  regeneratingProfile.set(profileId);
  await new Promise((r) => setTimeout(r, 1500));
  editorialProfiles.update((profiles) => profiles.map((p) => (
    p.id === profileId
      ? {
          ...p,
          generatedAt: new Date().toISOString(),
          lastCalibrationQuality: Math.random() * 0.15 + 0.8,
        }
      : p
  )));
  regeneratingProfile.set(null);
  showToast(`Editorial profile regenerated for ${themeName}`, 'success');
}

/* Public reader articles */
export const publicArticles = writable(/** @type {BlogItem[]} */ ([]));

export async function fetchPublicArticles() {
  try {
    const data = await apiFetch(`${ARTICLES_BASE}?size=50`);
    const list = data.articles ?? [];
    publicArticles.set(list.map((/** @type {any} */ a) => ({
      id: a.id,
      title: a.title,
      theme: a.themeId,
      relevanceScore: a.relevanceScore,
      innovationScore: a.innovationScore,
      featured: a.featured,
      publishedAt: a.publishedAt,
      imageUrl: a.imageUrl,
      summary: a.editorialSummary,
      sourceUrl: a.sourceUrl,
    })));
  } catch (e) {
    publicArticles.set([]);
  }
}

export const publicThemes = derived(publicArticles, ($a) => ['All', ...new Set($a.map((a) => a.theme))]);
