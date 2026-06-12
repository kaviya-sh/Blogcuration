<script>
  export let onNav = (page) => {};

  const posts = [
    { tag: 'Product News', title: 'Join us for BlogCurate Day 2026: Friday, September 18', sub: "Here's how you can apply to speak at BlogCurate Day 2026", author: 'BlogCurate Staff', date: 'May 22', read: '3 min read', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=240&fit=crop' },
    { tag: 'Product News', title: 'Muting topics: A new way to control the stories you see', sub: 'Giving you more influence over your story recommendations', author: 'BlogCurate Staff', date: 'May 14', read: '3 min read', img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=240&fit=crop' },
    { tag: 'Product News', title: 'Reposting: A new way to share stories you love with your followers', sub: 'Readers want story suggestions from people they trust', author: 'BlogCurate Staff', date: 'May 13', read: '4 min read', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=240&fit=crop' },
    { tag: 'New on BlogCurate', title: 'How BlogCurate moderates its open platform in the AI era', sub: 'Meet the team that handles everything from slop lords to password resets', author: 'BlogCurate Staff', date: 'Mar 10', read: '9 min read', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=240&fit=crop' },
    { tag: 'Latest', title: 'Which stories reach and grow your audience? Your new stats pages tell you', sub: 'Two long-awaited updates to writer stats pages', author: 'BlogCurate Staff', date: 'Sep 10, 2025', read: '5 min read', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop' },
    { tag: 'Latest', title: 'Why writing still wins in the AI era', sub: 'The four ages of the internet and the write-ward shift', author: 'Scott L.', date: 'May 1', read: '10 min read', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=240&fit=crop' },
  ];
</script>

<div class="blog-page">
  <nav class="top-nav">
    <div class="top-nav-inner">
      <button class="nav-logo" on:click={() => onNav('home')}>
        <svg width="28" height="28" viewBox="0 0 195 195" fill="none"><rect width="195" height="195" rx="4" fill="#000"/><path d="M45 65l30 65 30-65 30 65 15-32.5" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>The BlogCurate Blog</span>
      </button>
      <div class="nav-right">
        <button class="nav-link" on:click={() => onNav('auth-signin')}>Sign in</button>
        <button class="nav-pill" on:click={() => onNav('auth-signup')}>Get started</button>
      </div>
    </div>
  </nav>

  <!-- tabs -->
  <div class="blog-tabs">
    <div class="blog-tabs-inner">
      <button class="blog-tab active">Latest</button>
      <button class="blog-tab">Product News</button>
      <button class="blog-tab">Newsletter</button>
    </div>
  </div>

  <div class="blog-body">
    <div class="blog-inner">
      <!-- featured top post -->
      <div class="blog-featured">
        <img src={posts[0].img} alt="" class="blog-feat-img" />
        <div class="blog-feat-body">
          <span class="blog-tag">{posts[0].tag}</span>
          <h2 class="blog-feat-title">{posts[0].title}</h2>
          <p class="blog-feat-sub">{posts[0].sub}</p>
          <div class="blog-meta">{posts[0].author} · {posts[0].date} · {posts[0].read}</div>
        </div>
      </div>

      <!-- newsletter subscribe -->
      <div class="blog-subscribe">
        <p>Get the best of BlogCurate delivered to you weekly.</p>
        <button class="subscribe-btn">Subscribe</button>
      </div>

      <!-- grid -->
      <h2 class="blog-section-title">New on BlogCurate</h2>
      <div class="blog-grid">
        {#each posts.slice(1) as post}
          <div class="blog-card">
            <img src={post.img} alt="" class="blog-card-img" />
            <div class="blog-card-body">
              <span class="blog-tag">{post.tag}</span>
              <h3 class="blog-card-title">{post.title}</h3>
              <p class="blog-card-sub">{post.sub}</p>
              <div class="blog-meta">{post.author} · {post.date} · {post.read}</div>
            </div>
          </div>
        {/each}
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
.blog-page { min-height: 100vh; background: var(--white); font-family: var(--sans); color: var(--text-body); display: flex; flex-direction: column; }
.top-nav { border-bottom: 1px solid var(--divider); padding: 0 24px; }
.top-nav-inner { max-width: 1192px; margin: 0 auto; height: 57px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 700; color: var(--text-black); font-family: var(--serif); }
.nav-right { display: flex; align-items: center; gap: 8px; }
.nav-link { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); font-family: var(--sans); padding: 7px 14px; border-radius: 100px; }
.nav-link:hover { color: var(--text-black); background: var(--off-white); }
.nav-pill { background: var(--text-black); color: var(--white); border: none; cursor: pointer; font-size: 14px; font-family: var(--sans); padding: 8px 20px; border-radius: 100px; transition: opacity 0.15s; }
.nav-pill:hover { opacity: 0.8; }

.blog-tabs { border-bottom: 1px solid var(--divider); }
.blog-tabs-inner { max-width: 1192px; margin: 0 auto; padding: 0 24px; display: flex; gap: 0; }
.blog-tab { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-muted); font-family: var(--sans); padding: 14px 16px; border-bottom: 2px solid transparent; position: relative; top: 1px; transition: color 0.15s; }
.blog-tab:hover { color: var(--text-black); }
.blog-tab.active { color: var(--text-black); font-weight: 500; border-bottom-color: var(--text-black); }

.blog-body { flex: 1; padding: 40px 24px; }
.blog-inner { max-width: 1060px; margin: 0 auto; }

.blog-featured { display: flex; gap: 40px; align-items: flex-start; padding-bottom: 40px; border-bottom: 1px solid var(--divider); margin-bottom: 40px; }
.blog-feat-img { width: 380px; height: 220px; object-fit: cover; border-radius: var(--radius); flex-shrink: 0; }
.blog-feat-body { flex: 1; }
.blog-tag { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 10px; }
.blog-feat-title { font-family: var(--serif); font-size: 26px; font-weight: 700; color: var(--text-black); line-height: 1.3; margin-bottom: 10px; }
.blog-feat-sub { font-size: 16px; color: var(--text-muted); line-height: 1.55; margin-bottom: 14px; }
.blog-meta { font-size: 13px; color: var(--text-hint); }

.blog-subscribe { background: var(--off-white); border: 1px solid var(--divider); border-radius: var(--radius); padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 40px; }
.blog-subscribe p { font-size: 15px; color: var(--text-black); font-weight: 500; }
.subscribe-btn { background: var(--text-black); color: var(--white); border: none; cursor: pointer; font-size: 14px; font-family: var(--sans); padding: 10px 24px; border-radius: 100px; white-space: nowrap; transition: opacity 0.15s; }
.subscribe-btn:hover { opacity: 0.8; }

.blog-section-title { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--text-black); margin-bottom: 24px; }
.blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px 28px; }
.blog-card { display: flex; flex-direction: column; }
.blog-card-img { width: 100%; height: 160px; object-fit: cover; border-radius: var(--radius); margin-bottom: 14px; }
.blog-card-body { flex: 1; }
.blog-card-title { font-family: var(--serif); font-size: 17px; font-weight: 700; color: var(--text-black); line-height: 1.35; margin: 8px 0 6px; }
.blog-card-sub { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 10px; }

.med-footer { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; padding: 16px 24px; border-top: 1px solid var(--divider); }
.med-footer a { font-size: 13px; color: var(--text-muted); text-decoration: none; padding: 4px 12px; border-right: 1px solid var(--divider); }
.med-footer a:last-child { border-right: none; }
.med-footer a:hover { color: var(--text-black); }
@media (max-width: 860px) { .blog-grid { grid-template-columns: 1fr 1fr; } .blog-featured { flex-direction: column; } .blog-feat-img { width: 100%; } }
@media (max-width: 540px) { .blog-grid { grid-template-columns: 1fr; } }
</style>
