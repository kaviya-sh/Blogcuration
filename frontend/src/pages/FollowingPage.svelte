<script>
  // @ts-nocheck
  import { interestedBlogs } from '../stores/store.js';

  // Following list derived from sources of interested blogs + mock writers
  const mockFollowing = [
    { id: 1, name: 'Andrej Karpathy', avatar: 'A', bio: 'AI researcher & educator. Former Tesla AI, OpenAI.', followers: '142K', stories: 38 },
    { id: 2, name: 'Lilian Weng',     avatar: 'L', bio: 'Safety research at OpenAI. Writes about RL and alignment.', followers: '89K', stories: 54 },
    { id: 3, name: 'Simon Willison',  avatar: 'S', bio: 'Creator of Datasette, Django co-creator. Writes about LLMs.', followers: '54K', stories: 210 },
    { id: 4, name: 'Swyx',            avatar: 'S', bio: 'AI Engineer. Runs Latent Space podcast.', followers: '47K', stories: 92 },
    { id: 5, name: 'Harrison Chase',  avatar: 'H', bio: 'Founder of LangChain. Building the future of LLM apps.', followers: '38K', stories: 61 },
    { id: 6, name: 'Eugene Yan',      avatar: 'E', bio: 'Applied ML at Amazon. Writes about RecSys & LLMs.', followers: '29K', stories: 47 },
  ];

  // Sources from interested blogs as "publications you follow"
  $: followedSources = [...new Set($interestedBlogs.map(b => b.source).filter(Boolean))];

  let unfollowed = new Set();
  function toggleFollow(id) {
    if (unfollowed.has(id)) unfollowed.delete(id);
    else unfollowed.add(id);
    unfollowed = new Set(unfollowed);
  }
</script>

<div class="following-wrap">
  <div class="following-header">
    <h1 class="following-title">Following</h1>
    <p class="following-sub">Writers and publications you follow.</p>
  </div>

  <!-- Writers -->
  <div class="section-head">Writers</div>
  <div class="following-list">
    {#each mockFollowing as f}
      <div class="following-row">
        <div class="following-avatar">{f.avatar}</div>
        <div class="following-body">
          <div class="following-name">{f.name}</div>
          <div class="following-bio">{f.bio}</div>
          <div class="following-stats">{f.followers} followers · {f.stories} stories</div>
        </div>
        <button
          class="follow-btn"
          class:following={!unfollowed.has(f.id)}
          on:click={() => toggleFollow(f.id)}
        >
          {unfollowed.has(f.id) ? 'Follow' : 'Following'}
        </button>
      </div>
    {/each}
  </div>

  <!-- Publications (from interested blogs) -->
  <div class="section-head" style="margin-top:36px">Publications</div>
  {#if followedSources.length === 0}
    <div class="empty">
      <p class="empty-title">No publications yet</p>
      <p class="empty-sub">Mark articles as interested to follow their publications here.</p>
    </div>
  {:else}
    <div class="pub-list">
      {#each followedSources as src}
        <div class="pub-row">
          <div class="pub-avatar">{src[0]}</div>
          <div class="pub-body">
            <div class="pub-name">{src}</div>
            <div class="pub-meta">Publication</div>
          </div>
          <button class="follow-btn following">Following</button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .following-wrap { max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

  .following-header {
    padding: 32px 0 24px;
    border-bottom: 1px solid var(--divider);
    margin-bottom: 4px;
  }
  .following-title { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--text-black); letter-spacing: -0.3px; margin-bottom: 4px; }
  .following-sub { font-size: 14px; color: var(--text-muted); }

  .section-head {
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted);
    margin: 24px 0 8px;
  }

  .following-list, .pub-list { display: flex; flex-direction: column; }

  .following-row, .pub-row {
    display: flex; align-items: center; gap: 16px;
    padding: 18px 0; border-bottom: 1px solid var(--divider);
  }
  .following-row:last-child, .pub-row:last-child { border-bottom: none; }

  .following-avatar, .pub-avatar {
    width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
    background: var(--text-black); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700;
  }
  .pub-avatar { border-radius: 8px; background: var(--off-white); color: var(--text-black); border: 1px solid var(--divider); }

  .following-body, .pub-body { flex: 1; min-width: 0; }
  .following-name, .pub-name { font-size: 15px; font-weight: 600; color: var(--text-black); margin-bottom: 4px; }
  .following-bio { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .following-stats, .pub-meta { font-size: 12px; color: var(--text-hint); }

  .follow-btn {
    display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--divider); background: var(--white);
    font-size: 13px; font-family: var(--sans); cursor: pointer;
    padding: 7px 18px; border-radius: 100px; transition: all 0.15s;
    color: var(--text-body); white-space: nowrap; flex-shrink: 0;
  }
  .follow-btn:hover { border-color: var(--text-black); color: var(--text-black); }
  .follow-btn.following { border-color: var(--green,#1a8917); color: var(--green,#1a8917); }
  .follow-btn.following:hover { background: var(--green,#1a8917); color: #fff; border-color: var(--green,#1a8917); }

  .empty { padding: 40px 0; text-align: center; }
  .empty-title { font-family: var(--serif); font-size: 18px; font-weight: 700; color: var(--text-black); margin-bottom: 6px; }
  .empty-sub { font-size: 14px; color: var(--text-muted); }
</style>
